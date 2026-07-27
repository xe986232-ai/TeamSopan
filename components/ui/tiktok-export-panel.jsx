"use client";

import * as React from "react";
import { Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// TiktokExportPanel -- tombol "Export sebagai Video (MP4)" + status/progress.
// Logic-nya semua ada di hooks/use-tiktok-stage-export.js; komponen ini
// murni tampilan supaya gampang dipasang di TiktokPreviewScene.
// ============================================================================
export function TiktokExportPanel({
  status,
  progress,
  statusMessage,
  onExport,
  onStop,
  className,
  resolutionKey,
  onResolutionChange,
  resolutionOptions,
}) {
  const isRecording = status === "recording";
  const isConverting = status === "converting";
  const isBusy = isRecording || isConverting;

  function handleClick() {
    if (isRecording) {
      onStop();
    } else if (!isBusy) {
      onExport();
    }
  }

  return (
    <div className={cn("w-full max-w-[280px] rounded-2xl border border-base-line bg-base-elevated p-4", className)}>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink/60">Export Video</h3>

      {resolutionOptions && resolutionOptions.length > 0 && (
        <div className="mb-3">
          <p className="mb-1.5 text-[11px] font-medium text-ink/60">Resolusi (rasio 9:16)</p>
          <div className="grid grid-cols-2 gap-2">
            {resolutionOptions.map(([key, opt]) => (
              <button
                key={key}
                type="button"
                disabled={isBusy}
                onClick={() => onResolutionChange?.(key)}
                className={cn(
                  "rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                  resolutionKey === key
                    ? "border-ink bg-ink text-base"
                    : "border-base-line bg-base text-ink/70 hover:border-ink/40"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleClick}
        disabled={isConverting}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
          isRecording
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-ink text-base hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        {isConverting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Mengonversi Video...
          </>
        ) : isRecording ? (
          "Hentikan & Simpan Video"
        ) : (
          <>
            <Download size={16} />
            Export sebagai Video (MP4)
          </>
        )}
      </button>

      {status !== "idle" && (
        <div className="mt-3">
          <p className="mb-1.5 text-center text-[11px] text-ink/60">{statusMessage}</p>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
            <div
              className="h-full rounded-full bg-ink transition-[width] duration-200"
              style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            />
          </div>
        </div>
      )}

      <p className="mt-3 text-center text-[11px] leading-relaxed text-ink/50">
        Video direkam sepanjang durasi lagu, tampilannya persis seperti panggung ini (background, kartu musik,
        progress), lengkap dengan suara musiknya. Semua diproses langsung di browser kamu.
      </p>
    </div>
  );
}
