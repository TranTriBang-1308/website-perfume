import Link from "next/link";
import { ProductCard } from "@/components/store/product-card";
import { getOnSaleProducts } from "@/lib/queries/products";

export const metadata = {
  title: "Ưu đãi & Khuyến mãi — Whisper of Scent",
  description: "Tất cả sản phẩm nước hoa đang giảm giá đặc biệt. Cơ hội sở hữu hàng cao cấp với mức giá tốt nhất.",
};

export default async function SalePage() {
  const products = await getOnSaleProducts(48);

  // Tính discount lớn nhất để hiển thị badge "tới -X%"
  const maxDiscount = products.reduce((max, p) => {
    const v = p.variants[0];
    if (!v?.compareAtPrice) return max;
    const compareAt = Number(v.compareAtPrice);
    const price = Number(v.price);
    if (compareAt <= price) return max;
    const pct = Math.round(((compareAt - price) / compareAt) * 100);
    return Math.max(max, pct);
  }, 0);

  return (
    <>
      {/* Hero — tone burgundy đậm cho sale */}
      <section className="relative overflow-hidden border-b border-burgundy/20 bg-linear-to-br from-burgundy via-burgundy-light to-ink text-cream">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 30%, rgba(212, 165, 116, 0.30) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(15, 15, 16, 0.4) 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="inline-flex items-center gap-2.5 rounded-full border border-champagne/40 bg-paper/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-champagne backdrop-blur">
              <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-champagne animate-pulse-soft" />
              Ưu đãi giới hạn
            </p>
            <h1 className="mt-4 font-display text-4xl font-light leading-tight sm:text-6xl lg:text-7xl">
              {maxDiscount > 0 ? (
                <>
                  Giảm giá đến <span className="italic text-gold-gradient">−{maxDiscount}%</span>
                </>
              ) : (
                <>
                  Ưu đãi <span className="italic text-gold-gradient">đặc biệt</span>
                </>
              )}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-cream/80 sm:text-base">
              Cơ hội sở hữu các chai nước hoa cao cấp với mức giá tốt nhất trong năm. Số lượng giới hạn — chỉ còn trong thời gian ngắn.
            </p>
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex items-end justify-between border-b border-border-soft pb-3">
          <h2 className="font-display text-2xl font-light sm:text-3xl">Đang giảm giá</h2>
          <p className="text-sm text-ink-muted">
            <span className="font-grotesk font-semibold text-ink">{products.length}</span> sản phẩm
          </p>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-cream-warm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-ink-muted">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M12 22a10 10 0 100-20 10 10 0 000 20z" />
              </svg>
            </span>
            <p className="font-display text-2xl">Hiện tại chưa có ưu đãi</p>
            <p className="mt-2 max-w-sm text-sm text-ink-muted">
              Hãy quay lại sau, các chương trình giảm giá đặc biệt sẽ sớm có mặt.
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
