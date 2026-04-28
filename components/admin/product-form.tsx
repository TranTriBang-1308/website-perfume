"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productCreateSchema, type ProductCreateInput } from "@/lib/validations/product";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { CloudinaryUpload } from "@/components/admin/cloudinary-upload";

type Props = {
  productId?: string;
  initialValues?: Partial<ProductCreateInput> & {
    images?: Array<{ url: string; alt?: string }>;
    variants?: Array<{
      id?: string;
      volumeMl: number;
      price: number;
      compareAtPrice?: number | null;
      stock: number;
      sku?: string | null;
      isDefault: boolean;
      position: number;
    }>;
  };
  brands: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string }>;
};

const genderOptions = [
  { value: "MALE", label: "Nam" },
  { value: "FEMALE", label: "Nữ" },
  { value: "UNISEX", label: "Unisex" },
];

const concentrationOptions = [
  { value: "PARFUM", label: "Parfum" },
  { value: "EDP", label: "Eau de Parfum" },
  { value: "EDT", label: "Eau de Toilette" },
  { value: "EDC", label: "Eau de Cologne" },
];

export function ProductForm({ productId, initialValues, brands, categories }: Props) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(productId);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(productCreateSchema) as any,
    defaultValues: {
      name: initialValues?.name ?? "",
      slug: initialValues?.slug ?? "",
      description: initialValues?.description ?? "",
      gender: initialValues?.gender ?? "UNISEX",
      concentration: initialValues?.concentration ?? "EDP",
      topNotes: initialValues?.topNotes ?? "",
      middleNotes: initialValues?.middleNotes ?? "",
      baseNotes: initialValues?.baseNotes ?? "",
      isFeatured: initialValues?.isFeatured ?? false,
      isActive: initialValues?.isActive ?? true,
      brandId: initialValues?.brandId ?? "",
      categoryId: initialValues?.categoryId ?? "",
      images: initialValues?.images ?? [],
      variants:
        initialValues?.variants && initialValues.variants.length > 0
          ? initialValues.variants
          : [{ volumeMl: 100, price: 0, compareAtPrice: null, stock: 0, sku: "", isDefault: true, position: 0 }],
    },
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: "images",
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control,
    name: "variants",
  });

  const watchedImages = useWatch({ control, name: "images" }) as
    | Array<{ url?: string; alt?: string }>
    | undefined;

  const watchedVariants = useWatch({ control, name: "variants" }) as
    | Array<{ isDefault?: boolean }>
    | undefined;

  const onNameBlur = () => {
    const name = getValues("name");
    const slug = getValues("slug");
    if (name && !slug) {
      setValue("slug", slugify(name), { shouldValidate: true });
    }
  };

  // Khi tick "Mặc định" cho 1 variant, tự động bỏ tick các variant khác
  const setAsDefault = (index: number) => {
    const variants = getValues("variants") as Array<{ isDefault: boolean }>;
    variants.forEach((_, i) => {
      setValue(`variants.${i}.isDefault`, i === index, { shouldValidate: true });
    });
  };

  const onSubmit = async (data: any) => {
    setServerError(null);
    setLoading(true);
    const endpoint = isEdit ? `/api/admin/products/${productId}` : "/api/admin/products";
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
    router.push("/admin/products");
    router.refresh();
  };

  const variantsError = (errors.variants as any)?.message ?? (errors.variants as any)?.root?.message;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-6">
      <fieldset className="space-y-4 border border-[color:var(--color-border-soft)] bg-white p-6">
        <legend className="text-sm font-medium">Thông tin cơ bản</legend>
        <FormField label="Tên sản phẩm" htmlFor="name" error={(errors.name as any)?.message}>
          <Input id="name" {...register("name", { onBlur: onNameBlur })} />
        </FormField>

        <FormField label="Slug" htmlFor="slug" error={(errors.slug as any)?.message}>
          <Input id="slug" {...register("slug")} />
        </FormField>

        <FormField label="Mô tả" htmlFor="description" error={(errors.description as any)?.message}>
          <textarea
            id="description"
            rows={3}
            className="w-full border border-[color:var(--color-border-soft)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ink"
            {...register("description")}
          />
        </FormField>
      </fieldset>

      <fieldset className="space-y-4 border border-[color:var(--color-border-soft)] bg-white p-6">
        <legend className="text-sm font-medium">Phân loại</legend>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Thương hiệu" htmlFor="brandId" error={(errors.brandId as any)?.message}>
            <select
              id="brandId"
              className="border border-[color:var(--color-border-soft)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ink"
              {...register("brandId")}
            >
              <option value="">-- Chọn thương hiệu --</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Danh mục" htmlFor="categoryId" error={(errors.categoryId as any)?.message}>
            <select
              id="categoryId"
              className="border border-[color:var(--color-border-soft)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ink"
              {...register("categoryId")}
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Giới tính" htmlFor="gender">
            <select id="gender" className="border border-[color:var(--color-border-soft)] bg-white px-3 py-2 text-sm" {...register("gender")}>
              {genderOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Nồng độ" htmlFor="concentration">
            <select id="concentration" className="border border-[color:var(--color-border-soft)] bg-white px-3 py-2 text-sm" {...register("concentration")}>
              {concentrationOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </FormField>
        </div>
      </fieldset>

      <fieldset className="space-y-4 border border-[color:var(--color-border-soft)] bg-white p-6">
        <div className="flex items-center justify-between">
          <legend className="text-sm font-medium">Dung tích &amp; giá</legend>
          <p className="text-xs text-ink-muted">
            Mỗi sản phẩm có thể có nhiều dung tích, mỗi dung tích có giá &amp; tồn kho riêng.
          </p>
        </div>

        {variantsError && <p className="text-sm text-burgundy">{variantsError}</p>}

        <div className="space-y-3">
          {variantFields.map((field, i) => {
            const isDefault = watchedVariants?.[i]?.isDefault ?? false;
            return (
              <div
                key={field.id}
                className="grid grid-cols-12 items-end gap-3 border border-[color:var(--color-border-soft)] bg-cream/40 p-3"
              >
                <div className="col-span-2">
                  <label className="text-xs uppercase tracking-widest text-ink-muted">Dung tích (ml)</label>
                  <Input
                    type="number"
                    {...register(`variants.${i}.volumeMl`, { valueAsNumber: true })}
                  />
                </div>
                <div className="col-span-3">
                  <label className="text-xs uppercase tracking-widest text-ink-muted">Giá (VND)</label>
                  <Input
                    type="number"
                    step="1000"
                    {...register(`variants.${i}.price`, { valueAsNumber: true })}
                  />
                </div>
                <div className="col-span-3">
                  <label className="text-xs uppercase tracking-widest text-ink-muted">Giá gốc (VND)</label>
                  <Input
                    type="number"
                    step="1000"
                    {...register(`variants.${i}.compareAtPrice`, {
                      setValueAs: (v) => (v === "" || v === null || v === undefined ? null : Number(v)),
                    })}
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-xs uppercase tracking-widest text-ink-muted">Tồn</label>
                  <Input
                    type="number"
                    {...register(`variants.${i}.stock`, { valueAsNumber: true })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs uppercase tracking-widest text-ink-muted">SKU</label>
                  <Input {...register(`variants.${i}.sku`)} />
                </div>
                <div className="col-span-1 flex flex-col items-center gap-2 pb-1">
                  <label className="flex flex-col items-center gap-1 text-[10px] uppercase tracking-widest text-ink-muted">
                    <input
                      type="radio"
                      name="defaultVariant"
                      checked={isDefault}
                      onChange={() => setAsDefault(i)}
                    />
                    Mặc định
                  </label>
                  {variantFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(i)}
                      className="text-xs text-burgundy hover:underline"
                    >
                      Xóa
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            appendVariant({
              volumeMl: 50,
              price: 0,
              compareAtPrice: null,
              stock: 0,
              sku: "",
              isDefault: false,
              position: variantFields.length,
            })
          }
        >
          + Thêm dung tích
        </Button>
      </fieldset>

      <fieldset className="space-y-4 border border-[color:var(--color-border-soft)] bg-white p-6">
        <legend className="text-sm font-medium">Hương thơm</legend>
        <FormField label="Hương đầu" htmlFor="topNotes">
          <Input id="topNotes" {...register("topNotes")} placeholder="Ví dụ: Bergamot, Lemon" />
        </FormField>
        <FormField label="Hương giữa" htmlFor="middleNotes">
          <Input id="middleNotes" {...register("middleNotes")} placeholder="Ví dụ: Rose, Jasmine" />
        </FormField>
        <FormField label="Hương cuối" htmlFor="baseNotes">
          <Input id="baseNotes" {...register("baseNotes")} placeholder="Ví dụ: Sandalwood, Musk" />
        </FormField>
      </fieldset>

      <fieldset className="space-y-4 border border-[color:var(--color-border-soft)] bg-white p-6">
        <legend className="text-sm font-medium">Ảnh sản phẩm</legend>
        {imageFields.map((field, i) => {
          const url = watchedImages?.[i]?.url;
          return (
            <div key={field.id} className="flex gap-3 items-end border-b border-[color:var(--color-border-soft)] pb-3">
              {url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={url}
                  alt={watchedImages?.[i]?.alt ?? ""}
                  className="h-20 w-20 shrink-0 object-cover border border-[color:var(--color-border-soft)]"
                />
              ) : (
                <div className="h-20 w-20 shrink-0 border border-dashed border-[color:var(--color-border-soft)] bg-gray-50" />
              )}
              <div className="flex-1 space-y-2">
                <label className="text-xs uppercase tracking-widest text-ink-muted">URL ảnh {i + 1}</label>
                <Input {...register(`images.${i}.url`)} placeholder="https://..." />
              </div>
              <div className="flex-1">
                <label className="text-xs uppercase tracking-widest text-ink-muted">Alt text</label>
                <Input {...register(`images.${i}.alt`)} placeholder="Mô tả ảnh" />
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => removeImage(i)}>
                Xóa
              </Button>
            </div>
          );
        })}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendImage({ url: "", alt: "" })}
          >
            + Thêm ảnh (dán URL)
          </Button>
          <CloudinaryUpload onUploaded={(url) => appendImage({ url, alt: "" })} />
        </div>
      </fieldset>

      <fieldset className="space-y-3 border border-[color:var(--color-border-soft)] bg-white p-6">
        <legend className="text-sm font-medium">Trạng thái</legend>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("isActive")} />
          <span className="text-sm">Đang bán</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("isFeatured")} />
          <span className="text-sm">Sản phẩm nổi bật</span>
        </label>
      </fieldset>

      {serverError && <p className="text-sm text-burgundy">{serverError}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Đang lưu..." : isEdit ? "Cập nhật" : "Tạo mới"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
          Hủy
        </Button>
      </div>
    </form>
  );
}
