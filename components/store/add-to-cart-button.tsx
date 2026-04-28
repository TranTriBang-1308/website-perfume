"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addGuestCartItem } from "@/lib/guest-cart";

type Props = {
  variantId: string;
  disabled?: boolean;
};

export function AddToCartButton({ variantId, disabled }: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onClick = async () => {
    setLoading(true);
    setMessage(null);
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantId, quantity: 1 }),
    });
    setLoading(false);

    if (res.status === 401) {
      // Chưa đăng nhập → lưu vào localStorage, sync khi login
      addGuestCartItem(variantId, 1);
      setMessage("Đã lưu vào giỏ. Đăng nhập để hoàn tất mua hàng.");
      return;
    }
    if (!res.ok) {
      setMessage("Không thể thêm vào giỏ. Vui lòng thử lại.");
      return;
    }
    setMessage("Đã thêm vào giỏ hàng");
  };

  return (
    <div className="space-y-3">
      <Button onClick={onClick} disabled={disabled || loading} className="w-full" size="lg">
        {disabled ? "Hết hàng" : loading ? "Đang thêm..." : "Thêm vào giỏ"}
      </Button>
      {message && <p className="text-sm text-ink-muted">{message}</p>}
    </div>
  );
}
