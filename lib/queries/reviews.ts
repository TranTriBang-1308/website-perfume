import { prisma } from "@/lib/prisma";

// Kiểm tra user đã từng mua sản phẩm — chỉ tính đơn đã giao
export async function hasUserPurchased(userId: string, productId: string): Promise<boolean> {
  const count = await prisma.order.count({
    where: {
      userId,
      status: "DELIVERED",
      items: { some: { productId } },
    },
  });
  return count > 0;
}

export async function getUserReview(userId: string, productId: string) {
  return prisma.review.findUnique({
    where: { userId_productId: { userId, productId } },
  });
}
