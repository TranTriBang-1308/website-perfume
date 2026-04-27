import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts, getBrandsAndCategories } from "@/lib/queries/products";
import { getActiveBanners } from "@/lib/queries/banners";
import { ProductCard } from "@/components/store/product-card";
import { HeroSlider } from "@/components/store/hero-slider";

export default async function HomePage() {
  const [featured, { brands }, banners] = await Promise.all([
    getFeaturedProducts(8),
    getBrandsAndCategories(),
    getActiveBanners(),
  ]);

  return (
    <>
      {banners.length > 0 ? (
        <HeroSlider banners={banners} />
      ) : (
        // Fallback sang trọng khi admin chưa cấu hình banner
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
      )}

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
          <div className="flex items-end justify-between">
            <h2 className="font-display text-3xl sm:text-4xl">Thương hiệu nổi bật</h2>
            <Link href="/brands" className="text-sm text-ink-muted hover:text-ink">
              Xem tất cả →
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {brands.slice(0, 8).map((brand) => (
              <Link
                key={brand.id}
                href={`/products?brand=${brand.slug}`}
                className="group relative flex aspect-square items-center justify-center overflow-hidden border border-[color:var(--color-border-soft)] bg-white transition-colors hover:border-ink"
              >
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    sizes="(min-width: 640px) 25vw, 50vw"
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-105 sm:p-6"
                  />
                ) : (
                  <span className="font-display text-xl text-ink transition-colors group-hover:text-champagne">
                    {brand.name}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
