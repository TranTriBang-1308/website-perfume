import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | string[] | undefined>;
};

function buildHref(searchParams: Props["searchParams"], page: number): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") params.set(key, value);
    else if (Array.isArray(value) && value[0]) params.set(key, value[0]);
  }
  params.set("page", String(page));
  return `?${params.toString()}`;
}

export function Pagination({ page, totalPages, searchParams }: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center gap-2 pt-8" aria-label="Phân trang">
      {page > 1 && (
        <Link
          href={buildHref(searchParams, page - 1)}
          className="px-3 py-2 text-sm text-ink-muted hover:text-ink"
        >
          ← Trước
        </Link>
      )}
      {pages.map((p) => (
        <Link
          key={p}
          href={buildHref(searchParams, p)}
          className={cn(
            "h-9 w-9 inline-flex items-center justify-center text-sm border",
            p === page
              ? "border-ink bg-ink text-white"
              : "border-[color:var(--color-border-soft)] text-ink-muted hover:border-ink hover:text-ink"
          )}
        >
          {p}
        </Link>
      ))}
      {page < totalPages && (
        <Link
          href={buildHref(searchParams, page + 1)}
          className="px-3 py-2 text-sm text-ink-muted hover:text-ink"
        >
          Sau →
        </Link>
      )}
    </nav>
  );
}
