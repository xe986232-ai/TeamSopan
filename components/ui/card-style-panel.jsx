"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// CardStylePanel -- panel kustomisasi tampilan MusicPlayerCard di dalam
// mockup HP: opacity background card (biar bisa "nyatu" sama background
// ambient di belakangnya), blur background belakang card, dan posisi
// maju/mundur card (zoom). Dipasang di luar mockup HP, sama seperti
// PlaylistPanel -- controlled dari luar lewat props `bgOpacity`/`bgBlur`/
// `cardZoom` + setter, supaya TiktokPreviewScene yang nyimpen state-nya dan
// bisa langsung diteruskan ke MusicPlayerCard & layer background ambient.
// ============================================================================
export function CardStylePanel({
  bgOpacity,
  onBgOpacityChange,
  bgBlur,
  onBgBlurChange,
  cardZoom,
  onCardZoomChange,
  className,
}) {
  // slider "Posisi card (Mundur/Maju)" -- 100 = normal, di bawah 100 =
  // mundur (card mengecil, background makin kelihatan), di atas 100 =
  // maju (card membesar). Diterapkan lewat CSS transform:scale() di
  // TiktokStage, jadi kelihatan kayak card beneran bergerak di sumbu Z.
  const ZOOM_MIN = 60;
  const ZOOM_MAX = 140;
  const zoomPct = ((cardZoom - ZOOM_MIN) / (ZOOM_MAX - ZOOM_MIN)) * 100;

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

      <div className="mb-4">
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

      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs text-ink/70">
          <span>Posisi card</span>
          <span className="tabular-nums text-ink">{cardZoom}%</span>
        </div>
        <input
          type="range"
          min={ZOOM_MIN}
          max={ZOOM_MAX}
          value={cardZoom}
          onChange={(e) => onCardZoomChange(Number(e.target.value))}
          aria-label="Posisi card, mundur atau maju"
          className="csp-range w-full"
          style={{ "--pct": `${zoomPct}%` }}
        />
        <div className="mt-1 flex items-center justify-between text-[10px] text-ink/40">
          <span>Mundur (kecil)</span>
          <span>Maju (besar)</span>
        </div>
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
