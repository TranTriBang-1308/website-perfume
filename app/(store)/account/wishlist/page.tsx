import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatVND } from "@/lib/utils";
import { WishlistButton } from "@/components/store/wishlist-button";

export const metadata = { title: "Yêu thích — Parfum" };

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account/wishlist");

  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          compareAtPrice: true,
          stock: true,
          isActive: true,
          images: { take: 1, orderBy: { position: "asc" }, select: { url: true, alt: true } },
          brand: { select: { name: true } },
        },
      },
    },
  });

  const activeItems = items.filter((i) => i.product.isActive);

  if (activeItems.length === 0) {
    return (
      <div className="bg-white border border-[color:var(--color-border-soft)] p-6">
        <h2 className="font-display text-2xl">Danh sách yêu thích</h2>
        <p className="mt-6 text-sm text-ink-muted">
          Bạn chưa có sản phẩm yêu thích nào.{" "}
          <Link href="/products" className="underline underline-offset-4 hover:text-ink">
            Khám phá sản phẩm →
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[color:var(--color-border-soft)] p-6">
      <h2 className="font-display text-2xl">Danh sách yêu thích</h2>
      <p className="mt-1 text-sm text-ink-muted">{activeItems.length} sản phẩm</p>

      <ul className="mt-6 divide-y divide-[color:var(--color-border-soft)]">
        {activeItems.map((item) => {
          const product = item.product;
          const price = Number(product.price);
          const image = product.images[0];
          const outOfStock = product.stock <= 0;

          return (
            <li key={item.id} className="flex gap-4 py-4">
              <Link
                href={`/products/${product.slug}`}
                className="relative h-24 w-20 flex-shrink-0 overflow-hidden bg-white border border-[color:var(--color-border-soft)]"
              >
                {image ? (
                  <Image src={image.url} alt={image.alt ?? product.name} fill sizes="80px" className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-ink-muted">
                    {product.brand.name}
                  </div>
                )}
              </Link>

              <div className="flex flex-1 items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-ink-muted">{product.brand.name}</p>
                  <Link href={`/products/${product.slug}`} className="font-display text-lg hover:underline">
                    {product.name}
                  </Link>
                  <p className="mt-1 text-sm font-medium">{formatVND(price)}</p>
                  {outOfStock && <p className="mt-1 text-xs text-burgundy">Hết hàng</p>}
                </div>

                <WishlistButton productId={product.id} initialInWishlist={true} variant="icon" />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
