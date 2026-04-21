import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Tài khoản — Parfum" };

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, phone: true, createdAt: true },
  });

  if (!user) redirect("/login");

  return (
    <div className="bg-white border border-[color:var(--color-border-soft)] p-6">
      <h2 className="font-display text-2xl">Thông tin cá nhân</h2>
      <dl className="mt-6 space-y-4 text-sm">
        <div className="flex">
          <dt className="w-32 text-ink-muted">Họ tên</dt>
          <dd>{user.name ?? "—"}</dd>
        </div>
        <div className="flex">
          <dt className="w-32 text-ink-muted">Email</dt>
          <dd>{user.email}</dd>
        </div>
        <div className="flex">
          <dt className="w-32 text-ink-muted">Điện thoại</dt>
          <dd>{user.phone ?? "—"}</dd>
        </div>
        <div className="flex">
          <dt className="w-32 text-ink-muted">Tham gia từ</dt>
          <dd>{user.createdAt.toLocaleDateString("vi-VN")}</dd>
        </div>
      </dl>
    </div>
  );
}
