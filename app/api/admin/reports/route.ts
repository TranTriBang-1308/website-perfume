import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  // Doanh thu 30 ngày gần đây
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: thirtyDaysAgo },
      status: { notIn: ["CANCELLED", "REFUNDED"] },
    },
    select: { total: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  // Group by date
  const dailyMap = new Map<string, number>();
  orders.forEach((o) => {
    const date = o.createdAt.toLocaleDateString("vi-VN");
    dailyMap.set(date, (dailyMap.get(date) || 0) + Number(o.total));
  });

  const daily = Array.from(dailyMap, ([date, revenue]) => ({ date, revenue }));

  return NextResponse.json({ data: { daily } });
}
