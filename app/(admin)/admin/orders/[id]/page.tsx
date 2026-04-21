import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatVND } from "@/lib/utils";
import { OrderStatusForm } from "@/components/admin/order-status-form";

export const metadata = { title: "Chi tiết đơn hàng — Admin" };

type PageProps = { params: Promise<{ id: string }> };

const statusLabel: Record<string, string> = {
  PENDING: "Chờ xử lý",
  CONFIRMED: "Đã xác nhận",
  PROCESSING: "Đang chuẩn bị",
  SHIPPING: "Đang giao",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
  REFUNDED: "Hoàn tiền",
};

const paymentStatusLabel: Record<string, string> = {
  PENDING: "Chờ thanh toán",
  PAID: "Đã thanh toán",
  FAILED: "Thanh toán thất bại",
  REFUNDED: "Đã hoàn tiền",
};

const paymentMethodLabel: Record<string, string> = {
  COD: "Thanh toán khi nhận",
  VNPAY: "VNPay",
  MOMO: "MoMo",
  BANK_TRANSFER: "Chuyển khoản",
};

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, user: true, address: true, payment: true },
  });

  if (!order) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">{order.orderNumber}</h1>
        <p className="mt-1 text-sm text-ink-muted">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[color:var(--color-border-soft)] p-6">
            <h3 className="font-display text-lg mb-4">Sản phẩm</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-widest text-ink-muted">
                  <th className="pb-2">Sản phẩm</th>
                  <th className="pb-2 text-center">SL</th>
                  <th className="pb-2 text-right">Giá</th>
                  <th className="pb-2 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[color:var(--color-border-soft)]">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2">{item.productName}</td>
                    <td className="py-2 text-center">{item.quantity}</td>
                    <td className="py-2 text-right">{formatVND(Number(item.price))}</td>
                    <td className="py-2 text-right font-medium">{formatVND(Number(item.price) * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white border border-[color:var(--color-border-soft)] p-6">
            <h3 className="font-display text-lg mb-4">Địa chỉ giao hàng</h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-ink-muted">Người nhận</dt>
                <dd className="font-medium">{order.address.fullName}</dd>
              </div>
              <div>
                <dt className="text-ink-muted">Điện thoại</dt>
                <dd>{order.address.phone}</dd>
              </div>
              <div>
                <dt className="text-ink-muted">Địa chỉ</dt>
                <dd>{order.address.street}, {order.address.ward}, {order.address.district}, {order.address.province}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-[color:var(--color-border-soft)] p-6">
            <h3 className="font-display text-lg mb-4">Tóm tắt</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-muted">Tạm tính</dt>
                <dd>{formatVND(Number(order.subtotal))}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">Phí ship</dt>
                <dd>{Number(order.shippingFee) > 0 ? formatVND(Number(order.shippingFee)) : "Miễn phí"}</dd>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between">
                  <dt className="text-ink-muted">Giảm giá</dt>
                  <dd>-{formatVND(Number(order.discount))}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-[color:var(--color-border-soft)] pt-2 font-medium">
                <dt>Tổng cộng</dt>
                <dd className="font-display text-lg">{formatVND(Number(order.total))}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white border border-[color:var(--color-border-soft)] p-6 text-sm">
            <h3 className="font-display text-lg mb-4">Thông tin thanh toán</h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-ink-muted">Phương thức</dt>
                <dd>{paymentMethodLabel[order.paymentMethod] ?? order.paymentMethod}</dd>
              </div>
              <div>
                <dt className="text-ink-muted">Trạng thái</dt>
                <dd>{paymentStatusLabel[order.paymentStatus]}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white border border-[color:var(--color-border-soft)] p-6 text-sm">
            <h3 className="font-display text-lg mb-4">Khách hàng</h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-ink-muted">Tên</dt>
                <dd className="font-medium">{order.user.name ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-ink-muted">Email</dt>
                <dd className="font-mono text-xs">{order.user.email}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <OrderStatusForm orderId={order.id} currentStatus={order.status} currentPaymentStatus={order.paymentStatus} />
    </div>
  );
}
