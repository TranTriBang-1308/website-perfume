"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getGuestCart, clearGuestCart } from "@/lib/guest-cart";

export function GuestCartSync() {
  const { status } = useSession();
  const router = useRouter();
  const done = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || done.current) return;

    const items = getGuestCart();
    if (items.length === 0) {
      done.current = true;
      return;
    }
    done.current = true;

    (async () => {
      try {
        const res = await fetch("/api/cart/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });
        if (res.ok) {
          clearGuestCart();
          router.refresh();
        }
      } catch {
        // Fail silently — giữ lại localStorage để thử lại lần sau
      }
    })();
  }, [status, router]);

  return null;
}
