import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cartSyncSchema } from "@/lib/validations/cart";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Vui lòng đăng nhập" }, { status: 401 });
  }
  const userId = session.user.id;

  const body = await req.json().catch(() => null);
  const parsed = cartSyncSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dữ liệu không hợp lệ", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const { items } = parsed.data;
  if (items.length === 0) {
    return NextResponse.json({ data: { merged: 0 } });
  }

  const productIds = [...new Set(items.map((i) => i.productId))];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
    select: { id: true, stock: true },
  });
  const stockMap = new Map(products.map((p) => [p.id, p.stock]));

  // Merge: cộng quantity khách với quantity đã có trong DB, cap ở stock
  const existing = await prisma.cartItem.findMany({
    where: { userId, productId: { in: productIds } },
  });
  const existingMap = new Map(existing.map((c) => [c.productId, c.quantity]));

  let merged = 0;
  await prisma.$transaction(async (tx) => {
    for (const item of items) {
      const stock = stockMap.get(item.productId);
      if (stock === undefined || stock <= 0) continue;
      const current = existingMap.get(item.productId) ?? 0;
      const target = Math.min(stock, 99, current + item.quantity);
      if (target === current) continue;

      await tx.cartItem.upsert({
        where: { userId_productId: { userId, productId: item.productId } },
        update: { quantity: target },
        create: { userId, productId: item.productId, quantity: target },
      });
      merged++;
    }
  });

  return NextResponse.json({
    data: { merged },
    message: merged > 0 ? "Đã đồng bộ giỏ hàng" : "Không có sản phẩm nào cần đồng bộ",
  });
}
