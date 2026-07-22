"use client";

import { useRef } from "react";
import { Music4, Clapperboard, Sparkles, Zap } from "lucide-react";

import { AnimatedBeam } from "./AnimatedBeam";

const NODES = [
  {
    key: "remix",
    label: "Remix",
    icon: Music4,
    color: "#B026FF",
  },
  {
    key: "creator",
    label: "Creator",
    icon: Clapperboard,
    color: "#00B8D9",
  },
  {
    key: "leadis",
    label: "Leadis",
    icon: Sparkles,
    color: "#FF6FB5",
  },
];

export default function EcosystemBeamSection() {
  const containerRef = useRef(null);
  const centerRef = useRef(null);
  const remixRef = useRef(null);
  const creatorRef = useRef(null);
  const leadisRef = useRef(null);

  const refs = { remix: remixRef, creator: creatorRef, leadis: leadisRef };

  return (
    <section className="relative px-6 py-16 sm:px-10 sm:py-20">
      <div className="mx-auto max-w-3xl text-center mb-10">
        <span className="font-body font-semibold text-sm tracking-[0.3em] uppercase text-ink-muted">
          Satu Ekosistem
        </span>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl mt-3 text-ink leading-tight">
          Semua divisi, satu keluarga SOPAN TEAM
        </h2>
      </div>

      <div
        ref={containerRef}
        className="relative mx-auto flex h-[220px] w-full max-w-xl items-center justify-between px-4 sm:h-[260px]"
      >
        {/* Left node - Remix */}
        <div
          ref={remixRef}
          className="z-10 flex size-14 flex-col items-center justify-center gap-1 rounded-full border border-black/5 bg-base-elevated shadow-sm sm:size-16"
        >
          <Music4 className="size-5 sm:size-6" style={{ color: NODES[0].color }} />
        </div>

        {/* Center node - Logo SOPAN TEAM */}
        <div
          ref={centerRef}
          className="z-10 flex size-20 flex-col items-center justify-center gap-1 rounded-full border border-black/5 bg-ink-solid shadow-md sm:size-24"
        >
          <Zap className="size-6 text-white sm:size-7" />
          <span className="font-display font-bold text-[10px] text-white sm:text-xs">
            SOPAN
          </span>
        </div>

        {/* Right node - stacked Creator & Leadis */}
        <div className="z-10 flex flex-col items-center gap-6 sm:gap-8">
          <div
            ref={creatorRef}
            className="flex size-14 items-center justify-center rounded-full border border-black/5 bg-base-elevated shadow-sm sm:size-16"
          >
            <Clapperboard className="size-5 sm:size-6" style={{ color: NODES[1].color }} />
          </div>
          <div
            ref={leadisRef}
            className="flex size-14 items-center justify-center rounded-full border border-black/5 bg-base-elevated shadow-sm sm:size-16"
          >
            <Sparkles className="size-5 sm:size-6" style={{ color: NODES[2].color }} />
          </div>
        </div>

        {/* Beams */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={remixRef}
          toRef={centerRef}
          curvature={-40}
          duration={4}
          gradientStartColor={NODES[0].color}
          gradientStopColor="#B026FF"
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={centerRef}
          toRef={creatorRef}
          curvature={40}
          duration={4}
          delay={0.6}
          gradientStartColor="#B026FF"
          gradientStopColor={NODES[1].color}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={centerRef}
          toRef={leadisRef}
          curvature={-40}
          duration={4}
          delay={1.2}
          gradientStartColor="#B026FF"
          gradientStopColor={NODES[2].color}
        />
      </div>

      <div className="mx-auto mt-8 flex max-w-xl justify-between px-4 text-center">
        <span className="font-body text-xs text-ink-dim sm:text-sm">Remix</span>
        <span className="font-body text-xs text-ink-dim sm:text-sm">Creator & Leadis</span>
      </div>
    </section>
  );
}
