"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = {
  endpoint: string;
  label?: string;
  confirmMessage?: string;
  onDeletedRedirect?: string;
};

export function DeleteButton({
  endpoint,
  label = "Xóa",
  confirmMessage = "Bạn có chắc muốn xóa?",
  onDeletedRedirect,
}: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onClick = async () => {
    if (!window.confirm(confirmMessage)) return;
    setError(null);
    const res = await fetch(endpoint, { method: "DELETE" });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "Không thể xóa");
      return;
    }
    if (onDeletedRedirect) {
      router.push(onDeletedRedirect);
    }
    startTransition(() => router.refresh());
  };

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onClick}
        disabled={pending}
        className="text-burgundy border-burgundy hover:bg-burgundy"
      >
        {pending ? "Đang xóa..." : label}
      </Button>
      {error && <p className="text-xs text-burgundy">{error}</p>}
    </div>
  );
}
