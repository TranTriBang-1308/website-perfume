import Link from "next/link";
import Image from "next/image";
import { formatVND } from "@/lib/utils";
import type { ProductListItem } from "@/lib/queries/products";

type Props = { product: ProductListItem };

const concentrationLabel: Record<string, string> = {
  PARFUM: "Parfum",
  EDP: "EDP",
  EDT: "EDT",
  EDC: "EDC",
};

export function ProductCard({ product }: Props) {
  const image = product.images[0];
  const secondaryImage = product.images[1];
  const defaultVariant = product.variants[0];
  // Hiển thị giá variant mặc định + so sánh giá (nếu variant mặc định có compareAtPrice).
  const price = defaultVariant ? Number(defaultVariant.price) : Number(product.minPrice);
  const compareAt = defaultVariant?.compareAtPrice ? Number(defaultVariant.compareAtPrice) : null;
  const hasDiscount = compareAt !== null && compareAt > price;
  const discountPct = hasDiscount ? Math.round(((compareAt - price) / compareAt) * 100) : 0;
  const stock = defaultVariant?.stock ?? 0;
  const outOfStock = stock <= 0;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-4/5 overflow-hidden border border-border-soft bg-white shadow-soft transition-all duration-500 ease-luxe group-hover:border-champagne group-hover:shadow-luxe">
        {image ? (
          <>
            <Image
              src={image.url}
              alt={image.alt ?? product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className={`object-cover transition-all duration-700 ease-luxe ${
                secondaryImage ? "group-hover:opacity-0 group-hover:scale-110" : "group-hover:scale-105"
              }`}
            />
            {secondaryImage && (
              <Image
                src={secondaryImage.url}
                alt={secondaryImage.alt ?? product.name}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="object-cover opacity-0 transition-all duration-700 ease-luxe group-hover:opacity-100 group-hover:scale-105"
              />
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-champagne/15 to-burgundy/5 font-display text-2xl text-ink-muted">
            {product.brand.name}
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {hasDiscount && !outOfStock && (
            <span className="bg-burgundy px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white shadow-soft">
              -{discountPct}%
            </span>
          )}
        </div>

        {/* Quick action overlay */}
        {!outOfStock && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center bg-linear-to-t from-ink/95 to-ink/0 pb-4 pt-12 opacity-0 transition-all duration-500 ease-luxe group-hover:translate-y-0 group-hover:opacity-100">
            <span className="pointer-events-auto inline-flex h-10 items-center gap-2 bg-white px-5 text-xs font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:bg-champagne">
              Xem chi tiết
              <span aria-hidden>→</span>
            </span>
          </div>
        )}

        {outOfStock && (
          <span className="absolute inset-x-0 bottom-0 bg-ink/85 backdrop-blur-sm py-2.5 text-center text-[11px] uppercase tracking-[0.25em] text-white">
            Hết hàng
          </span>
        )}
      </div>

      <div className="mt-4 space-y-1.5">
        <p className="text-[10px] uppercase tracking-[0.25em] text-ink-faint transition-colors duration-300 group-hover:text-champagne-dark">
          {product.brand.name}
        </p>
        <h3 className="font-display text-lg leading-tight text-ink transition-colors duration-300 group-hover:text-champagne-dark">
          {product.name}
        </h3>
        <p className="text-xs text-ink-muted">
          {concentrationLabel[product.concentration]}
          {defaultVariant && ` · ${defaultVariant.volumeMl}ml`}
        </p>
        <div className="flex items-baseline gap-2 pt-1">
          <span className={`text-sm font-medium ${hasDiscount ? "text-burgundy" : "text-ink"}`}>
            {formatVND(price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-ink-faint line-through">{formatVND(compareAt)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
