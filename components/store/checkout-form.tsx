"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Address } from "@prisma/client";
import { AddressForm } from "@/components/store/address-form";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/lib/utils";

type Props = {
  addresses: Address[];
  subtotal: number;
};

type PaymentOption = {
  value: "COD" | "BANK_TRANSFER" | "VNPAY" | "MOMO";
  label: string;
  desc: string;
  disabled?: boolean;
};

const paymentOptions: PaymentOption[] = [
  { value: "COD", label: "Thanh toán khi nhận hàng (COD)", desc: "Trả tiền khi shipper giao" },
  { value: "BANK_TRANSFER", label: "Chuyển khoản ngân hàng", desc: "Nhận thông tin sau khi đặt" },
  { value: "VNPAY", label: "VNPay", desc: "Sắp ra mắt", disabled: true },
  { value: "MOMO", label: "MoMo", desc: "Sắp ra mắt", disabled: true },
];

export function CheckoutForm({ addresses, subtotal }: Props) {
  const router = useRouter();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id ?? null
  );
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "BANK_TRANSFER" | "VNPAY" | "MOMO">("COD");
  const [note, setNote] = useState("");
  const [showForm, setShowForm] = useState(addresses.length === 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const discount = appliedCoupon?.discount ?? 0;
  const shippingFee = subtotal >= 2000000 ? 0 : 35000;
  const total = Math.max(0, subtotal + shippingFee - discount);

  const applyCouponCode = async () => {
    setCouponError(null);
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setCouponLoading(true);
    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, subtotal }),
    });
    const json = await res.json().catch(() => ({}));
    setCouponLoading(false);

    if (!res.ok) {
      setCouponError(json.error ?? "Mã không hợp lệ");
      return;
    }
    setAppliedCoupon({ code: json.data.code, discount: json.data.discount });
    setCouponInput("");
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const submit = async () => {
    if (!selectedAddressId) {
      setError("Vui lòng chọn địa chỉ giao hàng");
      return;
    }
    setError(null);
    setLoading(true);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        addressId: selectedAddressId,
        paymentMethod,
        note,
        couponCode: appliedCoupon?.code,
      }),
    });
    const json = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(json.error ?? "Không thể đặt hàng");
      return;
    }
    router.push(`/checkout/success/${json.data.id}`);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <div className="space-y-10">
        <section>
          <h2 className="font-display text-2xl">Địa chỉ giao hàng</h2>
          {addresses.length > 0 && !showForm && (
            <ul className="mt-4 space-y-3">
              {addresses.map((addr) => (
                <li key={addr.id}>
                  <label className="flex cursor-pointer gap-3 border border-[color:var(--color-border-soft)] bg-white p-4 hover:border-ink">
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mt-1"
                    />
                    <div className="text-sm">
                      <p className="font-medium">
                        {addr.fullName} · {addr.phone}
                        {addr.isDefault && (
                          <span className="ml-2 text-xs text-champagne">(Mặc định)</span>
                        )}
                      </p>
                      <p className="text-ink-muted">
                        {addr.street}, {addr.ward}, {addr.district}, {addr.province}
                      </p>
                    </div>
                  </label>
                </li>
              ))}
            </ul>
          )}

          {showForm ? (
            <div className="mt-4 border border-[color:var(--color-border-soft)] bg-white p-6">
              <AddressForm
                onSaved={() => {
                  setShowForm(false);
                  router.refresh();
                }}
                onCancel={addresses.length > 0 ? () => setShowForm(false) : undefined}
              />
            </div>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-xs uppercase tracking-widest text-ink-muted hover:text-ink"
            >
              + Thêm địa chỉ mới
            </button>
          )}
        </section>

        <section>
          <h2 className="font-display text-2xl">Phương thức thanh toán</h2>
          <ul className="mt-4 space-y-3">
            {paymentOptions.map((opt) => (
              <li key={opt.value}>
                <label
                  className={`flex cursor-pointer items-start gap-3 border bg-white p-4 ${
                    opt.disabled
                      ? "cursor-not-allowed opacity-50"
                      : "border-[color:var(--color-border-soft)] hover:border-ink"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={opt.value}
                    checked={paymentMethod === opt.value}
                    disabled={opt.disabled}
                    onChange={() => setPaymentMethod(opt.value)}
                    className="mt-1"
                  />
                  <div className="text-sm">
                    <p className="font-medium">{opt.label}</p>
                    <p className="text-ink-muted">{opt.desc}</p>
                  </div>
                </label>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl">Ghi chú</h2>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="Ghi chú cho người bán (tùy chọn)"
            className="mt-4 w-full border border-[color:var(--color-border-soft)] bg-white p-4 text-sm"
          />
        </section>
      </div>

      <aside className="h-fit bg-white border border-[color:var(--color-border-soft)] p-6">
        <h2 className="font-display text-2xl">Tổng cộng</h2>

        <div className="mt-6 space-y-2">
          <label className="text-xs uppercase tracking-widest text-ink-muted">Mã giảm giá</label>
          {appliedCoupon ? (
            <div className="flex items-center justify-between border border-[color:var(--color-border-soft)] bg-cream px-3 py-2">
              <span className="font-mono text-sm font-medium">{appliedCoupon.code}</span>
              <button
                type="button"
                onClick={removeCoupon}
                className="text-xs uppercase tracking-widest text-burgundy hover:underline"
              >
                Bỏ
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="Nhập mã"
                className="flex-1 border border-[color:var(--color-border-soft)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ink"
              />
              <button
                type="button"
                onClick={applyCouponCode}
                disabled={couponLoading || !couponInput.trim()}
                className="border border-ink px-4 text-xs uppercase tracking-widest hover:bg-ink hover:text-white disabled:opacity-50"
              >
                {couponLoading ? "..." : "Áp dụng"}
              </button>
            </div>
          )}
          {couponError && <p className="text-xs text-burgundy">{couponError}</p>}
        </div>

        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-muted">Tạm tính</dt>
            <dd>{formatVND(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-muted">Phí vận chuyển</dt>
            <dd>{shippingFee === 0 ? "Miễn phí" : formatVND(shippingFee)}</dd>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-burgundy">
              <dt>Giảm giá</dt>
              <dd>-{formatVND(discount)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-[color:var(--color-border-soft)] pt-3 font-medium">
            <dt>Thành tiền</dt>
            <dd className="font-display text-xl">{formatVND(total)}</dd>
          </div>
        </dl>
        {error && <p className="mt-4 text-sm text-burgundy">{error}</p>}
        <Button onClick={submit} disabled={loading || !selectedAddressId} className="mt-6 w-full" size="lg">
          {loading ? "Đang xử lý..." : "Đặt hàng"}
        </Button>
        <p className="mt-3 text-center text-xs text-ink-muted">
          Miễn phí ship cho đơn từ {formatVND(2000000)}
        </p>
      </aside>
    </div>
  );
}
