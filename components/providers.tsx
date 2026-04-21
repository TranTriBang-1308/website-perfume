"use client";

import { SessionProvider } from "next-auth/react";
import { GuestCartSync } from "@/components/store/guest-cart-sync";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <GuestCartSync />
      {children}
    </SessionProvider>
  );
}
