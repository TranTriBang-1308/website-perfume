import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-auth";
import { wishlistToggleSchema } from "@/lib/validations/wishlist";

export async function GET() {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;

  const items = await prisma.wishlistItem.findMany({
    where: { userId: auth.userId },
    orderBy: { createdAt: "desc" },
    select: { productId: true },
  });
  return NextResponse.json({ data: items.map((i) => i.productId) });
}

// Toggle: thêm nếu chưa có, xóa nếu đã có
export async function POST(req: Request) {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null);
  const parsed = wishlistToggleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dữ liệu không hợp lệ", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const { productId } = parsed.data;
  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId: auth.userId, productId } },
  });

  if (existing) {
    await prisma.wishlistItem.delete({
      where: { userId_productId: { userId: auth.userId, productId } },
    });
    return NextResponse.json({ data: { inWishlist: false }, message: "Đã xóa khỏi yêu thích" });
  }

  // Kiểm tra sản phẩm tồn tại + đang bán
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { isActive: true },
  });
  if (!product?.isActive) {
    return NextResponse.json({ error: "Sản phẩm không tồn tại" }, { status: 404 });
  }

  await prisma.wishlistItem.create({
    data: { userId: auth.userId, productId },
  });
  return NextResponse.json({ data: { inWishlist: true }, message: "Đã thêm vào yêu thích" });
}
