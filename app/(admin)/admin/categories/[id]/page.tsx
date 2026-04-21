import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CategoryForm } from "@/components/admin/category-form";

export const metadata = { title: "Sửa danh mục — Admin" };

type PageProps = { params: Promise<{ id: string }> };

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Sửa danh mục</h1>
      <CategoryForm
        categoryId={category.id}
        initialValues={{
          name: category.name,
          slug: category.slug,
          description: category.description ?? "",
        }}
      />
    </div>
  );
}
