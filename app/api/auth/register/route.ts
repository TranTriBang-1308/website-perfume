import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { rateLimit, getIdentifier } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const rl = rateLimit(getIdentifier(req, "register"), { limit: 3, windowMs: 60 * 60_000 });
  if (!rl.success) {
    return NextResponse.json({ error: "Quá nhiều lần đăng ký, vui lòng thử lại sau" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dữ liệu không hợp lệ", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email đã được sử dụng" }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
    select: { id: true, email: true, name: true, role: true },
  });

  return NextResponse.json({ data: user, message: "Đăng ký thành công" }, { status: 201 });
}
