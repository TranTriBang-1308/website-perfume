// Tháp hương 3 tầng — visualization sang trọng hơn list <dl>.
// Tách hương thành chips, mỗi tầng có icon riêng và màu theo độ đậm.

type Props = {
  topNotes: string | null;
  middleNotes: string | null;
  baseNotes: string | null;
};

const tiers = [
  {
    key: "top",
    label: "Hương đầu",
    sub: "First impression — 15-30 phút đầu",
    icon: "M12 2C8 6 6 9 6 13a6 6 0 1012 0c0-4-2-7-6-11z",
    accent: "text-champagne-light",
    width: "w-[60%]",
  },
  {
    key: "middle",
    label: "Hương giữa",
    sub: "Heart — 2-4 giờ tiếp theo",
    icon: "M12 21l-1.5-1.4C5 15 2 12 2 8.5 2 5.5 4.5 3 7.5 3c1.7 0 3.4.8 4.5 2 1.1-1.2 2.8-2 4.5-2C19.5 3 22 5.5 22 8.5c0 3.5-3 6.5-8.5 11.1L12 21z",
    accent: "text-champagne",
    width: "w-[80%]",
  },
  {
    key: "base",
    label: "Hương cuối",
    sub: "Base — kéo dài 6+ giờ",
    icon: "M3 21h18M5 21V11l7-7 7 7v10",
    accent: "text-champagne-dark",
    width: "w-full",
  },
] as const;

function NoteChips({ value }: { value: string | null }) {
  if (!value) return <span className="text-xs italic text-ink-faint">Đang cập nhật…</span>;
  // Tách theo dấu phẩy để hiển thị chip
  const items = value.split(",").map((s) => s.trim()).filter(Boolean);
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((n) => (
        <span
          key={n}
          className="inline-flex items-center rounded-full border border-border-soft bg-cream-warm/60 px-2.5 py-0.5 text-[11px] text-ink"
        >
          {n}
        </span>
      ))}
    </div>
  );
}

export function NotesPyramid({ topNotes, middleNotes, baseNotes }: Props) {
  if (!topNotes && !middleNotes && !baseNotes) return null;

  const valueByKey: Record<"top" | "middle" | "base", string | null> = {
    top: topNotes,
    middle: middleNotes,
    base: baseNotes,
  };

  return (
    <div className="rounded-sm border border-border-soft bg-paper p-5 shadow-soft sm:p-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-champagne/12 text-champagne-dark">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8 6 6 9 6 13a6 6 0 1012 0c0-4-2-7-6-11z" />
          </svg>
        </span>
        <div>
          <h3 className="font-grotesk text-sm font-semibold text-ink">Tháp hương</h3>
          <p className="text-[11px] text-ink-faint">3 tầng từ tươi mát đến trầm ấm</p>
        </div>
      </div>

      <ol className="mt-5 space-y-4">
        {tiers.map((t) => (
          <li key={t.key} className="relative">
            <div className="flex items-start gap-3">
              <span className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cream-warm ${t.accent}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d={t.icon} />
                </svg>
              </span>
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-grotesk text-sm font-medium text-ink">{t.label}</p>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-ink-faint">{t.sub}</p>
                </div>
                <div className="mt-2">
                  <NoteChips value={valueByKey[t.key]} />
                </div>
                {/* Thanh tiến độ tỉ lệ độ kéo dài */}
                <div className="mt-3 h-px w-full overflow-hidden bg-border-faint">
                  <div className={`h-full bg-linear-to-r from-champagne-light to-champagne-dark ${t.width}`} />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
