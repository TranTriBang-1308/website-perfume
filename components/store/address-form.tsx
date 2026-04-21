"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, type AddressInput } from "@/lib/validations/address";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";

type Props = {
  defaultValues?: Partial<AddressInput>;
  onSaved: () => void;
  onCancel?: () => void;
  submitLabel?: string;
  addressId?: string;
};

export function AddressForm({ defaultValues, onSaved, onCancel, submitLabel = "Lưu địa chỉ", addressId }: Props) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: { isDefault: false, ...defaultValues },
  });

  const onSubmit = async (data: AddressInput) => {
    setServerError(null);
    setLoading(true);
    const url = addressId ? `/api/addresses/${addressId}` : "/api/addresses";
    const res = await fetch(url, {
      method: addressId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setLoading(false);

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setServerError(json.error ?? "Không thể lưu địa chỉ");
      return;
    }
    onSaved();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Họ tên" htmlFor="fullName" error={errors.fullName?.message}>
          <Input id="fullName" {...register("fullName")} />
        </FormField>
        <FormField label="Số điện thoại" htmlFor="phone" error={errors.phone?.message}>
          <Input id="phone" type="tel" {...register("phone")} />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <FormField label="Tỉnh/Thành" htmlFor="province" error={errors.province?.message}>
          <Input id="province" {...register("province")} />
        </FormField>
        <FormField label="Quận/Huyện" htmlFor="district" error={errors.district?.message}>
          <Input id="district" {...register("district")} />
        </FormField>
        <FormField label="Phường/Xã" htmlFor="ward" error={errors.ward?.message}>
          <Input id="ward" {...register("ward")} />
        </FormField>
      </div>

      <FormField label="Địa chỉ cụ thể (số nhà, tên đường)" htmlFor="street" error={errors.street?.message}>
        <Input id="street" {...register("street")} />
      </FormField>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register("isDefault")} className="h-4 w-4" />
        Đặt làm địa chỉ mặc định
      </label>

      {serverError && <p className="text-sm text-burgundy">{serverError}</p>}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Đang lưu..." : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
        )}
      </div>
    </form>
  );
}
