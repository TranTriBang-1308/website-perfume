"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Img = { id: string; url: string; alt: string | null };

type Props = {
  images: Img[];
  fallbackLabel: string;
};

export function ProductGallery({ images, fallbackLabel }: Props) {
  const [active, setActive] = useState(0);
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number } | null>(null);

  if (images.length === 0) {
    return (
      <div className="flex aspect-4/5 items-center justify-center border border-border-soft bg-linear-to-br from-champagne/15 to-burgundy/5 font-display text-3xl text-ink-muted shadow-soft">
        {fallbackLabel}
      </div>
    );
  }

  const current = images[active];

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  }

  return (
    <div className="space-y-4">
      <div
        className="group relative aspect-4/5 overflow-hidden border border-border-soft bg-white shadow-luxe"
        onMouseMove={onMouseMove}
        onMouseLeave={() => setZoomPos(null)}
      >
        <Image
          src={current.url}
          alt={current.alt ?? fallbackLabel}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className={cn(
            "object-cover transition-transform duration-500 ease-luxe",
            zoomPos ? "scale-150" : "scale-100"
          )}
          style={
            zoomPos
              ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
              : undefined
          }
          priority
        />

        {/* Zoom hint */}
        <span className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1.5 bg-white/85 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-ink-muted opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3 w-3">
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="M21 21l-4.5-4.5M11 8v6M8 11h6" />
          </svg>
          Di chuột để zoom
        </span>
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActive(idx)}
              aria-label={`Xem ảnh ${idx + 1}`}
              className={cn(
                "relative aspect-square overflow-hidden border transition-all duration-300 ease-luxe",
                idx === active
                  ? "border-champagne shadow-soft ring-1 ring-champagne/40"
                  : "border-border-soft opacity-70 hover:border-ink-faint hover:opacity-100"
              )}
            >
              <Image src={img.url} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
