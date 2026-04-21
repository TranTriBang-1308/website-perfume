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

  return (
    <aside className="space-y-8 text-sm">
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

      <button
        onClick={() => router.push(pathname)}
        className="text-xs uppercase tracking-widest text-ink-muted hover:text-ink"
      >
        Xóa bộ lọc
      </button>
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
    <div>
      <h3 className="mb-3 text-xs uppercase tracking-widest text-ink-muted">{title}</h3>
      <ul className="space-y-2">
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <li key={opt.value}>
              <button
                onClick={() => onChange(active ? "" : opt.value)}
                className={`text-left ${
                  active ? "text-ink font-medium" : "text-ink-muted hover:text-ink"
                }`}
              >
                {opt.label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
