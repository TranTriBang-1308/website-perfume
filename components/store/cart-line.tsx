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
    <div className="group relative flex gap-4 rounded-sm border border-border-soft bg-paper p-4 shadow-soft transition-all duration-300 ease-luxe hover:border-champagne hover:shadow-luxe sm:gap-5 sm:p-5">
      <Link
        href={`/products/${product.slug}`}
        className="relative h-28 w-22 shrink-0 overflow-hidden rounded-sm border border-border-soft bg-paper sm:h-32 sm:w-24"
      >
        {image ? (
          <Image
            src={image.url}
            alt={image.alt ?? product.name}
            fill
            sizes="112px"
            className="object-cover transition-transform duration-500 ease-luxe group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-champagne/20 to-burgundy/5 text-xs text-ink-muted">
            {product.brand.name}
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-2.5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase tracking-[0.15em] text-ink-faint">
              {product.brand.name}
            </p>
            <Link
              href={`/products/${product.slug}`}
              className="block font-grotesk text-base font-medium leading-tight text-ink transition-colors hover:text-champagne-dark"
            >
              {product.name}
            </Link>
            <p className="text-[11px] text-ink-muted">
              {product.concentration} · {variant.volumeMl}ml
            </p>
            <p className="text-[11px] text-ink-faint">
              Đơn giá: {formatVND(price)}
            </p>
          </div>
          <p className="whitespace-nowrap font-grotesk text-base font-semibold text-ink">
            {formatVND(price * item.quantity)}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="inline-flex items-center rounded-sm border border-border-soft bg-cream-warm/40">
            <button
              type="button"
              onClick={() => updateQty(item.quantity - 1)}
              disabled={pending}
              className="h-9 w-9 text-ink-muted transition-colors hover:bg-ink hover:text-cream disabled:opacity-50"
              aria-label="Giảm số lượng"
            >
              −
            </button>
            <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
            <button
              type="button"
              onClick={() => updateQty(item.quantity + 1)}
              disabled={pending}
              className="h-9 w-9 text-ink-muted transition-colors hover:bg-ink hover:text-cream disabled:opacity-50"
              aria-label="Tăng số lượng"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={removeItem}
            disabled={pending}
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] text-ink-faint transition-colors hover:text-burgundy"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            </svg>
            Xóa
          </button>
        </div>

        {error && (
          <p className="flex items-center gap-1.5 text-xs text-burgundy">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
              <circle cx="12" cy="12" r="10" />
              <path strokeLinecap="round" d="M12 8v4M12 16h.01" />
            </svg>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
