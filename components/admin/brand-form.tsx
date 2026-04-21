"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { brandUpsertSchema, type BrandUpsertInput } from "@/lib/validations/brand";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";

type Props = {
  brandId?: string;
  initialValues?: Partial<BrandUpsertInput>;
};

export function BrandForm({ brandId, initialValues }: Props) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(brandId);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<BrandUpsertInput>({
    resolver: zodResolver(brandUpsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      slug: initialValues?.slug ?? "",
      logo: initialValues?.logo ?? "",
      description: initialValues?.description ?? "",
    },
  });

  // Tự sinh slug khi chưa có, dựa trên tên
  const onNameBlur = () => {
    const name = getValues("name");
    const slug = getValues("slug");
    if (name && !slug) {
      setValue("slug", slugify(name), { shouldValidate: true });
    }
  };

  const onSubmit = async (data: BrandUpsertInput) => {
    setServerError(null);
    setLoading(true);
    const endpoint = isEdit ? `/api/admin/brands/${brandId}` : "/api/admin/brands";
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
    router.push("/admin/brands");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-5">
      <FormField label="Tên thương hiệu" htmlFor="name" error={errors.name?.message}>
        <Input id="name" {...register("name", { onBlur: onNameBlur })} />
      </FormField>

      <FormField label="Slug" htmlFor="slug" error={errors.slug?.message}>
        <Input id="slug" {...register("slug")} />
      </FormField>

      <FormField label="Logo URL" htmlFor="logo" error={errors.logo?.message}>
        <Input id="logo" type="url" placeholder="https://..." {...register("logo")} />
      </FormField>

      <FormField label="Mô tả" htmlFor="description" error={errors.description?.message}>
        <textarea
          id="description"
          rows={3}
          className="w-full border border-[color:var(--color-border-soft)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ink"
          {...register("description")}
        />
      </FormField>

      {serverError && <p className="text-sm text-burgundy">{serverError}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Đang lưu..." : isEdit ? "Cập nhật" : "Tạo mới"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/brands")}
        >
          Hủy
        </Button>
      </div>
    </form>
  );
}
