import { prisma } from "@/lib/prisma";

async function getCartItemsRaw(userId: string) {
  return prisma.cartItem.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      variant: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              concentration: true,
              isActive: true,
              images: { take: 1, orderBy: { position: "asc" }, select: { url: true, alt: true } },
              brand: { select: { name: true } },
            },
          },
        },
      },
    },
  });
}

// Chuyển Decimal → number để có thể truyền xuống Client Component
function toPlainCartItem<T extends Awaited<ReturnType<typeof getCartItemsRaw>>[number]>(
  item: T
) {
  return {
    ...item,
    variant: {
      ...item.variant,
      price: Number(item.variant.price),
      compareAtPrice: item.variant.compareAtPrice !== null ? Number(item.variant.compareAtPrice) : null,
    },
  };
}

export async function getCartItems(userId: string) {
  const items = await getCartItemsRaw(userId);
  return items.map(toPlainCartItem);
}

export async function getCartSummary(userId: string) {
  const items = await getCartItems(userId);
  // Bỏ qua những dòng trỏ tới sản phẩm đã ngừng kinh doanh
  const activeItems = items.filter((i) => i.variant.product.isActive);
  const subtotal = activeItems.reduce(
    (sum, i) => sum + i.variant.price * i.quantity,
    0
  );
  return { items: activeItems, subtotal, count: activeItems.length };
}

export type CartLineItem = Awaited<ReturnType<typeof getCartItems>>[number];
