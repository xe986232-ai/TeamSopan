"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Kartu kaca dengan "spotlight" yang ngikutin posisi kursor/jari --
// gaya signature BadtzUI (glow-border cards). Border-nya gradient tipis,
// dan radial-gradient overlay-nya ngikutin --mx/--my yang di-update tiap
// pointermove, jadi kesannya kartu "nyala" di titik yang disentuh.
export const SpotlightCard = React.forwardRef(function SpotlightCard(
  { className, children, glowFrom = "#B026FF", glowTo = "#FF2E92", ...props },
  ref
) {
  const localRef = React.useRef(null);

  function handlePointerMove(e) {
    const el = localRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <div
      ref={(node) => {
        localRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      onPointerMove={handlePointerMove}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-black/10 bg-base-elevated/60 backdrop-blur-xl dark:border-white/10",
        className
      )}
      style={{ "--mx": "50%", "--my": "50%" }}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(240px circle at var(--mx) var(--my), ${glowFrom}22, transparent 70%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          padding: 1,
          background: `radial-gradient(200px circle at var(--mx) var(--my), ${glowFrom}, ${glowTo}, transparent 75%)`,
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
});
