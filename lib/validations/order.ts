import { z } from "zod";

export const orderCreateSchema = z.object({
  addressId: z.string().cuid("Địa chỉ không hợp lệ"),
  paymentMethod: z.enum(["COD", "VNPAY", "MOMO", "BANK_TRANSFER"]),
  note: z.string().max(500).optional(),
  couponCode: z.string().optional(),
});

export type OrderCreateInput = z.infer<typeof orderCreateSchema>;
