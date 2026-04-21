import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-11 w-full rounded-none border border-[color:var(--color-border-soft)] bg-white px-4 text-sm text-ink",
        "placeholder:text-ink-muted focus:border-ink focus:outline-none transition-colors",
        "disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
