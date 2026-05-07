import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries/products";
import { ProductGallery } from "@/components/store/product-gallery";
import { ProductCard } from "@/components/store/product-card";
import { VariantSelector, type VariantOption } from "@/components/store/variant-selector";
import { WishlistButton } from "@/components/store/wishlist-button";
import { ReviewForm } from "@/components/store/review-form";
import { hasUserPurchased, getUserReview } from "@/lib/queries/reviews";
import { SectionHeader } from "@/components/ui/section-header";
import { NotesPyramid } from "@/components/store/notes-pyramid";
import { StickyAddBar } from "@/components/store/sticky-add-bar";

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

  // Kiểm tra wishlist + đã mua + đã review
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

  const variantOptions: VariantOption[] = product.variants.map((v) => ({
    id: v.id,
    volumeMl: v.volumeMl,
    price: Number(v.price),
    compareAtPrice: v.compareAtPrice !== null ? Number(v.compareAtPrice) : null,
    stock: v.stock,
  }));

  const defaultVariant = product.variants.find((v) => v.isDefault) ?? product.variants[0];
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : null;

  const headerImage = product.images[0]?.url ?? null;
  const headerPrice = defaultVariant ? Number(defaultVariant.price) : Number(product.minPrice);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 pb-24 sm:px-6 lg:px-8 lg:pb-12">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-ink-faint">
        <Link href="/" className="transition-colors hover:text-ink">Trang chủ</Link>
        <span aria-hidden>/</span>
        <Link href="/products" className="transition-colors hover:text-ink">Sản phẩm</Link>
        <span aria-hidden>/</span>
        <span className="truncate text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="animate-fade-in">
          <ProductGallery images={product.images} fallbackLabel={product.brand.name} />
        </div>

        <div className="space-y-5 animate-fade-in-up">
          <div>
            <Link
              href={`/products?brand=${product.brand.slug}`}
              className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-champagne-dark transition-colors hover:text-ink"
            >
              <span aria-hidden className="h-px w-5 bg-champagne" />
              {product.brand.name}
            </Link>
            <h1 className="mt-2 font-display text-3xl font-light leading-tight text-ink sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="chip">{concentrationLabel[product.concentration]}</span>
              <span className="chip">{genderLabel[product.gender]}</span>
              {avgRating !== null && (
                <span className="inline-flex items-center gap-1 text-ink-muted">
                  <span className="text-champagne">{"★".repeat(Math.round(avgRating))}</span>
                  <span className="text-[11px]">({product.reviews.length} đánh giá)</span>
                </span>
              )}
            </div>
          </div>

          <div aria-hidden className="divider-gradient" />

          <p className="text-sm leading-relaxed text-ink-muted sm:text-base">{product.description}</p>

          <NotesPyramid
            topNotes={product.topNotes}
            middleNotes={product.middleNotes}
            baseNotes={product.baseNotes}
          />

          <div className="flex items-start gap-3">
            <div className="flex-1">
              <VariantSelector variants={variantOptions} />
            </div>
            <WishlistButton
              productId={product.id}
              initialInWishlist={inWishlist}
              variant="icon"
              className="h-12 w-12"
            />
          </div>

          {/* Trust badges */}
          <ul className="grid grid-cols-2 gap-2.5 border-t border-border-soft pt-5 text-[11px] text-ink-muted sm:grid-cols-4">
            {[
              { d: "M9 12l2 2 4-4M12 22a10 10 0 100-20 10 10 0 000 20z", label: "Chính hãng" },
              { d: "M3 7h13l3 4v6h-3a2 2 0 11-4 0H9a2 2 0 11-4 0H3V7z", label: "Giao nhanh" },
              { d: "M3 6l9 6 9-6M3 6v12h18V6", label: "Đổi trả 7 ngày" },
              { d: "M12 2l3 7h7l-5.5 4 2 7-6.5-4.5L5.5 20l2-7L2 9h7z", label: "Quà tặng" },
            ].map((item) => (
              <li key={item.label} className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-champagne-dark">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.d} />
                </svg>
                {item.label}
              </li>
            ))}
          </ul>

          <dl className="grid grid-cols-2 gap-3 pt-1 text-sm">
            <div>
              <dt className="text-[10px] uppercase tracking-[0.15em] text-ink-faint">Tồn kho</dt>
              <dd className="mt-0.5 font-grotesk">{totalStock > 0 ? `${totalStock} sản phẩm` : "Hết hàng"}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.15em] text-ink-faint">Danh mục</dt>
              <dd className="mt-0.5 font-grotesk">{product.category.name}</dd>
            </div>
          </dl>
        </div>
      </div>

      <StickyAddBar
        name={product.name}
        brandName={product.brand.name}
        imageUrl={headerImage}
        price={headerPrice}
      />

      {/* Reviews */}
      <section className="mt-20 border-t border-border-soft pt-12">
        <SectionHeader
          eyebrow="Trải nghiệm thật"
          title="Đánh giá từ khách hàng"
          description={
            avgRating !== null
              ? `Trung bình ${avgRating.toFixed(1)} / 5 từ ${product.reviews.length} đánh giá`
              : undefined
          }
        />

        {canReview && (
          <div className="mt-10 max-w-2xl border border-border-soft bg-white p-6 shadow-soft">
            <ReviewForm
              productId={product.id}
              initialRating={existingReview?.rating ?? 0}
              initialComment={existingReview?.comment ?? ""}
              isEdit={Boolean(existingReview)}
            />
          </div>
        )}

        {!canReview && session?.user && (
          <p className="mt-8 text-sm text-ink-muted">
            Bạn cần mua và nhận sản phẩm trước khi có thể đánh giá.
          </p>
        )}

        {product.reviews.length > 0 ? (
          <ul className="mt-10 grid gap-6 md:grid-cols-2">
            {product.reviews.map((review) => (
              <li
                key={review.id}
                className="border border-border-soft bg-white p-6 shadow-soft transition-shadow duration-300 hover:shadow-luxe"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-ink">{review.user.name ?? "Khách hàng"}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-ink-faint">
                      Đánh giá đã xác minh
                    </p>
                  </div>
                  <p className="text-sm">
                    <span className="text-champagne">{"★".repeat(review.rating)}</span>
                    <span className="text-ink-faint">{"★".repeat(5 - review.rating)}</span>
                  </p>
                </div>
                {review.comment && (
                  <p className="mt-4 text-sm leading-relaxed text-ink-muted">{review.comment}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          !canReview && (
            <p className="mt-8 text-sm italic text-ink-muted">
              Chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ trải nghiệm!
            </p>
          )
        )}
      </section>

      {related.length > 0 && (
        <section className="mt-20 border-t border-border-soft pt-12">
          <SectionHeader
            eyebrow="Gợi ý"
            title="Có thể bạn cũng thích"
            link={{ href: "/products", label: "Xem thêm" }}
          />
          <div className="mt-12 grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-3 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
