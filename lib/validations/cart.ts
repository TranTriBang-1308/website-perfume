import { z } from "zod";

export const cartAddSchema = z.object({
  variantId: z.string().cuid("Biến thể không hợp lệ"),
  quantity: z.number().int().positive().max(99).default(1),
});

export const cartUpdateSchema = z.object({
  variantId: z.string().cuid(),
  quantity: z.number().int().positive().max(99),
});

export const cartRemoveSchema = z.object({
  variantId: z.string().cuid(),
});

export const cartSyncSchema = z.object({
  items: z
    .array(
      z.object({
        variantId: z.string().cuid(),
        quantity: z.number().int().positive().max(99),
      })
    )
    .max(50),
});

export type CartAddInput = z.infer<typeof cartAddSchema>;
export type CartUpdateInput = z.infer<typeof cartUpdateSchema>;
export type CartSyncInput = z.infer<typeof cartSyncSchema>;
