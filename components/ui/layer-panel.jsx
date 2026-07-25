"use client";

import * as React from "react";
import { Eye, EyeOff, Layers, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// LayerPanel -- daftar semua layer top-level project Alight Motion (dari
// `ALIGHT_MOTION_LAYERS` di lib/alightmotion-template.js), ditampilkan mirip
// panel layer di Alight Motion: klik ikon mata buat sembunyikan/tampilkan
// layer itu dari file .xml yang di-generate lewat tombol "Generate Project".
//
// Ini CUMA soal include/exclude layer di file .xml, BUKAN preview HP di web
// (preview HP pakai MusicPlayerCard sendiri yang lebih sederhana) -- jadi
// nyembunyikan layer di sini nggak ngubah tampilan mockup HP, cuma
// ngefek ke isi project yang didownload nanti.
//
// Layer bertanda `locked` (background & foto album) dikasih ikon gembok +
// tetap bisa di-uncheck, tapi dikasih catatan visual karena kalau dihapus
// project-nya kehilangan 2 elemen visual paling utama.
// ============================================================================
export function LayerPanel({ layers, hiddenLayerIds, onToggleLayer, className }) {
  const hiddenCount = hiddenLayerIds.size;

  return (
    <div className={cn("w-full max-w-[280px] rounded-2xl border border-base-line bg-base-elevated p-4", className)}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink/60">
          <Layers size={13} />
          Layer Project
        </h3>
        <span className="text-[11px] tabular-nums text-ink/50">
          {layers.length - hiddenCount}/{layers.length} aktif
        </span>
      </div>

      <div className="max-h-64 overflow-y-auto rounded-xl border border-base-line bg-ink/[0.03]">
        {layers.map((layer) => {
          const isHidden = hiddenLayerIds.has(layer.id);
          return (
            <button
              key={layer.id}
              type="button"
              onClick={() => onToggleLayer(layer.id)}
              className={cn(
                "flex w-full items-center gap-2.5 border-b border-base-line px-3 py-2 text-left text-xs transition-colors last:border-b-0 hover:bg-ink/5",
                isHidden && "opacity-45"
              )}
            >
              <span className={cn("shrink-0", isHidden ? "text-ink/40" : "text-ink")}>
                {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
              </span>
              <span className={cn("min-w-0 flex-1 truncate text-ink", isHidden && "line-through decoration-ink/40")}>
                {layer.label}
              </span>
              {layer.locked && <Lock size={11} className="shrink-0 text-ink/35" />}
            </button>
          );
        })}
      </div>

      <p className="mt-2.5 text-[10.5px] leading-relaxed text-ink/45">
        Klik ikon mata buat sembunyikan layer dari file .xml. Layer bertanda{" "}
        <Lock size={9} className="inline -mt-0.5" /> adalah background &amp; foto sampul -- sebaiknya jangan
        disembunyikan.
      </p>
    </div>
  );
}
