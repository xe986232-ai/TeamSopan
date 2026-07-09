"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Kartu pilihan divisi — gaya "switch card" (referensi Origin UI switch-14).
 * Kiri: orb bulat gradient (mirip voice-chat AI orb), tengah: label + deskripsi,
 * kanan: toggle switch. accentFrom / accentTo dipakai buat warna khas tiap divisi.
 */
const CheckboxCard = React.forwardRef(
  (
    {
      id,
      checked,
      onChange,
      label,
      description,
      image,
      accentFrom = "#8B5CF6",
      accentTo = "#06B6D4",
      className,
      ...props
    },
    ref
  ) => {
    return (
      <label
        htmlFor={id}
        className={cn(
          "group relative flex w-full cursor-pointer items-start gap-3 rounded-lg border p-4 shadow-sm shadow-black/5 transition-colors",
          checked
            ? "border-ink/30 dark:border-white/30"
            : "border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20",
          className
        )}
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

        {/* Toggle switch — order-1 supaya nempel di kanan */}
        <span
          aria-hidden="true"
          className={cn(
            "order-1 relative mt-0.5 h-4 w-6 shrink-0 rounded-full transition-colors",
            checked ? "bg-ink dark:bg-white" : "bg-black/15 dark:bg-white/15"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 left-0.5 h-3 w-3 rounded-full bg-white dark:bg-base transition-transform",
              checked && "translate-x-2"
            )}
          />
        </span>

        <span className="flex grow items-center gap-3">
          {/* Icon bulat — foto divisi */}
          <span
            aria-hidden="true"
            className={cn(
              "relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full transition-transform",
              checked && "scale-105"
            )}
            style={{
              boxShadow: checked
                ? `0 0 0 1px ${accentTo}55, 0 0 10px 1px ${accentTo}55`
                : `0 0 0 1px ${accentTo}33`,
            }}
          >
            {image ? (
              <img
                src={image}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <span
                className="h-full w-full"
                style={{
                  background: `radial-gradient(circle at 32% 30%, ${accentFrom}, ${accentTo} 70%)`,
                }}
              />
            )}
          </span>

          <span className="grid grow gap-0.5">
            <span className="text-sm font-medium text-ink">{label}</span>
            {description && (
              <span className="text-xs text-ink-muted">{description}</span>
            )}
          </span>
        </span>
      </label>
    );
  }
);
CheckboxCard.displayName = "CheckboxCard";

export { CheckboxCard };
