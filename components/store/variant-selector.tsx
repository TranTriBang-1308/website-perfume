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
    // Data lỗi: sản phẩm hiển thị nhưng chưa có variant nào — admin cần bổ sung
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
    <div className="space-y-6">
      {/* Giá theo variant đang chọn */}
      <div className="flex items-baseline gap-3 border-y border-[color:var(--color-border-soft)] py-4">
        <span className="font-display text-3xl">{formatVND(selected.price)}</span>
        {hasDiscount && (
          <>
            <span className="text-lg text-ink-muted line-through">
              {formatVND(selected.compareAtPrice as number)}
            </span>
            <span className="ml-auto bg-burgundy px-2 py-1 text-xs uppercase tracking-widest text-white">
              -{discountPercent}%
            </span>
          </>
        )}
      </div>

      {/* Chọn dung tích */}
      {variants.length > 1 && (
        <div>
          <p className="text-xs uppercase tracking-widest text-ink-muted">Dung tích</p>
          <div className="mt-3 flex flex-wrap gap-3">
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
                  className={`min-w-[88px] border px-4 py-2 text-sm transition-colors ${
                    active
                      ? "border-ink bg-ink text-white"
                      : "border-[color:var(--color-border-soft)] bg-white hover:border-ink"
                  } ${disabled ? "cursor-not-allowed opacity-50 line-through" : ""}`}
                >
                  <div className="font-medium">{v.volumeMl}ml</div>
                  <div className={`mt-0.5 text-xs ${active ? "text-cream/80" : "text-ink-muted"}`}>
                    {formatVND(v.price)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tồn kho variant đang chọn */}
      <p className="text-sm text-ink-muted">
        {outOfStock ? "Hết hàng" : `Còn ${selected.stock} sản phẩm — dung tích ${selected.volumeMl}ml`}
      </p>

      <AddToCartButton variantId={selected.id} disabled={outOfStock} />
    </div>
  );
}
