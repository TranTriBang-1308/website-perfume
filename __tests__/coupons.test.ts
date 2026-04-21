import { applyCoupon } from "@/lib/coupons";
import type { Coupon } from "@prisma/client";

function makeCoupon(overrides: Partial<Coupon> = {}): Coupon {
  const now = new Date();
  const past = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const future = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  return {
    id: "test-id",
    code: "TEST10",
    description: null,
    discountType: "PERCENTAGE",
    discountValue: 10 as unknown as Coupon["discountValue"],
    maxDiscount: null,
    minOrderValue: null,
    usageLimit: null,
    usedCount: 0,
    isActive: true,
    startsAt: past,
    expiresAt: future,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe("applyCoupon", () => {
  it("applies a percentage discount", () => {
    const result = applyCoupon(makeCoupon(), 1_000_000);
    expect(result).toEqual({ ok: true, discount: 100_000 });
  });

  it("applies a fixed discount", () => {
    const coupon = makeCoupon({ discountType: "FIXED", discountValue: 50_000 as unknown as Coupon["discountValue"] });
    const result = applyCoupon(coupon, 500_000);
    expect(result).toEqual({ ok: true, discount: 50_000 });
  });

  it("caps discount at maxDiscount", () => {
    const coupon = makeCoupon({ maxDiscount: 30_000 as unknown as Coupon["maxDiscount"] });
    const result = applyCoupon(coupon, 1_000_000);
    expect(result).toEqual({ ok: true, discount: 30_000 });
  });

  it("rejects inactive coupon", () => {
    const result = applyCoupon(makeCoupon({ isActive: false }), 500_000);
    expect(result.ok).toBe(false);
  });

  it("rejects expired coupon", () => {
    const past = new Date(Date.now() - 1000);
    const result = applyCoupon(makeCoupon({ expiresAt: past }), 500_000);
    expect(result.ok).toBe(false);
  });

  it("rejects when minimum order value not met", () => {
    const coupon = makeCoupon({ minOrderValue: 500_000 as unknown as Coupon["minOrderValue"] });
    const result = applyCoupon(coupon, 300_000);
    expect(result.ok).toBe(false);
  });

  it("rejects when usage limit reached", () => {
    const coupon = makeCoupon({ usageLimit: 5, usedCount: 5 });
    const result = applyCoupon(coupon, 500_000);
    expect(result.ok).toBe(false);
  });

  it("discount never exceeds subtotal", () => {
    const coupon = makeCoupon({ discountType: "FIXED", discountValue: 9_999_999 as unknown as Coupon["discountValue"] });
    const result = applyCoupon(coupon, 100_000);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.discount).toBe(100_000);
  });
});
