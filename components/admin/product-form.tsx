"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productCreateSchema, type ProductCreateInput } from "@/lib/validations/product";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";

type Props = {
  productId?: string;
  initialValues?: Partial<ProductCreateInput> & { images?: Array<{ url: string; alt?: string }> };
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
      price: initialValues?.price,
      compareAtPrice: initialValues?.compareAtPrice,
      stock: initialValues?.stock ?? 0,
      sku: initialValues?.sku ?? "",
      volumeMl: initialValues?.volumeMl,
      gender: initialValues?.gender ?? "UNISEX",
      concentration: initialValues?.concentration ?? "EDP",
      topNotes: initialValues?.topNotes ?? "",
      middleNotes: initialValues?.middleNotes ?? "",
      baseNotes: initialValues?.baseNotes ?? "",
      isFeatured: initialValues?.isFeatured ?? false,
      isActive: initialValues?.isActive ?? true,
      brandId: initialValues?.brandId ?? "",
      categoryId: initialValues?.categoryId ?? "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  });

  const onNameBlur = () => {
    const name = getValues("name");
    const slug = getValues("slug");
    if (name && !slug) {
      setValue("slug", slugify(name), { shouldValidate: true });
    }
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

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Giá (VND)" htmlFor="price" error={(errors.price as any)?.message}>
            <Input id="price" type="number" step="1000" {...register("price", { valueAsNumber: true })} />
          </FormField>
          <FormField label="Giá gốc (VND)" htmlFor="compareAtPrice" error={(errors.compareAtPrice as any)?.message}>
            <Input
              id="compareAtPrice"
              type="number"
              step="1000"
              {...register("compareAtPrice", {
                setValueAs: (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
              })}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField label="Tồn kho" htmlFor="stock" error={(errors.stock as any)?.message}>
            <Input id="stock" type="number" {...register("stock", { valueAsNumber: true })} />
          </FormField>
          <FormField label="Dung tích (ml)" htmlFor="volumeMl" error={(errors.volumeMl as any)?.message}>
            <Input id="volumeMl" type="number" {...register("volumeMl", { valueAsNumber: true })} />
          </FormField>
          <FormField label="SKU" htmlFor="sku" error={(errors.sku as any)?.message}>
            <Input id="sku" {...register("sku")} />
          </FormField>
        </div>
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
        {fields.map((field, i) => (
          <div key={field.id} className="flex gap-3 items-end border-b border-[color:var(--color-border-soft)] pb-3">
            <div className="flex-1 space-y-2">
              <label className="text-xs uppercase tracking-widest text-ink-muted">URL ảnh {i + 1}</label>
              <Input {...register(`images.${i}.url`)} placeholder="https://..." />
            </div>
            <div className="flex-1">
              <label className="text-xs uppercase tracking-widest text-ink-muted">Alt text</label>
              <Input {...register(`images.${i}.alt`)} placeholder="Mô tả ảnh" />
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => remove(i)}>
              Xóa
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ url: "", alt: "" })}
        >
          + Thêm ảnh
        </Button>
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
