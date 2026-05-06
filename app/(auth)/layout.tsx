import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-cream px-4 py-12">
      {/* Hoa văn nền tinh tế */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(201, 169, 97, 0.15) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(109, 26, 42, 0.08) 0%, transparent 40%)",
        }}
      />

      <Link
        href="/"
        className="group relative mb-10 flex items-center gap-3 transition-transform duration-300 hover:scale-105"
      >
        <span className="relative flex h-11 w-11 items-center justify-center bg-linear-to-br from-ink to-ink-soft text-champagne shadow-soft ring-1 ring-champagne/30">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
            <circle cx="12" cy="6" r="3" />
            <circle cx="18" cy="12" r="3" />
            <circle cx="12" cy="18" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="12" cy="12" r="2.2" fill="#faf7f2" />
          </svg>
        </span>
        <span className="font-display text-3xl tracking-tight">Whisper of Scent</span>
      </Link>

      <div className="relative w-full max-w-md border border-border-soft bg-white p-8 shadow-luxe sm:p-10 animate-fade-in-up">
        {/* Decorative top accent */}
        <div aria-hidden className="absolute inset-x-0 -top-px h-px bg-linear-to-r from-transparent via-champagne to-transparent" />
        {children}
      </div>

      <p className="relative mt-8 text-center text-xs text-ink-faint">
        © {new Date().getFullYear()} Whisper of Scent · Đẳng cấp hương thơm
      </p>
    </main>
  );
}
