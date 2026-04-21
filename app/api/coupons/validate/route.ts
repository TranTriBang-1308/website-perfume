import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-auth";
import { couponValidateSchema } from "@/lib/validations/coupon";
import { applyCoupon } from "@/lib/coupons";

export async function POST(req: Request) {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null);
  const parsed = couponValidateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }

  const coupon = await prisma.coupon.findUnique({
    where: { code: parsed.data.code.toUpperCase() },
  });

  if (!coupon) {
    return NextResponse.json({ error: "Mã giảm giá không tồn tại" }, { status: 404 });
  }

  const check = applyCoupon(coupon, parsed.data.subtotal);
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: 400 });
  }

  return NextResponse.json({
    data: {
      code: coupon.code,
      discount: check.discount,
      description: coupon.description,
    },
  });
}
