import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatVND } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/page-header";

export const metadata = { title: "Đơn hàng — Admin" };

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const statusLabel: Record<string, string> = {
  PENDING: "Chờ xử lý",
  CONFIRMED: "Đã xác nhận",
  PROCESSING: "Đang chuẩn bị",
  SHIPPING: "Đang giao",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
  REFUNDED: "Hoàn tiền",
};

const statusStyle: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-indigo-50 text-indigo-700 border-indigo-200",
  SHIPPING: "bg-purple-50 text-purple-700 border-purple-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
  REFUNDED: "bg-slate-100 text-slate-700 border-slate-200",
};

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const status = typeof raw.status === "string" ? raw.status : "";
  const page = Math.max(1, Number(raw.page) || 1);
  const limit = 20;

  const validStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPING", "DELIVERED", "CANCELLED", "REFUNDED"];
  const where = status && validStatuses.includes(status) ? { status: status as any } : {};
  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: { select: { name: true, email: true } },
      },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);
  const statuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPING", "DELIVERED", "CANCELLED", "REFUNDED"];

  return (
    <div className="space-y-6 animate-fade-in">
      <AdminPageHeader
        title="Đơn hàng"
        description={`${total.toLocaleString("vi-VN")} đơn hàng`}
      />

      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/orders"
          className={`inline-flex h-9 items-center px-4 text-xs uppercase tracking-[0.18em] transition-all duration-300 ${
            !status
              ? "bg-ink text-white shadow-soft"
              : "border border-border-soft bg-white text-ink-muted hover:border-ink hover:text-ink"
          }`}
        >
          Tất cả
        </Link>
        {statuses.map((s) => (
          <Link
            key={s}
            href={`?status=${s}`}
            className={`inline-flex h-9 items-center px-4 text-xs uppercase tracking-[0.18em] transition-all duration-300 ${
              status === s
                ? "bg-ink text-white shadow-soft"
                : "border border-border-soft bg-white text-ink-muted hover:border-ink hover:text-ink"
            }`}
          >
            {statusLabel[s]}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden border border-border-soft bg-white shadow-soft">
        {orders.length === 0 ? (
          <p className="p-12 text-center text-sm text-ink-muted">Không có đơn hàng nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-warm/40">
                <tr className="text-left text-[10px] uppercase tracking-[0.2em] text-ink-muted">
                  <th className="px-6 py-3 font-medium">Mã đơn</th>
                  <th className="px-6 py-3 font-medium">Khách hàng</th>
                  <th className="px-6 py-3 font-medium">Trạng thái</th>
                  <th className="px-6 py-3 text-right font-medium">Tổng</th>
                  <th className="px-6 py-3 font-medium">Ngày</th>
                  <th className="px-6 py-3 text-right font-medium">Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr
                    key={o.id}
                    className="border-t border-border-soft transition-colors hover:bg-cream-warm/30"
                  >
                    <td className="px-6 py-3.5 font-mono text-xs text-ink">{o.orderNumber}</td>
                    <td className="px-6 py-3.5 text-sm">
                      <p className="font-medium text-ink">{o.user.name ?? "—"}</p>
                      <p className="text-[11px] text-ink-faint">{o.user.email}</p>
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center border px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] ${
                          statusStyle[o.status] ?? "bg-cream-warm text-ink-muted border-border-soft"
                        }`}
                      >
                        {statusLabel[o.status]}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right font-medium">
                      {formatVND(Number(o.total))}
                    </td>
                    <td className="px-6 py-3.5 text-sm text-ink-muted">
                      {new Date(o.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="text-[11px] uppercase tracking-[0.18em] text-ink-muted transition-colors hover:text-champagne-dark"
                      >
                        Xem →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => (
            <Link
              key={i + 1}
              href={`?status=${status}&page=${i + 1}`}
              className={`min-w-9 px-3 py-1.5 text-center text-sm transition-colors ${
                page === i + 1
                  ? "bg-ink text-white shadow-soft"
                  : "border border-border-soft bg-white text-ink-muted hover:border-ink hover:text-ink"
              }`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
