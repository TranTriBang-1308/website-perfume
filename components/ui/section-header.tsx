import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  link?: { href: string; label: string };
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  link,
  className,
}: Props) {
  const isCenter = align === "center";
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-4",
        isCenter ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className={cn("space-y-3", isCenter && "max-w-2xl")}>
        {eyebrow && (
          <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.3em] text-champagne-dark">
            {!isCenter && <span aria-hidden className="h-px w-8 bg-champagne" />}
            {eyebrow}
            {isCenter && <span aria-hidden className="h-px w-8 bg-champagne" />}
          </p>
        )}
        <h2 className="font-display text-3xl font-light leading-tight text-ink sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        {description && (
          <p className="text-sm leading-relaxed text-ink-muted sm:text-base">
            {description}
          </p>
        )}
      </div>
      {link && (
        <Link
          href={link.href}
          className="group inline-flex items-center gap-2 self-start text-xs font-medium uppercase tracking-[0.25em] text-ink-muted transition-colors hover:text-ink sm:self-end"
        >
          {link.label}
          <span aria-hidden className="transition-transform duration-300 ease-luxe group-hover:translate-x-1">
            →
          </span>
        </Link>
      )}
    </div>
  );
}
