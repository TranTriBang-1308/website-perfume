import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatVND } from "@/lib/utils";

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
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Đơn hàng</h1>
        <p className="mt-1 text-sm text-ink-muted">{total} đơn</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Link
          href="/admin/orders"
          className={`px-3 py-1 text-sm ${!status ? "bg-ink text-white" : "border border-[color:var(--color-border-soft)]"}`}
        >
          Tất cả
        </Link>
        {statuses.map((s) => (
          <Link
            key={s}
            href={`?status=${s}`}
            className={`px-3 py-1 text-sm ${status === s ? "bg-ink text-white" : "border border-[color:var(--color-border-soft)]"}`}
          >
            {statusLabel[s]}
          </Link>
        ))}
      </div>

      <div className="border border-[color:var(--color-border-soft)] bg-white">
        {orders.length === 0 ? (
          <p className="p-6 text-sm text-ink-muted">Không có đơn hàng nào.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest text-ink-muted">
                <th className="px-6 py-3">Mã đơn</th>
                <th className="px-6 py-3">Khách hàng</th>
                <th className="px-6 py-3">Trạng thái</th>
                <th className="px-6 py-3 text-right">Tổng</th>
                <th className="px-6 py-3">Ngày</th>
                <th className="px-6 py-3 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-[color:var(--color-border-soft)]">
                  <td className="px-6 py-3 font-mono text-xs">{o.orderNumber}</td>
                  <td className="px-6 py-3 text-sm">{o.user.name ?? o.user.email}</td>
                  <td className="px-6 py-3 text-xs text-ink-muted">{statusLabel[o.status]}</td>
                  <td className="px-6 py-3 text-right font-medium">{formatVND(Number(o.total))}</td>
                  <td className="px-6 py-3 text-sm text-ink-muted">{new Date(o.createdAt).toLocaleDateString("vi-VN")}</td>
                  <td className="px-6 py-3 text-right">
                    <Link href={`/admin/orders/${o.id}`} className="text-xs uppercase tracking-widest text-ink-muted hover:text-ink">
                      Xem →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <Link
              key={i + 1}
              href={`?status=${status}&page=${i + 1}`}
              className={`px-3 py-1 text-sm ${page === i + 1 ? "bg-ink text-white" : "border border-[color:var(--color-border-soft)]"}`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
