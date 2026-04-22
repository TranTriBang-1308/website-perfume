"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { formatVND } from "@/lib/utils";

type Suggestion = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  image: { url: string; alt: string | null } | null;
  brandName: string;
};

// Ô tìm kiếm dạng pill kèm dropdown gợi ý sản phẩm (ảnh, tên, giá)
export function HeaderSearch() {
  const router = useRouter();
  const params = useSearchParams();
  const listboxId = useId();

  const [value, setValue] = useState(params.get("q") ?? "");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setValue(params.get("q") ?? "");
  }, [params]);

  // Debounce fetch gợi ý 200ms; hủy request cũ nếu user gõ tiếp
  useEffect(() => {
    const q = value.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setLoading(false);
      abortRef.current?.abort();
      return;
    }

    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      try {
        const res = await fetch(`/api/products/suggest?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("fetch failed");
        const json = (await res.json()) as { data: Suggestion[] };
        setSuggestions(json.data);
        setActiveIndex(-1);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setSuggestions([]);
        }
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [value]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const goToSearch = (q: string) => {
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      const s = suggestions[activeIndex];
      setOpen(false);
      router.push(`/products/${s.slug}`);
      return;
    }
    goToSearch(q);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const showDropdown = open && value.trim().length >= 2;

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={onSubmit} className="relative w-full" role="search">
        <div
          className={`flex h-11 w-full items-center rounded-full border border-[color:var(--color-border-soft)] bg-white pl-5 pr-1 transition-colors focus-within:border-ink ${
            showDropdown ? "rounded-b-none border-b-transparent" : ""
          }`}
        >
          <input
            type="search"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder="Tìm kiếm sản phẩm, thương hiệu..."
            aria-label="Tìm kiếm sản phẩm"
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-expanded={showDropdown}
            className="h-full flex-1 bg-transparent text-sm placeholder:text-ink-muted focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Tìm kiếm"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-burgundy text-white transition-colors hover:bg-ink"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="M20 20l-3-3" />
            </svg>
          </button>
        </div>
      </form>

      {showDropdown && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 overflow-hidden rounded-b-2xl border border-t-0 border-[color:var(--color-border-soft)] bg-white shadow-[0_10px_30px_-12px_rgba(10,10,10,0.18)]"
        >
          {loading && suggestions.length === 0 && (
            <div className="px-5 py-4 text-sm text-ink-muted">Đang tìm...</div>
          )}

          {!loading && suggestions.length === 0 && (
            <div className="px-5 py-4 text-sm text-ink-muted">
              Không có gợi ý phù hợp.
            </div>
          )}

          {suggestions.length > 0 && (
            <ul className="max-h-[70vh] overflow-y-auto py-1">
              {suggestions.map((s, i) => {
                const hasDiscount = s.compareAtPrice !== null && s.compareAtPrice > s.price;
                return (
                  <li key={s.id} role="option" aria-selected={i === activeIndex}>
                    <Link
                      href={`/products/${s.slug}`}
                      onClick={() => setOpen(false)}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={`flex items-center gap-4 px-4 py-3 transition-colors ${
                        i === activeIndex ? "bg-cream" : "hover:bg-cream"
                      }`}
                    >
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden border border-[color:var(--color-border-soft)] bg-white">
                        {s.image ? (
                          <Image
                            src={s.image.url}
                            alt={s.image.alt ?? s.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-display text-xs text-ink-muted">
                            {s.brandName.slice(0, 2)}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[10px] uppercase tracking-[0.2em] text-ink-muted">
                          {s.brandName}
                        </p>
                        <p className="mt-0.5 truncate font-display text-base leading-tight">
                          {s.name}
                        </p>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-sm font-medium">{formatVND(s.price)}</span>
                          {hasDiscount && (
                            <span className="text-xs text-ink-muted line-through">
                              {formatVND(s.compareAtPrice!)}
                            </span>
                          )}
                        </div>
                      </div>

                      {hasDiscount && (
                        <span className="shrink-0 bg-burgundy px-2 py-0.5 text-[10px] uppercase tracking-widest text-white">
                          Sale
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}

              <li className="border-t border-[color:var(--color-border-soft)]">
                <button
                  type="button"
                  onClick={() => goToSearch(value.trim())}
                  className="flex w-full items-center justify-between px-4 py-3 text-xs uppercase tracking-[0.2em] text-ink-muted transition-colors hover:bg-cream hover:text-ink"
                >
                  <span>Xem tất cả kết quả cho &ldquo;{value.trim()}&rdquo;</span>
                  <span aria-hidden="true">→</span>
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
