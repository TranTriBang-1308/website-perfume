import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { orderCreateSchema } from "@/lib/validations/order";
import { generateOrderNumber } from "@/lib/utils";
import { sendOrderConfirmation } from "@/lib/email";
import { applyCoupon } from "@/lib/coupons";
import { rateLimit, getIdentifier } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const rl = rateLimit(getIdentifier(req, "orders"), { limit: 5, windowMs: 60_000 });
  if (!rl.success) {
    return NextResponse.json({ error: "Quá nhiều yêu cầu, vui lòng thử lại sau" }, { status: 429 });
  }

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Vui lòng đăng nhập" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = orderCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dữ liệu không hợp lệ", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const userId = session.user.id;
  const { addressId, paymentMethod, note, couponCode } = parsed.data;

  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address || address.userId !== userId) {
    return NextResponse.json({ error: "Địa chỉ không hợp lệ" }, { status: 400 });
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      const cartItems = await tx.cartItem.findMany({
        where: { userId },
        include: {
          product: { select: { id: true, name: true, price: true, stock: true, isActive: true } },
        },
      });

      if (cartItems.length === 0) {
        throw new Error("EMPTY_CART");
      }

      for (const item of cartItems) {
        if (!item.product.isActive) {
          throw new Error(`INACTIVE:${item.product.name}`);
        }
        if (item.quantity > item.product.stock) {
          throw new Error(`OUT_OF_STOCK:${item.product.name}`);
        }
      }

      const subtotal = cartItems.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0
      );
      const shippingFee = subtotal >= 2000000 ? 0 : 35000;

      // Áp coupon nếu có — revalidate server-side
      let discount = 0;
      let appliedCouponId: string | null = null;
      if (couponCode) {
        const coupon = await tx.coupon.findUnique({
          where: { code: couponCode.toUpperCase() },
        });
        if (!coupon) throw new Error("COUPON_NOT_FOUND");
        const check = applyCoupon(coupon, subtotal);
        if (!check.ok) throw new Error(`COUPON:${check.error}`);
        discount = check.discount;
        appliedCouponId = coupon.id;
      }

      const total = Math.max(0, subtotal + shippingFee - discount);

      const created = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId,
          addressId,
          subtotal,
          shippingFee,
          discount,
          total,
          paymentMethod,
          note,
          couponCode,
          items: {
            create: cartItems.map((item) => ({
              productId: item.product.id,
              productName: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
            })),
          },
          payment: {
            create: {
              method: paymentMethod,
              amount: total,
              status: paymentMethod === "COD" ? "PENDING" : "PENDING",
            },
          },
        },
      });

      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.product.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Tăng usedCount của coupon nếu đã áp
      if (appliedCouponId) {
        await tx.coupon.update({
          where: { id: appliedCouponId },
          data: { usedCount: { increment: 1 } },
        });
      }

      await tx.cartItem.deleteMany({ where: { userId } });

      return created;
    });

    // Gửi email xác nhận — không chặn response nếu lỗi/thiếu config
    if (session.user.email) {
      const full = await prisma.order.findUnique({
        where: { id: order.id },
        include: { items: true, address: true },
      });
      if (full) {
        sendOrderConfirmation({
          to: session.user.email,
          customerName: session.user.name ?? null,
          orderNumber: full.orderNumber,
          items: full.items.map((it) => ({
            productName: it.productName,
            quantity: it.quantity,
            price: Number(it.price),
          })),
          subtotal: Number(full.subtotal),
          shippingFee: Number(full.shippingFee),
          discount: Number(full.discount),
          total: Number(full.total),
          paymentMethod: full.paymentMethod,
          shippingAddress: {
            fullName: full.address.fullName,
            phone: full.address.phone,
            street: full.address.street,
            ward: full.address.ward,
            district: full.address.district,
            province: full.address.province,
          },
        }).catch((err) => console.error("Order email failed:", err));
      }
    }

    return NextResponse.json(
      { data: { id: order.id, orderNumber: order.orderNumber }, message: "Đặt hàng thành công" },
      { status: 201 }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "UNKNOWN";
    if (msg === "EMPTY_CART") {
      return NextResponse.json({ error: "Giỏ hàng trống" }, { status: 400 });
    }
    if (msg.startsWith("OUT_OF_STOCK:")) {
      return NextResponse.json(
        { error: `Sản phẩm "${msg.slice(13)}" không đủ tồn kho` },
        { status: 400 }
      );
    }
    if (msg.startsWith("INACTIVE:")) {
      return NextResponse.json(
        { error: `Sản phẩm "${msg.slice(9)}" đã ngừng kinh doanh` },
        { status: 400 }
      );
    }
    if (msg === "COUPON_NOT_FOUND") {
      return NextResponse.json({ error: "Mã giảm giá không tồn tại" }, { status: 400 });
    }
    if (msg.startsWith("COUPON:")) {
      return NextResponse.json({ error: msg.slice(7) }, { status: 400 });
    }
    console.error("Order creation error:", err);
    return NextResponse.json({ error: "Không thể tạo đơn hàng" }, { status: 500 });
  }
}
