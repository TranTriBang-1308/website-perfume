"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatVND } from "@/lib/utils";
import type { CartLineItem } from "@/lib/queries/cart";

type Props = { item: CartLineItem };

export function CartLine({ item }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const variant = item.variant;
  const product = variant.product;
  const price = variant.price;
  const image = product.images[0];

  const updateQty = async (quantity: number) => {
    setError(null);
    if (quantity < 1) return removeItem();
    const res = await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantId: variant.id, quantity }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json.error ?? "Không thể cập nhật");
      return;
    }
    startTransition(() => router.refresh());
  };

  const removeItem = async () => {
    setError(null);
    const res = await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantId: variant.id }),
    });
    if (!res.ok) {
      setError("Không thể xóa sản phẩm");
      return;
    }
    startTransition(() => router.refresh());
  };

  return (
    <div className="flex gap-4 border-b border-[color:var(--color-border-soft)] py-6">
      <Link href={`/products/${product.slug}`} className="relative h-28 w-24 flex-shrink-0 overflow-hidden bg-white">
        {image ? (
          <Image src={image.url} alt={image.alt ?? product.name} fill sizes="96px" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-champagne/20 to-burgundy/5 text-xs text-ink-muted">
            {product.brand.name}
          </div>
        )}
      </Link>

      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-ink-muted">{product.brand.name}</p>
            <Link href={`/products/${product.slug}`} className="font-display text-lg hover:underline">
              {product.name}
            </Link>
            <p className="text-xs text-ink-muted">
              {product.concentration} · {variant.volumeMl}ml
            </p>
          </div>
          <p className="font-medium whitespace-nowrap">{formatVND(price * item.quantity)}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="inline-flex items-center border border-[color:var(--color-border-soft)]">
            <button
              type="button"
              onClick={() => updateQty(item.quantity - 1)}
              disabled={pending}
              className="h-9 w-9 text-ink-muted hover:text-ink"
              aria-label="Giảm số lượng"
            >
              −
            </button>
            <span className="w-10 text-center text-sm">{item.quantity}</span>
            <button
              type="button"
              onClick={() => updateQty(item.quantity + 1)}
              disabled={pending}
              className="h-9 w-9 text-ink-muted hover:text-ink"
              aria-label="Tăng số lượng"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={removeItem}
            disabled={pending}
            className="text-xs uppercase tracking-widest text-burgundy hover:underline"
          >
            Xóa
          </button>
        </div>

        {error && <p className="text-xs text-burgundy">{error}</p>}
      </div>
    </div>
  );
}
