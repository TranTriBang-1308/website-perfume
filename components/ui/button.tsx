import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 text-sm font-medium",
    "transition-all duration-300 ease-luxe",
    "disabled:opacity-50 disabled:pointer-events-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
    "active:scale-[0.98]",
    "select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-ink text-white hover:bg-ink-soft shadow-soft hover:shadow-luxe",
        gold:
          "bg-champagne text-ink hover:bg-champagne-dark hover:text-white shadow-soft hover:shadow-luxe",
        outline:
          "border border-ink text-ink bg-transparent hover:bg-ink hover:text-white",
        outlineGold:
          "border border-champagne text-champagne-dark bg-transparent hover:bg-champagne hover:text-ink",
        ghost:
          "text-ink hover:bg-ink/5",
        link:
          "text-ink underline-offset-4 hover:underline",
        burgundy:
          "bg-burgundy text-white hover:bg-burgundy-light shadow-soft hover:shadow-luxe",
      },
      size: {
        sm: "h-9 px-4 text-xs tracking-wide uppercase",
        md: "h-11 px-6 tracking-wide",
        lg: "h-12 px-8 tracking-wide",
        xl: "h-14 px-10 text-base tracking-wide",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
  };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {loading ? (
        <>
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
          <span>Đang xử lý...</span>
        </>
      ) : (
        children
      )}
    </button>
  )
);
Button.displayName = "Button";

export { buttonVariants };
