import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { productUpdateSchema } from "@/lib/validations/product";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  const body = await req.json().catch(() => null);

  const parsed = productUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dữ liệu không hợp lệ", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const { images, ...data } = parsed.data;
  try {
    const product = await prisma.$transaction(async (tx) => {
      if (images !== undefined) {
        // Đồng bộ toàn bộ ảnh: xóa cũ, tạo lại theo thứ tự form gửi lên
        await tx.productImage.deleteMany({ where: { productId: id } });
        if (images.length > 0) {
          await tx.productImage.createMany({
            data: images.map((img, i) => ({
              productId: id,
              url: img.url,
              alt: img.alt,
              position: i,
            })),
          });
        }
      }
      return tx.product.update({
        where: { id },
        data,
        include: { images: { orderBy: { position: "asc" } } },
      });
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
