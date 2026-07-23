/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          muted: "rgb(var(--ink-muted) / <alpha-value>)",
          dim: "rgb(var(--ink-dim) / <alpha-value>)",
          // Fixed dark tone for solid CTA buttons — intentionally does NOT
          // flip in dark mode, since those buttons keep white text on them.
          solid: "#0B0A10",
        },
        base: {
          DEFAULT: "rgb(var(--base) / <alpha-value>)",
          elevated: "rgb(var(--base-elevated) / <alpha-value>)",
          line: "rgb(var(--base-line) / <alpha-value>)",
        },
        remix: {
          from: "#B026FF",
          to: "#FF2E92",
        },
        creator: {
          from: "#00E5FF",
          to: "#3D5AFE",
        },
        leadis: {
          from: "#FFD166",
          to: "#FF6FB5",
        },
        // Dipakai RainbowButton (components/ui/rainbow-button.jsx)
        "color-1": "hsl(var(--color-1))",
        "color-2": "hsl(var(--color-2))",
        "color-3": "hsl(var(--color-3))",
        "color-4": "hsl(var(--color-4))",
        "color-5": "hsl(var(--color-5))",
      },
      fontFamily: {
        // Outfit powers the whole site now (headings + body).
        display: ["var(--font-outfit)", "sans-serif"],
        body: ["var(--font-outfit)", "sans-serif"],
        // Unbounded — reserved exclusively for the "SOPAN TEAM" hero title.
        hero: ["var(--font-hero)", "sans-serif"],
        // Space Grotesk — untuk label/tag aksen kecil (mis. nama divisi berwarna).
        accent: ["var(--font-accent)", "sans-serif"],
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        "aurora": {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
        "scroll": {
          to: {
            transform: "translate(calc(-50% - 0.5rem))",
          },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "rainbow": {
          "0%": { "background-position": "0%" },
          "100%": { "background-position": "200%" },
        },
        "ripple": {
          "0%, 100%": {
            transform: "translate(-50%, -50%) scale(1)",
          },
          "50%": {
            transform: "translate(-50%, -50%) scale(0.9)",
          },
        },
      },
      animation: {
        "aurora": "aurora 60s linear infinite",
        "scroll": "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
        "float-slow": "float-slow 6s ease-in-out infinite",
        "rainbow": "rainbow var(--speed, 2s) infinite linear",
        "ripple": "ripple var(--duration,2s) ease calc(var(--i, 0)*.2s) infinite",
      },
    },
  },
  plugins: [],
};
