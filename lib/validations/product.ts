import { z } from "zod";

export const GENDERS = ["MALE", "FEMALE", "UNISEX"] as const;
export const CONCENTRATIONS = ["PARFUM", "EDP", "EDT", "EDC"] as const;
export const SORT_OPTIONS = ["newest", "price-asc", "price-desc", "featured"] as const;

export const productQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
  gender: z.enum(GENDERS).optional(),
  concentration: z.enum(CONCENTRATIONS).optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  onSale: z
    .union([z.boolean(), z.literal("true"), z.literal("false"), z.literal("1"), z.literal("0")])
    .transform((v) => v === true || v === "true" || v === "1")
    .optional(),
  sort: z.enum(SORT_OPTIONS).default("newest"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(48).default(12),
});

export type ProductQuery = z.infer<typeof productQuerySchema>;

// Schema cho 1 variant — dùng khi tạo/sửa sản phẩm cùng các dung tích
export const productVariantInputSchema = z.object({
  id: z.string().cuid().optional(), // có khi sửa, không có khi tạo mới
  volumeMl: z.number().int().positive("Dung tích phải > 0"),
  price: z.number().positive("Giá phải lớn hơn 0"),
  compareAtPrice: z.number().positive().nullable().optional(),
  stock: z.number().int().nonnegative().default(0),
  sku: z.string().optional().nullable(),
  isDefault: z.boolean().default(false),
  position: z.number().int().nonnegative().default(0),
});

export const productCreateSchema = z
  .object({
    name: z.string().min(1, "Tên sản phẩm là bắt buộc").max(200),
    slug: z
      .string()
      .regex(/^[a-z0-9-]+$/, "Slug chỉ gồm chữ thường, số và dấu gạch ngang"),
    description: z.string().min(10, "Mô tả tối thiểu 10 ký tự"),
    gender: z.enum(GENDERS),
    concentration: z.enum(CONCENTRATIONS),
    topNotes: z.string().optional(),
    middleNotes: z.string().optional(),
    baseNotes: z.string().optional(),
    isFeatured: z.boolean().default(false),
    isActive: z.boolean().default(true),
    brandId: z.string().cuid(),
    categoryId: z.string().cuid(),
    images: z
      .array(
        z.object({
          url: z.string().url("URL ảnh không hợp lệ"),
          alt: z.string().optional(),
        })
      )
      .optional(),
    variants: z
      .array(productVariantInputSchema)
      .min(1, "Sản phẩm phải có ít nhất 1 dung tích"),
  })
  .refine(
    (data) => data.variants.filter((v) => v.isDefault).length === 1,
    { message: "Phải có đúng 1 dung tích mặc định", path: ["variants"] }
  )
  .refine(
    (data) => new Set(data.variants.map((v) => v.volumeMl)).size === data.variants.length,
    { message: "Các dung tích không được trùng nhau", path: ["variants"] }
  );

// Update là partial của create — nhưng variants nếu được gửi thì vẫn phải đầy đủ
export const productUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().min(10).optional(),
  gender: z.enum(GENDERS).optional(),
  concentration: z.enum(CONCENTRATIONS).optional(),
  topNotes: z.string().optional(),
  middleNotes: z.string().optional(),
  baseNotes: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  brandId: z.string().cuid().optional(),
  categoryId: z.string().cuid().optional(),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        alt: z.string().optional(),
      })
    )
    .optional(),
  variants: z.array(productVariantInputSchema).min(1).optional(),
});

export const productImageSchema = z.object({
  url: z.string().url("URL ảnh không hợp lệ"),
  alt: z.string().optional(),
  position: z.number().int().nonnegative().default(0),
});

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type ProductVariantInput = z.infer<typeof productVariantInputSchema>;
export type ProductImageInput = z.infer<typeof productImageSchema>;
