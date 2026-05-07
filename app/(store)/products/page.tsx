import { productQuerySchema } from "@/lib/validations/product";
import { listProducts, getBrandsAndCategories } from "@/lib/queries/products";
import { ProductCard } from "@/components/store/product-card";
import { ProductFilters } from "@/components/store/product-filters";
import { ProductSort } from "@/components/store/product-sort";
import { Pagination } from "@/components/store/pagination";

export const metadata = { title: "Sản phẩm — Whisper of Scent" };

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProductsPage({ searchParams }: PageProps) {
  const rawParams = await searchParams;

  const parsed = productQuerySchema.safeParse(rawParams);
  const query = parsed.success ? parsed.data : productQuerySchema.parse({});

  const [{ products, pagination }, { brands, categories }] = await Promise.all([
    listProducts(query),
    getBrandsAndCategories(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="border-b border-border-soft pb-6">
        <p className="inline-flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-champagne-dark">
          <span aria-hidden className="h-px w-8 bg-champagne" />
          Bộ sưu tập
        </p>
        <h1 className="mt-2 font-display text-4xl font-light leading-tight sm:text-5xl">
          Tất cả sản phẩm
        </h1>
        <p className="mt-2 max-w-xl text-sm text-ink-muted">
          Chọn lọc kỹ lưỡng từ các maison danh tiếng — đa dạng phong cách, tinh tế trong từng nốt hương.
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <ProductFilters brands={brands} categories={categories} />

        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-soft pb-3">
            <p className="text-sm text-ink-muted">
              <span className="font-grotesk font-semibold text-ink">{pagination.total}</span> sản phẩm
            </p>
            <ProductSort />
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-cream-warm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-ink-muted">
                  <circle cx="11" cy="11" r="7" />
                  <path strokeLinecap="round" d="M21 21l-4.5-4.5" />
                </svg>
              </span>
              <p className="font-display text-2xl">Không tìm thấy sản phẩm</p>
              <p className="mt-2 max-w-sm text-sm text-ink-muted">
                Hãy thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 md:grid-cols-3">
              {products.map((product, i) => (
                <div
                  key={product.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            searchParams={rawParams}
          />
        </div>
      </div>
    </div>
  );
}
