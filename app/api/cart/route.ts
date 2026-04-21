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

  const { productId, quantity } = parsed.data;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, stock: true, isActive: true },
  });
  if (!product || !product.isActive) {
    return NextResponse.json({ error: "Sản phẩm không tồn tại" }, { status: 404 });
  }

  const existing = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId, productId } },
  });
  const nextQty = (existing?.quantity ?? 0) + quantity;

  if (nextQty > product.stock) {
    return NextResponse.json(
      { error: `Chỉ còn ${product.stock} sản phẩm trong kho` },
      { status: 400 }
    );
  }

  const item = await prisma.cartItem.upsert({
    where: { userId_productId: { userId, productId } },
    update: { quantity: nextQty },
    create: { userId, productId, quantity },
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

  const { productId, quantity } = parsed.data;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { stock: true },
  });
  if (!product) {
    return NextResponse.json({ error: "Sản phẩm không tồn tại" }, { status: 404 });
  }
  if (quantity > product.stock) {
    return NextResponse.json(
      { error: `Chỉ còn ${product.stock} sản phẩm trong kho` },
      { status: 400 }
    );
  }

  const item = await prisma.cartItem.update({
    where: { userId_productId: { userId, productId } },
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
    where: { userId_productId: { userId, productId: parsed.data.productId } },
  });
  return NextResponse.json({ message: "Đã xóa" });
}
