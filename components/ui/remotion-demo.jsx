"use client";

import * as React from "react";
import { Player } from "@remotion/player";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";

// ============================================================================
// RemotionDemo -- tes kemampuan animasi Remotion, TAPI cuma dipakai lewat
// @remotion/player (<Player>), yang murni jalan di BROWSER (requestAnimationFrame
// biasa, gak ada Chromium/FFmpeg/server sama sekali) -- beda total sama
// pendekatan render server (@remotion/renderer + bundle()) yang kena limit
// ukuran function di Vercel kemarin. Kalau butuh didownload jadi file
// nantinya, itu perlu render terpisah (server lain / Remotion Lambda) --
// tapi buat SEKADAR preview animasi di halaman web, ini udah cukup.
//
// Konsep animasi (4 detik, loop): beberapa bar "soundwave" muncul satu-satu
// (spring) sambil naik-turun kayak equalizer, disusul teks "Sopan Team"
// (slide-up + fade) lalu subtitle. Warna gradient ngikutin palet default
// logo brand (lihat lib/logo-styles.js -- "aurora": ungu ke cyan).
// ============================================================================

const BAR_COUNT = 5;
const AURORA_FROM = "#7C3AED";
const AURORA_TO = "#22D3EE";

function SoundwaveBar({ index, frame, fps }) {
  // tiap bar mulai muncul berurutan (stagger), lalu terus "berdenyut"
  // (sinusoidal) selama animasi berjalan biar keliatan hidup, bukan statis.
  const delay = index * 4;
  const appear = spring({ frame: frame - delay, fps, config: { damping: 12, mass: 0.5 } });

  const pulse = Math.sin(frame / 6 + index * 1.3) * 0.5 + 0.5; // 0..1
  const heightPct = 25 + pulse * 65; // 25%..90%

  return (
    <div
      style={{
        width: 10,
        height: `${heightPct}%`,
        borderRadius: 999,
        background: `linear-gradient(180deg, ${AURORA_FROM}, ${AURORA_TO})`,
        transform: `scaleY(${appear})`,
        transformOrigin: "bottom",
        opacity: appear,
      }}
    />
  );
}

function SopanIntroComposition() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame: frame - 18, fps, config: { damping: 14 } });
  const titleY = interpolate(titleSpring, [0, 1], [24, 0]);
  const titleOpacity = interpolate(frame, [18, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const subtitleOpacity = interpolate(frame, [40, 58], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0f",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* radial glow lembut di belakang, denyut pelan */}
      <div
        style={{
          position: "absolute",
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${AURORA_FROM}33, transparent 70%)`,
          transform: `scale(${1 + Math.sin(frame / 20) * 0.08})`,
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        {/* soundwave bars */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 64 }}>
          {Array.from({ length: BAR_COUNT }).map((_, i) => (
            <SoundwaveBar key={i} index={i} frame={frame} fps={fps} />
          ))}
        </div>

        {/* judul */}
        <div
          style={{
            transform: `translateY(${titleY}px)`,
            opacity: titleOpacity,
            fontSize: 56,
            fontWeight: 800,
            letterSpacing: -1,
            backgroundImage: `linear-gradient(90deg, ${AURORA_FROM}, ${AURORA_TO})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Sopan Team
        </div>

        {/* subjudul */}
        <div style={{ opacity: subtitleOpacity, fontSize: 16, color: "rgba(255,255,255,0.55)", letterSpacing: 2 }}>
          CREATIVE & TECH COLLECTIVE
        </div>
      </div>
    </AbsoluteFill>
  );
}

const FPS = 30;
const DURATION_IN_FRAMES = 120; // 4 detik

export function RemotionDemo() {
  return (
    <div className="flex w-full max-w-[420px] flex-col items-center gap-3">
      <div className="w-full overflow-hidden rounded-2xl border border-ink/10 shadow-lg shadow-black/10">
        <Player
          component={SopanIntroComposition}
          durationInFrames={DURATION_IN_FRAMES}
          fps={FPS}
          compositionWidth={640}
          compositionHeight={360}
          style={{ width: "100%" }}
          controls
          loop
          autoPlay
        />
      </div>
      <p className="max-w-[360px] text-center text-[11px] leading-relaxed text-ink/50">
        Tes animasi pakai Remotion Player -- murni jalan di browser (bukan hasil render server), jadi bisa di-preview
        langsung tanpa proses ekspor.
      </p>
    </div>
  );
}
