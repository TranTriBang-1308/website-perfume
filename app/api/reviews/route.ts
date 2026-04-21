import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-auth";
import { reviewUpsertSchema } from "@/lib/validations/review";
import { hasUserPurchased } from "@/lib/queries/reviews";

// POST: upsert review (user đã mua mới được)
export async function POST(req: Request) {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null);
  const parsed = reviewUpsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dữ liệu không hợp lệ", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const { productId, rating, comment } = parsed.data;

  const purchased = await hasUserPurchased(auth.userId, productId);
  if (!purchased) {
    return NextResponse.json(
      { error: "Bạn chỉ có thể đánh giá sau khi mua và nhận hàng" },
      { status: 403 }
    );
  }

  const review = await prisma.review.upsert({
    where: { userId_productId: { userId: auth.userId, productId } },
    create: { userId: auth.userId, productId, rating, comment },
    update: { rating, comment },
  });

  return NextResponse.json({ data: review, message: "Đã gửi đánh giá" }, { status: 201 });
}

// DELETE: user xóa review của chính mình
export async function DELETE(req: Request) {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null);
  const productId = body?.productId;
  if (typeof productId !== "string") {
    return NextResponse.json({ error: "Thiếu productId" }, { status: 400 });
  }

  await prisma.review.deleteMany({
    where: { userId: auth.userId, productId },
  });
  return NextResponse.json({ message: "Đã xóa đánh giá" });
}
