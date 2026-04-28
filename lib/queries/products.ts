import type { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { ProductQuery } from "@/lib/validations/product";

// Sort dựa trên cột denormalized `minPrice` trên Product cho hiệu năng tốt
// (không thể orderBy qua aggregate của variants trong Prisma).
const sortMap: Record<ProductQuery["sort"], Prisma.ProductOrderByWithRelationInput> = {
  newest: { createdAt: "desc" },
  "price-asc": { minPrice: "asc" },
  "price-desc": { minPrice: "desc" },
  featured: { isFeatured: "desc" },
};

// Select dùng chung cho danh sách (card sản phẩm). Chỉ lấy đủ thông tin
// để hiển thị card + badge sale + "from {minPrice}".
const productCardSelect = {
  id: true,
  name: true,
  slug: true,
  minPrice: true,
  hasDiscount: true,
  concentration: true,
  gender: true,
  images: {
    take: 1,
    orderBy: { position: "asc" },
    select: { url: true, alt: true },
  },
  brand: { select: { name: true, slug: true } },
  // Lấy variant mặc định để biết volumeMl + compareAtPrice hiển thị trên card
  variants: {
    where: { isDefault: true },
    take: 1,
    select: {
      id: true,
      volumeMl: true,
      price: true,
      compareAtPrice: true,
      stock: true,
    },
  },
} satisfies Prisma.ProductSelect;

export async function listProducts(query: ProductQuery) {
  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(query.q && {
      OR: [
        { name: { contains: query.q, mode: "insensitive" } },
        { description: { contains: query.q, mode: "insensitive" } },
      ],
    }),
    ...(query.brand && { brand: { slug: query.brand } }),
    ...(query.category && { category: { slug: query.category } }),
    ...(query.gender && { gender: query.gender }),
    ...(query.concentration && { concentration: query.concentration }),
    // Lọc theo dải giá: dùng minPrice để khớp với "starting from price" hiển thị trên card
    ...((query.minPrice !== undefined || query.maxPrice !== undefined) && {
      minPrice: {
        ...(query.minPrice !== undefined && { gte: query.minPrice }),
        ...(query.maxPrice !== undefined && { lte: query.maxPrice }),
      },
    }),
    ...(query.onSale && { hasDiscount: true }),
  };

  const [total, products] = await prisma.$transaction([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: sortMap[query.sort],
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      select: productCardSelect,
    }),
  ]);

  return {
    products,
    pagination: {
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}

export type ProductListItem = Awaited<ReturnType<typeof listProducts>>["products"][number];

export const getProductBySlug = unstable_cache(
  async (slug: string) =>
    prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        brand: true,
        category: true,
        images: { orderBy: { position: "asc" } },
        // Tất cả variant — sắp xếp theo position (admin có thể tùy biến thứ tự)
        variants: {
          orderBy: [{ position: "asc" }, { volumeMl: "asc" }],
        },
        reviews: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: { user: { select: { name: true, image: true } } },
        },
      },
    }),
  ["product-by-slug"],
  { tags: ["products"], revalidate: 3600 }
);

export const getFeaturedProducts = unstable_cache(
  async (limit = 4) =>
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: limit,
      orderBy: { createdAt: "desc" },
      select: productCardSelect,
    }),
  ["featured-products"],
  { tags: ["products"], revalidate: 3600 }
);

export async function getRelatedProducts(params: {
  productId: string;
  brandId: string;
  categoryId: string;
  limit?: number;
}) {
  const { productId, brandId, categoryId, limit = 4 } = params;

  // Ưu tiên sản phẩm cùng brand, nếu thiếu thì lấy cùng category bù vào
  const sameBrand = await prisma.product.findMany({
    where: { isActive: true, brandId, id: { not: productId } },
    take: limit,
    orderBy: { createdAt: "desc" },
    select: productCardSelect,
  });

  if (sameBrand.length >= limit) return sameBrand;

  const fillers = await prisma.product.findMany({
    where: {
      isActive: true,
      categoryId,
      id: { notIn: [productId, ...sameBrand.map((p) => p.id)] },
    },
    take: limit - sameBrand.length,
    orderBy: { createdAt: "desc" },
    select: productCardSelect,
  });

  return [...sameBrand, ...fillers];
}

export const getBrandsAndCategories = unstable_cache(
  async () => {
    const [brands, categories] = await prisma.$transaction([
      prisma.brand.findMany({ select: { id: true, name: true, slug: true, logo: true }, orderBy: { name: "asc" } }),
      prisma.category.findMany({
        select: { id: true, name: true, slug: true },
        orderBy: { name: "asc" },
      }),
    ]);
    return { brands, categories };
  },
  ["brands-and-categories"],
  { tags: ["brands", "categories"], revalidate: 3600 }
);
