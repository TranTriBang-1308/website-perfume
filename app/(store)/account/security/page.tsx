import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PasswordForm } from "@/components/store/password-form";

export const metadata = { title: "Bảo mật — Parfum" };

export default async function SecurityPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account/security");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },
  });

  const hasPassword = Boolean(user?.password);

  return (
    <div className="bg-white border border-[color:var(--color-border-soft)] p-6">
      <h2 className="font-display text-2xl">Đổi mật khẩu</h2>
      <p className="mt-2 text-sm text-ink-muted">
        Cập nhật mật khẩu định kỳ để giữ an toàn cho tài khoản của bạn.
      </p>

      <div className="mt-8">
        {hasPassword ? (
          <PasswordForm />
        ) : (
          <p className="text-sm text-ink-muted">
            Tài khoản của bạn đăng nhập qua nhà cung cấp bên ngoài và chưa thiết lập mật khẩu.
          </p>
        )}
      </div>
    </div>
  );
}
