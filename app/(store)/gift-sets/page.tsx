import Link from "next/link";
import { ProductCard } from "@/components/store/product-card";
import { getProductsByCategory } from "@/lib/queries/products";

export const metadata = {
  title: "Set quà tặng — Whisper of Scent",
  description: "Bộ set nước hoa cao cấp tặng người yêu, gia đình, đối tác. Gói quà miễn phí kèm thiệp.",
};

export default async function GiftSetsPage() {
  const products = await getProductsByCategory("set-qua-tang", 24);

  return (
    <>
      {/* Hero — tone vàng champagne ấm nhẹ + ribbon */}
      <section className="relative overflow-hidden border-b border-border-soft bg-cream">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 30%, rgba(212, 165, 116, 0.22) 0%, transparent 45%), radial-gradient(circle at 10% 90%, rgba(122, 45, 60, 0.10) 0%, transparent 45%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="inline-flex items-center gap-2.5 rounded-full border border-champagne/40 bg-champagne/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-champagne-dark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3 w-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h18v4H3V8zm2 4h14v9H5v-9zm7-7v16M5 8a3 3 0 010-5c2 0 5 2 7 5M19 8a3 3 0 000-5c-2 0-5 2-7 5" />
              </svg>
              Set quà tặng
            </p>
            <h1 className="mt-4 font-display text-4xl font-light leading-tight sm:text-5xl lg:text-6xl">
              Trao tặng <span className="italic text-gold-gradient">hương thơm</span>,
              <br />
              gửi gắm <span className="italic text-gold-gradient">cảm xúc</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-ink-muted sm:text-base">
              Những bộ set được tuyển chọn kỹ lưỡng — đóng gói sang trọng, kèm thiệp chúc mừng theo yêu cầu. Hoàn hảo cho ngày lễ, kỷ niệm, hay đơn giản là một lời cảm ơn tinh tế.
            </p>
          </div>
        </div>
      </section>

      {/* USP strip — đặc thù gift set */}
      <section className="border-b border-border-soft bg-paper">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-border-soft md:grid-cols-4">
          {[
            { icon: "M3 8h18v4H3V8zm2 4h14v9H5v-9zm7-7v16", title: "Gói quà miễn phí", desc: "Hộp + ruy băng cao cấp" },
            { icon: "M5 8h14l-1 12H6L5 8zm3-4a4 4 0 018 0v4M9 12v6m6-6v6", title: "Thiệp chúc theo yêu cầu", desc: "Khắc tên / lời nhắn" },
            { icon: "M3 7h13l3 4v6h-3a2 2 0 11-4 0H9a2 2 0 11-4 0H3V7z", title: "Giao tận tay", desc: "Đóng gói cẩn thận" },
            { icon: "M9 12l2 2 4-4M12 22a10 10 0 100-20 10 10 0 000 20z", title: "Đổi trả linh hoạt", desc: "Trong 7 ngày" },
          ].map((it) => (
            <div key={it.title} className="flex items-center gap-3 bg-paper px-4 py-4 sm:px-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-champagne/12 text-champagne-dark">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d={it.icon} />
                </svg>
              </span>
              <div>
                <p className="font-grotesk text-[13px] font-medium">{it.title}</p>
                <p className="text-[11px] text-ink-muted">{it.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Curated occasions */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-center text-[11px] uppercase tracking-[0.15em] text-ink-faint">Gợi ý theo dịp</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {[
            { label: "Dành cho nàng", desc: "Sinh nhật, kỷ niệm" },
            { label: "Dành cho chàng", desc: "Lịch lãm, thành đạt" },
            { label: "Đối tác / Sếp", desc: "Trang trọng, đẳng cấp" },
            { label: "Người thân yêu", desc: "Gia đình, bố mẹ" },
          ].map((it, i) => (
            <div
              key={it.label}
              style={{ animationDelay: `${i * 50}ms` }}
              className="group animate-fade-in-up rounded-sm border border-border-soft bg-paper px-4 py-5 text-center transition-all duration-500 ease-luxe hover:-translate-y-0.5 hover:border-champagne hover:shadow-soft"
            >
              <p className="font-grotesk text-sm font-semibold text-ink">{it.label}</p>
              <p className="mt-1 text-[11px] text-ink-muted">{it.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Products grid */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-border-soft pb-3">
          <h2 className="font-display text-2xl font-light sm:text-3xl">Bộ sưu tập set quà</h2>
          <p className="text-sm text-ink-muted">
            <span className="font-grotesk font-semibold text-ink">{products.length}</span> set
          </p>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-cream-warm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-ink-muted">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h18v4H3V8zm2 4h14v9H5v-9zm7-7v16" />
              </svg>
            </span>
            <p className="font-display text-2xl">Đang chuẩn bị bộ sưu tập</p>
            <p className="mt-2 max-w-sm text-sm text-ink-muted">
              Bộ set quà sẽ sớm được cập nhật. Trong lúc chờ, hãy khám phá sản phẩm khác.
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
