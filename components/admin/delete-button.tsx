"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  endpoint: string;
  label?: string;
  confirmMessage?: string;
  onDeletedRedirect?: string;
};

export function DeleteButton({
  endpoint,
  label = "Xóa",
  confirmMessage = "Bạn có chắc muốn xóa? Hành động này không thể hoàn tác.",
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
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className="inline-flex h-7 items-center gap-1 px-2 text-[11px] uppercase tracking-[0.18em] text-ink-faint transition-colors hover:text-burgundy disabled:opacity-50"
      >
        {pending ? (
          <>
            <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ...
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            </svg>
            {label}
          </>
        )}
      </button>
      {error && <p className="text-xs text-burgundy">{error}</p>}
    </div>
  );
}
