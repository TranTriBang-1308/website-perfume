"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const options = [
  { value: "newest", label: "Mới nhất" },
  { value: "featured", label: "Nổi bật" },
  { value: "price-asc", label: "Giá tăng dần" },
  { value: "price-desc", label: "Giá giảm dần" },
];

export function ProductSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") ?? "newest";

  const onChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select
      value={current}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 border border-[color:var(--color-border-soft)] bg-white px-4 text-sm"
      aria-label="Sắp xếp"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          Sắp xếp: {o.label}
        </option>
      ))}
    </select>
  );
}
