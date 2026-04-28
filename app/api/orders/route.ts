import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { orderCreateSchema } from "@/lib/validations/order";
import { generateOrderNumber } from "@/lib/utils";
import { sendOrderConfirmation } from "@/lib/email";
import { applyCoupon } from "@/lib/coupons";
import { rateLimit, getIdentifier } from "@/lib/rate-limit";
import { syncProductPriceCache } from "@/lib/queries/variants";

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

  // Sản phẩm cần đồng bộ minPrice/hasDiscount sau khi giảm tồn kho không cần,
  // nhưng nếu sau này tồn kho ảnh hưởng tới hiển thị, có thể bổ sung.
  const productIdsToSync: string[] = [];

  try {
    const order = await prisma.$transaction(async (tx) => {
      const cartItems = await tx.cartItem.findMany({
        where: { userId },
        include: {
          variant: {
            include: {
              product: { select: { id: true, name: true, isActive: true } },
            },
          },
        },
      });

      if (cartItems.length === 0) {
        throw new Error("EMPTY_CART");
      }

      for (const item of cartItems) {
        if (!item.variant.product.isActive) {
          throw new Error(`INACTIVE:${item.variant.product.name}`);
        }
        if (item.quantity > item.variant.stock) {
          throw new Error(`OUT_OF_STOCK:${item.variant.product.name}`);
        }
      }

      const subtotal = cartItems.reduce(
        (sum, item) => sum + Number(item.variant.price) * item.quantity,
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
            // Snapshot tên + dung tích + giá tại thời điểm đặt — đơn hàng cũ
            // không vỡ khi admin sửa variant về sau
            create: cartItems.map((item) => ({
              productId: item.variant.product.id,
              variantId: item.variant.id,
              productName: item.variant.product.name,
              volumeMl: item.variant.volumeMl,
              price: item.variant.price,
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

      // Trừ tồn kho ở mức variant
      for (const item of cartItems) {
        await tx.productVariant.update({
          where: { id: item.variant.id },
          data: { stock: { decrement: item.quantity } },
        });
        productIdsToSync.push(item.variant.product.id);
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

    // Đồng bộ price cache (ngoài transaction để không kéo dài lock).
    // Tồn kho thay đổi có thể chưa ảnh hưởng minPrice ngay, nhưng để chắc chắn
    // hasDiscount/minPrice luôn nhất quán, ta sync lại.
    await Promise.all(
      [...new Set(productIdsToSync)].map((id) => syncProductPriceCache(id))
    );

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
            productName: `${it.productName} — ${it.volumeMl}ml`,
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
