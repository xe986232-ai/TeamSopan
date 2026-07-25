"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// CardStylePanel -- panel kustomisasi tampilan MusicPlayerCard di dalam
// mockup HP: opacity background card (biar bisa "nyatu" sama background
// ambient di belakangnya) dan blur background belakang card. Dipasang di
// luar mockup HP, sama seperti PlaylistPanel -- controlled dari luar lewat
// props `bgOpacity`/`bgBlur` + setter, supaya TiktokPreviewScene yang
// nyimpen state-nya dan bisa langsung diteruskan ke MusicPlayerCard & layer
// background ambient.
// ============================================================================
export function CardStylePanel({ bgOpacity, onBgOpacityChange, bgBlur, onBgBlurChange, className }) {
  return (
    <div className={cn("w-full max-w-[280px] rounded-2xl border border-base-line bg-base-elevated p-4", className)}>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink/60">Tampilan Card</h3>

      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between text-xs text-ink/70">
          <span>Opacity background card</span>
          <span className="tabular-nums text-ink">{bgOpacity}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={bgOpacity}
          onChange={(e) => onBgOpacityChange(Number(e.target.value))}
          aria-label="Opacity background card"
          className="csp-range w-full"
          style={{ "--pct": `${bgOpacity}%` }}
        />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs text-ink/70">
          <span>Blur background belakang</span>
          <span className="tabular-nums text-ink">{bgBlur}px</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={bgBlur}
          onChange={(e) => onBgBlurChange(Number(e.target.value))}
          aria-label="Blur background belakang"
          className="csp-range w-full"
          style={{ "--pct": `${bgBlur}%` }}
        />
      </div>

      <style jsx>{`
        .csp-range {
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          border-radius: 9999px;
          background: linear-gradient(
            to right,
            currentColor 0%,
            currentColor var(--pct),
            rgba(0, 0, 0, 0.12) var(--pct),
            rgba(0, 0, 0, 0.12) 100%
          );
          color: inherit;
        }
        .csp-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          background: currentColor;
          cursor: pointer;
        }
        .csp-range::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border: none;
          border-radius: 9999px;
          background: currentColor;
          cursor: pointer;
        }
        .csp-range::-moz-range-track {
          height: 4px;
          border-radius: 9999px;
          background: transparent;
        }
      `}</style>
    </div>
  );
}
