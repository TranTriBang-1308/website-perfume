import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  // Các route tĩnh
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/products`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/search`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${base}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/register`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  // Sản phẩm active
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });
  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${base}/products/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Filter theo brand/category
  const [brands, categories] = await Promise.all([
    prisma.brand.findMany({ select: { slug: true } }),
    prisma.category.findMany({ select: { slug: true } }),
  ]);
  const filterRoutes: MetadataRoute.Sitemap = [
    ...brands.map((b) => ({
      url: `${base}/products?brand=${b.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...categories.map((c) => ({
      url: `${base}/products?category=${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];

  return [...staticRoutes, ...productRoutes, ...filterRoutes];
}
