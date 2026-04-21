import { prisma } from "@/lib/prisma";

async function getCartItemsRaw(userId: string) {
  return prisma.cartItem.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          stock: true,
          volumeMl: true,
          concentration: true,
          isActive: true,
          images: { take: 1, orderBy: { position: "asc" }, select: { url: true, alt: true } },
          brand: { select: { name: true } },
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
    product: {
      ...item.product,
      price: Number(item.product.price),
    },
  };
}

export async function getCartItems(userId: string) {
  const items = await getCartItemsRaw(userId);
  return items.map(toPlainCartItem);
}

export async function getCartSummary(userId: string) {
  const items = await getCartItems(userId);
  const activeItems = items.filter((i) => i.product.isActive);
  const subtotal = activeItems.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );
  return { items: activeItems, subtotal, count: activeItems.length };
}

export type CartLineItem = Awaited<ReturnType<typeof getCartItems>>[number];
