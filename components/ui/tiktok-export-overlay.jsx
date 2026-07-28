"use client";

import * as React from "react";
import { Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// TiktokExportOverlay -- overlay loading yang nutupin LAYAR MOCKUP HP (bukan
// panel di bawahnya) selama proses export video berlangsung (status
// "recording" / "converting"). Dipasang sebagai layer PALING ATAS di dalam
// <Iphone15Pro>, di atas <TiktokOverlay> (chrome TikTok), supaya user
// langsung sadar preview lagi "dibekukan" buat direkam -- persis kayak UI
// export di app editor video pada umumnya.
//
// Overlay ini murni dekor UI (sama seperti TiktokOverlay) -- TIDAK ikut
// ke-capture ke video, karena letaknya di luar <TiktokStage> yang jadi
// sumber gambar canvas export.
// ============================================================================
export function TiktokExportOverlay({ status, progress, statusMessage, className }) {
  const isRecording = status === "recording";
  const isConverting = status === "converting";
  const isDone = status === "done";

  // ---- "done" sengaja di-auto-hide setelah sebentar (bukan langsung
  // ilang begitu status berubah), supaya user sempat lihat konfirmasi
  // "Video siap!" sebelum overlay ditutup dan preview normal kelihatan
  // lagi. Tanpa ini overlay bakal nyangkut permanen nutupin layar mockup
  // sampai user export ulang. ----
  const [showDone, setShowDone] = React.useState(false);
  React.useEffect(() => {
    if (isDone) {
      setShowDone(true);
      const t = setTimeout(() => setShowDone(false), 2200);
      return () => clearTimeout(t);
    }
    setShowDone(false);
  }, [isDone]);

  const visible = isRecording || isConverting || showDone;

  if (!visible) return null;

  return (
    <div
      className={cn(
        "absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-black/70 px-8 text-center text-white backdrop-blur-md transition-opacity duration-300",
        className
      )}
    >
      {isDone ? (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 ring-1 ring-emerald-400/40">
          <Check size={26} className="text-emerald-400" />
        </div>
      ) : (
        <Loader2 size={34} className="animate-spin text-white" />
      )}

      <div className="w-full max-w-[200px]">
        <p className="text-[13px] font-semibold leading-snug">
          {isDone ? "Video siap!" : isConverting ? "Mengonversi ke MP4" : "Merekam video..."}
        </p>
        {statusMessage ? (
          <p className="mt-1 text-[11px] leading-snug text-white/60">{statusMessage}</p>
        ) : null}

        {!isDone && (
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-white transition-[width] duration-200"
              style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
