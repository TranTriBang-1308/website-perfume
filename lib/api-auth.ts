import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

type AuthResult =
  | { ok: true; userId: string; role: "USER" | "ADMIN" }
  | { ok: false; response: NextResponse };

export async function requireUser(): Promise<AuthResult> {
  const session = await auth();
  if (!session?.user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Vui lòng đăng nhập" }, { status: 401 }),
    };
  }
  return { ok: true, userId: session.user.id, role: session.user.role };
}

export async function requireAdmin(): Promise<AuthResult> {
  const result = await requireUser();
  if (!result.ok) return result;
  if (result.role !== "ADMIN") {
    return {
      ok: false,
      response: NextResponse.json({ error: "Không có quyền truy cập" }, { status: 403 }),
    };
  }
  return result;
}
