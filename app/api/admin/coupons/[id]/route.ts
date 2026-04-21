import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { couponUpsertSchema } from "@/lib/validations/coupon";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
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
    const coupon = await prisma.coupon.update({
      where: { id },
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
    return NextResponse.json({ data: coupon, message: "Đã cập nhật" });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") return NextResponse.json({ error: "Mã đã tồn tại" }, { status: 409 });
      if (err.code === "P2025") return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
    }
    console.error("Coupon update error:", err);
    return NextResponse.json({ error: "Không thể cập nhật" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  try {
    await prisma.coupon.delete({ where: { id } });
    return NextResponse.json({ message: "Đã xóa" });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
    }
    console.error("Coupon delete error:", err);
    return NextResponse.json({ error: "Không thể xóa" }, { status: 500 });
  }
}
