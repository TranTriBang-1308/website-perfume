import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Thương hiệu — Whisper of Scent",
  description: "Khám phá toàn bộ các thương hiệu nước hoa danh tiếng tại cửa hàng.",
};

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: { where: { isActive: true } } } } },
  });

  // Nhóm theo chữ cái đầu để trang có cảm giác tạp chí sang trọng
  const groups = new Map<string, typeof brands>();
  for (const b of brands) {
    const key = b.name.charAt(0).toUpperCase();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(b);
  }
  const sortedKeys = Array.from(groups.keys()).sort();

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <header className="border-b border-border-soft pb-8 text-center">
        <p className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.18em] text-champagne-dark">
          <span aria-hidden className="h-px w-8 bg-champagne" />
          Bộ sưu tập thương hiệu
          <span aria-hidden className="h-px w-8 bg-champagne" />
        </p>
        <h1 className="mt-3 font-display text-4xl font-light leading-tight sm:text-5xl lg:text-6xl">
          Thương hiệu nước hoa
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-muted">
          {brands.length} thương hiệu được chọn lọc — từ những nhà mốt cao cấp Pháp đến niche house phương Đông.
        </p>
      </header>

      {brands.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="font-display text-2xl">Chưa có thương hiệu nào</p>
          <p className="mt-2 text-sm text-ink-muted">
            Hãy quay lại sau, bộ sưu tập đang được cập nhật.
          </p>
        </div>
      ) : (
        <>
          {/* Bảng chữ cái nhảy nhanh */}
          <nav
            aria-label="Lọc theo chữ cái"
            className="mt-8 flex flex-wrap items-center justify-center gap-1.5"
          >
            {sortedKeys.map((key) => (
              <a
                key={key}
                href={`#letter-${key}`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-xs border border-border-soft bg-paper text-xs font-medium text-ink-muted transition-all hover:border-champagne hover:text-champagne-dark"
              >
                {key}
              </a>
            ))}
          </nav>

          <div className="mt-12 space-y-12">
            {sortedKeys.map((key) => {
              const items = groups.get(key)!;
              return (
                <section key={key} id={`letter-${key}`} className="scroll-mt-28">
                  <div className="flex items-baseline gap-5 border-b border-border-soft pb-3">
                    <h2 className="font-display text-4xl text-champagne">{key}</h2>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-ink-faint">
                      {items.length} thương hiệu
                    </p>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
                    {items.map((b) => (
                      <Link
                        key={b.id}
                        href={`/products?brand=${b.slug}`}
                        className="group flex flex-col overflow-hidden rounded-sm border border-border-soft bg-paper transition-all duration-500 ease-luxe hover:-translate-y-0.5 hover:border-champagne hover:shadow-luxe"
                      >
                        <div className="relative flex aspect-5/3 items-center justify-center overflow-hidden bg-cream-warm/40">
                          {b.logo ? (
                            <Image
                              src={b.logo}
                              alt={b.name}
                              fill
                              sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 45vw"
                              className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.04] sm:p-4"
                            />
                          ) : (
                            <span className="font-display text-2xl text-ink transition-colors group-hover:text-champagne-dark">
                              {b.name}
                            </span>
                          )}
                        </div>
                        <div className="border-t border-border-soft px-3 py-2.5">
                          <p className="font-grotesk text-sm font-medium leading-tight">{b.name}</p>
                          <p className="mt-0.5 text-[10px] uppercase tracking-[0.15em] text-ink-faint">
                            {b._count.products} sản phẩm
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
