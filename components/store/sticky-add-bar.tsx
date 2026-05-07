"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { formatVND } from "@/lib/utils";

type Props = {
  name: string;
  brandName: string;
  imageUrl: string | null;
  price: number;
};

// Mobile sticky bar: hiện khi user cuộn qua khu vực mua hàng (≥ 600px).
// Click "Mua ngay" sẽ scroll lên VariantSelector (#buy-section) để chọn dung tích.
export function StickyAddBar({ name, brandName, imageUrl, price }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onClick = () => {
    document.getElementById("buy-section")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div
      role="region"
      aria-label="Thanh mua nhanh"
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border-soft surface-glass shadow-luxe transition-transform duration-500 ease-luxe lg:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        {imageUrl ? (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-sm border border-border-soft">
            <Image src={imageUrl} alt={name} fill sizes="48px" className="object-cover" />
          </div>
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-border-soft bg-cream-warm font-display text-sm">
            {brandName.charAt(0)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] uppercase tracking-[0.15em] text-ink-faint">{brandName}</p>
          <p className="truncate font-grotesk text-sm font-medium leading-tight">{name}</p>
          <p className="mt-0.5 font-grotesk text-sm font-semibold text-ink">{formatVND(price)}</p>
        </div>
        <button
          type="button"
          onClick={onClick}
          className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-sm bg-ink px-5 text-xs font-medium tracking-wide text-cream transition-colors hover:bg-ink-soft"
        >
          Mua ngay
          <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}
