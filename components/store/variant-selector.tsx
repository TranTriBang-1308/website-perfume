"use client";

import { useState } from "react";
import { formatVND } from "@/lib/utils";
import { AddToCartButton } from "@/components/store/add-to-cart-button";

export type VariantOption = {
  id: string;
  volumeMl: number;
  price: number;
  compareAtPrice: number | null;
  stock: number;
};

type Props = {
  variants: VariantOption[];
};

// Cho phép user chọn dung tích → cập nhật giá hiển thị + giá so sánh + tồn kho.
// AddToCartButton nhận variantId của variant đang chọn.
export function VariantSelector({ variants }: Props) {
  const initial = variants.find((v) => v.stock > 0) ?? variants[0];
  const [selectedId, setSelectedId] = useState(initial?.id ?? "");

  if (!initial) {
    return (
      <p className="text-sm text-burgundy">
        Sản phẩm chưa có dung tích để bán. Vui lòng quay lại sau.
      </p>
    );
  }

  const selected = variants.find((v) => v.id === selectedId) ?? initial;
  const hasDiscount = selected.compareAtPrice !== null && selected.compareAtPrice > selected.price;
  const outOfStock = selected.stock <= 0;
  const discountPercent = hasDiscount
    ? Math.round((1 - selected.price / (selected.compareAtPrice as number)) * 100)
    : 0;

  return (
    <div id="buy-section" className="space-y-5 scroll-mt-24">
      {/* Giá theo variant đang chọn */}
      <div className="flex flex-wrap items-baseline gap-3 border-y border-border-soft py-4">
        <span className="font-grotesk text-3xl font-semibold tracking-tight">{formatVND(selected.price)}</span>
        {hasDiscount && (
          <>
            <span className="text-base text-ink-faint line-through">
              {formatVND(selected.compareAtPrice as number)}
            </span>
            <span className="ml-auto rounded-xs bg-burgundy px-2 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-white">
              -{discountPercent}%
            </span>
          </>
        )}
      </div>

      {/* Chọn dung tích */}
      {variants.length > 1 && (
        <div>
          <p className="text-[11px] uppercase tracking-[0.15em] text-ink-muted">Dung tích</p>
          <div className="mt-2.5 flex flex-wrap gap-2.5">
            {variants.map((v) => {
              const active = v.id === selectedId;
              const disabled = v.stock <= 0;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => !disabled && setSelectedId(v.id)}
                  disabled={disabled}
                  aria-pressed={active}
                  className={`min-w-[88px] rounded-sm border px-4 py-2 text-sm transition-all duration-300 ease-luxe ${
                    active
                      ? "border-ink bg-ink text-cream shadow-luxe"
                      : "border-border-soft bg-paper hover:border-ink"
                  } ${disabled ? "cursor-not-allowed opacity-50 line-through" : ""}`}
                >
                  <div className="font-grotesk font-semibold">{v.volumeMl}ml</div>
                  <div className={`mt-0.5 text-[11px] ${active ? "text-cream/70" : "text-ink-muted"}`}>
                    {formatVND(v.price)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tồn kho */}
      <p className="flex items-center gap-2 text-sm text-ink-muted">
        <span
          aria-hidden
          className={`inline-block h-1.5 w-1.5 rounded-full ${outOfStock ? "bg-burgundy" : "bg-emerald-500 animate-pulse-soft"}`}
        />
        {outOfStock ? "Tạm hết hàng" : `Còn ${selected.stock} sản phẩm — dung tích ${selected.volumeMl}ml`}
      </p>

      <AddToCartButton variantId={selected.id} disabled={outOfStock} />
    </div>
  );
}
