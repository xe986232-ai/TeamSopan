"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Kartu checkbox — dipakai buat pilihan divisi.
 * accentFrom / accentTo opsional buat kasih warna khas tiap divisi saat dicentang.
 */
const CheckboxCard = React.forwardRef(
  (
    {
      id,
      checked,
      onChange,
      label,
      description,
      accentFrom,
      accentTo,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <label
        htmlFor={id}
        className={cn(
          "group relative flex w-full cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors",
          checked
            ? "border-ink/30 dark:border-white/30"
            : "border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20",
          className
        )}
        style={
          checked && accentFrom && accentTo
            ? { boxShadow: `0 0 0 1px ${accentTo}55` }
            : undefined
        }
      >
        <input
          ref={ref}
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
          {...props}
        />
        <span
          aria-hidden="true"
          className={cn(
            "order-1 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all",
            checked
              ? "border-transparent text-white"
              : "border-black/20 dark:border-white/20 bg-transparent"
          )}
          style={
            checked
              ? {
                  background:
                    accentFrom && accentTo
                      ? `linear-gradient(135deg, ${accentFrom}, ${accentTo})`
                      : "#0B0A10",
                }
              : undefined
          }
        >
          {checked && <Check size={13} strokeWidth={3} />}
        </span>

        <span className="flex grow flex-col gap-0.5">
          <span className="text-sm font-medium text-ink">{label}</span>
          {description && (
            <span className="text-xs text-ink-muted">{description}</span>
          )}
        </span>
      </label>
    );
  }
);
CheckboxCard.displayName = "CheckboxCard";

export { CheckboxCard };
