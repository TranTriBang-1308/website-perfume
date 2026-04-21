import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatVND } from "@/lib/utils";

export const metadata = { title: "Tổng quan — Admin" };

const orderStatusLabel: Record<string, string> = {
  PENDING: "Chờ xử lý",
  CONFIRMED: "Đã xác nhận",
  PROCESSING: "Đang chuẩn bị",
  SHIPPING: "Đang giao",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
  REFUNDED: "Hoàn tiền",
};

export default async function AdminDashboardPage() {
  // Mốc đầu tháng hiện tại (giờ local server)
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [
    totalOrders,
    monthOrders,
    revenueAgg,
    newUsers,
    activeProducts,
    topProducts,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.order.aggregate({
      where: {
        createdAt: { gte: monthStart },
        status: { notIn: ["CANCELLED", "REFUNDED"] },
      },
      _sum: { total: true },
    }),
    prisma.user.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.orderItem.groupBy({
      by: ["productId", "productName"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
    prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderNumber: true,
        total: true,
        status: true,
        createdAt: true,
        user: { select: { name: true, email: true } },
      },
    }),
  ]);

  const revenue = Number(revenueAgg._sum.total ?? 0);

  const stats = [
    { label: "Đơn tháng này", value: monthOrders.toLocaleString("vi-VN") },
    { label: "Doanh thu tháng", value: formatVND(revenue) },
    { label: "Người dùng mới", value: newUsers.toLocaleString("vi-VN") },
    { label: "Sản phẩm đang bán", value: activeProducts.toLocaleString("vi-VN") },
    { label: "Tổng đơn toàn thời gian", value: totalOrders.toLocaleString("vi-VN") },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl">Tổng quan</h1>
        <p className="mt-1 text-sm text-ink-muted">Số liệu trong tháng hiện tại</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="border border-[color:var(--color-border-soft)] bg-white p-5"
          >
            <p className="text-xs uppercase tracking-widest text-ink-muted">{s.label}</p>
            <p className="mt-2 font-display text-2xl">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <section className="border border-[color:var(--color-border-soft)] bg-white">
          <header className="flex items-center justify-between border-b border-[color:var(--color-border-soft)] px-6 py-4">
            <h2 className="font-display text-xl">Đơn hàng gần nhất</h2>
            <Link href="/admin/orders" className="text-xs uppercase tracking-widest text-ink-muted hover:text-ink">
              Xem tất cả →
            </Link>
          </header>
          {recentOrders.length === 0 ? (
            <p className="p-6 text-sm text-ink-muted">Chưa có đơn hàng nào.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-widest text-ink-muted">
                  <th className="px-6 py-3">Mã đơn</th>
                  <th className="px-6 py-3">Khách hàng</th>
                  <th className="px-6 py-3">Trạng thái</th>
                  <th className="px-6 py-3 text-right">Tổng</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr
                    key={o.id}
                    className="border-t border-[color:var(--color-border-soft)]"
                  >
                    <td className="px-6 py-3 font-mono text-xs">{o.orderNumber}</td>
                    <td className="px-6 py-3">
                      {o.user.name ?? o.user.email}
                    </td>
                    <td className="px-6 py-3 text-xs text-ink-muted">
                      {orderStatusLabel[o.status] ?? o.status}
                    </td>
                    <td className="px-6 py-3 text-right font-medium">
                      {formatVND(Number(o.total))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="border border-[color:var(--color-border-soft)] bg-white">
          <header className="flex items-center justify-between border-b border-[color:var(--color-border-soft)] px-6 py-4">
            <h2 className="font-display text-xl">Sản phẩm bán chạy</h2>
          </header>
          {topProducts.length === 0 ? (
            <p className="p-6 text-sm text-ink-muted">Chưa có dữ liệu bán hàng.</p>
          ) : (
            <ol className="divide-y divide-[color:var(--color-border-soft)]">
              {topProducts.map((p, i) => (
                <li key={p.productId} className="flex items-center gap-4 px-6 py-3">
                  <span className="font-display text-lg text-ink-muted w-6">{i + 1}</span>
                  <span className="flex-1 truncate text-sm">{p.productName}</span>
                  <span className="text-xs text-ink-muted">
                    {p._sum.quantity ?? 0} đã bán
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}
