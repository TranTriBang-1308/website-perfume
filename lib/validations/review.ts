import { z } from "zod";

export const reviewUpsertSchema = z.object({
  productId: z.string().cuid(),
  rating: z.number().int().min(1, "Vui lòng chọn số sao").max(5),
  comment: z.string().max(1000).optional(),
});

export type ReviewUpsertInput = z.infer<typeof reviewUpsertSchema>;
