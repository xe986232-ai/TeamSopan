import * as React from "react";
import { cn } from "@/lib/utils";

const VARIANTS = {
  default:
    "bg-ink-solid text-white hover:bg-ink-solid/90 dark:bg-white dark:text-ink-solid dark:hover:bg-white/90",
  secondary:
    "bg-black/5 text-ink hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15",
  outline:
    "border border-black/15 text-ink hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/5",
  ghost: "text-ink hover:bg-black/5 dark:hover:bg-white/5",
};

const SIZES = {
  default: "h-10 px-4 py-2 text-sm",
  sm: "h-9 px-3 text-xs",
  lg: "h-11 px-6 text-sm",
};

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
          VARIANTS[variant],
          SIZES[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
