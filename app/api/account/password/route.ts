import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { passwordChangeSchema } from "@/lib/validations/account";
import { rateLimit, getIdentifier } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const rl = rateLimit(getIdentifier(req, "password"), { limit: 5, windowMs: 15 * 60_000 });
  if (!rl.success) {
    return NextResponse.json({ error: "Quá nhiều yêu cầu, vui lòng thử lại sau 15 phút" }, { status: 429 });
  }

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Vui lòng đăng nhập" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = passwordChangeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dữ liệu không hợp lệ", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const { currentPassword, newPassword } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, password: true },
  });

  // Tài khoản OAuth chưa có mật khẩu → không cho phép đổi qua route này
  if (!user?.password) {
    return NextResponse.json(
      { error: "Tài khoản chưa thiết lập mật khẩu" },
      { status: 400 }
    );
  }

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) {
    return NextResponse.json(
      { error: "Mật khẩu hiện tại không chính xác" },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed },
  });

  return NextResponse.json({ message: "Đổi mật khẩu thành công" });
}
