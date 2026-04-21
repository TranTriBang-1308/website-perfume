import { z } from "zod";

export const couponUpsertSchema = z
  .object({
    code: z
      .string()
      .min(3, "Mã tối thiểu 3 ký tự")
      .max(30)
      .regex(/^[A-Z0-9_-]+$/, "Mã chỉ gồm chữ hoa, số, dấu gạch"),
    description: z.string().max(200).optional().or(z.literal("")),
    discountType: z.enum(["PERCENTAGE", "FIXED"]),
    discountValue: z.number().positive("Giá trị phải > 0"),
    minOrderValue: z.number().nonnegative().optional(),
    maxDiscount: z.number().positive().optional(),
    usageLimit: z.number().int().positive().optional(),
    startsAt: z.string().min(1, "Ngày bắt đầu là bắt buộc"),
    expiresAt: z.string().min(1, "Ngày hết hạn là bắt buộc"),
    isActive: z.boolean().default(true),
  })
  .refine(
    (d) => {
      if (d.discountType === "PERCENTAGE" && d.discountValue > 100) return false;
      return true;
    },
    { message: "Phần trăm giảm không quá 100", path: ["discountValue"] }
  )
  .refine(
    (d) => new Date(d.startsAt) < new Date(d.expiresAt),
    { message: "Ngày hết hạn phải sau ngày bắt đầu", path: ["expiresAt"] }
  );

export const couponValidateSchema = z.object({
  code: z.string().min(1),
  subtotal: z.number().nonnegative(),
});

export type CouponUpsertInput = z.infer<typeof couponUpsertSchema>;
export type CouponValidateInput = z.infer<typeof couponValidateSchema>;
