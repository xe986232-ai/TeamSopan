"use client";

import * as React from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const REQUIREMENTS = [
  { regex: /.{8,}/, text: "Minimal 8 karakter" },
  { regex: /[0-9]/, text: "Minimal 1 angka" },
  { regex: /[a-z]/, text: "Minimal 1 huruf kecil" },
  { regex: /[A-Z]/, text: "Minimal 1 huruf besar" },
];

const STRENGTH_COLOR = {
  0: "bg-base-line",
  1: "bg-rose-500",
  2: "bg-orange-500",
  3: "bg-amber-500",
  4: "bg-emerald-500",
};

const STRENGTH_TEXT = {
  0: "Masukkan password",
  1: "Password lemah",
  2: "Password lemah",
  3: "Password sedang",
  4: "Password kuat",
};

const PasswordField = React.forwardRef(
  (
    {
      id = "password",
      label = "Password",
      value,
      onChange,
      className,
      showStrength = true,
      ...props
    },
    ref
  ) => {
    const [visible, setVisible] = React.useState(false);

    const strength = REQUIREMENTS.map((req) => ({
      met: req.regex.test(value || ""),
      text: req.text,
    }));
    const score = strength.filter((r) => r.met).length;

    return (
      <div className={cn("space-y-2", className)}>
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>

        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={visible ? "text" : "password"}
            value={value}
            onChange={onChange}
            aria-describedby={`${id}-description`}
            className={cn(
              "w-full rounded-lg border border-black/10 dark:border-white/10 bg-base px-3.5 py-2.5 pe-10 text-sm text-ink",
              "outline-none transition-colors focus:border-ink/40 dark:focus:border-white/40"
            )}
            placeholder="Password"
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}
            aria-pressed={visible}
            className="absolute inset-y-0 end-0 flex h-full w-10 items-center justify-center text-ink-dim hover:text-ink transition-colors"
          >
            {visible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Indikator kekuatan — cuma relevan di form daftar */}
        {showStrength && (
          <>
            <div
              className="h-1 w-full overflow-hidden rounded-full bg-base-line"
              role="progressbar"
              aria-valuenow={score}
              aria-valuemin={0}
              aria-valuemax={4}
              aria-label="Kekuatan password"
            >
              <div
                className={cn("h-full transition-all duration-500 ease-out", STRENGTH_COLOR[score])}
                style={{ width: `${(score / 4) * 100}%` }}
              />
            </div>

            <p className="text-xs font-medium text-ink-muted" id={`${id}-description`}>
              {STRENGTH_TEXT[score]}
            </p>

            <ul className="space-y-1" aria-label="Syarat password">
              {strength.map((req) => (
                <li key={req.text} className="flex items-center gap-1.5">
                  {req.met ? (
                    <Check size={13} className="text-emerald-500" />
                  ) : (
                    <X size={13} className="text-ink-dim" />
                  )}
                  <span className={cn("text-xs", req.met ? "text-emerald-500" : "text-ink-dim")}>
                    {req.text}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  }
);
PasswordField.displayName = "PasswordField";

export { PasswordField };
