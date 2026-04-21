import { CategoryForm } from "@/components/admin/category-form";

export const metadata = { title: "Thêm danh mục — Admin" };

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Thêm danh mục</h1>
      <CategoryForm />
    </div>
  );
}
