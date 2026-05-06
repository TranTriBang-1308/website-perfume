import * as React from "react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
};

export function FormField({ label, htmlFor, error, hint, required, children, className }: Props) {
  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em] text-ink-muted"
      >
        <span>{label}</span>
        {required && <span className="text-burgundy" aria-hidden>*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-ink-faint">{hint}</p>}
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-burgundy" role="alert">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 shrink-0">
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" d="M12 8v4M12 16h.01" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
