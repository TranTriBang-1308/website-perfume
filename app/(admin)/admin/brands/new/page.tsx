import { BrandForm } from "@/components/admin/brand-form";

export const metadata = { title: "Thêm thương hiệu — Admin" };

export default function NewBrandPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Thêm thương hiệu</h1>
      <BrandForm />
    </div>
  );
}
