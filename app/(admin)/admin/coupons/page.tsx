import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatVND } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";

export const metadata = { title: "Mã giảm giá — Admin" };

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Mã giảm giá</h1>
          <p className="mt-1 text-sm text-ink-muted">{coupons.length} mã</p>
        </div>
        <Link href="/admin/coupons/new">
          <Button>+ Tạo mã</Button>
        </Link>
      </header>

      <div className="border border-[color:var(--color-border-soft)] bg-white">
        {coupons.length === 0 ? (
          <p className="p-6 text-sm text-ink-muted">Chưa có mã nào.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest text-ink-muted">
                <th className="px-6 py-3">Mã</th>
                <th className="px-6 py-3">Loại</th>
                <th className="px-6 py-3 text-right">Giá trị</th>
                <th className="px-6 py-3 text-center">Đã dùng</th>
                <th className="px-6 py-3">Hạn</th>
                <th className="px-6 py-3 text-center">Trạng thái</th>
                <th className="px-6 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => {
                const now = new Date();
                const expired = now > c.expiresAt;
                return (
                  <tr key={c.id} className="border-t border-[color:var(--color-border-soft)]">
                    <td className="px-6 py-3 font-mono font-medium">{c.code}</td>
                    <td className="px-6 py-3 text-xs text-ink-muted">
                      {c.discountType === "PERCENTAGE" ? "%" : "VND"}
                    </td>
                    <td className="px-6 py-3 text-right">
                      {c.discountType === "PERCENTAGE"
                        ? `${Number(c.discountValue)}%`
                        : formatVND(Number(c.discountValue))}
                    </td>
                    <td className="px-6 py-3 text-center text-ink-muted">
                      {c.usedCount}
                      {c.usageLimit ? `/${c.usageLimit}` : ""}
                    </td>
                    <td className="px-6 py-3 text-xs text-ink-muted">
                      {c.expiresAt.toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-3 text-center text-xs">
                      {!c.isActive ? (
                        <span className="text-ink-muted">Tắt</span>
                      ) : expired ? (
                        <span className="text-burgundy">Hết hạn</span>
                      ) : (
                        <span>Active</span>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/coupons/${c.id}`}
                          className="text-xs uppercase tracking-widest text-ink-muted hover:text-ink"
                        >
                          Sửa
                        </Link>
                        <DeleteButton
                          endpoint={`/api/admin/coupons/${c.id}`}
                          confirmMessage={`Xóa mã "${c.code}"?`}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
