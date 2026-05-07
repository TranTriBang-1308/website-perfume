import Link from "next/link";
import Image from "next/image";
import {
  getFeaturedProducts,
  getBrandsAndCategories,
  getBestSellers,
  getOnSaleProducts,
} from "@/lib/queries/products";
import { getActiveBanners } from "@/lib/queries/banners";
import { ProductCard } from "@/components/store/product-card";
import { HeroSlider } from "@/components/store/hero-slider";
import { SectionHeader } from "@/components/ui/section-header";

export default async function HomePage() {
  const [featured, bestSellers, onSale, { brands }, banners] = await Promise.all([
    getFeaturedProducts(8),
    getBestSellers(6),
    getOnSaleProducts(4),
    getBrandsAndCategories(),
    getActiveBanners(),
  ]);

  return (
    <>
      {banners.length > 0 ? (
        <HeroSlider banners={banners} />
      ) : (
        // Fallback hero — modern editorial split layout, palette mới
        <section className="relative overflow-hidden bg-cream">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 15% 20%, rgba(212, 165, 116, 0.18) 0%, transparent 45%), radial-gradient(circle at 85% 85%, rgba(122, 45, 60, 0.08) 0%, transparent 45%)",
            }}
          />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
              <div className="space-y-6 animate-fade-in-up">
                <p className="inline-flex items-center gap-2.5 rounded-full border border-champagne/40 bg-champagne/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-champagne-dark">
                  <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-champagne animate-pulse-soft" />
                  Bộ sưu tập 2026
                </p>
                <h1 className="font-display text-5xl font-light leading-[1.05] sm:text-6xl lg:text-7xl">
                  Hương thơm
                  <br />
                  <span className="text-gold-gradient italic">định hình</span> cá tính
                </h1>
                <p className="max-w-md text-base leading-relaxed text-ink-muted">
                  Khám phá những chai nước hoa được chọn lọc tinh tế từ các maison danh tiếng — Pháp, Ý, Anh và bậc thầy phương Đông.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    href="/products"
                    className="group inline-flex h-12 items-center gap-2 rounded-sm bg-ink px-7 text-sm font-medium tracking-wide text-cream transition-all duration-300 ease-luxe hover:bg-ink-soft hover:shadow-luxe"
                  >
                    Khám phá ngay
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </Link>
                  <Link
                    href="/gift-sets"
                    className="inline-flex h-12 items-center gap-2 rounded-sm border border-ink px-7 text-sm font-medium tracking-wide text-ink transition-all duration-300 ease-luxe hover:bg-ink hover:text-cream"
                  >
                    Set quà tặng
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </Link>
                </div>
                <div className="flex items-center gap-6 pt-4 text-[11px] uppercase tracking-[0.15em] text-ink-faint">
                  <span className="inline-flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5 text-champagne">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M12 22a10 10 0 100-20 10 10 0 000 20z" />
                    </svg>
                    Chính hãng 100%
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5 text-champagne">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h13l3 4v6h-3a2 2 0 11-4 0H9a2 2 0 11-4 0H3V7z" />
                    </svg>
                    Giao toàn quốc
                  </span>
                </div>
              </div>

              <div className="relative aspect-4/5 overflow-hidden rounded-sm border border-border-soft bg-linear-to-br from-champagne/15 via-cream to-burgundy/8 shadow-luxe">
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 50% 50%, rgba(212, 165, 116, 0.3) 0%, transparent 60%)",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 240" className="h-3/4 w-auto text-champagne/40 animate-float-y" fill="none" stroke="currentColor" strokeWidth="1">
                    {/* Bottle silhouette outline */}
                    <path d="M85 30h30v18l8 8v22h-46V56l8-8V30z" />
                    <rect x="65" y="78" width="70" height="130" rx="6" />
                    <line x1="65" y1="100" x2="135" y2="100" />
                    <line x1="80" y1="135" x2="120" y2="135" />
                    <text x="100" y="155" textAnchor="middle" className="fill-champagne/50 font-display text-[14px] italic">Whisper</text>
                    <text x="100" y="172" textAnchor="middle" className="fill-champagne/40 font-display text-[10px]">of Scent</text>
                  </svg>
                </div>
                <span aria-hidden className="absolute bottom-4 left-4 right-4 h-px bg-linear-to-r from-transparent via-champagne/50 to-transparent" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Trust strip — gọn, icon nhỏ */}
      <section className="border-y border-border-soft bg-paper">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-border-soft sm:grid-cols-4">
          {[
            { icon: "M3 7h13l3 4v6h-3a2 2 0 11-4 0H9a2 2 0 11-4 0H3V7z", title: "Giao hàng miễn phí", desc: "Đơn từ 1.500.000₫" },
            { icon: "M9 12l2 2 4-4M12 22a10 10 0 100-20 10 10 0 000 20z", title: "Hàng chính hãng", desc: "Cam kết 100%" },
            { icon: "M3 6l9 6 9-6M3 6v12h18V6", title: "Đổi trả 7 ngày", desc: "Nhanh chóng tiện lợi" },
            { icon: "M12 2l3 7h7l-5.5 4 2 7-6.5-4.5L5.5 20l2-7L2 9h7z", title: "Quà tặng kèm", desc: "Mỗi đơn hàng" },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-3 bg-paper px-4 py-4 sm:gap-4 sm:px-6">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-champagne/12 text-champagne-dark">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
              </span>
              <div>
                <p className="font-grotesk text-[13px] font-medium text-ink">{item.title}</p>
                <p className="text-[11px] text-ink-muted">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeader
            eyebrow="Tuyển chọn"
            title="Sản phẩm nổi bật"
            description="Những hương thơm được yêu thích nhất, chọn lọc kỹ lưỡng từ các nhà sáng lập danh tiếng."
            link={{ href: "/products", label: "Xem tất cả" }}
          />

          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((product, i) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Categories quick-jump — discover by gender + gift + accessories */}
      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {[
            { href: "/products?gender=FEMALE", label: "Nữ", desc: "Quyến rũ, tinh tế", svg: "M12 4a4 4 0 11-4 4 4 4 0 014-4zm0 10c4 0 7 3 7 6H5c0-3 3-6 7-6z" },
            { href: "/products?gender=MALE", label: "Nam", desc: "Mạnh mẽ, lịch lãm", svg: "M9 8h6V4h-6v4zm-2 0v8a5 5 0 0010 0V8H7z" },
            { href: "/products?gender=UNISEX", label: "Unisex", desc: "Đa phong cách", svg: "M5 12a7 7 0 1114 0M9 4l3-2 3 2M12 12v8" },
            { href: "/gift-sets", label: "Set quà", desc: "Sang trọng tặng yêu", svg: "M3 8h18v4H3V8zm2 4h14v9H5v-9zm7-7v16M5 8a3 3 0 010-5c2 0 5 2 7 5M19 8a3 3 0 000-5c-2 0-5 2-7 5" },
            { href: "/accessories", label: "Phụ kiện", desc: "Vỏ, refill, mini", svg: "M9 4h6l1 4H8l1-4zm-2 4h10l2 12H5L7 8z" },
          ].map((c, i) => (
            <Link
              key={c.label}
              href={c.href}
              style={{ animationDelay: `${i * 50}ms` }}
              className="group relative flex animate-fade-in-up flex-col items-center justify-center gap-2 overflow-hidden rounded-sm border border-border-soft bg-paper px-4 py-6 text-center transition-all duration-500 ease-luxe hover:-translate-y-0.5 hover:border-champagne hover:shadow-luxe"
            >
              <span
                aria-hidden
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at center, rgba(212, 165, 116, 0.10) 0%, transparent 70%)",
                }}
              />
              <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-cream-warm text-champagne-dark transition-colors group-hover:bg-champagne/15">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d={c.svg} />
                </svg>
              </span>
              <p className="relative font-grotesk text-sm font-semibold text-ink">{c.label}</p>
              <p className="relative text-[11px] text-ink-muted">{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Best-sellers — kiểu top rank với số lớn bên cạnh */}
      {bestSellers.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeader
            eyebrow="Bán chạy nhất"
            title="Top sản phẩm yêu thích"
            description="Những chai nước hoa được khách hàng lựa chọn nhiều nhất gần đây."
            link={{ href: "/products?sort=featured", label: "Xem thêm" }}
          />
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3">
            {bestSellers.slice(0, 6).map((product, i) => (
              <div
                key={product.id}
                className="relative animate-fade-in-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -left-2 -top-3 z-10 select-none font-display text-7xl leading-none text-champagne/35 sm:text-8xl"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Editorial banner sang trọng */}
      <section className="relative my-8 overflow-hidden bg-ink py-16 text-cream sm:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 50%, rgba(212, 165, 116, 0.25) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(122, 45, 60, 0.2) 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-champagne">
            <span aria-hidden className="h-px w-8 bg-champagne/60" />
            Nghệ thuật hương
            <span aria-hidden className="h-px w-8 bg-champagne/60" />
          </p>
          <h2 className="mt-5 font-display text-4xl font-light leading-tight sm:text-5xl lg:text-6xl">
            Mỗi giọt hương là một <span className="italic text-gold-gradient">câu chuyện</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-cream/70">
            Từ những đồng hoa Grasse, đến những nốt gỗ trầm phương Đông — chúng tôi gói trọn nghệ thuật vào mỗi chai nước hoa.
          </p>
          <Link
            href="/brands"
            className="group mt-8 inline-flex h-12 items-center gap-3 rounded-sm border border-champagne px-7 text-sm font-medium tracking-wide text-champagne transition-all duration-300 ease-luxe hover:bg-champagne hover:text-ink"
          >
            Khám phá thương hiệu
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </section>

      {/* On Sale */}
      {onSale.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeader
            eyebrow="Ưu đãi giới hạn"
            title="Sản phẩm đang giảm giá"
            description="Cơ hội sở hữu các chai nước hoa cao cấp với mức giá đặc biệt."
            link={{ href: "/sale", label: "Xem tất cả" }}
          />
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
            {onSale.map((product, i) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Brands compact */}
      {brands.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeader
            eyebrow="Đẳng cấp"
            title="Thương hiệu nổi bật"
            description="Hợp tác với các nhà nước hoa biểu tượng — Pháp, Ý, Anh và những bậc thầy phương Đông."
            link={{ href: "/brands", label: "Xem tất cả" }}
          />
          <div className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-5">
            {brands.slice(0, 10).map((brand, i) => (
              <Link
                key={brand.id}
                href={`/products?brand=${brand.slug}`}
                style={{ animationDelay: `${i * 40}ms` }}
                className="group relative flex aspect-5/3 animate-fade-in-scale items-center justify-center overflow-hidden rounded-sm border border-border-soft bg-paper transition-all duration-500 ease-luxe hover:-translate-y-0.5 hover:border-champagne hover:shadow-luxe"
              >
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at center, rgba(212, 165, 116, 0.12) 0%, transparent 70%)",
                  }}
                />
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    sizes="(min-width: 1024px) 18vw, (min-width: 640px) 24vw, 32vw"
                    className="object-contain p-3 transition-transform duration-700 ease-luxe group-hover:scale-[1.04] sm:p-4"
                  />
                ) : (
                  <span className="font-display text-base text-ink transition-colors duration-500 group-hover:text-champagne-dark sm:text-lg">
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
