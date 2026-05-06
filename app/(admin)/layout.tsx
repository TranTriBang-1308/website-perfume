import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";

export const metadata = { title: "Admin — Whisper of Scent" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/admin");
  if (session.user.role !== "ADMIN") redirect("/");

  const userName = session.user.name ?? session.user.email ?? "Admin";
  const initial = userName.charAt(0).toUpperCase();

  return (
    <div className="flex min-h-screen bg-cream-warm/40">
      <aside className="sticky top-0 flex h-screen w-72 shrink-0 flex-col border-r border-border-soft bg-white">
        <div className="flex items-center gap-3 border-b border-border-soft px-6 py-5">
          <span className="flex h-10 w-10 items-center justify-center bg-linear-to-br from-ink to-ink-soft text-champagne shadow-soft ring-1 ring-champagne/30">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <circle cx="12" cy="6" r="3" />
              <circle cx="18" cy="12" r="3" />
              <circle cx="12" cy="18" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="12" cy="12" r="2.2" fill="#faf7f2" />
            </svg>
          </span>
          <div className="min-w-0">
            <Link href="/admin" className="block font-display text-lg leading-tight">
              Whisper of Scent
            </Link>
            <p className="text-[10px] uppercase tracking-[0.25em] text-champagne-dark">
              Admin Panel
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-6">
          <AdminSidebar />
        </div>

        <div className="border-t border-border-soft p-4">
          <div className="flex items-center gap-3 rounded-none border border-border-soft bg-cream-warm/50 px-3 py-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-ink font-display text-lg text-champagne">
              {initial}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{userName}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-ink-faint">Quản trị viên</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border-soft surface-glass px-8 py-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-ink-faint">Bảng điều khiển</p>
            <p className="mt-0.5 text-sm">
              Xin chào, <span className="font-medium text-ink">{userName}</span>
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 border border-border-soft bg-white px-4 py-2 text-xs uppercase tracking-[0.18em] text-ink-muted transition-all duration-300 hover:border-ink hover:text-ink"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 4h6v6M10 14L20 4M19 12v7a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1h7" />
              </svg>
              Về cửa hàng
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-[0.18em] text-ink-muted transition-colors hover:text-burgundy"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 17l5-5-5-5M21 12H9M9 21H4V3h5" />
                </svg>
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
