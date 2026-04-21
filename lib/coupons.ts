import type { Coupon } from "@prisma/client";

export type CouponCheck =
  | { ok: true; discount: number }
  | { ok: false; error: string };

// Kiểm tra + tính giảm giá cho một coupon. Dùng chung ở validate endpoint và order creation.
export function applyCoupon(coupon: Coupon, subtotal: number): CouponCheck {
  if (!coupon.isActive) {
    return { ok: false, error: "Mã giảm giá không còn hiệu lực" };
  }

  const now = new Date();
  if (now < coupon.startsAt) {
    return { ok: false, error: "Mã giảm giá chưa được kích hoạt" };
  }
  if (now > coupon.expiresAt) {
    return { ok: false, error: "Mã giảm giá đã hết hạn" };
  }

  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    return { ok: false, error: "Mã giảm giá đã hết lượt sử dụng" };
  }

  if (coupon.minOrderValue !== null) {
    const min = Number(coupon.minOrderValue);
    if (subtotal < min) {
      return { ok: false, error: `Đơn tối thiểu ${min.toLocaleString("vi-VN")}đ để áp dụng` };
    }
  }

  const value = Number(coupon.discountValue);
  let discount = coupon.discountType === "PERCENTAGE" ? (subtotal * value) / 100 : value;

  if (coupon.maxDiscount !== null) {
    discount = Math.min(discount, Number(coupon.maxDiscount));
  }
  // Không vượt quá subtotal
  discount = Math.min(discount, subtotal);

  return { ok: true, discount: Math.floor(discount) };
}
