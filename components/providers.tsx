"use client";

import { SessionProvider } from "next-auth/react";
import { GuestCartSync } from "@/components/store/guest-cart-sync";
import { ToastProvider } from "@/components/ui/toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <GuestCartSync />
        {children}
      </ToastProvider>
    </SessionProvider>
  );
}
