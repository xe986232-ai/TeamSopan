"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const TextareaField = React.forwardRef(
  ({ id, label, error, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-ink">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-lg border bg-base px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-dim",
            "outline-none transition-colors focus:border-ink/40 dark:focus:border-white/40",
            "resize-none",
            error
              ? "border-rose-500/60"
              : "border-black/10 dark:border-white/10",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${id}-error`} className="text-xs text-rose-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);
TextareaField.displayName = "TextareaField";

export { TextareaField };
