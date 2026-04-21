import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { userRoleUpdateSchema } from "@/lib/validations/admin";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  const body = await req.json().catch(() => null);
  const parsed = userRoleUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dữ liệu không hợp lệ", details: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { role: parsed.data.role },
      select: { id: true, email: true, name: true, role: true },
    });
    return NextResponse.json({ data: user, message: "Đã cập nhật vai trò" });
  } catch (err) {
    console.error("User update error:", err);
    return NextResponse.json({ error: "Không thể cập nhật" }, { status: 500 });
  }
}
