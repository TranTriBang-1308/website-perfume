import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { couponUpsertSchema } from "@/lib/validations/coupon";

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null);
  const parsed = couponUpsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dữ liệu không hợp lệ", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const d = parsed.data;
  try {
    const coupon = await prisma.coupon.create({
      data: {
        code: d.code.toUpperCase(),
        description: d.description || null,
        discountType: d.discountType,
        discountValue: d.discountValue,
        minOrderValue: d.minOrderValue,
        maxDiscount: d.maxDiscount,
        usageLimit: d.usageLimit,
        startsAt: new Date(d.startsAt),
        expiresAt: new Date(d.expiresAt),
        isActive: d.isActive,
      },
    });
    return NextResponse.json({ data: coupon, message: "Đã tạo mã" }, { status: 201 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ error: "Mã đã tồn tại" }, { status: 409 });
    }
    console.error("Coupon create error:", err);
    return NextResponse.json({ error: "Không thể tạo mã" }, { status: 500 });
  }
}
