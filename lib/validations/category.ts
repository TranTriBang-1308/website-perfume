import { z } from "zod";

export const categoryUpsertSchema = z.object({
  name: z.string().min(1, "Tên danh mục là bắt buộc").max(100),
  slug: z
    .string()
    .min(1, "Slug là bắt buộc")
    .regex(/^[a-z0-9-]+$/, "Slug chỉ gồm chữ thường, số và gạch ngang"),
  description: z.string().max(500).optional().or(z.literal("")),
});

export type CategoryUpsertInput = z.infer<typeof categoryUpsertSchema>;
