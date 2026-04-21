import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { categoryUpsertSchema } from "@/lib/validations/category";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  const body = await req.json().catch(() => null);
  const parsed = categoryUpsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dữ liệu không hợp lệ", details: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description || null,
      },
    });
    revalidateTag("categories", "max");
    return NextResponse.json({ data: category, message: "Đã cập nhật" });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return NextResponse.json({ error: "Tên hoặc slug đã tồn tại" }, { status: 409 });
      }
      if (err.code === "P2025") {
        return NextResponse.json({ error: "Danh mục không tồn tại" }, { status: 404 });
      }
    }
    console.error("Category update error:", err);
    return NextResponse.json({ error: "Không thể cập nhật" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await context.params;

  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    return NextResponse.json(
      { error: `Không thể xóa: còn ${productCount} sản phẩm thuộc danh mục này` },
      { status: 409 }
    );
  }

  try {
    await prisma.category.delete({ where: { id } });
    revalidateTag("categories", "max");
    return NextResponse.json({ message: "Đã xóa" });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return NextResponse.json({ error: "Danh mục không tồn tại" }, { status: 404 });
    }
    console.error("Category delete error:", err);
    return NextResponse.json({ error: "Không thể xóa" }, { status: 500 });
  }
}
