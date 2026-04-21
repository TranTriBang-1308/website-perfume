"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

type Props = {
  initial?: string;
  placeholder?: string;
  className?: string;
};

export function SearchInput({ initial, placeholder, className }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(initial ?? params.get("q") ?? "");

  useEffect(() => {
    setValue(initial ?? params.get("q") ?? "");
  }, [initial, params]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <form onSubmit={onSubmit} className={className}>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder ?? "Tìm kiếm sản phẩm..."}
        className="h-10 w-full border border-[color:var(--color-border-soft)] bg-white px-3 text-sm placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-ink"
        aria-label="Tìm kiếm sản phẩm"
      />
    </form>
  );
}
