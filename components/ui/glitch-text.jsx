"use client";

import { useEffect, useRef } from "react";

const GLITCH_CHARS = "!<>-_/[]{}=+*^?#$%&01";

function randomChar() {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
}

function scrambleFrame(text, intensity) {
  return text
    .split("")
    .map((ch) => (ch === " " ? " " : Math.random() < intensity ? randomChar() : ch))
    .join("");
}

// Periodically "corrupts" the text into random glitch characters for a brief
// burst, synced with a chromatic-split + skew animation, then resolves back
// to the real text. Skips entirely when the user prefers reduced motion.
export default function GlitchText({
  text,
  className = "",
  as: Tag = "div",
  intervalMs = 3000,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let burstTimeout;
    let loopInterval;

    function runBurst() {
      el.classList.add("glitching");
      el.setAttribute("data-text", text);
      const frames = [0.5, 0.7, 0.3, 0.6, 0.15, 0];
      let frame = 0;

      function step() {
        if (frame >= frames.length) {
          el.textContent = text;
          el.setAttribute("data-text", text);
          el.classList.remove("glitching");
          return;
        }
        const scrambled = scrambleFrame(text, frames[frame]);
        el.textContent = scrambled;
        el.setAttribute("data-text", scrambled);
        frame++;
        burstTimeout = setTimeout(step, 70);
      }
      step();
    }

    runBurst();
    loopInterval = setInterval(runBurst, intervalMs);

    return () => {
      clearTimeout(burstTimeout);
      clearInterval(loopInterval);
    };
  }, [text, intervalMs]);

  return (
    <Tag ref={ref} data-text={text} className={`glitch-text-el ${className}`}>
      {text}
      <style jsx>{`
        .glitch-text-el {
          position: relative;
          display: inline-block;
        }
        .glitch-text-el.glitching {
          animation: shakeSkew 0.45s steps(1, end);
        }
        .glitch-text-el.glitching::before,
        .glitch-text-el.glitching::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .glitch-text-el.glitching::before {
          color: #ff2e92;
          animation: sliceA 0.45s steps(1, end);
        }
        .glitch-text-el.glitching::after {
          color: #00e5ff;
          animation: sliceB 0.45s steps(1, end);
        }
        @keyframes shakeSkew {
          0% {
            transform: translate(0, 0) skewX(0deg);
          }
          10% {
            transform: translate(-6px, 2px) skewX(-8deg);
          }
          20% {
            transform: translate(5px, -3px) skewX(6deg);
          }
          30% {
            transform: translate(-4px, 3px) skewX(-4deg);
          }
          40% {
            transform: translate(6px, -2px) skewX(3deg);
          }
          50% {
            transform: translate(-3px, 0) skewX(-6deg);
          }
          60% {
            transform: translate(4px, 2px) skewX(2deg);
          }
          70% {
            transform: translate(-5px, -2px) skewX(-3deg);
          }
          85% {
            transform: translate(2px, 1px) skewX(1deg);
          }
          100% {
            transform: translate(0, 0) skewX(0deg);
          }
        }
        @keyframes sliceA {
          0% {
            clip-path: inset(0 0 100% 0);
            transform: translate(0, 0);
            opacity: 0;
          }
          8% {
            clip-path: inset(5% 0 70% 0);
            transform: translate(-10px, 0);
            opacity: 0.95;
          }
          22% {
            clip-path: inset(60% 0 15% 0);
            transform: translate(9px, 0);
            opacity: 0.95;
          }
          36% {
            clip-path: inset(30% 0 45% 0);
            transform: translate(-8px, 0);
            opacity: 0.95;
          }
          50% {
            clip-path: inset(0 0 80% 0);
            transform: translate(10px, 0);
            opacity: 0.95;
          }
          64% {
            clip-path: inset(70% 0 5% 0);
            transform: translate(-9px, 0);
            opacity: 0.95;
          }
          100% {
            clip-path: inset(0 0 100% 0);
            transform: translate(0, 0);
            opacity: 0;
          }
        }
        @keyframes sliceB {
          0% {
            clip-path: inset(0 0 100% 0);
            transform: translate(0, 0);
            opacity: 0;
          }
          10% {
            clip-path: inset(75% 0 0 0);
            transform: translate(10px, 0);
            opacity: 0.95;
          }
          24% {
            clip-path: inset(15% 0 60% 0);
            transform: translate(-9px, 0);
            opacity: 0.95;
          }
          38% {
            clip-path: inset(45% 0 30% 0);
            transform: translate(8px, 0);
            opacity: 0.95;
          }
          52% {
            clip-path: inset(80% 0 0 0);
            transform: translate(-10px, 0);
            opacity: 0.95;
          }
          66% {
            clip-path: inset(5% 0 70% 0);
            transform: translate(9px, 0);
            opacity: 0.95;
          }
          100% {
            clip-path: inset(0 0 100% 0);
            transform: translate(0, 0);
            opacity: 0;
          }
        }
      `}</style>
    </Tag>
  );
}
