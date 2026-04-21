import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addressSchema } from "@/lib/validations/address";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Context) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Vui lòng đăng nhập" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = addressSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dữ liệu không hợp lệ", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const userId = session.user.id;
  const existing = await prisma.address.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    return NextResponse.json({ error: "Không tìm thấy địa chỉ" }, { status: 404 });
  }

  const address = await prisma.$transaction(async (tx) => {
    if (parsed.data.isDefault) {
      await tx.address.updateMany({
        where: { userId, NOT: { id } },
        data: { isDefault: false },
      });
    }
    return tx.address.update({ where: { id }, data: parsed.data });
  });

  return NextResponse.json({ data: address, message: "Đã cập nhật" });
}

export async function DELETE(_req: Request, { params }: Context) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Vui lòng đăng nhập" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.address.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Không tìm thấy địa chỉ" }, { status: 404 });
  }

  await prisma.address.delete({ where: { id } });
  return NextResponse.json({ message: "Đã xóa" });
}
