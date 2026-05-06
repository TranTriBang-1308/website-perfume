"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Address } from "@prisma/client";
import { AddressForm } from "@/components/store/address-form";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

type Props = {
  addresses: Address[];
  subtotal: number;
};

type PaymentOption = {
  value: "COD" | "BANK_TRANSFER" | "VNPAY" | "MOMO";
  label: string;
  desc: string;
  icon: string;
  disabled?: boolean;
};

const paymentOptions: PaymentOption[] = [
  {
    value: "COD",
    label: "Thanh toán khi nhận hàng (COD)",
    desc: "Trả tiền khi shipper giao",
    icon: "M3 7h13l3 4v6h-3a2 2 0 11-4 0H9a2 2 0 11-4 0H3V7z",
  },
  {
    value: "BANK_TRANSFER",
    label: "Chuyển khoản ngân hàng",
    desc: "Nhận thông tin sau khi đặt",
    icon: "M3 10h18M3 6l9-3 9 3M5 10v8h14v-8M9 14h2M13 14h2",
  },
  {
    value: "VNPAY",
    label: "VNPay",
    desc: "Sắp ra mắt",
    icon: "M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z",
    disabled: true,
  },
  {
    value: "MOMO",
    label: "MoMo",
    desc: "Sắp ra mắt",
    icon: "M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z",
    disabled: true,
  },
];

