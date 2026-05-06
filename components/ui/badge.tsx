import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em]",
  {
    variants: {
      variant: {
        default: "bg-ink text-white",
        gold: "bg-champagne text-ink",
        goldOutline: "border border-champagne text-champagne-dark bg-cream",
        burgundy: "bg-burgundy text-white",
        success: "bg-emerald-700 text-white",
        warning: "bg-amber-600 text-white",
        muted: "bg-cream-warm text-ink-muted border border-border-soft",
        outline: "border border-ink text-ink bg-transparent",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
