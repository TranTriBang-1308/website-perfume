import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";

export const metadata = { title: "Danh mục — Admin" };

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Danh mục</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {categories.length} danh mục
          </p>
        </div>
        <Link href="/admin/categories/new">
          <Button>+ Thêm danh mục</Button>
        </Link>
      </header>

      <div className="border border-[color:var(--color-border-soft)] bg-white">
        {categories.length === 0 ? (
          <p className="p-6 text-sm text-ink-muted">Chưa có danh mục nào.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest text-ink-muted">
                <th className="px-6 py-3">Tên</th>
                <th className="px-6 py-3">Slug</th>
                <th className="px-6 py-3 text-center">Sản phẩm</th>
                <th className="px-6 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr
                  key={c.id}
                  className="border-t border-[color:var(--color-border-soft)]"
                >
                  <td className="px-6 py-3 font-medium">{c.name}</td>
                  <td className="px-6 py-3 font-mono text-xs text-ink-muted">
                    {c.slug}
                  </td>
                  <td className="px-6 py-3 text-center text-ink-muted">
                    {c._count.products}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/categories/${c.id}`}
                        className="text-xs uppercase tracking-widest text-ink-muted hover:text-ink"
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
