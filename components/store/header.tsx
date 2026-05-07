import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserMenu } from "@/components/store/user-menu";
import { HeaderSearch } from "@/components/store/header-search";
import { TopBar } from "@/components/store/top-bar";

// Logo monogram — chữ "W" lồng trong khung rose-gold mảnh, modern hơn cánh hoa
function LogoMark() {
  return (
    <div className="relative flex h-10 w-10 items-center justify-center rounded-sm bg-ink text-champagne ring-1 ring-champagne/40 shadow-soft">
      <span className="font-display text-xl leading-none italic">W</span>
      <span aria-hidden className="absolute -inset-px rounded-sm border border-champagne/15" />
    </div>
  );
}

function HeaderIconLink({
  href,
  label,
  icon,
  badge,
  className = "",
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={`group relative flex flex-col items-center gap-0.5 text-ink-muted transition-colors duration-300 ease-luxe hover:text-ink ${className}`}
    >
      <span className="relative">
        {icon}
        {badge !== undefined && badge > 0 && (
          <span className="absolute -right-1.5 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-burgundy px-1 text-[10px] font-medium text-white shadow-soft">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </span>
      <span className="text-[10px] tracking-wide">{label}</span>
    </Link>
  );
}

const navLinks: Array<{ href: string; label: string; accent?: boolean }> = [
  { href: "/products?gender=MALE", label: "Nam" },
  { href: "/products?gender=FEMALE", label: "Nữ" },
  { href: "/products?gender=UNISEX", label: "Unisex" },
  { href: "/gift-sets", label: "Set quà tặng" },
  { href: "/accessories", label: "Phụ kiện" },
  { href: "/brands", label: "Thương hiệu" },
  { href: "/sale", label: "Sale", accent: true },
];

export async function Header() {
  const session = await auth();

  const [cartCount, wishlistCount] = session?.user
    ? await Promise.all([
        prisma.cartItem.count({ where: { userId: session.user.id } }),
        prisma.wishlistItem.count({ where: { userId: session.user.id } }),
      ])
    : [0, 0];

  return (
    <header className="sticky top-0 z-40 border-b border-border-soft surface-glass">
      <TopBar />

      {/* Row 1 — brand / search / icon buttons */}
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-6 sm:px-6 lg:gap-10 lg:px-8">
        <Link href="/" className="group flex min-w-0 items-center gap-2.5 shrink">
          <LogoMark />
          <div className="hidden min-w-0 flex-col leading-none sm:flex">
            <span className="font-display text-xl tracking-tight transition-colors duration-300 group-hover:text-champagne-dark">
              Whisper of Scent
            </span>
            <span className="mt-1 text-[9px] uppercase tracking-[0.25em] text-ink-faint">
              Maison de Parfum
            </span>
          </div>
          <span className="truncate font-display text-base leading-none sm:hidden">Whisper of Scent</span>
        </Link>

        <div className="hidden flex-1 md:block">
          <HeaderSearch />
        </div>

        <div className="ml-auto flex items-center gap-3 sm:gap-5 md:gap-6">
          <UserMenu user={session?.user ?? null} />
          <HeaderIconLink
            href={session?.user ? "/account/wishlist" : "/login?callbackUrl=/account/wishlist"}
            label="Yêu thích"
            badge={wishlistCount}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733C11.285 4.876 9.623 3.75 7.688 3.75 5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            }
          />
          <HeaderIconLink
            href="/cart"
            label="Giỏ hàng"
            badge={cartCount}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l2.4 12.3a2 2 0 002 1.7h8.2a2 2 0 002-1.6L22 7H6" />
                <circle cx="9" cy="20" r="1.5" />
                <circle cx="17" cy="20" r="1.5" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Row 2 — primary nav */}
      <nav className="border-t border-border-faint">
        <ul className="mx-auto flex max-w-7xl items-center gap-5 overflow-x-auto px-4 py-2.5 text-[12px] font-medium tracking-[0.08em] sm:gap-7 sm:px-6 lg:justify-center lg:gap-10 lg:px-8">
          {navLinks.map((link) => (
            <li key={link.label} className="shrink-0">
              <Link
                href={link.href}
                className={`group relative inline-block py-1 transition-colors duration-300 ease-luxe ${
                  link.accent
                    ? "text-burgundy hover:text-burgundy-light"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                <span className="relative">
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute -bottom-1 left-1/2 h-px w-0 -translate-x-1/2 transition-all duration-500 ease-luxe group-hover:w-full ${
                      link.accent ? "bg-burgundy" : "bg-champagne"
                    }`}
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Search bar mobile */}
      <div className="border-t border-border-faint px-4 py-2.5 md:hidden">
        <HeaderSearch />
      </div>
    </header>
  );
}
