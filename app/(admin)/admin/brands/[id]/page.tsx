import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BrandForm } from "@/components/admin/brand-form";

export const metadata = { title: "Sửa thương hiệu — Admin" };

type PageProps = { params: Promise<{ id: string }> };

export default async function EditBrandPage({ params }: PageProps) {
  const { id } = await params;
  const brand = await prisma.brand.findUnique({ where: { id } });
  if (!brand) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Sửa thương hiệu</h1>
      <BrandForm
        brandId={brand.id}
        initialValues={{
          name: brand.name,
          slug: brand.slug,
          logo: brand.logo ?? "",
          description: brand.description ?? "",
        }}
      />
    </div>
  );
}
