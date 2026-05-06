"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { addGuestCartItem } from "@/lib/guest-cart";
import { useToast } from "@/components/ui/toast";

type Props = {
  variantId: string;
  disabled?: boolean;
};

export function AddToCartButton({ variantId, disabled }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    setLoading(true);
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantId, quantity: 1 }),
    });
    setLoading(false);

    if (res.status === 401) {
      addGuestCartItem(variantId, 1);
      toast.show("Đã lưu vào giỏ. Đăng nhập để hoàn tất mua hàng.", "info");
      return;
    }
    if (!res.ok) {
      toast.show("Không thể thêm vào giỏ. Vui lòng thử lại.", "error");
      return;
    }
    toast.show("Đã thêm vào giỏ hàng", "success");
    router.refresh();
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      loading={loading}
      className="w-full"
      size="lg"
    >
      {!loading && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l2.4 12.3a2 2 0 002 1.7h8.2a2 2 0 002-1.6L22 7H6" />
          <circle cx="9" cy="20" r="1.5" />
          <circle cx="17" cy="20" r="1.5" />
        </svg>
      )}
      {disabled ? "Hết hàng" : "Thêm vào giỏ"}
    </Button>
  );
}
