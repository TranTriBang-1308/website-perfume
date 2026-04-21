import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 py-12">
      <Link href="/" className="mb-10 font-display text-3xl tracking-tight">
        Parfum
      </Link>
      <div className="w-full max-w-md bg-white border border-[color:var(--color-border-soft)] p-8 sm:p-10">
        {children}
      </div>
    </main>
  );
}
