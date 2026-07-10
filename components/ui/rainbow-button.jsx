import React from "react";
import { cn } from "@/lib/utils";

export const RainbowButton = React.forwardRef(
  ({ children, className, href, ...props }, ref) => {
    const classes = cn(
      "group relative inline-flex h-11 animate-rainbow cursor-pointer items-center justify-center rounded-full border-0 bg-[length:200%] px-8 py-2 font-medium text-primary-foreground transition-colors [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.08*1rem)_solid_transparent] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
      // before styles (glow di belakang tombol)
      "before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))] before:[filter:blur(calc(0.8*1rem))]",
      // light mode: isi hitam solid, border rainbow
      "bg-[linear-gradient(#0B0A10,#0B0A10),linear-gradient(#0B0A10_50%,rgba(11,10,16,0.6)_80%,rgba(11,10,16,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))] text-white",
      // dark mode: isi putih solid, border rainbow
      "dark:bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))] dark:text-ink-solid",
      className,
    );

    if (href) {
      return (
        <a ref={ref} href={href} className={classes} {...props}>
          {children}
        </a>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  },
);
RainbowButton.displayName = "RainbowButton";
