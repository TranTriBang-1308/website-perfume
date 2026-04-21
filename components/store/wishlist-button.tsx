"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

type Props = {
  productId: string;
  initialInWishlist?: boolean;
  className?: string;
  variant?: "icon" | "full";
};

export function WishlistButton({
  productId,
  initialInWishlist = false,
  className,
  variant = "icon",
}: Props) {
  const router = useRouter();
  const { status } = useSession();
  const [inWishlist, setInWishlist] = useState(initialInWishlist);
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();

  const onClick = async () => {
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setLoading(true);
    const res = await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    setLoading(false);

    if (res.ok) {
      const json = await res.json();
      setInWishlist(json.data.inWishlist);
      startTransition(() => router.refresh());
    }
  };

  // Heart icon SVG (filled / outline)
  const Icon = inWishlist ? (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 21s-7-4.5-9.5-9C.5 8 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.5 4 4.5 8-2.5 4.5-9.5 9-9.5 9z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  );

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        aria-label={inWishlist ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center border border-[color:var(--color-border-soft)] bg-white transition-colors",
          inWishlist ? "text-burgundy" : "text-ink-muted hover:text-ink",
          className
        )}
      >
        {Icon}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={cn(
        "inline-flex items-center gap-2 border px-6 py-3 text-sm transition-colors",
        inWishlist
          ? "border-burgundy text-burgundy"
          : "border-ink text-ink hover:bg-ink hover:text-white",
        className
      )}
    >
      {Icon}
      <span>{inWishlist ? "Đã yêu thích" : "Yêu thích"}</span>
    </button>
  );
}
