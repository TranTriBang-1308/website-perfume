import Link from "next/link";

type Props = {
  title: string;
  description?: string;
  action?: { href: string; label: string };
  children?: React.ReactNode;
};

export function AdminPageHeader({ title, description, action, children }: Props) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border-soft pb-6">
      <div>
        <h1 className="font-display text-3xl font-light text-ink">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
      </div>
      <div className="flex items-center gap-3">
        {children}
        {action && (
          <Link
            href={action.href}
            className="group inline-flex h-11 items-center gap-2 bg-ink px-5 text-xs font-medium uppercase tracking-[0.18em] text-white shadow-soft transition-all duration-300 ease-luxe hover:bg-ink-soft hover:shadow-luxe"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
            </svg>
            {action.label}
          </Link>
        )}
      </div>
    </header>
  );
}
