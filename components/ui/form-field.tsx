import * as React from "react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
};

export function FormField({ label, htmlFor, error, children, className }: Props) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={htmlFor} className="text-xs uppercase tracking-widest text-ink-muted">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-burgundy">{error}</p>}
    </div>
  );
}
