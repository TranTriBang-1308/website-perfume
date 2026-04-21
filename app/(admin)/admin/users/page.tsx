import { prisma } from "@/lib/prisma";
import { UserRoleForm } from "@/components/admin/user-role-form";

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
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Người dùng</h1>
        <p className="mt-1 text-sm text-ink-muted">{total} người dùng</p>
      </div>

      <div className="border border-[color:var(--color-border-soft)] bg-white">
        {users.length === 0 ? (
          <p className="p-6 text-sm text-ink-muted">Không có người dùng nào.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest text-ink-muted">
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Tên</th>
                <th className="px-6 py-3">Vai trò</th>
                <th className="px-6 py-3 text-center">Đơn hàng</th>
                <th className="px-6 py-3">Tham gia</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-[color:var(--color-border-soft)]">
                  <td className="px-6 py-3 font-mono text-xs">{u.email}</td>
                  <td className="px-6 py-3">{u.name ?? "—"}</td>
                  <td className="px-6 py-3">
                    <UserRoleForm userId={u.id} currentRole={u.role} />
                  </td>
                  <td className="px-6 py-3 text-center text-ink-muted">{u._count.orders}</td>
                  <td className="px-6 py-3 text-sm text-ink-muted">{new Date(u.createdAt).toLocaleDateString("vi-VN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <a
              key={i + 1}
              href={`?page=${i + 1}`}
              className={`px-3 py-1 text-sm ${page === i + 1 ? "bg-ink text-white" : "border border-[color:var(--color-border-soft)]"}`}
            >
              {i + 1}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
