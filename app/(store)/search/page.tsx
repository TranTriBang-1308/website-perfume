import Link from "next/link";
import { productQuerySchema } from "@/lib/validations/product";
import { listProducts } from "@/lib/queries/products";
import { ProductCard } from "@/components/store/product-card";
import { Pagination } from "@/components/store/pagination";
import { SearchInput } from "@/components/store/search-input";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: PageProps) {
  const raw = await searchParams;
  const q = typeof raw.q === "string" ? raw.q : "";
  return {
    title: q ? `Kết quả tìm "${q}" — Parfum` : "Tìm kiếm — Parfum",
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const q = typeof raw.q === "string" ? raw.q.trim() : "";

  // Chưa có từ khóa → chỉ hiển thị ô tìm kiếm, không gọi DB
  if (!q) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <header className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">Tìm kiếm</p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">Bạn đang tìm gì?</h1>
          <p className="mt-3 text-sm text-ink-muted">
            Nhập tên sản phẩm, thương hiệu hoặc mô tả hương thơm.
          </p>
        </header>
        <div className="mt-10">
          <SearchInput placeholder="Ví dụ: Chanel No 5, hương gỗ, nam..." />
        </div>
      </div>
    );
  }

  const parsed = productQuerySchema.safeParse({ ...raw, q });
  const query = parsed.success ? parsed.data : productQuerySchema.parse({ q });

  const { products, pagination } = await listProducts(query);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="border-b border-[color:var(--color-border-soft)] pb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">Kết quả tìm kiếm</p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">
          &ldquo;{q}&rdquo;
        </h1>
        <p className="mt-3 text-sm text-ink-muted">
          {pagination.total} sản phẩm được tìm thấy
        </p>
        <div className="mt-6 max-w-lg">
          <SearchInput initial={q} />
        </div>
      </header>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="font-display text-2xl">Không tìm thấy sản phẩm nào</p>
          <p className="mt-2 text-sm text-ink-muted">
            Hãy thử với từ khóa khác hoặc{" "}
            <Link href="/products" className="underline underline-offset-4 hover:text-ink">
              xem toàn bộ sản phẩm
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        searchParams={raw}
      />
    </div>
  );
}
