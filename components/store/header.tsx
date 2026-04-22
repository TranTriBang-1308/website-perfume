import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserMenu } from "@/components/store/user-menu";
import { HeaderSearch } from "@/components/store/header-search";

// Logo hình hoa tinh giản, dùng champagne-on-ink cho cảm giác sang trọng
function LogoMark() {
  return (
    <div className="relative flex h-11 w-11 items-center justify-center bg-ink text-champagne">
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <circle cx="12" cy="6" r="3" />
        <circle cx="18" cy="12" r="3" />
        <circle cx="12" cy="18" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="12" cy="12" r="2.2" fill="#faf7f2" />
      </svg>
    </div>
  );
}

// Icon + label cho nút phải header (dùng chung cho Cửa hàng, Hỗ trợ, Yêu thích, Giỏ hàng)
function HeaderIconLink({
  href,
  label,
  icon,
  badge,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col items-center gap-1 text-ink-muted transition-colors hover:text-ink"
    >
      <span className="relative">
        {icon}
        {badge !== undefined && badge > 0 && (
          <span className="absolute -right-2 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-burgundy px-1 text-[10px] font-medium text-white">
            {badge}
          </span>
        )}
      </span>
      <span className="text-xs">{label}</span>
    </Link>
  );
}

const navLinks: Array<{ href: string; label: string; accent?: boolean }> = [
  { href: "/products", label: "TƯ VẤN CHỌN" },
  { href: "/products?onSale=true&sort=price-asc", label: "HOT DEALS", accent: true },
  { href: "/brands", label: "THƯƠNG HIỆU" },
  { href: "/products?gender=MALE", label: "NƯỚC HOA NAM" },
  { href: "/products?gender=FEMALE", label: "NƯỚC HOA NỮ" },
  { href: "/products?gender=UNISEX", label: "NƯỚC HOA UNISEX" },
  { href: "/products", label: "SET QUÀ TẶNG" },
  { href: "/products", label: "PHỤ KIỆN" },
];

export async function Header() {
  const session = await auth();

  // Lấy số lượng giỏ + yêu thích song song khi đã đăng nhập
  const [cartCount, wishlistCount] = session?.user
    ? await Promise.all([
        prisma.cartItem.count({ where: { userId: session.user.id } }),
        prisma.wishlistItem.count({ where: { userId: session.user.id } }),
      ])
    : [0, 0];

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--color-border-soft)] bg-cream/95 backdrop-blur">
      {/* Row 1 — brand / search / icon buttons */}
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-4 sm:px-6 lg:gap-10 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="hidden flex-col sm:flex">
            <span className="text-[10px] uppercase tracking-[0.25em] text-ink-muted">
              Chào mừng đến với
            </span>
            <div className="mt-1 flex items-center gap-3">
              <LogoMark />
              <span className="font-display text-2xl leading-none tracking-tight">
                Whisper of Scent
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:hidden">
            <LogoMark />
            <span className="font-display text-lg leading-none">Whisper of Scent</span>
          </div>
        </Link>

        {/* Search */}
        <div className="hidden flex-1 md:block">
          <HeaderSearch />
        </div>

        {/* Icon buttons */}
        <div className="flex items-center gap-5 md:gap-7">
          <HeaderIconLink
            href="/products"
            label="Cửa hàng"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-7-7-12a7 7 0 1114 0c0 5-7 12-7 12z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
            }
          />
          <HeaderIconLink
            href="/search"
            label="Hỗ trợ"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
                <circle cx="12" cy="12" r="9" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 9a2.5 2.5 0 115 0c0 1.5-2.5 2-2.5 3.5" />
                <circle cx="12" cy="17" r="0.5" fill="currentColor" />
              </svg>
            }
          />
          <UserMenu user={session?.user ?? null} />
          <HeaderIconLink
            href={session?.user ? "/account/wishlist" : "/login?callbackUrl=/account/wishlist"}
            label="Yêu thích"
            badge={wishlistCount}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l2.4 12.3a2 2 0 002 1.7h8.2a2 2 0 002-1.6L22 7H6" />
                <circle cx="9" cy="20" r="1.5" />
                <circle cx="17" cy="20" r="1.5" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Row 2 — primary nav */}
      <nav className="border-t border-[color:var(--color-border-soft)]">
        <ul className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-4 py-3 text-xs font-medium uppercase tracking-[0.15em] sm:gap-8 sm:px-6 lg:justify-center lg:gap-12 lg:px-8">
          {navLinks.map((link) => (
            <li key={link.label} className="shrink-0">
              <Link
                href={link.href}
                className={`group relative inline-block py-1 transition-colors ${
                  link.accent
                    ? "text-burgundy hover:text-burgundy"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                <span className="relative">
                  {link.label}
                  {/* Gạch chân sang trọng: bung ra từ giữa, dùng champagne cho mục thường, burgundy cho Hot Deals */}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute -bottom-1 left-1/2 h-px w-0 -translate-x-1/2 transition-all duration-500 ease-out group-hover:w-full ${
                      link.accent ? "bg-burgundy" : "bg-champagne"
                    }`}
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Search bar (mobile, below nav) */}
      <div className="border-t border-[color:var(--color-border-soft)] px-4 py-3 md:hidden">
        <HeaderSearch />
      </div>
    </header>
  );
}
