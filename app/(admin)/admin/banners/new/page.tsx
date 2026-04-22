import { BannerForm } from "@/components/admin/banner-form";

export const metadata = { title: "Thêm banner — Admin" };

export default function NewBannerPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Thêm banner</h1>
      <BannerForm />
    </div>
  );
}
