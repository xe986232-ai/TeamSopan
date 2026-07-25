"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

// Tombol "magnetic" -- geser dikit ngikutin kursor pas di-hover, gaya
// Lightswind "Magnetic Button" / BadtzUI animated buttons. Di touch
// device efek magnetnya otomatis no-op (pointer type != mouse), jadi
// tombol tetap normal & gampang di-tap.
export const MagneticButton = React.forwardRef(function MagneticButton(
  { className, children, colorFrom = "#B026FF", colorTo = "#FF2E92", disabled, style, ...props },
  ref
) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });

  function handlePointerMove(e) {
    if (disabled || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.28);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.28);
  }

  function handlePointerLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      disabled={disabled}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ x: springX, y: springY, ...style }}
      className={cn(
        "relative inline-flex items-center justify-center gap-1.5 rounded-full font-display font-bold text-white shadow-lg transition-opacity disabled:cursor-not-allowed disabled:opacity-40",
        className
      )}
      {...props}
    >
      <span
        className="absolute inset-0 -z-10 rounded-full blur-md transition-opacity"
        style={{ background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})`, opacity: 0.65 }}
        aria-hidden="true"
      />
      <span
        className="absolute inset-0 -z-10 rounded-full"
        style={{ background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})` }}
        aria-hidden="true"
      />
      {children}
    </motion.button>
  );
});
