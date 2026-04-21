import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatVND } from "@/lib/utils";

export const metadata = { title: "Đơn hàng của tôi — Parfum" };

const statusLabel: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  PROCESSING: "Đang xử lý",
  SHIPPING: "Đang giao",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
  REFUNDED: "Đã hoàn tiền",
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account/orders");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: { take: 3 } },
  });

  if (orders.length === 0) {
    return (
      <div className="bg-white border border-[color:var(--color-border-soft)] p-10 text-center">
        <p className="font-display text-2xl">Bạn chưa có đơn hàng nào</p>
        <Link
          href="/products"
          className="mt-6 inline-flex h-11 items-center bg-ink px-6 text-sm font-medium text-white hover:bg-ink/90"
        >
          Khám phá sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/account/orders/${order.id}`}
          className="block bg-white border border-[color:var(--color-border-soft)] p-5 hover:border-ink"
        >
          <div className="flex items-center justify-between border-b border-[color:var(--color-border-soft)] pb-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-ink-muted">
                {order.orderNumber}
              </p>
              <p className="text-xs text-ink-muted">
                {order.createdAt.toLocaleDateString("vi-VN")}
              </p>
            </div>
            <span className="border border-ink px-3 py-1 text-xs uppercase tracking-widest">
              {statusLabel[order.status]}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-ink-muted">
              {order.items.length} sản phẩm
              {order.items[0] && ` · ${order.items[0].productName}`}
              {order.items.length > 1 && `, ...`}
            </p>
            <p className="font-display text-lg">{formatVND(Number(order.total))}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
