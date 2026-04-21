import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { orderStatusUpdateSchema } from "@/lib/validations/admin";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  const body = await req.json().catch(() => null);
  const parsed = orderStatusUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dữ liệu không hợp lệ", details: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const order = await prisma.order.update({
      where: { id },
      data: {
        status: parsed.data.status,
        ...(parsed.data.paymentStatus && { paymentStatus: parsed.data.paymentStatus }),
      },
      include: { items: true, user: true, address: true },
    });
    return NextResponse.json({ data: order, message: "Đã cập nhật trạng thái" });
  } catch (err) {
    console.error("Order update error:", err);
    return NextResponse.json({ error: "Không thể cập nhật" }, { status: 500 });
  }
}
