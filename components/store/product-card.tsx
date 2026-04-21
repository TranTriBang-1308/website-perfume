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
  const price = Number(product.price);
  const compareAt = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const hasDiscount = compareAt !== null && compareAt > price;
  const outOfStock = product.stock <= 0;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden border border-[color:var(--color-border-soft)] bg-white">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt ?? product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-champagne/10 to-burgundy/5 font-display text-2xl text-ink-muted">
            {product.brand.name}
          </div>
        )}

        {hasDiscount && !outOfStock && (
          <span className="absolute left-3 top-3 bg-burgundy px-2 py-1 text-xs uppercase tracking-widest text-white">
            Sale
          </span>
        )}
        {outOfStock && (
          <span className="absolute inset-x-0 bottom-0 bg-ink/80 py-2 text-center text-xs uppercase tracking-widest text-white">
            Hết hàng
          </span>
        )}
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-xs uppercase tracking-widest text-ink-muted">{product.brand.name}</p>
        <h3 className="font-display text-lg leading-tight">{product.name}</h3>
        <p className="text-xs text-ink-muted">
          {concentrationLabel[product.concentration]} · {product.volumeMl}ml
        </p>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-sm font-medium">{formatVND(price)}</span>
          {hasDiscount && (
            <span className="text-xs text-ink-muted line-through">{formatVND(compareAt)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
