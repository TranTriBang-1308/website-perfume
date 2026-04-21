import { z } from "zod";

export const wishlistToggleSchema = z.object({
  productId: z.string().cuid("Sản phẩm không hợp lệ"),
});

export type WishlistToggleInput = z.infer<typeof wishlistToggleSchema>;
