import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";

export const metadata = { title: "Thương hiệu — Admin" };

export default async function AdminBrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Thương hiệu</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {brands.length} thương hiệu
          </p>
        </div>
        <Link href="/admin/brands/new">
          <Button>+ Thêm thương hiệu</Button>
        </Link>
      </header>

      <div className="border border-[color:var(--color-border-soft)] bg-white">
        {brands.length === 0 ? (
          <p className="p-6 text-sm text-ink-muted">Chưa có thương hiệu nào.</p>
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
              {brands.map((b) => (
                <tr
                  key={b.id}
                  className="border-t border-[color:var(--color-border-soft)]"
                >
                  <td className="px-6 py-3 font-medium">{b.name}</td>
                  <td className="px-6 py-3 font-mono text-xs text-ink-muted">
                    {b.slug}
                  </td>
                  <td className="px-6 py-3 text-center text-ink-muted">
                    {b._count.products}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/brands/${b.id}`}
                        className="text-xs uppercase tracking-widest text-ink-muted hover:text-ink"
                      >
                        Sửa
                      </Link>
                      <DeleteButton
                        endpoint={`/api/admin/brands/${b.id}`}
                        confirmMessage={`Xóa thương hiệu "${b.name}"?`}
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
