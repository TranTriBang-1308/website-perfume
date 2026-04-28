import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { productCreateSchema } from "@/lib/validations/product";
import { syncProductPriceCache } from "@/lib/queries/variants";

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null);
  const parsed = productCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dữ liệu không hợp lệ", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const images = data.images ?? [];

  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        gender: data.gender,
        concentration: data.concentration,
        topNotes: data.topNotes,
        middleNotes: data.middleNotes,
        baseNotes: data.baseNotes,
        isFeatured: data.isFeatured,
        isActive: data.isActive,
        brandId: data.brandId,
        categoryId: data.categoryId,
        images: {
          create: images.map((img, i) => ({
            url: img.url,
            alt: img.alt,
            position: i,
          })),
        },
        variants: {
          create: data.variants.map((v, i) => ({
            volumeMl: v.volumeMl,
            price: v.price,
            compareAtPrice: v.compareAtPrice ?? null,
            stock: v.stock,
            sku: v.sku ?? null,
            isDefault: v.isDefault,
            position: v.position ?? i,
          })),
        },
      },
      include: { images: true, variants: true },
    });

    await syncProductPriceCache(product.id);
    revalidateTag("products");

    return NextResponse.json(
      { data: product, message: "Đã tạo sản phẩm" },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return NextResponse.json({ error: "Slug hoặc SKU đã tồn tại" }, { status: 409 });
      }
      if (err.code === "P2025") {
        return NextResponse.json({ error: "Brand hoặc Category không tồn tại" }, { status: 400 });
      }
    }
    console.error("Product create error:", err);
    return NextResponse.json({ error: "Không thể tạo sản phẩm" }, { status: 500 });
  }
}
