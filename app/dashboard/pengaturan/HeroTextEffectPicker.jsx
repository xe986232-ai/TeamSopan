"use client";

import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import {
  HERO_TEXT_EFFECT_LIST,
  getHeroTextEffect,
} from "@/lib/hero-text-effects";
import {
  TexturedText,
  SequentialTexturedText,
  TexturedOutlineText,
  BlurText,
  HERO_TEXTURE_IMAGES,
} from "@/components/ui/portfolio-hero";
import { updateHeroTextEffect } from "./actions";

// Preview mini dipakai buat ngerender masing-masing effect persis pakai
// komponen asli yang jalan di Hero homepage (bukan tiruan/CSS beda) --
// jadi apa yang admin lihat di sini = apa yang bakal tampil di situs.
function EffectPreview({ effectId }) {
  const commonClassName =
    "font-hero font-black text-[26px] leading-[0.9] tracking-tighter uppercase whitespace-nowrap";

  if (effectId === "sequential") {
    return (
      <SequentialTexturedText
        text="SOPAN"
        images={HERO_TEXTURE_IMAGES}
        offset={0}
        className={commonClassName}
      />
    );
  }

  if (effectId === "static") {
    return (
      <BlurText
        text="SOPAN"
        delay={80}
        animateBy="letters"
        direction="top"
        className={`${commonClassName} justify-center`}
        style={{ color: "#C3E41D" }}
      />
    );
  }

  if (effectId === "outline") {
    return (
      <TexturedOutlineText
        text="SOPAN"
        images={HERO_TEXTURE_IMAGES}
        offset={0}
        isDark
        className={commonClassName}
      />
    );
  }

  return (
    <TexturedText
      text="SOPAN"
      images={HERO_TEXTURE_IMAGES}
      offset={0}
      className={commonClassName}
    />
  );
}

export default function HeroTextEffectPicker({ currentEffect }) {
  const [selectedEffect, setSelectedEffect] = useState(currentEffect);
  const [saved, setSaved] = useState(currentEffect);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const hasChanges = selectedEffect !== saved;

  function handleSave() {
    setError("");
    startTransition(async () => {
      const result = await updateHeroTextEffect(selectedEffect);
      if (result?.error) {
        setError(result.error);
      } else {
        setSaved(selectedEffect);
      }
    });
  }

  return (
    <div className="rounded-2xl border border-black/[0.06] p-5 mb-4">
      <div className="mb-1">
        <p className="font-body font-semibold text-sm text-[#111827]">
          Animasi Teks Hero
        </p>
        <p className="text-xs text-black/45 mt-0.5">
          Pilih gaya animasi untuk teks nama "SOPAN TEAM" besar di
          homepage. Preview di bawah jalan persis seperti di halaman
          aslinya.
        </p>
      </div>

      <div className="grid gap-3 mt-4 grid-cols-2 sm:grid-cols-4">
        {HERO_TEXT_EFFECT_LIST.map((effect) => {
          const isSelected = selectedEffect === effect.id;
          return (
            <button
              key={effect.id}
              type="button"
              onClick={() => setSelectedEffect(effect.id)}
              className={`relative flex flex-col items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
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

              {/* Preview kotak gelap -- warna teks/tekstur kelihatan
                  jelas walau kartu ada di halaman terang */}
              <div className="flex h-20 w-full items-center justify-center overflow-hidden rounded-lg bg-[#0B0F1A]">
                <EffectPreview effectId={effect.id} />
              </div>

              <div>
                <p className="text-[11px] font-semibold text-[#111827]">
                  {effect.label}
                </p>
                <p className="text-[10px] text-black/40 leading-tight mt-0.5">
                  {effect.description}
                </p>
              </div>
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
            Sedang aktif: {getHeroTextEffect(saved).label}
          </span>
        )}
      </div>
    </div>
  );
}
