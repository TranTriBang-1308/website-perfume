import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatVND } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";

export const metadata = { title: "Sản phẩm — Admin" };

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const q = typeof raw.q === "string" ? raw.q : "";
  const page = Math.max(1, Number(raw.page) || 1);
  const limit = 20;

  const where: any = { OR: [{ name: { contains: q, mode: "insensitive" } }, { sku: { contains: q, mode: "insensitive" } }] };

  const [total, products] = await Promise.all([
    prisma.product.count({ where: q ? where : {} }),
    prisma.product.findMany({
      where: q ? where : {},
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        sku: true,
        price: true,
        stock: true,
        isActive: true,
        brand: { select: { name: true } },
        images: { take: 1, select: { url: true } },
      },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Sản phẩm</h1>
          <p className="mt-1 text-sm text-ink-muted">{total} sản phẩm</p>
        </div>
        <Link href="/admin/products/new">
          <Button>+ Thêm sản phẩm</Button>
        </Link>
      </header>

      <div className="flex gap-3">
        <form method="get" className="flex-1 max-w-sm">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Tìm theo tên, SKU..."
            className="w-full border border-[color:var(--color-border-soft)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ink"
          />
        </form>
      </div>

      <div className="border border-[color:var(--color-border-soft)] bg-white">
        {products.length === 0 ? (
          <p className="p-6 text-sm text-ink-muted">Không tìm thấy sản phẩm.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest text-ink-muted">
                <th className="px-6 py-3">Sản phẩm</th>
                <th className="px-6 py-3">SKU</th>
                <th className="px-6 py-3">Thương hiệu</th>
                <th className="px-6 py-3 text-right">Giá</th>
                <th className="px-6 py-3 text-center">Tồn</th>
                <th className="px-6 py-3 text-center">Trạng thái</th>
                <th className="px-6 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-[color:var(--color-border-soft)]">
                  <td className="px-6 py-3 font-medium">{p.name}</td>
                  <td className="px-6 py-3 font-mono text-xs text-ink-muted">{p.sku}</td>
                  <td className="px-6 py-3 text-sm text-ink-muted">{p.brand.name}</td>
                  <td className="px-6 py-3 text-right">{formatVND(Number(p.price))}</td>
                  <td className="px-6 py-3 text-center text-ink-muted">{p.stock}</td>
                  <td className="px-6 py-3 text-center">
                    <span className={`text-xs font-medium ${p.isActive ? "text-ink" : "text-ink-muted"}`}>
                      {p.isActive ? "Bán" : "Ẩn"}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="text-xs uppercase tracking-widest text-ink-muted hover:text-ink"
                      >
                        Sửa
                      </Link>
                      <DeleteButton endpoint={`/api/admin/products/${p.id}`} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <Link
              key={i + 1}
              href={`?q=${q}&page=${i + 1}`}
              className={`px-3 py-1 text-sm ${page === i + 1 ? "bg-ink text-white" : "border border-[color:var(--color-border-soft)]"}`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
