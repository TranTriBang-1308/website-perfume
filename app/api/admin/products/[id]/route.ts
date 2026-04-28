import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { productUpdateSchema } from "@/lib/validations/product";
import { syncProductPriceCache } from "@/lib/queries/variants";

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

  const { images, variants, ...data } = parsed.data;

  // Validate variants nếu có gửi lên (Zod refine không chạy được với .partial())
  if (variants !== undefined) {
    const defaults = variants.filter((v) => v.isDefault).length;
    if (defaults !== 1) {
      return NextResponse.json(
        { error: "Phải có đúng 1 dung tích mặc định" },
        { status: 400 }
      );
    }
    const volumes = new Set(variants.map((v) => v.volumeMl));
    if (volumes.size !== variants.length) {
      return NextResponse.json(
        { error: "Các dung tích không được trùng nhau" },
        { status: 400 }
      );
    }
  }

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

      if (variants !== undefined) {
        // Sync variants: giữ những variant có id (update), tạo mới variant không id,
        // xóa các variant cũ không còn xuất hiện trong payload.
        // Cart/Order trỏ tới variant bị xóa: Cart sẽ cascade-delete (CartItem có FK Cascade),
        // Order sẽ giữ snapshot (volumeMl/price/productName) nhờ SetNull.
        const incomingIds = variants.filter((v) => v.id).map((v) => v.id!) as string[];
        await tx.productVariant.deleteMany({
          where: { productId: id, id: { notIn: incomingIds.length > 0 ? incomingIds : ["__none__"] } },
        });

        for (const [i, v] of variants.entries()) {
          if (v.id) {
            await tx.productVariant.update({
              where: { id: v.id },
              data: {
                volumeMl: v.volumeMl,
                price: v.price,
                compareAtPrice: v.compareAtPrice ?? null,
                stock: v.stock,
                sku: v.sku ?? null,
                isDefault: v.isDefault,
                position: v.position ?? i,
              },
            });
          } else {
            await tx.productVariant.create({
              data: {
                productId: id,
                volumeMl: v.volumeMl,
                price: v.price,
                compareAtPrice: v.compareAtPrice ?? null,
                stock: v.stock,
                sku: v.sku ?? null,
                isDefault: v.isDefault,
                position: v.position ?? i,
              },
            });
          }
        }
      }

      return tx.product.update({
        where: { id },
        data,
        include: {
          images: { orderBy: { position: "asc" } },
          variants: { orderBy: [{ position: "asc" }, { volumeMl: "asc" }] },
        },
      });
    });

    if (variants !== undefined) await syncProductPriceCache(id);
    revalidateTag("products");

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
    revalidateTag("products");
    return NextResponse.json({ message: "Đã xóa" });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return NextResponse.json({ error: "Sản phẩm không tồn tại" }, { status: 404 });
    }
    console.error("Product delete error:", err);
    return NextResponse.json({ error: "Không thể xóa" }, { status: 500 });
  }
}
