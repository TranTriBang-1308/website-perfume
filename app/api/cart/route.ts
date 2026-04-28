import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCartSummary } from "@/lib/queries/cart";
import { cartAddSchema, cartUpdateSchema, cartRemoveSchema } from "@/lib/validations/cart";

async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    return { error: NextResponse.json({ error: "Vui lòng đăng nhập" }, { status: 401 }) };
  }
  return { userId: session.user.id };
}

export async function GET() {
  const { userId, error } = await requireUser();
  if (error) return error;

  const summary = await getCartSummary(userId);
  return NextResponse.json({ data: summary });
}

export async function POST(req: Request) {
  const { userId, error } = await requireUser();
  if (error) return error;

  const body = await req.json().catch(() => null);
  const parsed = cartAddSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dữ liệu không hợp lệ", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const { variantId, quantity } = parsed.data;

  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    select: { id: true, stock: true, product: { select: { isActive: true } } },
  });
  if (!variant || !variant.product.isActive) {
    return NextResponse.json({ error: "Biến thể không tồn tại" }, { status: 404 });
  }

  const existing = await prisma.cartItem.findUnique({
    where: { userId_variantId: { userId, variantId } },
  });
  const nextQty = (existing?.quantity ?? 0) + quantity;

  if (nextQty > variant.stock) {
    return NextResponse.json(
      { error: `Chỉ còn ${variant.stock} sản phẩm trong kho` },
      { status: 400 }
    );
  }

  const item = await prisma.cartItem.upsert({
    where: { userId_variantId: { userId, variantId } },
    update: { quantity: nextQty },
    create: { userId, variantId, quantity },
  });

  return NextResponse.json({ data: item, message: "Đã thêm vào giỏ" }, { status: 201 });
}

export async function PATCH(req: Request) {
  const { userId, error } = await requireUser();
  if (error) return error;

  const body = await req.json().catch(() => null);
  const parsed = cartUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dữ liệu không hợp lệ", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const { variantId, quantity } = parsed.data;

  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    select: { stock: true },
  });
  if (!variant) {
    return NextResponse.json({ error: "Biến thể không tồn tại" }, { status: 404 });
  }
  if (quantity > variant.stock) {
    return NextResponse.json(
      { error: `Chỉ còn ${variant.stock} sản phẩm trong kho` },
      { status: 400 }
    );
  }

  const item = await prisma.cartItem.update({
    where: { userId_variantId: { userId, variantId } },
    data: { quantity },
  });
  return NextResponse.json({ data: item });
}

export async function DELETE(req: Request) {
  const { userId, error } = await requireUser();
  if (error) return error;

  const body = await req.json().catch(() => null);
  const parsed = cartRemoveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }

  await prisma.cartItem.delete({
    where: { userId_variantId: { userId, variantId: parsed.data.variantId } },
  });
  return NextResponse.json({ message: "Đã xóa" });
}
