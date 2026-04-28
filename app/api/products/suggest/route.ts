import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const querySchema = z.object({
  q: z.string().trim().min(1).max(100),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsed = querySchema.safeParse({ q: searchParams.get("q") ?? "" });

  if (!parsed.success) {
    return NextResponse.json({ data: [] });
  }

  const { q } = parsed.data;

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { brand: { name: { contains: q, mode: "insensitive" } } },
      ],
    },
    take: 6,
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      minPrice: true,
      hasDiscount: true,
      images: {
        take: 1,
        orderBy: { position: "asc" },
        select: { url: true, alt: true },
      },
      brand: { select: { name: true } },
      variants: {
        where: { isDefault: true },
        take: 1,
        select: { compareAtPrice: true },
      },
    },
  });

  // Hiển thị "from {minPrice}" + giá so sánh từ variant mặc định nếu có
  const data = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.minPrice),
    compareAtPrice: p.variants[0]?.compareAtPrice ? Number(p.variants[0].compareAtPrice) : null,
    image: p.images[0] ?? null,
    brandName: p.brand.name,
  }));

  return NextResponse.json({ data });
}
