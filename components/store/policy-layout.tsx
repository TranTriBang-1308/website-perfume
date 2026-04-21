import Link from "next/link";

interface Props {
  title: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export function PolicyLayout({ title, lastUpdated, children }: Props) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <nav className="mb-8 text-xs text-ink-muted">
        <Link href="/" className="hover:text-ink">
          Trang chủ
        </Link>
        <span className="mx-2">›</span>
        <span>{title}</span>
      </nav>

      <header className="mb-10 border-b border-border-soft pb-6">
        <h1 className="font-display text-3xl text-ink">{title}</h1>
        {lastUpdated && (
          <p className="mt-2 text-xs text-ink-muted">
            Cập nhật lần cuối: {lastUpdated}
          </p>
        )}
      </header>

      <div className="space-y-8">{children}</div>
    </main>
  );
}
