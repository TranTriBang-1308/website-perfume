import { z } from "zod";

export const orderStatusUpdateSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "PROCESSING", "SHIPPING", "DELIVERED", "CANCELLED", "REFUNDED"]),
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]).optional(),
});

export const userRoleUpdateSchema = z.object({
  role: z.enum(["USER", "ADMIN"]),
});

export type OrderStatusUpdateInput = z.infer<typeof orderStatusUpdateSchema>;
export type UserRoleUpdateInput = z.infer<typeof userRoleUpdateSchema>;
