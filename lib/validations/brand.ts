import { z } from "zod";

export const brandUpsertSchema = z.object({
  name: z.string().min(1, "Tên thương hiệu là bắt buộc").max(100),
  slug: z
    .string()
    .min(1, "Slug là bắt buộc")
    .regex(/^[a-z0-9-]+$/, "Slug chỉ gồm chữ thường, số và gạch ngang"),
  logo: z
    .union([z.string().url("URL không hợp lệ"), z.literal("")])
    .optional(),
  description: z.string().max(500).optional().or(z.literal("")),
});

export type BrandUpsertInput = z.infer<typeof brandUpsertSchema>;
