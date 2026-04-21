// Gửi email qua Resend REST API (không cần SDK riêng).
// Nếu RESEND_API_KEY chưa cấu hình → no-op, trả về { skipped: true }.

import { formatVND } from "@/lib/utils";

type SendResult = { ok: boolean; skipped?: boolean; error?: string };

async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    return { ok: false, skipped: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: text };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "unknown" };
  }
}

type OrderConfirmationData = {
  to: string;
  customerName: string | null;
  orderNumber: string;
  items: Array<{ productName: string; quantity: number; price: number }>;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    ward: string;
    district: string;
    province: string;
  };
};

const paymentLabel: Record<string, string> = {
  COD: "Thanh toán khi nhận hàng",
  VNPAY: "VNPay",
  MOMO: "MoMo",
  BANK_TRANSFER: "Chuyển khoản ngân hàng",
};

export async function sendOrderConfirmation(data: OrderConfirmationData) {
  const itemsHtml = data.items
    .map(
      (i) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #e5e0d8">${escapeHtml(i.productName)}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e5e0d8;text-align:center">${i.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e5e0d8;text-align:right">${formatVND(i.price * i.quantity)}</td>
        </tr>`
    )
    .join("");

  const addr = data.shippingAddress;
  const html = `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px;background:#faf7f2;color:#0a0a0a">
      <h1 style="font-size:28px;font-weight:300;margin:0 0 8px">Parfum</h1>
      <p style="color:#6b6b6b;margin:0 0 24px">Cảm ơn ${escapeHtml(data.customerName ?? "quý khách")}!</p>

      <h2 style="font-size:20px;font-weight:400;margin:24px 0 12px">Xác nhận đơn hàng</h2>
      <p style="margin:0 0 4px">Mã đơn: <strong>${escapeHtml(data.orderNumber)}</strong></p>
      <p style="margin:0 0 16px">Phương thức: ${escapeHtml(paymentLabel[data.paymentMethod] ?? data.paymentMethod)}</p>

      <table style="width:100%;border-collapse:collapse;font-size:14px;margin:16px 0">
        <thead>
          <tr>
            <th style="text-align:left;padding:8px 0;border-bottom:2px solid #0a0a0a">Sản phẩm</th>
            <th style="text-align:center;padding:8px 0;border-bottom:2px solid #0a0a0a">SL</th>
            <th style="text-align:right;padding:8px 0;border-bottom:2px solid #0a0a0a">Thành tiền</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <table style="width:100%;font-size:14px;margin:8px 0 24px">
        <tr><td style="padding:4px 0;color:#6b6b6b">Tạm tính</td><td style="text-align:right">${formatVND(data.subtotal)}</td></tr>
        <tr><td style="padding:4px 0;color:#6b6b6b">Phí vận chuyển</td><td style="text-align:right">${data.shippingFee === 0 ? "Miễn phí" : formatVND(data.shippingFee)}</td></tr>
        ${data.discount > 0 ? `<tr><td style="padding:4px 0;color:#6b6b6b">Giảm giá</td><td style="text-align:right">-${formatVND(data.discount)}</td></tr>` : ""}
        <tr><td style="padding:8px 0;border-top:1px solid #e5e0d8"><strong>Tổng cộng</strong></td><td style="text-align:right;border-top:1px solid #e5e0d8"><strong>${formatVND(data.total)}</strong></td></tr>
      </table>

      <h3 style="font-size:16px;font-weight:400;margin:16px 0 8px">Địa chỉ giao hàng</h3>
      <p style="margin:0;font-size:14px;line-height:1.6">
        ${escapeHtml(addr.fullName)} · ${escapeHtml(addr.phone)}<br/>
        ${escapeHtml(addr.street)}, ${escapeHtml(addr.ward)}, ${escapeHtml(addr.district)}, ${escapeHtml(addr.province)}
      </p>

      <p style="margin:32px 0 0;font-size:12px;color:#6b6b6b">
        Email này được gửi tự động. Nếu có thắc mắc, vui lòng liên hệ bộ phận chăm sóc khách hàng.
      </p>
    </div>
  `;

  return sendEmail({
    to: data.to,
    subject: `Xác nhận đơn hàng ${data.orderNumber} — Parfum`,
    html,
  });
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
