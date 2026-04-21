import { productQuerySchema } from "@/lib/validations/product";
import { listProducts, getBrandsAndCategories } from "@/lib/queries/products";
import { ProductCard } from "@/components/store/product-card";
import { ProductFilters } from "@/components/store/product-filters";
import { ProductSort } from "@/components/store/product-sort";
import { Pagination } from "@/components/store/pagination";

export const metadata = { title: "Sản phẩm — Parfum" };

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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="border-b border-[color:var(--color-border-soft)] pb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">Bộ sưu tập</p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">Tất cả sản phẩm</h1>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[220px_1fr]">
        <ProductFilters brands={brands} categories={categories} />

        <div>
          <div className="flex items-center justify-between border-b border-[color:var(--color-border-soft)] pb-4">
            <p className="text-sm text-ink-muted">
              {pagination.total} sản phẩm
            </p>
            <ProductSort />
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="font-display text-2xl">Không tìm thấy sản phẩm</p>
              <p className="mt-2 text-sm text-ink-muted">
                Hãy thử thay đổi bộ lọc hoặc tìm kiếm khác.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
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