export function CheckoutForm({ addresses, subtotal }: Props) {
  const router = useRouter();
  const toast = useToast();
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
    toast.show(`Áp dụng thành công mã ${json.data.code}`, "success");
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
    toast.show("Đặt hàng thành công!", "success");
    router.push(`/checkout/success/${json.data.id}`);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
      <div className="space-y-10">
        {/* Steps indicator */}
        <ol className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-ink-faint">
          <li className="flex items-center gap-2 text-ink">
            <span className="flex h-7 w-7 items-center justify-center bg-ink text-white">1</span>
            Thông tin
          </li>
          <span className="h-px flex-1 bg-border-soft" aria-hidden />
          <li className="flex items-center gap-2 text-ink">
            <span className="flex h-7 w-7 items-center justify-center bg-ink text-white">2</span>
            Thanh toán
          </li>
          <span className="h-px flex-1 bg-border-soft" aria-hidden />
          <li className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center border border-border-soft bg-white">3</span>
            Hoàn tất
          </li>
        </ol>

        <SectionPanel
          step="01"
          title="Địa chỉ giao hàng"
          description="Chọn hoặc thêm địa chỉ để chúng tôi giao đến tay bạn."
        >
          {addresses.length > 0 && !showForm && (
            <ul className="space-y-3">
              {addresses.map((addr) => {
                const active = selectedAddressId === addr.id;
                return (
                  <li key={addr.id}>
                    <label
                      className={`flex cursor-pointer gap-4 border bg-white p-4 transition-all duration-300 ease-luxe ${
                        active
                          ? "border-champagne shadow-soft ring-1 ring-champagne/30"
                          : "border-border-soft hover:border-ink-faint"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={active}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1 accent-champagne"
                      />
                      <div className="flex-1 text-sm">
                        <p className="font-medium">
                          {addr.fullName} · {addr.phone}
                          {addr.isDefault && (
                            <span className="ml-2 inline-flex items-center bg-champagne/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-champagne-dark">
                              Mặc định
                            </span>
                          )}
                        </p>
                        <p className="mt-1 text-ink-muted">
                          {addr.street}, {addr.ward}, {addr.district}, {addr.province}
                        </p>
                      </div>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}

          {showForm ? (
            <div className="border border-border-soft bg-white p-6 shadow-soft">
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
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-champagne-dark transition-colors hover:text-ink"
            >
              <span aria-hidden className="inline-flex h-5 w-5 items-center justify-center border border-champagne text-champagne-dark">+</span>
              Thêm địa chỉ mới
            </button>
          )}
        </SectionPanel>

        <SectionPanel step="02" title="Phương thức thanh toán" description="Chọn phương thức phù hợp với bạn.">
          <ul className="grid gap-3 sm:grid-cols-2">
            {paymentOptions.map((opt) => {
              const active = paymentMethod === opt.value;
              return (
                <li key={opt.value}>
                  <label
                    className={`flex cursor-pointer items-start gap-3 border bg-white p-4 transition-all duration-300 ease-luxe ${
                      opt.disabled
                        ? "cursor-not-allowed opacity-50"
                        : active
                          ? "border-champagne shadow-soft ring-1 ring-champagne/30"
                          : "border-border-soft hover:border-ink-faint"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.value}
                      checked={active}
                      disabled={opt.disabled}
                      onChange={() => setPaymentMethod(opt.value)}
                      className="mt-1 accent-champagne"
                    />
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-cream-warm text-champagne-dark">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d={opt.icon} />
                      </svg>
                    </span>
                    <div className="text-sm">
                      <p className="font-medium">{opt.label}</p>
                      <p className="text-xs text-ink-muted">{opt.desc}</p>
                    </div>
                  </label>
                </li>
              );
            })}
          </ul>
        </SectionPanel>

        <SectionPanel step="03" title="Ghi chú" description="Có yêu cầu đặc biệt? Hãy cho chúng tôi biết.">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="Ghi chú cho người bán (tùy chọn)..."
            className="block w-full border border-border-soft bg-white p-4 text-sm transition-colors focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne/30"
          />
          <p className="mt-1 text-right text-[11px] text-ink-faint">{note.length}/500</p>
        </SectionPanel>
      </div>

      <aside className="h-fit space-y-6 lg:sticky lg:top-32">
        <div className="border border-border-soft bg-white shadow-luxe">
          <header className="border-b border-border-soft bg-cream-warm/50 px-6 py-4">
            <h2 className="font-display text-xl">Tổng cộng</h2>
          </header>

          <div className="space-y-5 p-6">
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.2em] text-ink-muted">Mã giảm giá</label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between border border-champagne bg-champagne/10 px-3 py-2">
                  <span className="inline-flex items-center gap-2 font-mono text-sm font-medium">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5 text-champagne-dark">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M12 22a10 10 0 100-20 10 10 0 000 20z" />
                    </svg>
                    {appliedCoupon.code}
                  </span>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-xs uppercase tracking-[0.18em] text-burgundy transition-colors hover:text-burgundy-light"
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
                    className="flex-1 border border-border-soft bg-white px-3 py-2 text-sm transition-colors focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne/30"
                  />
                  <button
                    type="button"
                    onClick={applyCouponCode}
                    disabled={couponLoading || !couponInput.trim()}
                    className="border border-ink px-4 text-xs uppercase tracking-[0.18em] transition-colors hover:bg-ink hover:text-white disabled:opacity-50"
                  >
                    {couponLoading ? "..." : "Áp dụng"}
                  </button>
                </div>
              )}
              {couponError && (
                <p className="flex items-center gap-1.5 text-xs text-burgundy">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" d="M12 8v4M12 16h.01" />
                  </svg>
                  {couponError}
                </p>
              )}
            </div>

            <dl className="space-y-3 border-t border-border-soft pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-muted">Tạm tính</dt>
                <dd>{formatVND(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">Phí vận chuyển</dt>
                <dd className={shippingFee === 0 ? "text-emerald-700" : ""}>
                  {shippingFee === 0 ? "Miễn phí" : formatVND(shippingFee)}
                </dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-burgundy">
                  <dt>Giảm giá</dt>
                  <dd>-{formatVND(discount)}</dd>
                </div>
              )}
              <div className="flex items-baseline justify-between border-t border-border-soft pt-4">
                <dt className="text-[11px] uppercase tracking-[0.2em] text-ink-muted">Thành tiền</dt>
                <dd className="font-display text-2xl">{formatVND(total)}</dd>
              </div>
            </dl>

            {error && (
              <p className="flex items-center gap-2 border border-burgundy/30 bg-burgundy/5 p-3 text-sm text-burgundy">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <path strokeLinecap="round" d="M12 8v4M12 16h.01" />
                </svg>
                {error}
              </p>
            )}

            <Button
              onClick={submit}
              disabled={loading || !selectedAddressId}
              loading={loading}
              className="w-full"
              size="lg"
            >
              Đặt hàng ngay
            </Button>
            <p className="text-center text-[11px] text-ink-faint">
              Miễn phí ship cho đơn từ {formatVND(2000000)}
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}

function SectionPanel({
  step,
  title,
  description,
  children,
}: {
  step: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <header className="mb-5 flex items-baseline gap-3">
        <span className="font-display text-3xl text-champagne-dark">{step}</span>
        <div>
          <h2 className="font-display text-2xl text-ink">{title}</h2>
          {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
        </div>
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
