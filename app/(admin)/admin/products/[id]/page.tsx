import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

export const metadata = { title: "Sửa sản phẩm — Admin" };

type PageProps = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;

  const [product, brands, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { position: "asc" } },
        variants: { orderBy: [{ position: "asc" }, { volumeMl: "asc" }] },
      },
    }),
    prisma.brand.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Sửa sản phẩm</h1>
      <ProductForm
        productId={product.id}
        initialValues={{
          name: product.name,
          slug: product.slug,
          description: product.description,
          gender: product.gender,
          concentration: product.concentration,
          topNotes: product.topNotes ?? "",
          middleNotes: product.middleNotes ?? "",
          baseNotes: product.baseNotes ?? "",
          isFeatured: product.isFeatured,
          isActive: product.isActive,
          brandId: product.brandId,
          categoryId: product.categoryId,
          images: product.images.map((img) => ({ url: img.url, alt: img.alt ?? "" })),
          variants: product.variants.map((v) => ({
            id: v.id,
            volumeMl: v.volumeMl,
            price: Number(v.price),
            compareAtPrice: v.compareAtPrice !== null ? Number(v.compareAtPrice) : null,
            stock: v.stock,
            sku: v.sku ?? "",
            isDefault: v.isDefault,
            position: v.position,
          })),
        }}
        brands={brands}
        categories={categories}
      />
    </div>
  );
}
