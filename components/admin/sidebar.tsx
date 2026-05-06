"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavGroup = {
  label: string;
  items: Array<{
    href: string;
    label: string;
    icon: string;
    exact?: boolean;
  }>;
};

const groups: NavGroup[] = [
  {
    label: "Tổng quan",
    items: [
      {
        href: "/admin",
        label: "Tổng quan",
        exact: true,
        icon: "M3 12l9-9 9 9M5 10v10h14V10",
      },
      {
        href: "/admin/reports",
        label: "Báo cáo",
        icon: "M3 3v18h18M7 14l4-4 4 4 5-5",
      },
    ],
  },
  {
    label: "Bán hàng",
    items: [
      {
        href: "/admin/orders",
        label: "Đơn hàng",
        icon: "M3 6h18M6 6V4a2 2 0 012-2h8a2 2 0 012 2v2M5 6l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14",
      },
      {
        href: "/admin/coupons",
        label: "Mã giảm giá",
        icon: "M9 5l-7 7 7 7M14 5h7v7M21 12L9 24",
      },
    ],
  },
  {
    label: "Sản phẩm",
    items: [
      {
        href: "/admin/products",
        label: "Sản phẩm",
        icon: "M20 7l-8-4-8 4m16 0v10l-8 4m8-14L12 11M4 7v10l8 4M4 7l8 4",
      },
      {
        href: "/admin/brands",
        label: "Thương hiệu",
        icon: "M12 2l3 7h7l-5.5 4 2 7-6.5-4.5L5.5 20l2-7L2 9h7z",
      },
      {
        href: "/admin/categories",
        label: "Danh mục",
        icon: "M4 6h16M4 12h16M4 18h16",
      },
    ],
  },
  {
    label: "Marketing",
    items: [
      {
        href: "/admin/banners",
        label: "Banner Hero",
        icon: "M3 5h18v14H3z M3 5l9 7 9-7",
      },
    ],
  },
  {
    label: "Hệ thống",
    items: [
      {
        href: "/admin/users",
        label: "Người dùng",
        icon: "M16 11a4 4 0 10-8 0 4 4 0 008 0zM12 14c-4 0-7 2-7 5v1h14v-1c0-3-3-5-7-5z",
      },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="space-y-6 text-sm">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-ink-faint">
            {group.label}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-3 px-3 py-2.5 transition-all duration-300 ease-luxe",
                      active
                        ? "bg-ink text-cream shadow-soft"
                        : "text-ink-muted hover:bg-cream-warm/50 hover:text-ink"
                    )}
                  >
                    {active && (
                      <span aria-hidden className="absolute inset-y-1 -left-px w-0.5 bg-champagne" />
                    )}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className={cn(
                        "h-4 w-4 transition-colors",
                        active ? "text-champagne" : "text-ink-faint group-hover:text-champagne-dark"
                      )}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
