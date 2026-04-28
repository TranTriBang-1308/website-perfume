import { prisma } from "@/lib/prisma";

// Mỗi khi variant được tạo/sửa/xóa, gọi hàm này để đồng bộ Product.minPrice
// và Product.hasDiscount. Hai cột này được denormalize để filter/sort theo giá
// chạy nhanh trên Product mà không cần JOIN aggregate.
export async function syncProductPriceCache(productId: string) {
  const variants = await prisma.productVariant.findMany({
    where: { productId },
    select: { price: true, compareAtPrice: true },
  });

  // Sản phẩm không có variant nào (trạng thái tạm bợ) — đặt minPrice = 0
  if (variants.length === 0) {
    await prisma.product.update({
      where: { id: productId },
      data: { minPrice: 0, hasDiscount: false },
    });
    return;
  }

  const minPrice = variants.reduce(
    (min, v) => (Number(v.price) < min ? Number(v.price) : min),
    Number(variants[0].price)
  );
  const hasDiscount = variants.some((v) => v.compareAtPrice !== null);

  await prisma.product.update({
    where: { id: productId },
    data: { minPrice, hasDiscount },
  });
}

// Lấy variant mặc định của một product (dùng làm fallback khi cart lưu variantId
// nhưng cần hiển thị product info).
export async function getDefaultVariant(productId: string) {
  const v = await prisma.productVariant.findFirst({
    where: { productId, isDefault: true },
    select: { id: true },
  });
  if (v) return v;
  // Fallback: nếu không có default, lấy variant đầu tiên theo position
  return prisma.productVariant.findFirst({
    where: { productId },
    orderBy: [{ position: "asc" }, { volumeMl: "desc" }],
    select: { id: true },
  });
}
