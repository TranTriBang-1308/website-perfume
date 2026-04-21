import { CouponForm } from "@/components/admin/coupon-form";

export const metadata = { title: "Tạo mã — Admin" };

export default function NewCouponPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Tạo mã giảm giá</h1>
      <CouponForm />
    </div>
  );
}
