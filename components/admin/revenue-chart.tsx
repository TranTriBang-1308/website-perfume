"use client";

import { useEffect, useState } from "react";
import { formatVND } from "@/lib/utils";

interface DailyRevenue {
  date: string;
  revenue: number;
}

export function RevenueChart() {
  const [dailyData, setDailyData] = useState<DailyRevenue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/reports")
      .then((res) => res.json())
      .then((json) => {
        setDailyData(json.data?.daily ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-ink-muted">Đang tải...</p>;
  if (dailyData.length === 0) return <p className="text-sm text-ink-muted">Chưa có dữ liệu.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-widest text-ink-muted">
            <th className="pb-2">Ngày</th>
            <th className="pb-2 text-right">Doanh thu</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[color:var(--color-border-soft)]">
          {dailyData.map((d, i) => (
            <tr key={i}>
              <td className="py-2">{d.date}</td>
              <td className="py-2 text-right font-medium">{formatVND(d.revenue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
