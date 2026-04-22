"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Tổng quan", exact: true },
  { href: "/admin/products", label: "Sản phẩm" },
  { href: "/admin/orders", label: "Đơn hàng" },
  { href: "/admin/users", label: "Người dùng" },
  { href: "/admin/brands", label: "Thương hiệu" },
  { href: "/admin/categories", label: "Danh mục" },
  { href: "/admin/banners", label: "Banner Hero" },
  { href: "/admin/coupons", label: "Mã giảm giá" },
  { href: "/admin/reports", label: "Báo cáo" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="mt-8 flex flex-col gap-1 text-sm">
      {items.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "px-3 py-2 transition-colors",
              active
                ? "bg-ink text-white"
                : "text-ink-muted hover:bg-ink/5 hover:text-ink"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
