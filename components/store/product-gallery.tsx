"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Image = { id: string; url: string; alt: string | null };

type Props = {
  images: Image[];
  fallbackLabel: string;
};

export function ProductGallery({ images, fallbackLabel }: Props) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-[4/5] flex items-center justify-center bg-gradient-to-br from-champagne/15 to-burgundy/5 border border-[color:var(--color-border-soft)] font-display text-3xl text-ink-muted">
        {fallbackLabel}
      </div>
    );
  }

  const current = images[active];

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/5] overflow-hidden border border-[color:var(--color-border-soft)] bg-white">
        <Image
          src={current.url}
          alt={current.alt ?? fallbackLabel}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActive(idx)}
              className={cn(
                "relative aspect-square overflow-hidden border",
                idx === active
                  ? "border-ink"
                  : "border-[color:var(--color-border-soft)] opacity-70 hover:opacity-100"
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
