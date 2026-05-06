// Top bar mảnh chạy phía trên header — thông điệp marketing & hotline
export function TopBar() {
  return (
    <div className="hidden border-b border-ink-soft bg-ink text-cream md:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-[11px] tracking-[0.18em] sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 text-cream/70">
          <span className="inline-flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5 text-champagne">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h13l3 4v6h-3a2 2 0 11-4 0H9a2 2 0 11-4 0H3V7z" />
            </svg>
            MIỄN PHÍ GIAO HÀNG ĐƠN TỪ 1.500.000₫
          </span>
          <span className="hidden lg:inline-flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5 text-champagne">
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" d="M12 7v5l3 2" />
            </svg>
            ĐỔI TRẢ TRONG 7 NGÀY
          </span>
          <span className="hidden lg:inline-flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5 text-champagne">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M12 22a10 10 0 100-20 10 10 0 000 20z" />
            </svg>
            CAM KẾT CHÍNH HÃNG 100%
          </span>
        </div>
        <div className="flex items-center gap-5 text-cream/70">
          <a href="tel:+84853394026" className="inline-flex items-center gap-2 transition-colors hover:text-champagne">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
              <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.24 1.02l-2.21 2.2z" />
            </svg>
            HOTLINE: 0853 394 026
          </a>
        </div>
      </div>
    </div>
  );
}
