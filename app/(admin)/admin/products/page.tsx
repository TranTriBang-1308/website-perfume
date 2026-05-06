import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatVND } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/delete-button";
import { AdminPageHeader } from "@/components/admin/page-header";

export const metadata = { title: "Sản phẩm — Admin" };

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const q = typeof raw.q === "string" ? raw.q : "";
  const page = Math.max(1, Number(raw.page) || 1);
  const limit = 20;

  // SKU giờ thuộc variant — search theo tên hoặc theo SKU của bất kỳ variant nào
  const where: any = {
    OR: [
      { name: { contains: q, mode: "insensitive" } },
      { variants: { some: { sku: { contains: q, mode: "insensitive" } } } },
    ],
  };

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
        minPrice: true,
        isActive: true,
        brand: { select: { name: true } },
        images: { take: 1, select: { url: true } },
        variants: {
          select: { volumeMl: true, stock: true, isDefault: true, sku: true },
          orderBy: [{ position: "asc" }, { volumeMl: "asc" }],
        },
      },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6 animate-fade-in">
      <AdminPageHeader
        title="Sản phẩm"
        description={`${total.toLocaleString("vi-VN")} sản phẩm`}
        action={{ href: "/admin/products/new", label: "Thêm sản phẩm" }}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <form method="get" className="relative max-w-sm flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="M21 21l-4.5-4.5" />
            </svg>
          </span>
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Tìm theo tên, SKU..."
            className="h-10 w-full border border-border-soft bg-white pl-10 pr-3 text-sm transition-colors focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne/30"
          />
        </form>
      </div>

      <div className="overflow-hidden border border-border-soft bg-white shadow-soft">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <span className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-full bg-cream-warm text-ink-muted">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
                <circle cx="11" cy="11" r="7" />
                <path strokeLinecap="round" d="M21 21l-4.5-4.5" />
              </svg>
            </span>
            <p className="font-display text-lg">Không tìm thấy sản phẩm</p>
            <p className="mt-1 text-sm text-ink-muted">Hãy thử từ khóa khác hoặc tạo sản phẩm mới.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-warm/40">
                <tr className="text-left text-[10px] uppercase tracking-[0.2em] text-ink-muted">
                  <th className="px-6 py-3 font-medium">Sản phẩm</th>
                  <th className="px-6 py-3 font-medium">Thương hiệu</th>
                  <th className="px-6 py-3 font-medium">Dung tích</th>
                  <th className="px-6 py-3 text-right font-medium">Giá từ</th>
                  <th className="px-6 py-3 text-center font-medium">Tồn</th>
                  <th className="px-6 py-3 text-center font-medium">Trạng thái</th>
                  <th className="px-6 py-3 text-right font-medium">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
                  const volumes = p.variants.map((v) => `${v.volumeMl}ml`).join(", ");
                  const lowStock = totalStock > 0 && totalStock <= 10;
                  const outOfStock = totalStock === 0;
                  return (
                    <tr
                      key={p.id}
                      className="border-t border-border-soft transition-colors hover:bg-cream-warm/30"
                    >
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          {p.images[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.images[0].url}
                              alt=""
                              className="h-12 w-10 shrink-0 object-cover border border-border-soft"
                            />
                          ) : (
                            <div className="flex h-12 w-10 shrink-0 items-center justify-center border border-border-soft bg-cream-warm text-[10px] text-ink-faint">
                              N/A
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="truncate font-medium text-ink">{p.name}</p>
                            <p className="text-[11px] text-ink-faint">/{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-sm text-ink-muted">{p.brand.name}</td>
                      <td className="px-6 py-3.5 text-xs text-ink-muted">{volumes || "—"}</td>
                      <td className="px-6 py-3.5 text-right font-medium">
                        {formatVND(Number(p.minPrice))}
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        <span
                          className={`text-xs font-medium ${
                            outOfStock ? "text-burgundy" : lowStock ? "text-amber-700" : "text-ink-muted"
                          }`}
                        >
                          {totalStock}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        <span
                          className={`inline-flex items-center gap-1 border px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] ${
                            p.isActive
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-border-soft bg-cream-warm text-ink-muted"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              p.isActive ? "bg-emerald-500" : "bg-ink-faint"
                            }`}
                          />
                          {p.isActive ? "Bán" : "Ẩn"}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/admin/products/${p.id}`}
                            className="text-[11px] uppercase tracking-[0.18em] text-ink-muted transition-colors hover:text-champagne-dark"
                          >
                            Sửa
                          </Link>
                          <DeleteButton endpoint={`/api/admin/products/${p.id}`} />
                        </div>
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
            <Link
              key={i + 1}
              href={`?q=${q}&page=${i + 1}`}
              className={`min-w-9 px-3 py-1.5 text-center text-sm transition-colors ${
                page === i + 1
                  ? "bg-ink text-white shadow-soft"
                  : "border border-border-soft bg-white text-ink-muted hover:border-ink hover:text-ink"
              }`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
