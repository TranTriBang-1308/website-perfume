import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { productUpdateSchema, productToggleSchema } from "@/lib/validations/product";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  const body = await req.json().catch(() => null);

  // Cố gắng parse update schema (full update)
  const parsed = productUpdateSchema.safeParse(body);
  if (!parsed.success) {
    // Nếu fail, thử toggle schema (chỉ toggle isActive/isFeatured)
    const toggleParsed = productToggleSchema.safeParse(body);
    if (!toggleParsed.success) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ", details: parsed.error.issues },
        { status: 400 }
      );
    }
    // Thực hiện toggle
    try {
      const product = await prisma.product.update({
        where: { id },
        data: toggleParsed.data,
      });
      revalidateTag("products", "max");
      return NextResponse.json({ data: product });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
        return NextResponse.json({ error: "Sản phẩm không tồn tại" }, { status: 404 });
      }
      console.error("Product toggle error:", err);
      return NextResponse.json({ error: "Không thể cập nhật" }, { status: 500 });
    }
  }

  // Full update
  const data = parsed.data as any;
  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        stock: data.stock,
        sku: data.sku,
        volumeMl: data.volumeMl,
        gender: data.gender,
        concentration: data.concentration,
        topNotes: data.topNotes,
        middleNotes: data.middleNotes,
        baseNotes: data.baseNotes,
        isFeatured: data.isFeatured,
        isActive: data.isActive,
        brandId: data.brandId,
        categoryId: data.categoryId,
      },
      include: { images: true },
    });
    revalidateTag("products", "max");
    return NextResponse.json({ data: product, message: "Đã cập nhật" });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return NextResponse.json({ error: "Slug hoặc SKU đã tồn tại" }, { status: 409 });
      }
      if (err.code === "P2025") {
        return NextResponse.json({ error: "Sản phẩm hoặc tham chiếu không tồn tại" }, { status: 404 });
      }
    }
    console.error("Product update error:", err);
    return NextResponse.json({ error: "Không thể cập nhật" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  try {
    await prisma.product.delete({ where: { id } });
    revalidateTag("products", "max");
    return NextResponse.json({ message: "Đã xóa" });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return NextResponse.json({ error: "Sản phẩm không tồn tại" }, { status: 404 });
    }
    console.error("Product delete error:", err);
    return NextResponse.json({ error: "Không thể xóa" }, { status: 500 });
  }
}
