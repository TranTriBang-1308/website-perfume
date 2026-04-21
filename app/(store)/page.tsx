import Link from "next/link";
import { getFeaturedProducts, getBrandsAndCategories } from "@/lib/queries/products";
import { ProductCard } from "@/components/store/product-card";

export default async function HomePage() {
  const [featured, { brands }] = await Promise.all([
    getFeaturedProducts(8),
    getBrandsAndCategories(),
  ]);

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">Bộ sưu tập mới</p>
            <h1 className="font-display text-5xl font-light leading-tight sm:text-6xl lg:text-7xl">
              Hương thơm
              <br />
              định hình cá tính
            </h1>
            <p className="max-w-md text-base text-ink-muted">
              Khám phá những chai nước hoa được chọn lọc tinh tế từ các thương hiệu danh tiếng thế giới.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/products"
                className="inline-flex h-11 items-center bg-ink px-8 text-sm font-medium text-white hover:bg-ink/90"
              >
                Khám phá ngay
              </Link>
              <Link
                href="/products?gender=UNISEX"
                className="inline-flex h-11 items-center border border-ink px-8 text-sm font-medium text-ink hover:bg-ink hover:text-white"
              >
                Nước hoa Unisex
              </Link>
            </div>
          </div>

          <div className="aspect-[4/5] bg-gradient-to-br from-champagne/20 to-burgundy/10 border border-[color:var(--color-border-soft)]" />
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between border-b border-[color:var(--color-border-soft)] pb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">Tuyển chọn</p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl">Sản phẩm nổi bật</h2>
            </div>
            <Link href="/products" className="text-sm text-ink-muted hover:text-ink">
              Xem tất cả →
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {brands.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl sm:text-4xl">Thương hiệu nổi bật</h2>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/products?brand=${brand.slug}`}
                className="flex aspect-square items-center justify-center border border-[color:var(--color-border-soft)] bg-white font-display text-xl transition-colors hover:bg-ink hover:text-white"
              >
                {brand.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
