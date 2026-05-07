import Link from "next/link";
import { ProductCard } from "@/components/store/product-card";
import { getProductsByCategory } from "@/lib/queries/products";

export const metadata = {
  title: "Phụ kiện — Whisper of Scent",
  description: "Phụ kiện nước hoa cao cấp: vỏ da, refill, mini, túi đựng, atomizer.",
};

export default async function AccessoriesPage() {
  const products = await getProductsByCategory("phu-kien", 24);

  return (
    <>
      {/* Hero — modern, accent burgundy nhạt */}
      <section className="relative overflow-hidden border-b border-border-soft bg-cream">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(212, 165, 116, 0.18) 0%, transparent 45%), radial-gradient(circle at 90% 80%, rgba(15, 15, 16, 0.06) 0%, transparent 45%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="inline-flex items-center gap-2.5 rounded-full border border-champagne/40 bg-champagne/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-champagne-dark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3 w-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 4h6l1 4H8l1-4zm-2 4h10l2 12H5L7 8z" />
              </svg>
              Phụ kiện nước hoa
            </p>
            <h1 className="mt-4 font-display text-4xl font-light leading-tight sm:text-5xl lg:text-6xl">
              Tinh tế <span className="italic text-gold-gradient">trong</span> từng <span className="italic text-gold-gradient">chi tiết</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-ink-muted sm:text-base">
              Vỏ da bảo vệ, atomizer du lịch, mini decant, túi nhung sang trọng — những phụ kiện hoàn thiện trải nghiệm nước hoa của bạn mọi lúc, mọi nơi.
            </p>
          </div>
        </div>
      </section>

      {/* Category quick-links — kiểu phụ kiện */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-center text-[11px] uppercase tracking-[0.15em] text-ink-faint">Khám phá theo loại</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {[
            { label: "Vỏ da", desc: "Bảo vệ chai nước hoa", svg: "M5 7h14v14H5V7zm2-3h10v3H7V4z" },
            { label: "Atomizer du lịch", desc: "5–10ml mang đi", svg: "M10 3h4v3l2 2v12H8V8l2-2V3zm-1 8h6" },
            { label: "Mini / Decant", desc: "Sample 2-10ml", svg: "M11 4h2v3l1 1v11h-4V8l1-1V4z" },
            { label: "Túi nhung", desc: "Đựng quà & bảo quản", svg: "M5 7l3-4h8l3 4v13H5V7zm0 0h14" },
          ].map((it, i) => (
            <Link
              key={it.label}
              href="#products"
              style={{ animationDelay: `${i * 50}ms` }}
              className="group flex animate-fade-in-up flex-col items-center gap-2 rounded-sm border border-border-soft bg-paper px-3 py-5 text-center transition-all duration-500 ease-luxe hover:-translate-y-0.5 hover:border-champagne hover:shadow-soft"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cream-warm text-champagne-dark transition-colors group-hover:bg-champagne/15">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d={it.svg} />
                </svg>
              </span>
              <p className="font-grotesk text-sm font-semibold text-ink">{it.label}</p>
              <p className="text-[11px] text-ink-muted">{it.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Products grid */}
      <section id="products" className="mx-auto max-w-7xl scroll-mt-28 px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-border-soft pb-3">
          <h2 className="font-display text-2xl font-light sm:text-3xl">Tất cả phụ kiện</h2>
          <p className="text-sm text-ink-muted">
            <span className="font-grotesk font-semibold text-ink">{products.length}</span> sản phẩm
          </p>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-cream-warm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-ink-muted">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 4h6l1 4H8l1-4zm-2 4h10l2 12H5L7 8z" />
              </svg>
            </span>
            <p className="font-display text-2xl">Đang cập nhật phụ kiện</p>
            <p className="mt-2 max-w-sm text-sm text-ink-muted">
              Bộ sưu tập phụ kiện sẽ sớm có mặt. Khám phá nước hoa trong khi chờ đợi.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-sm bg-ink px-6 text-sm text-cream transition-colors hover:bg-ink-soft"
            >
              Xem tất cả sản phẩm
              <span aria-hidden>→</span>
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p, i) => (
              <div
                key={p.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
