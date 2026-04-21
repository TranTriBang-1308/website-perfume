import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatVND } from "@/lib/utils";

type PageProps = { params: Promise<{ id: string }> };

const statusLabel: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  PROCESSING: "Đang xử lý",
  SHIPPING: "Đang giao",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
  REFUNDED: "Đã hoàn tiền",
};

const paymentLabel: Record<string, string> = {
  COD: "Thanh toán khi nhận hàng",
  VNPAY: "VNPay",
  MOMO: "MoMo",
  BANK_TRANSFER: "Chuyển khoản ngân hàng",
};

export default async function OrderDetailPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, address: true, payment: true },
  });

  if (!order || order.userId !== session.user.id) notFound();

  return (
    <div>
      <Link href="/account/orders" className="text-xs uppercase tracking-widest text-ink-muted hover:text-ink">
        ← Quay lại danh sách
      </Link>

      <div className="mt-4 flex items-start justify-between">
        <div>
          <h2 className="font-display text-3xl">Đơn #{order.orderNumber}</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Đặt ngày {order.createdAt.toLocaleDateString("vi-VN")}
          </p>
        </div>
        <span className="border border-ink px-3 py-1 text-xs uppercase tracking-widest">
          {statusLabel[order.status]}
        </span>
      </div>

      <div className="mt-8 bg-white border border-[color:var(--color-border-soft)] p-6">
        <h3 className="font-display text-xl">Sản phẩm</h3>
        <ul className="mt-4 space-y-4">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between border-b border-[color:var(--color-border-soft)] pb-3 text-sm">
              <div>
                <p className="font-medium">{item.productName}</p>
                <p className="text-ink-muted">Số lượng: {item.quantity}</p>
              </div>
              <p>{formatVND(Number(item.price) * item.quantity)}</p>
            </li>
          ))}
        </ul>

        <dl className="mt-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-muted">Tạm tính</dt>
            <dd>{formatVND(Number(order.subtotal))}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-muted">Vận chuyển</dt>
            <dd>{Number(order.shippingFee) === 0 ? "Miễn phí" : formatVND(Number(order.shippingFee))}</dd>
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

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="bg-white border border-[color:var(--color-border-soft)] p-6 text-sm">
          <h3 className="text-xs uppercase tracking-widest text-ink-muted">Địa chỉ giao hàng</h3>
          <p className="mt-2 font-medium">
            {order.address.fullName} · {order.address.phone}
          </p>
          <p className="text-ink-muted">
            {order.address.street}, {order.address.ward}, {order.address.district}, {order.address.province}
          </p>
        </div>

        <div className="bg-white border border-[color:var(--color-border-soft)] p-6 text-sm">
          <h3 className="text-xs uppercase tracking-widest text-ink-muted">Thanh toán</h3>
          <p className="mt-2 font-medium">{paymentLabel[order.paymentMethod]}</p>
          <p className="text-ink-muted">
            Trạng thái: {order.paymentStatus === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
          </p>
          {order.note && (
            <>
              <h3 className="mt-4 text-xs uppercase tracking-widest text-ink-muted">Ghi chú</h3>
              <p className="mt-2 text-ink-muted">{order.note}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
