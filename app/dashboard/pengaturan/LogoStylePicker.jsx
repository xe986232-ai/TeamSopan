"use client";

import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { LOGO_STYLE_LIST, getLogoStyle } from "@/lib/logo-styles";
import LogoMark from "@/components/ui/logo-mark";
import { updateLogoStyle } from "./actions";

export default function LogoStylePicker({ currentStyle }) {
  const [selected, setSelected] = useState(currentStyle);
  const [saved, setSaved] = useState(currentStyle);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const hasChanges = selected !== saved;

  function handleSave() {
    setError("");
    startTransition(async () => {
      const result = await updateLogoStyle(selected);
      if (result?.error) {
        setError(result.error);
      } else {
        setSaved(selected);
      }
    });
  }

  return (
    <div className="rounded-2xl border border-black/[0.06] p-5 mb-4">
      <div className="flex items-center justify-between gap-4 mb-1">
        <div>
          <p className="font-body font-semibold text-sm text-[#111827]">Logo Utama</p>
          <p className="text-xs text-black/45 mt-0.5">
            Pilih warna gradient untuk logo soundwave di navbar semua halaman publik.
          </p>
        </div>
      </div>

      {/* preview besar di tengah -- biar admin lihat dulu sebelum simpan.
          Background gelap tipis di belakang biar garis gradient-nya kelihatan
          jelas walau di halaman terang. */}
      <div className="flex items-center justify-center py-6">
        <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-[#0B0F1A]">
          <LogoMark styleId={selected} size={56} />
        </div>
      </div>

      {/* pilihan 5 style */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {LOGO_STYLE_LIST.map((style) => {
          const isSelected = selected === style.id;
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => setSelected(style.id)}
              className={`relative flex flex-col items-center gap-2 rounded-xl border p-3 transition-colors ${
                isSelected
                  ? "border-[#1677F5] bg-[#1677F5]/5"
                  : "border-black/[0.08] hover:border-black/20"
              }`}
            >
              {isSelected && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#1677F5] text-white">
                  <Check size={10} strokeWidth={3} />
                </span>
              )}
              <div className="flex items-center justify-center h-11 w-11 rounded-lg bg-[#0B0F1A]">
                <LogoMark styleId={style.id} size={30} />
              </div>
              <span className="text-[11px] font-semibold text-[#111827]">{style.label}</span>
              <span className="text-[10px] text-black/40 text-center leading-tight">
                {style.description}
              </span>
            </button>
          );
        })}
      </div>

      {error && <p className="text-xs text-red-500 mt-3">{error}</p>}

      <div className="flex items-center gap-3 mt-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges || isPending}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-[#111827] px-4 py-2 text-xs font-semibold text-white disabled:opacity-40 transition-opacity"
        >
          {isPending ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
          Simpan pilihan
        </button>
        {!hasChanges && !isPending && (
          <span className="text-xs text-black/40">
            {saved ? `Sedang aktif: ${getLogoStyle(saved).label}` : ""}
          </span>
        )}
      </div>
    </div>
  );
}
