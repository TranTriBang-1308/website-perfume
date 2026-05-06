import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts, getBrandsAndCategories } from "@/lib/queries/products";
import { getActiveBanners } from "@/lib/queries/banners";
import { ProductCard } from "@/components/store/product-card";
import { HeroSlider } from "@/components/store/hero-slider";
import { SectionHeader } from "@/components/ui/section-header";

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
        <section className="relative overflow-hidden bg-linear-to-br from-cream via-cream-warm to-cream">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, rgba(201, 169, 97, 0.18) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(109, 26, 42, 0.08) 0%, transparent 50%)",
            }}
          />
          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="space-y-7 animate-fade-in-up">
                <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.35em] text-champagne-dark">
                  <span aria-hidden className="h-px w-10 bg-champagne" />
                  Bộ sưu tập mới
                </p>
                <h1 className="font-display text-5xl font-light leading-[1.05] sm:text-6xl lg:text-7xl">
                  Hương thơm
                  <br />
                  <span className="text-gold-gradient italic">định hình</span> cá tính
                </h1>
                <p className="max-w-md text-base leading-relaxed text-ink-muted">
                  Khám phá những chai nước hoa được chọn lọc tinh tế từ các thương hiệu danh tiếng thế giới.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link
                    href="/products"
                    className="group inline-flex h-12 items-center gap-2 bg-ink px-8 text-sm font-medium tracking-wide text-white transition-all duration-300 ease-luxe hover:bg-ink-soft hover:shadow-luxe"
                  >
                    Khám phá ngay
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </Link>
                  <Link
                    href="/products?gender=UNISEX"
                    className="inline-flex h-12 items-center border border-ink px-8 text-sm font-medium tracking-wide text-ink transition-all duration-300 ease-luxe hover:bg-ink hover:text-white"
                  >
                    Nước hoa Unisex
                  </Link>
                </div>
              </div>

              <div className="relative aspect-[4/5] overflow-hidden border border-border-soft bg-linear-to-br from-champagne/15 via-cream to-burgundy/10 shadow-luxe">
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 50% 50%, rgba(201, 169, 97, 0.3) 0%, transparent 60%)",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 200" className="h-2/3 w-2/3 text-champagne/30" fill="currentColor">
                    <circle cx="100" cy="50" r="15" />
                    <circle cx="150" cy="100" r="15" />
                    <circle cx="100" cy="150" r="15" />
                    <circle cx="50" cy="100" r="15" />
                    <circle cx="100" cy="100" r="10" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Trust strip */}
      <section className="border-y border-border-soft bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-border-soft sm:grid-cols-4">
          {[
            { icon: "M3 7h13l3 4v6h-3a2 2 0 11-4 0H9a2 2 0 11-4 0H3V7z", title: "Giao hàng miễn phí", desc: "Đơn từ 1.500.000₫" },
            { icon: "M9 12l2 2 4-4M12 22a10 10 0 100-20 10 10 0 000 20z", title: "Hàng chính hãng", desc: "Cam kết 100%" },
            { icon: "M3 6l9 6 9-6M3 6v12h18V6", title: "Đổi trả 7 ngày", desc: "Nhanh chóng tiện lợi" },
            { icon: "M12 2l3 7h7l-5.5 4 2 7-6.5-4.5L5.5 20l2-7L2 9h7z", title: "Quà tặng kèm", desc: "Mỗi đơn hàng" },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-4 bg-white px-6 py-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-cream-warm text-champagne-dark">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
              </span>
              <div>
                <p className="text-sm font-medium text-ink">{item.title}</p>
                <p className="text-xs text-ink-muted">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Tuyển chọn"
            title="Sản phẩm nổi bật"
            description="Những hương thơm được yêu thích nhất, chọn lọc kỹ lưỡng từ các nhà sáng lập danh tiếng."
            link={{ href: "/products", label: "Xem tất cả" }}
          />

          <div className="mt-12 grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((product, i) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Editorial banner sang trọng */}
      <section className="relative my-12 overflow-hidden bg-ink py-20 text-cream sm:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 50%, rgba(201, 169, 97, 0.25) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(109, 26, 42, 0.2) 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="flex items-center justify-center gap-3 text-[11px] font-medium uppercase tracking-[0.4em] text-champagne">
            <span aria-hidden className="h-px w-10 bg-champagne/60" />
            Nghệ thuật hương
            <span aria-hidden className="h-px w-10 bg-champagne/60" />
          </p>
          <h2 className="mt-6 font-display text-4xl font-light leading-tight sm:text-5xl lg:text-6xl">
            Mỗi giọt hương là một <span className="italic text-gold-gradient">câu chuyện</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-cream/70">
            Từ những đồng hoa Grasse, đến những nốt gỗ trầm phương Đông — chúng tôi gói trọn nghệ thuật vào mỗi chai nước hoa.
          </p>
          <Link
            href="/brands"
            className="group mt-10 inline-flex h-12 items-center gap-3 border border-champagne px-8 text-sm font-medium tracking-wide text-champagne transition-all duration-300 ease-luxe hover:bg-champagne hover:text-ink"
          >
            Khám phá thương hiệu
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </section>

      {brands.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Đẳng cấp"
            title="Thương hiệu nổi bật"
            description="Hợp tác với các nhà nước hoa biểu tượng — Pháp, Ý, Anh và những bậc thầy phương Đông."
            link={{ href: "/brands", label: "Xem tất cả" }}
          />
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
            {brands.slice(0, 8).map((brand, i) => (
              <Link
                key={brand.id}
                href={`/products?brand=${brand.slug}`}
                style={{ animationDelay: `${i * 50}ms` }}
                className="group relative flex aspect-square animate-fade-in-scale items-center justify-center overflow-hidden border border-border-soft bg-white shadow-soft transition-all duration-500 ease-luxe hover:border-champagne hover:shadow-luxe hover:-translate-y-1"
              >
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at center, rgba(201, 169, 97, 0.12) 0%, transparent 70%)",
                  }}
                />
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    sizes="(min-width: 640px) 25vw, 50vw"
                    className="object-contain p-6 transition-transform duration-700 ease-luxe group-hover:scale-105 sm:p-8"
                  />
                ) : (
                  <span className="font-display text-xl text-ink transition-colors duration-500 group-hover:text-champagne-dark">
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
