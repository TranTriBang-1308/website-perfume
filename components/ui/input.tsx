import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-11 w-full rounded-none border border-border-soft bg-white px-4 text-sm text-ink",
        "placeholder:text-ink-faint focus:border-champagne focus:ring-1 focus:ring-champagne/40 focus:outline-none",
        "transition-all duration-300 ease-luxe",
        "hover:border-ink-faint",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-cream-warm",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "block w-full rounded-none border border-border-soft bg-white px-4 py-3 text-sm text-ink",
        "placeholder:text-ink-faint focus:border-champagne focus:ring-1 focus:ring-champagne/40 focus:outline-none",
        "transition-all duration-300 ease-luxe",
        "hover:border-ink-faint",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-cream-warm",
        "resize-y min-h-[100px]",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "h-11 w-full appearance-none rounded-none border border-border-soft bg-white px-4 pr-10 text-sm text-ink",
          "focus:border-champagne focus:ring-1 focus:ring-champagne/40 focus:outline-none",
          "transition-all duration-300 ease-luxe",
          "hover:border-ink-faint cursor-pointer",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-cream-warm",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
        aria-hidden
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
      </svg>
    </div>
  )
);
Select.displayName = "Select";
