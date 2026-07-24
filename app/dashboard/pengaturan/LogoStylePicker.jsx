"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { LOGO_STYLE_LIST, getLogoStyle } from "@/lib/logo-styles";
import { updateLogoStyle } from "./actions";

// Preview logo -- versi kecil dari orb "S" yang ada di navbar
// (components/ui/site-navbar.jsx), sengaja disamain animasinya (blob morph)
// biar admin lihat persis kayak apa nanti tampil di navbar publik.
function LogoPreview({ style, size = 56 }) {
  return (
    <span
      className="relative shrink-0 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <motion.span
        animate={{
          borderRadius: [
            "60% 40% 55% 45% / 50% 60% 40% 50%",
            "45% 55% 40% 60% / 55% 45% 60% 40%",
            "55% 45% 60% 40% / 45% 55% 45% 55%",
            "60% 40% 55% 45% / 50% 60% 40% 50%",
          ],
          scale: [1, 1.08, 0.95, 1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 blur-md opacity-80"
        style={{ background: style.outer }}
      />
      <motion.span
        animate={{
          borderRadius: [
            "60% 40% 55% 45% / 50% 60% 40% 50%",
            "45% 55% 40% 60% / 55% 45% 60% 40%",
            "55% 45% 60% 40% / 45% 55% 45% 55%",
            "60% 40% 55% 45% / 50% 60% 40% 50%",
          ],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative h-full w-full flex items-center justify-center text-white font-black overflow-hidden"
        style={{ background: style.inner, fontSize: size * 0.42 }}
      >
        S
      </motion.span>
    </span>
  );
}

export default function LogoStylePicker({ currentStyle }) {
  const [selected, setSelected] = useState(currentStyle);
  const [saved, setSaved] = useState(currentStyle);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const previewStyle = getLogoStyle(selected);
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
            Pilih warna gradient untuk logo "S" di navbar semua halaman publik.
          </p>
        </div>
      </div>

      {/* preview besar di tengah -- biar admin lihat dulu sebelum simpan */}
      <div className="flex items-center justify-center py-6">
        <LogoPreview style={previewStyle} size={72} />
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
              <LogoPreview style={style} size={36} />
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
