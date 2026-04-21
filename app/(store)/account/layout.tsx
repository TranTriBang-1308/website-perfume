import Link from "next/link";

const links = [
  { href: "/account", label: "Tài khoản" },
  { href: "/account/orders", label: "Đơn hàng" },
  { href: "/account/addresses", label: "Địa chỉ" },
  { href: "/account/wishlist", label: "Yêu thích" },
  { href: "/account/security", label: "Bảo mật" },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl sm:text-5xl">Tài khoản của tôi</h1>
      <div className="mt-10 grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside>
          <ul className="space-y-3 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-ink-muted hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
