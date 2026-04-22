"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bannerUpsertSchema, type BannerUpsertInput } from "@/lib/validations/banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { CloudinaryUpload } from "@/components/admin/cloudinary-upload";

type Props = {
  bannerId?: string;
  initialValues?: Partial<BannerUpsertInput>;
};

export function BannerForm({ bannerId, initialValues }: Props) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(bannerId);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(bannerUpsertSchema) as any,
    defaultValues: {
      title: initialValues?.title ?? "",
      subtitle: initialValues?.subtitle ?? "",
      description: initialValues?.description ?? "",
      imageUrl: initialValues?.imageUrl ?? "",
      ctaLabel: initialValues?.ctaLabel ?? "",
      ctaHref: initialValues?.ctaHref ?? "",
      position: initialValues?.position ?? 0,
      isActive: initialValues?.isActive ?? true,
    },
  });

  const imageUrl = watch("imageUrl");

  const onSubmit = async (data: BannerUpsertInput) => {
    setServerError(null);
    setLoading(true);
    const endpoint = isEdit ? `/api/admin/banners/${bannerId}` : "/api/admin/banners";
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
    router.push("/admin/banners");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-5">
      <FormField label="Tiêu đề" htmlFor="title" error={(errors.title as any)?.message}>
        <Input id="title" placeholder="Hương thơm định hình cá tính" {...register("title")} />
      </FormField>

      <FormField label="Tiêu đề phụ" htmlFor="subtitle" error={(errors.subtitle as any)?.message}>
        <Input id="subtitle" placeholder="Bộ sưu tập mới" {...register("subtitle")} />
      </FormField>

      <FormField label="Mô tả ngắn" htmlFor="description" error={(errors.description as any)?.message}>
        <textarea
          id="description"
          rows={3}
          className="w-full border border-[color:var(--color-border-soft)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ink"
          {...register("description")}
        />
      </FormField>

      <FormField label="Ảnh banner" htmlFor="imageUrl" error={(errors.imageUrl as any)?.message}>
        <div className="space-y-3">
          <Input
            id="imageUrl"
            placeholder="https://res.cloudinary.com/..."
            {...register("imageUrl")}
          />
          <CloudinaryUpload
            onUploaded={(url) => setValue("imageUrl", url, { shouldValidate: true })}
          />
          {imageUrl && (
            <div className="relative aspect-[21/9] w-full overflow-hidden border border-[color:var(--color-border-soft)] bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="Xem trước banner" className="h-full w-full object-cover" />
            </div>
          )}
        </div>
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Nhãn nút CTA" htmlFor="ctaLabel" error={(errors.ctaLabel as any)?.message}>
          <Input id="ctaLabel" placeholder="Khám phá ngay" {...register("ctaLabel")} />
        </FormField>

        <FormField label="Đường dẫn CTA" htmlFor="ctaHref" error={(errors.ctaHref as any)?.message}>
          <Input id="ctaHref" placeholder="/products" {...register("ctaHref")} />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Thứ tự hiển thị" htmlFor="position" error={(errors.position as any)?.message}>
          <Input
            id="position"
            type="number"
            min={0}
            {...register("position", { valueAsNumber: true })}
          />
        </FormField>

        <FormField label="Trạng thái" htmlFor="isActive" error={(errors.isActive as any)?.message}>
          <label className="inline-flex h-11 items-center gap-2 text-sm">
            <input type="checkbox" {...register("isActive")} className="h-4 w-4" />
            <span>Hiển thị trên trang chủ</span>
          </label>
        </FormField>
      </div>

      {serverError && <p className="text-sm text-burgundy">{serverError}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Đang lưu..." : isEdit ? "Cập nhật" : "Tạo mới"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/banners")}>
          Hủy
        </Button>
      </div>
    </form>
  );
}
