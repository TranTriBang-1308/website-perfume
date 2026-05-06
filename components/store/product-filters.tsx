"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

type Option = { value: string; label: string };
type Brand = { id: string; name: string; slug: string };
type Category = { id: string; name: string; slug: string };

const genderOptions: Option[] = [
  { value: "MALE", label: "Nam" },
  { value: "FEMALE", label: "Nữ" },
  { value: "UNISEX", label: "Unisex" },
];

const concentrationOptions: Option[] = [
  { value: "PARFUM", label: "Parfum" },
  { value: "EDP", label: "EDP" },
  { value: "EDT", label: "EDT" },
  { value: "EDC", label: "EDC" },
];

type Props = {
  brands: Brand[];
  categories: Category[];
};

export function ProductFilters({ brands, categories }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const current = (key: string) => searchParams.get(key) ?? "";

  // Đếm filter đang áp dụng để hiển thị số bên cạnh "Bộ lọc"
  const activeCount = ["brand", "category", "gender", "concentration", "onSale"].filter(
    (k) => searchParams.get(k)
  ).length;

  return (
    <aside className="space-y-6 text-sm">
      <div className="flex items-center justify-between border-b border-border-soft pb-4">
        <h2 className="font-display text-xl text-ink">Bộ lọc</h2>
        {activeCount > 0 && (
          <button
            onClick={() => router.push(pathname)}
            className="text-[11px] uppercase tracking-[0.2em] text-burgundy transition-colors hover:text-burgundy-light"
          >
            Xóa ({activeCount})
          </button>
        )}
      </div>

      <FilterGroup
        title="Thương hiệu"
        options={brands.map((b) => ({ value: b.slug, label: b.name }))}
        value={current("brand")}
        onChange={(v) => setParam("brand", v)}
      />

      <FilterGroup
        title="Danh mục"
        options={categories.map((c) => ({ value: c.slug, label: c.name }))}
        value={current("category")}
        onChange={(v) => setParam("category", v)}
      />

      <FilterGroup
        title="Giới tính"
        options={genderOptions}
        value={current("gender")}
        onChange={(v) => setParam("gender", v)}
      />

      <FilterGroup
        title="Nồng độ"
        options={concentrationOptions}
        value={current("concentration")}
        onChange={(v) => setParam("concentration", v)}
      />
    </aside>
  );
}

type GroupProps = {
  title: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
};

function FilterGroup({ title, options, value, onChange }: GroupProps) {
  return (
    <details open className="group border-b border-border-soft pb-5 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer items-center justify-between text-[11px] font-medium uppercase tracking-[0.25em] text-ink-muted transition-colors hover:text-ink">
        {title}
        <span className="transition-transform duration-300 group-open:rotate-180">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3 w-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </summary>
      <ul className="mt-4 space-y-2.5">
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <li key={opt.value}>
              <button
                onClick={() => onChange(active ? "" : opt.value)}
                className={`group flex w-full items-center gap-2.5 text-left transition-colors duration-300 ${
                  active ? "font-medium text-ink" : "text-ink-muted hover:text-ink"
                }`}
              >
                <span
                  aria-hidden
                  className={`inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center border transition-all duration-300 ${
                    active
                      ? "border-champagne bg-champagne"
                      : "border-border-soft bg-white group-hover:border-ink-faint"
                  }`}
                >
                  {active && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-2.5 w-2.5 text-ink">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" />
                    </svg>
                  )}
                </span>
                <span>{opt.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
