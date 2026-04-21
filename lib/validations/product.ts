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
  sort: z.enum(SORT_OPTIONS).default("newest"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(48).default(12),
});

export type ProductQuery = z.infer<typeof productQuerySchema>;

export const productCreateSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm là bắt buộc").max(200),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug chỉ gồm chữ thường, số và dấu gạch ngang"),
  description: z.string().min(10, "Mô tả tối thiểu 10 ký tự"),
  price: z.number().positive("Giá phải lớn hơn 0"),
  compareAtPrice: z.number().positive().optional(),
  stock: z.number().int().nonnegative().default(0),
  sku: z.string().optional(),
  volumeMl: z.number().int().positive("Dung tích phải > 0"),
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
});

export const productUpdateSchema = productCreateSchema.partial().extend({
  id: z.string().cuid(),
});

export const productImageSchema = z.object({
  url: z.string().url("URL ảnh không hợp lệ"),
  alt: z.string().optional(),
  position: z.number().int().nonnegative().default(0),
});

export const productToggleSchema = z.object({
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type ProductImageInput = z.infer<typeof productImageSchema>;
export type ProductToggleInput = z.infer<typeof productToggleSchema>;
