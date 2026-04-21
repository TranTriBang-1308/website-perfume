"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  productId: string;
  initialRating?: number;
  initialComment?: string;
  isEdit?: boolean;
};

export function ReviewForm({ productId, initialRating = 0, initialComment = "", isEdit = false }: Props) {
  const router = useRouter();
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(initialComment);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (rating < 1) {
      setError("Vui lòng chọn số sao");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating, comment: comment || undefined }),
    });
    setLoading(false);

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "Không thể gửi đánh giá");
      return;
    }
    setSuccess(isEdit ? "Đã cập nhật đánh giá" : "Cảm ơn đánh giá của bạn");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 border border-[color:var(--color-border-soft)] bg-white p-6">
      <h3 className="font-display text-xl">
        {isEdit ? "Chỉnh sửa đánh giá" : "Viết đánh giá"}
      </h3>

      <div>
        <label className="block text-xs uppercase tracking-widest text-ink-muted mb-2">Đánh giá</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => {
            const active = n <= (hoverRating || rating);
            return (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                onMouseEnter={() => setHoverRating(n)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`${n} sao`}
                className={cn(
                  "text-2xl transition-colors",
                  active ? "text-champagne" : "text-[color:var(--color-border-soft)]"
                )}
              >
                ★
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="comment" className="block text-xs uppercase tracking-widest text-ink-muted mb-2">
          Nhận xét (tuỳ chọn)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          maxLength={1000}
          className="w-full border border-[color:var(--color-border-soft)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ink"
          placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
        />
      </div>

      {error && <p className="text-sm text-burgundy">{error}</p>}
      {success && <p className="text-sm text-ink">{success}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Đang gửi..." : isEdit ? "Cập nhật" : "Gửi đánh giá"}
      </Button>
    </form>
  );
}
