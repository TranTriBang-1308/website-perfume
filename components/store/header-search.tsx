"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

// Ô tìm kiếm dạng pill có nút tròn bên phải, dùng cho header
export function HeaderSearch() {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get("q") ?? "");

  useEffect(() => {
    setValue(params.get("q") ?? "");
  }, [params]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <form onSubmit={onSubmit} className="relative w-full">
      <div className="flex h-11 w-full items-center rounded-full border border-[color:var(--color-border-soft)] bg-white pl-5 pr-1 focus-within:border-ink">
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Tìm kiếm sản phẩm, thương hiệu..."
          aria-label="Tìm kiếm sản phẩm"
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
  );
}
