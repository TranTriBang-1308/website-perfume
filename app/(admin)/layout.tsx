import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";

export const metadata = { title: "Admin — Parfum" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/admin");
  if (session.user.role !== "ADMIN") redirect("/");

  return (
    <div className="flex min-h-screen bg-cream">
      <aside className="w-64 shrink-0 border-r border-[color:var(--color-border-soft)] bg-white p-6">
        <Link href="/admin" className="font-display text-xl">
          Parfum · Admin
        </Link>
        <AdminSidebar />
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[color:var(--color-border-soft)] bg-white px-8 py-4">
          <p className="text-sm text-ink-muted">
            Xin chào, <span className="text-ink">{session.user.name ?? session.user.email}</span>
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/" className="text-ink-muted hover:text-ink">
              Về cửa hàng
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button type="submit" className="text-ink-muted hover:text-ink">
                Đăng xuất
              </button>
            </form>
          </div>
        </header>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
