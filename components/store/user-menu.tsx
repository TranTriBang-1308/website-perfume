"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";

type Props = { user: Session["user"] | null };

// Icon tài khoản (user + chevron nhỏ khi đã đăng nhập)
function UserIcon({ withChevron }: { withChevron: boolean }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <circle cx="12" cy="8" r="4" />
        <path strokeLinecap="round" d="M4 20c0-4 4-6 8-6s8 2 8 6" />
      </svg>
      {withChevron && (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
          <path d="M7 10l5 5 5-5z" />
        </svg>
      )}
    </span>
  );
}

export function UserMenu({ user }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex flex-col items-center gap-1 text-ink-muted transition-colors hover:text-ink"
      >
        <UserIcon withChevron={false} />
        <span className="text-xs">Đăng nhập</span>
      </Link>
    );
  }

  const displayName = user.name ? user.name.split(" ")[0] : "Tài khoản";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex flex-col items-center gap-1 text-ink-muted transition-colors hover:text-ink"
        aria-label="Tài khoản"
      >
        <UserIcon withChevron />
        <span className="max-w-[80px] truncate text-xs">{displayName}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 border border-[color:var(--color-border-soft)] bg-white py-2 shadow-sm">
          <Link href="/account" className="block px-4 py-2 text-sm hover:bg-cream">
            Tài khoản
          </Link>
          <Link href="/account/orders" className="block px-4 py-2 text-sm hover:bg-cream">
            Đơn hàng của tôi
          </Link>
          <Link href="/account/wishlist" className="block px-4 py-2 text-sm hover:bg-cream">
            Yêu thích
          </Link>
          {user.role === "ADMIN" && (
            <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-cream">
              Quản trị
            </Link>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="block w-full px-4 py-2 text-left text-sm text-burgundy hover:bg-cream"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
