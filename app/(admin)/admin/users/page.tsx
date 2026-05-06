import { prisma } from "@/lib/prisma";
import { UserRoleForm } from "@/components/admin/user-role-form";
import { AdminPageHeader } from "@/components/admin/page-header";

export const metadata = { title: "Người dùng — Admin" };

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const page = Math.max(1, Number(raw.page) || 1);
  const limit = 30;

  const [total, users] = await Promise.all([
    prisma.user.count(),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6 animate-fade-in">
      <AdminPageHeader
        title="Người dùng"
        description={`${total.toLocaleString("vi-VN")} tài khoản đã đăng ký`}
      />

      <div className="overflow-hidden border border-border-soft bg-white shadow-soft">
        {users.length === 0 ? (
          <p className="p-12 text-center text-sm text-ink-muted">Không có người dùng nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-warm/40">
                <tr className="text-left text-[10px] uppercase tracking-[0.2em] text-ink-muted">
                  <th className="px-6 py-3 font-medium">Người dùng</th>
                  <th className="px-6 py-3 font-medium">Vai trò</th>
                  <th className="px-6 py-3 text-center font-medium">Đơn hàng</th>
                  <th className="px-6 py-3 font-medium">Tham gia</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const initial = (u.name ?? u.email).charAt(0).toUpperCase();
                  return (
                    <tr
                      key={u.id}
                      className="border-t border-border-soft transition-colors hover:bg-cream-warm/30"
                    >
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-ink font-display text-sm text-champagne">
                            {initial}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-ink">{u.name ?? "—"}</p>
                            <p className="truncate font-mono text-[11px] text-ink-faint">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <UserRoleForm userId={u.id} currentRole={u.role} />
                      </td>
                      <td className="px-6 py-3.5 text-center text-ink-muted">{u._count.orders}</td>
                      <td className="px-6 py-3.5 text-sm text-ink-muted">
                        {new Date(u.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => (
            <a
              key={i + 1}
              href={`?page=${i + 1}`}
              className={`min-w-9 px-3 py-1.5 text-center text-sm transition-colors ${
                page === i + 1
                  ? "bg-ink text-white shadow-soft"
                  : "border border-border-soft bg-white text-ink-muted hover:border-ink hover:text-ink"
              }`}
            >
              {i + 1}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
