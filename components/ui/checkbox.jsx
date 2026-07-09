"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Kartu pilihan divisi — ringkas: foto profil divisi, nama, dan checkbox.
 */
const CheckboxCard = React.forwardRef(
  (
    { id, checked, onChange, label, image, accentTo = "#06B6D4", className, ...props },
    ref
  ) => {
    return (
      <label
        htmlFor={id}
        className={cn(
          "group relative flex w-full cursor-pointer items-center gap-3 rounded-lg border p-4 shadow-sm shadow-black/5 transition-colors",
          checked
            ? "border-ink/30 dark:border-white/30"
            : "border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20",
          className
        )}
      >
        <input
          ref={ref}
          id={id}
          name="division"
          type="radio"
          checked={checked}
          onChange={onChange}
          className="sr-only"
          {...props}
        />

        {/* Foto profil divisi */}
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
          {image && (
            <img
              src={image}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          )}
        </span>

        <span className="grow text-sm font-medium text-ink">{label}</span>

        {/* Checkbox kotak */}
        <span
          aria-hidden="true"
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
            checked
              ? "border-ink bg-ink dark:border-white dark:bg-white"
              : "border-black/25 dark:border-white/25"
          )}
        >
          {checked && (
            <Check size={13} strokeWidth={3} className="text-base" />
          )}
        </span>
      </label>
    );
  }
);
CheckboxCard.displayName = "CheckboxCard";

export { CheckboxCard };
