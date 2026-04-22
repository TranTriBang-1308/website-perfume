import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Thương hiệu — Parfum",
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
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="border-b border-[color:var(--color-border-soft)] pb-10 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
          Bộ sưu tập thương hiệu
        </p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl">
          Thương hiệu nước hoa
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-ink-muted">
          {brands.length} thương hiệu được chọn lọc, từ những nhà mốt cao cấp đến các
          niche house độc đáo.
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
            className="mt-10 flex flex-wrap items-center justify-center gap-2"
          >
            {sortedKeys.map((key) => (
              <a
                key={key}
                href={`#letter-${key}`}
                className="inline-flex h-9 w-9 items-center justify-center border border-[color:var(--color-border-soft)] bg-white text-sm font-medium text-ink-muted transition-colors hover:border-ink hover:text-ink"
              >
                {key}
              </a>
            ))}
          </nav>

          <div className="mt-14 space-y-16">
            {sortedKeys.map((key) => {
              const items = groups.get(key)!;
              return (
                <section key={key} id={`letter-${key}`} className="scroll-mt-28">
                  <div className="flex items-baseline gap-6 border-b border-[color:var(--color-border-soft)] pb-4">
                    <h2 className="font-display text-5xl text-champagne">{key}</h2>
                    <p className="text-xs uppercase tracking-[0.25em] text-ink-muted">
                      {items.length} thương hiệu
                    </p>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                    {items.map((b) => (
                      <Link
                        key={b.id}
                        href={`/products?brand=${b.slug}`}
                        className="group flex flex-col overflow-hidden border border-[color:var(--color-border-soft)] bg-white transition-colors hover:border-ink"
                      >
                        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-cream p-6">
                          {b.logo ? (
                            <Image
                              src={b.logo}
                              alt={b.name}
                              fill
                              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                              className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <span className="font-display text-3xl text-ink transition-colors group-hover:text-champagne">
                              {b.name}
                            </span>
                          )}
                        </div>
                        <div className="border-t border-[color:var(--color-border-soft)] px-4 py-3">
                          <p className="font-display text-lg leading-tight">{b.name}</p>
                          <p className="mt-1 text-xs uppercase tracking-widest text-ink-muted">
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
