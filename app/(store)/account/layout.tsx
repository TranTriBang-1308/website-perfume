import Link from "next/link";

const links = [
  { href: "/account", label: "Tài khoản", icon: "M16 11a4 4 0 10-8 0 4 4 0 008 0zM12 14c-4 0-7 2-7 5v1h14v-1c0-3-3-5-7-5z" },
  { href: "/account/orders", label: "Đơn hàng", icon: "M3 6h18M6 6V4a2 2 0 012-2h8a2 2 0 012 2v2M5 6l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14" },
  { href: "/account/addresses", label: "Địa chỉ", icon: "M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" },
  { href: "/account/wishlist", label: "Yêu thích", icon: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733C11.285 4.876 9.623 3.75 7.688 3.75 5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" },
  { href: "/account/security", label: "Bảo mật", icon: "M12 15v2m0-10a4 4 0 014 4v3H8v-3a4 4 0 014-4zM6 11h12v9H6z" },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="border-b border-border-soft pb-6">
        <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.3em] text-champagne-dark">
          <span aria-hidden className="h-px w-10 bg-champagne" />
          Cá nhân
        </p>
        <h1 className="mt-3 font-display text-4xl font-light leading-tight sm:text-5xl">Tài khoản của tôi</h1>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[260px_1fr]">
        <aside>
          <nav>
            <ul className="space-y-1 border border-border-soft bg-white shadow-soft">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group flex items-center gap-3 px-4 py-3 text-sm text-ink-muted transition-all duration-300 ease-luxe hover:bg-cream-warm/40 hover:text-ink"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="h-4 w-4 text-ink-faint transition-colors group-hover:text-champagne-dark"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d={l.icon} />
                    </svg>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
