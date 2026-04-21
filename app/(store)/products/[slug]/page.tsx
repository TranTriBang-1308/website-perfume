import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries/products";
import { formatVND } from "@/lib/utils";
import { ProductGallery } from "@/components/store/product-gallery";
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { ProductCard } from "@/components/store/product-card";
import { WishlistButton } from "@/components/store/wishlist-button";
import { ReviewForm } from "@/components/store/review-form";
import { hasUserPurchased, getUserReview } from "@/lib/queries/reviews";

type PageProps = { params: Promise<{ slug: string }> };

const genderLabel: Record<string, string> = {
  MALE: "Nam",
  FEMALE: "Nữ",
  UNISEX: "Unisex",
};

const concentrationLabel: Record<string, string> = {
  PARFUM: "Parfum",
  EDP: "Eau de Parfum",
  EDT: "Eau de Toilette",
  EDC: "Eau de Cologne",
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Sản phẩm không tồn tại" };

  const desc = product.description.slice(0, 160);
  const imageUrl = product.images[0]?.url;

  return {
    title: product.name,
    description: desc,
    openGraph: {
      title: `${product.name} — ${product.brand.name}`,
      description: desc,
      type: "website",
      images: imageUrl ? [{ url: imageUrl, alt: product.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: product.name,
      description: desc,
      images: imageUrl ? [imageUrl] : undefined,
    },
    alternates: { canonical: `/products/${product.slug}` },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts({
    productId: product.id,
    brandId: product.brandId,
    categoryId: product.categoryId,
  });

  // Kiểm tra sản phẩm đã trong wishlist + đã mua + đã review hay chưa
  const session = await auth();
  let inWishlist = false;
  let canReview = false;
  let existingReview: { rating: number; comment: string | null } | null = null;
  if (session?.user) {
    const [wl, purchased, userReview] = await Promise.all([
      prisma.wishlistItem.findUnique({
        where: { userId_productId: { userId: session.user.id, productId: product.id } },
        select: { id: true },
      }),
      hasUserPurchased(session.user.id, product.id),
      getUserReview(session.user.id, product.id),
    ]);
    inWishlist = Boolean(wl);
    canReview = purchased;
    existingReview = userReview ? { rating: userReview.rating, comment: userReview.comment } : null;
  }

  const price = Number(product.price);
  const compareAt = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const hasDiscount = compareAt !== null && compareAt > price;
  const outOfStock = product.stock <= 0;

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-8 text-xs uppercase tracking-widest text-ink-muted">
        <Link href="/" className="hover:text-ink">Trang chủ</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-ink">Sản phẩm</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} fallbackLabel={product.brand.name} />

        <div className="space-y-6">
          <div>
            <Link
              href={`/products?brand=${product.brand.slug}`}
              className="text-xs uppercase tracking-[0.3em] text-ink-muted hover:text-ink"
            >
              {product.brand.name}
            </Link>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl">{product.name}</h1>
            <p className="mt-3 text-sm text-ink-muted">
              {concentrationLabel[product.concentration]} · {product.volumeMl}ml · {genderLabel[product.gender]}
            </p>
          </div>

          <div className="flex items-baseline gap-3 border-y border-[color:var(--color-border-soft)] py-4">
            <span className="font-display text-3xl">{formatVND(price)}</span>
            {hasDiscount && (
              <>
                <span className="text-lg text-ink-muted line-through">{formatVND(compareAt)}</span>
                <span className="ml-auto bg-burgundy px-2 py-1 text-xs uppercase tracking-widest text-white">
                  -{Math.round((1 - price / compareAt) * 100)}%
                </span>
              </>
            )}
          </div>

          <p className="leading-relaxed text-ink-muted">{product.description}</p>

          {(product.topNotes || product.middleNotes || product.baseNotes) && (
            <div className="space-y-3 border-y border-[color:var(--color-border-soft)] py-6">
              <h2 className="text-xs uppercase tracking-widest text-ink-muted">Hương thơm</h2>
              <dl className="space-y-2 text-sm">
                {product.topNotes && (
                  <div className="flex gap-3">
                    <dt className="w-24 text-ink-muted">Hương đầu</dt>
                    <dd>{product.topNotes}</dd>
                  </div>
                )}
                {product.middleNotes && (
                  <div className="flex gap-3">
                    <dt className="w-24 text-ink-muted">Hương giữa</dt>
                    <dd>{product.middleNotes}</dd>
                  </div>
                )}
                {product.baseNotes && (
                  <div className="flex gap-3">
                    <dt className="w-24 text-ink-muted">Hương cuối</dt>
                    <dd>{product.baseNotes}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          <div className="flex gap-3">
            <div className="flex-1">
              <AddToCartButton productId={product.id} disabled={outOfStock} />
            </div>
            <WishlistButton productId={product.id} initialInWishlist={inWishlist} variant="icon" className="h-12 w-12" />
          </div>

          <dl className="grid grid-cols-2 gap-4 pt-4 text-sm">
            <div>
              <dt className="text-ink-muted">Tình trạng</dt>
              <dd>{outOfStock ? "Hết hàng" : `Còn ${product.stock} sản phẩm`}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Danh mục</dt>
              <dd>{product.category.name}</dd>
            </div>
          </dl>
        </div>
      </div>

      <section className="mt-16 border-t border-[color:var(--color-border-soft)] pt-12">
        <h2 className="font-display text-3xl">Đánh giá từ khách hàng</h2>
        {avgRating !== null && (
          <p className="mt-2 text-sm text-ink-muted">
            Trung bình {avgRating.toFixed(1)} / 5 từ {product.reviews.length} đánh giá
          </p>
        )}

        {canReview && (
          <div className="mt-8 max-w-2xl">
            <ReviewForm
              productId={product.id}
              initialRating={existingReview?.rating ?? 0}
              initialComment={existingReview?.comment ?? ""}
              isEdit={Boolean(existingReview)}
            />
          </div>
        )}

        {!canReview && session?.user && (
          <p className="mt-6 text-sm text-ink-muted">
            Bạn cần mua và nhận sản phẩm trước khi có thể đánh giá.
          </p>
        )}

        {product.reviews.length > 0 && (
          <ul className="mt-8 space-y-6">
            {product.reviews.map((review) => (
              <li key={review.id} className="border-b border-[color:var(--color-border-soft)] pb-6">
                <div className="flex items-center gap-3">
                  <p className="font-medium">{review.user.name ?? "Khách hàng"}</p>
                  <p className="text-xs text-champagne">
                    {"★".repeat(review.rating)}
                    <span className="text-ink-muted">{"★".repeat(5 - review.rating)}</span>
                  </p>
                </div>
                {review.comment && <p className="mt-2 text-sm text-ink-muted">{review.comment}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>

      {related.length > 0 && (
        <section className="mt-16 border-t border-[color:var(--color-border-soft)] pt-12">
          <h2 className="font-display text-3xl">Có thể bạn cũng thích</h2>
          <div className="mt-8 grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-3 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
