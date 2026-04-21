"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = {
  orderId: string;
  currentStatus: string;
  currentPaymentStatus: string;
};

const statusOptions = [
  { value: "PENDING", label: "Chờ xử lý" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "PROCESSING", label: "Đang chuẩn bị" },
  { value: "SHIPPING", label: "Đang giao" },
  { value: "DELIVERED", label: "Đã giao" },
  { value: "CANCELLED", label: "Đã hủy" },
  { value: "REFUNDED", label: "Hoàn tiền" },
];

const paymentStatusOptions = [
  { value: "PENDING", label: "Chờ thanh toán" },
  { value: "PAID", label: "Đã thanh toán" },
  { value: "FAILED", label: "Thanh toán thất bại" },
  { value: "REFUNDED", label: "Đã hoàn tiền" },
];

export function OrderStatusForm({ orderId, currentStatus, currentPaymentStatus }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, paymentStatus }),
    });
    setLoading(false);

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "Không thể cập nhật");
      return;
    }
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 bg-white border border-[color:var(--color-border-soft)] p-6">
      <h3 className="font-display text-lg">Cập nhật trạng thái</h3>

      <div>
        <label className="block text-xs uppercase tracking-widest text-ink-muted mb-2">Trạng thái đơn</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border border-[color:var(--color-border-soft)] bg-white px-3 py-2 text-sm"
        >
          {statusOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-ink-muted mb-2">Trạng thái thanh toán</label>
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="w-full border border-[color:var(--color-border-soft)] bg-white px-3 py-2 text-sm"
        >
          {paymentStatusOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-burgundy">{error}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Đang lưu..." : "Cập nhật"}
      </Button>
    </form>
  );
}
