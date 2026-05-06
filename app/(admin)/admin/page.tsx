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

const orderStatusStyle: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-indigo-50 text-indigo-700 border-indigo-200",
  SHIPPING: "bg-purple-50 text-purple-700 border-purple-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
  REFUNDED: "bg-slate-100 text-slate-700 border-slate-200",
};

export default async function AdminDashboardPage() {
  // Mốc đầu tháng + tháng trước để so sánh xu hướng
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const prevMonthStart = new Date(monthStart);
  prevMonthStart.setMonth(prevMonthStart.getMonth() - 1);

  const [
    totalOrders,
    monthOrders,
    prevMonthOrders,
    revenueAgg,
    prevRevenueAgg,
    newUsers,
    prevNewUsers,
    activeProducts,
    topProducts,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.order.count({
      where: { createdAt: { gte: prevMonthStart, lt: monthStart } },
    }),
    prisma.order.aggregate({
      where: {
        createdAt: { gte: monthStart },
        status: { notIn: ["CANCELLED", "REFUNDED"] },
      },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: {
        createdAt: { gte: prevMonthStart, lt: monthStart },
        status: { notIn: ["CANCELLED", "REFUNDED"] },
      },
      _sum: { total: true },
    }),
    prisma.user.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.user.count({
      where: { createdAt: { gte: prevMonthStart, lt: monthStart } },
    }),
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
  const prevRevenue = Number(prevRevenueAgg._sum.total ?? 0);

  const trend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const stats = [
    {
      label: "Đơn tháng này",
      value: monthOrders.toLocaleString("vi-VN"),
      delta: trend(monthOrders, prevMonthOrders),
      icon: "M3 6h18M6 6V4a2 2 0 012-2h8a2 2 0 012 2v2M5 6l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14",
    },
    {
      label: "Doanh thu tháng",
      value: formatVND(revenue),
      delta: trend(revenue, prevRevenue),
      icon: "M12 1v22M5 8h14M5 16h14",
      accent: true,
    },
    {
      label: "Người dùng mới",
      value: newUsers.toLocaleString("vi-VN"),
      delta: trend(newUsers, prevNewUsers),
      icon: "M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
    },
    {
      label: "Sản phẩm đang bán",
      value: activeProducts.toLocaleString("vi-VN"),
      icon: "M20 7l-8-4-8 4m16 0v10l-8 4m8-14L12 11M4 7v10l8 4M4 7l8 4",
    },
    {
      label: "Tổng đơn",
      value: totalOrders.toLocaleString("vi-VN"),
      icon: "M3 3v18h18M7 14l4-4 4 4 5-5",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-light">Tổng quan</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Số liệu tháng hiện tại · cập nhật theo thời gian thực
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`group relative overflow-hidden border bg-white p-5 shadow-soft transition-all duration-300 ease-luxe hover:shadow-luxe hover:-translate-y-0.5 ${
              s.accent ? "border-champagne" : "border-border-soft"
            }`}
          >
            {s.accent && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 100% 0%, rgba(201, 169, 97, 0.25) 0%, transparent 60%)",
                }}
              />
            )}
            <div className="relative flex items-start justify-between">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-faint">
                {s.label}
              </p>
              <span
                className={`flex h-8 w-8 items-center justify-center transition-colors ${
                  s.accent
                    ? "bg-champagne/15 text-champagne-dark"
                    : "bg-cream-warm text-ink-muted group-hover:bg-cream group-hover:text-champagne-dark"
                }`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                </svg>
              </span>
            </div>
            <p className="relative mt-3 font-display text-2xl text-ink">{s.value}</p>
            {s.delta !== undefined && (
              <p
                className={`relative mt-2 inline-flex items-center gap-1 text-xs ${
                  s.delta > 0 ? "text-emerald-700" : s.delta < 0 ? "text-burgundy" : "text-ink-faint"
                }`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3">
                  {s.delta >= 0 ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17l5-5 5 5M7 11l5-5 5 5" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7l5 5 5-5M7 13l5 5 5-5" />
                  )}
                </svg>
                {s.delta > 0 && "+"}
                {s.delta}% so với tháng trước
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Recent orders */}
        <section className="border border-border-soft bg-white shadow-soft">
          <header className="flex items-center justify-between border-b border-border-soft px-6 py-4">
            <div>
              <h2 className="font-display text-xl">Đơn hàng gần nhất</h2>
              <p className="text-xs text-ink-faint">8 đơn mới nhất</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-[11px] uppercase tracking-[0.2em] text-ink-muted transition-colors hover:text-champagne-dark"
            >
              Xem tất cả →
            </Link>
          </header>
          {recentOrders.length === 0 ? (
            <p className="p-12 text-center text-sm text-ink-muted">Chưa có đơn hàng nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-cream-warm/40">
                  <tr className="text-left text-[10px] uppercase tracking-[0.2em] text-ink-muted">
                    <th className="px-6 py-3 font-medium">Mã đơn</th>
                    <th className="px-6 py-3 font-medium">Khách hàng</th>
                    <th className="px-6 py-3 font-medium">Trạng thái</th>
                    <th className="px-6 py-3 text-right font-medium">Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr
                      key={o.id}
                      className="border-t border-border-soft transition-colors hover:bg-cream-warm/30"
                    >
                      <td className="px-6 py-3.5 font-mono text-xs text-ink">{o.orderNumber}</td>
                      <td className="px-6 py-3.5">{o.user.name ?? o.user.email}</td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex items-center border px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] ${
                            orderStatusStyle[o.status] ?? "bg-cream-warm text-ink-muted border-border-soft"
                          }`}
                        >
                          {orderStatusLabel[o.status] ?? o.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right font-medium">
                        {formatVND(Number(o.total))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Top products */}
        <section className="border border-border-soft bg-white shadow-soft">
          <header className="flex items-center justify-between border-b border-border-soft px-6 py-4">
            <div>
              <h2 className="font-display text-xl">Bán chạy</h2>
              <p className="text-xs text-ink-faint">Top 5 sản phẩm</p>
            </div>
            <Link
              href="/admin/products"
              className="text-[11px] uppercase tracking-[0.2em] text-ink-muted transition-colors hover:text-champagne-dark"
            >
              Quản lý →
            </Link>
          </header>
          {topProducts.length === 0 ? (
            <p className="p-12 text-center text-sm text-ink-muted">Chưa có dữ liệu bán hàng.</p>
          ) : (
            <ol className="divide-y divide-border-soft">
              {topProducts.map((p, i) => (
                <li
                  key={p.productId}
                  className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-cream-warm/30"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center font-display text-lg ${
                      i === 0
                        ? "bg-champagne text-ink"
                        : i === 1
                          ? "bg-cream-warm text-ink-muted"
                          : "bg-cream text-ink-faint"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="flex-1 truncate text-sm text-ink">{p.productName}</span>
                  <span className="shrink-0 text-xs text-ink-muted">
                    <span className="font-display text-base text-ink">{p._sum.quantity ?? 0}</span> đã bán
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
