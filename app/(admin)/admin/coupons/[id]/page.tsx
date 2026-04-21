import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CouponForm } from "@/components/admin/coupon-form";

export const metadata = { title: "Sửa mã — Admin" };

type PageProps = { params: Promise<{ id: string }> };

// Convert Date → datetime-local input value (YYYY-MM-DDTHH:mm)
function toLocalInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default async function EditCouponPage({ params }: PageProps) {
  const { id } = await params;
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Sửa mã</h1>
      <CouponForm
        couponId={coupon.id}
        initialValues={{
          code: coupon.code,
          description: coupon.description ?? "",
          discountType: coupon.discountType,
          discountValue: Number(coupon.discountValue),
          minOrderValue: coupon.minOrderValue ? Number(coupon.minOrderValue) : undefined,
          maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : undefined,
          usageLimit: coupon.usageLimit ?? undefined,
          startsAt: toLocalInput(coupon.startsAt),
          expiresAt: toLocalInput(coupon.expiresAt),
          isActive: coupon.isActive,
        }}
      />
    </div>
  );
}
