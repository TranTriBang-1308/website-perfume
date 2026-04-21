import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { googleOAuthEnabled } from "@/lib/auth";

export const metadata = { title: "Đăng nhập — Parfum" };

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center text-sm text-ink-muted">Đang tải...</div>}>
      <LoginForm googleEnabled={googleOAuthEnabled} />
    </Suspense>
  );
}
