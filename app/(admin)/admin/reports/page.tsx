import { RevenueChart } from "@/components/admin/revenue-chart";

export const metadata = { title: "Báo cáo — Admin" };

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Báo cáo doanh thu</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="border border-[color:var(--color-border-soft)] bg-white p-6">
          <h2 className="font-display text-xl mb-4">Doanh thu 30 ngày gần đây</h2>
          <RevenueChart />
        </div>

        <div className="border border-[color:var(--color-border-soft)] bg-white p-6">
          <h2 className="font-display text-xl mb-4">Tổng quan</h2>
          <p className="text-sm text-ink-muted">Biểu đồ recharts sẽ hiển thị ở đây sau khi cài đặt.</p>
          <p className="mt-2 text-xs text-ink-muted">
            Để xem biểu đồ, chạy: <code className="bg-gray-100 px-2 py-1">npm install recharts</code>
          </p>
        </div>
      </div>
    </div>
  );
}
