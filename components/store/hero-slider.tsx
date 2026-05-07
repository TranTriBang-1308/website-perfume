"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ActiveBanner } from "@/lib/queries/banners";

type Props = { banners: ActiveBanner[] };

const AUTOPLAY_MS = 6000;

// Slider Hero sang trọng: cross-fade + Ken Burns zoom, overlay gradient mờ để chữ luôn dễ đọc
export function HeroSlider({ banners }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const count = banners.length;
  const goTo = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Auto-play, tạm dừng khi hover hoặc tab không active (visibilitychange)
  useEffect(() => {
    if (count <= 1 || paused) return;
    timerRef.current = setTimeout(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [index, paused, count]);

  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  if (count === 0) return null;

  return (
    <section
      className="relative isolate overflow-hidden bg-ink"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Banner giới thiệu"
    >
      {/* Khung chiều cao gợi nhớ cinemascope — 21:9 trên desktop, thoáng trên mobile */}
      <div className="relative h-[520px] w-full sm:h-[560px] lg:h-[640px]">
        {banners.map((b, i) => {
          const active = i === index;
          return (
            <div
              key={b.id}
              className={`absolute inset-0 transition-opacity duration-1200 ease-out ${
                active ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              aria-hidden={!active}
            >
              {/* Ảnh nền + Ken Burns: slide active tự động zoom chậm */}
              <div className="absolute inset-0 overflow-hidden">
                <div
                  className={`absolute inset-0 ${
                    active ? "animate-[hero-zoom_8s_ease-out_forwards]" : "scale-105"
                  }`}
                >
                  <Image
                    src={b.imageUrl}
                    alt={b.title}
                    fill
                    priority={i === 0}
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Overlay gradient: ink đậm trái → trong suốt phải, champagne glow mỏng trên */}
              <div className="absolute inset-0 bg-linear-to-r from-ink/80 via-ink/40 to-ink/10" />
              <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-ink/40 to-transparent" />

              {/* Nội dung: trượt-lên-fade khi active */}
              <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
                <div
                  className={`w-full max-w-xl space-y-5 text-cream transition-all duration-900 ease-out ${
                    active ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                >
                  {b.subtitle && (
                    <p className="inline-flex items-center gap-2.5 rounded-full border border-champagne/40 bg-champagne/15 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-champagne wrap-break-word">
                      <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-champagne animate-pulse-soft" />
                      {b.subtitle}
                    </p>
                  )}
                  <h1 className="wrap-break-word font-display text-4xl font-light leading-[1.05] sm:text-6xl lg:text-7xl">
                    {b.title}
                  </h1>
                  {b.description && (
                    <p className="max-w-md wrap-break-word text-base text-cream/80">{b.description}</p>
                  )}
                  {b.ctaLabel && b.ctaHref && (
                    <div className="pt-1">
                      <Link
                        href={b.ctaHref}
                        className="group inline-flex h-12 items-center gap-3 rounded-sm bg-champagne px-7 text-sm font-medium tracking-wide text-ink transition-colors hover:bg-champagne-light"
                      >
                        <span>{b.ctaLabel}</span>
                        <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Mũi tên điều hướng — ẩn khi chỉ 1 banner */}
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Slide trước"
              className="absolute left-4 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-cream/30 bg-ink/30 text-cream backdrop-blur transition hover:border-champagne hover:bg-ink/60 hover:text-champagne sm:left-6"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Slide kế tiếp"
              className="absolute right-4 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-cream/30 bg-ink/30 text-cream backdrop-blur transition hover:border-champagne hover:bg-ink/60 hover:text-champagne sm:right-6"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </>
        )}

        {/* Chấm điều hướng + thanh tiến trình cho slide hiện tại */}
        {count > 1 && (
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
            {banners.map((b, i) => {
              const active = i === index;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Đi tới slide ${i + 1}`}
                  aria-current={active}
                  className="group relative h-[2px] w-10 overflow-hidden bg-cream/30 transition-all sm:w-14"
                >
                  <span
                    className={`absolute inset-y-0 left-0 bg-champagne ${
                      active && !paused
                        ? "animate-[hero-progress_6s_linear_forwards]"
                        : active
                          ? "w-full"
                          : "w-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes hero-zoom {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.08);
          }
        }
        @keyframes hero-progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
