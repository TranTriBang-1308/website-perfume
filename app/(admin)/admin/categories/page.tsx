import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteButton } from "@/components/admin/delete-button";
import { AdminPageHeader } from "@/components/admin/page-header";

export const metadata = { title: "Danh mục — Admin" };

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <AdminPageHeader
        title="Danh mục"
        description={`${categories.length} danh mục`}
        action={{ href: "/admin/categories/new", label: "Thêm danh mục" }}
      />

      <div className="overflow-hidden border border-border-soft bg-white shadow-soft">
        {categories.length === 0 ? (
          <p className="p-12 text-center text-sm text-ink-muted">Chưa có danh mục nào.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-cream-warm/40">
              <tr className="text-left text-[10px] uppercase tracking-[0.2em] text-ink-muted">
                <th className="px-6 py-3 font-medium">Tên</th>
                <th className="px-6 py-3 font-medium">Slug</th>
                <th className="px-6 py-3 text-center font-medium">Sản phẩm</th>
                <th className="px-6 py-3 text-right font-medium">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr
                  key={c.id}
                  className="border-t border-border-soft transition-colors hover:bg-cream-warm/30"
                >
                  <td className="px-6 py-3.5 font-medium text-ink">{c.name}</td>
                  <td className="px-6 py-3.5 font-mono text-xs text-ink-faint">/{c.slug}</td>
                  <td className="px-6 py-3.5 text-center">
                    <span className="inline-flex h-6 min-w-6 items-center justify-center bg-cream-warm px-2 text-xs font-medium text-ink">
                      {c._count.products}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/categories/${c.id}`}
                        className="text-[11px] uppercase tracking-[0.18em] text-ink-muted transition-colors hover:text-champagne-dark"
                      >
                        Sửa
                      </Link>
                      <DeleteButton
                        endpoint={`/api/admin/categories/${c.id}`}
                        confirmMessage={`Xóa danh mục "${c.name}"?`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
