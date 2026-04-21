"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { couponUpsertSchema, type CouponUpsertInput } from "@/lib/validations/coupon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";

type Props = {
  couponId?: string;
  initialValues?: Partial<CouponUpsertInput>;
};

export function CouponForm({ couponId, initialValues }: Props) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(couponId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(couponUpsertSchema) as any,
    defaultValues: {
      code: initialValues?.code ?? "",
      description: initialValues?.description ?? "",
      discountType: initialValues?.discountType ?? "PERCENTAGE",
      discountValue: initialValues?.discountValue,
      minOrderValue: initialValues?.minOrderValue,
      maxDiscount: initialValues?.maxDiscount,
      usageLimit: initialValues?.usageLimit,
      startsAt: initialValues?.startsAt ?? "",
      expiresAt: initialValues?.expiresAt ?? "",
      isActive: initialValues?.isActive ?? true,
    },
  });

  const onSubmit = async (data: any) => {
    setServerError(null);
    setLoading(true);
    const endpoint = isEdit ? `/api/admin/coupons/${couponId}` : "/api/admin/coupons";
    const res = await fetch(endpoint, {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setLoading(false);

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setServerError(json.error ?? "Không thể lưu");
      return;
    }
    router.push("/admin/coupons");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-5">
      <FormField label="Mã (chữ hoa)" htmlFor="code" error={(errors.code as any)?.message}>
        <Input id="code" placeholder="SUMMER20" {...register("code")} />
      </FormField>

      <FormField label="Mô tả" htmlFor="description" error={(errors.description as any)?.message}>
        <Input id="description" {...register("description")} />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Loại giảm" htmlFor="discountType" error={(errors.discountType as any)?.message}>
          <select
            id="discountType"
            className="w-full border border-[color:var(--color-border-soft)] bg-white px-3 py-2 text-sm"
            {...register("discountType")}
          >
            <option value="PERCENTAGE">Phần trăm (%)</option>
            <option value="FIXED">Số tiền cố định (VND)</option>
          </select>
        </FormField>
        <FormField label="Giá trị giảm" htmlFor="discountValue" error={(errors.discountValue as any)?.message}>
          <Input
            id="discountValue"
            type="number"
            step="1"
            {...register("discountValue", { valueAsNumber: true })}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Đơn tối thiểu (VND)" htmlFor="minOrderValue">
          <Input
            id="minOrderValue"
            type="number"
            step="1000"
            {...register("minOrderValue", { valueAsNumber: true, setValueAs: (v) => (v === "" || isNaN(v) ? undefined : v) })}
          />
        </FormField>
        <FormField label="Giảm tối đa (VND)" htmlFor="maxDiscount">
          <Input
            id="maxDiscount"
            type="number"
            step="1000"
            {...register("maxDiscount", { valueAsNumber: true, setValueAs: (v) => (v === "" || isNaN(v) ? undefined : v) })}
          />
        </FormField>
      </div>

      <FormField label="Giới hạn lượt dùng (để trống = không giới hạn)" htmlFor="usageLimit">
        <Input
          id="usageLimit"
          type="number"
          step="1"
          {...register("usageLimit", { valueAsNumber: true, setValueAs: (v) => (v === "" || isNaN(v) ? undefined : v) })}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Ngày bắt đầu" htmlFor="startsAt" error={(errors.startsAt as any)?.message}>
          <Input id="startsAt" type="datetime-local" {...register("startsAt")} />
        </FormField>
        <FormField label="Ngày hết hạn" htmlFor="expiresAt" error={(errors.expiresAt as any)?.message}>
          <Input id="expiresAt" type="datetime-local" {...register("expiresAt")} />
        </FormField>
      </div>

      <label className="flex items-center gap-2">
        <input type="checkbox" {...register("isActive")} />
        <span className="text-sm">Đang kích hoạt</span>
      </label>

      {serverError && <p className="text-sm text-burgundy">{serverError}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Đang lưu..." : isEdit ? "Cập nhật" : "Tạo mới"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/coupons")}>
          Hủy
        </Button>
      </div>
    </form>
  );
}
