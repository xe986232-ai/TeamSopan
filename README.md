# SOPAN TEAM — Landing Page

Landing page komunitas SOPAN TEAM dengan tiga divisi: **Remix**, **Creator**, dan **Leadis**.
Dibangun pakai Next.js (App Router), Tailwind CSS, dan Framer Motion.

## Cara Menjalankan

1. Pastikan sudah install [Node.js](https://nodejs.org) versi 18 ke atas.
2. Buka folder project ini lewat terminal, lalu jalankan:

   ```bash
   npm install
   npm run dev
   ```

3. Buka `http://localhost:3000` di browser.

> Catatan: saat pertama kali `npm run dev` atau `npm run build`, Next.js akan
> mengunduh font (Unbounded & Plus Jakarta Sans) dari Google Fonts secara
> otomatis — pastikan komputer kamu terkoneksi internet.

## Struktur Project

```
app/
  layout.js       -> font & metadata global
  page.js         -> menyusun semua section jadi 1 halaman
  globals.css     -> style dasar + reduced-motion support
components/
  ui/                          -> komponen asli Aceternity (nama & props sesuai dokumentasi resmi)
    aurora-background.jsx      -> Aurora Background
    floating-navbar.jsx        -> Floating Navbar (export: FloatingNav)
    3d-card.jsx                -> 3D Card Effect (CardContainer, CardBody, CardItem)
    bento-grid.jsx             -> Bento Grid (BentoGrid, BentoGridItem)
    infinite-moving-cards.jsx  -> Infinite Moving Cards (marquee)
  Hero.jsx              -> pakai AuroraBackground
  AboutSection.jsx       -> manifesto singkat tim
  DivisionsSection.jsx   -> 3 kartu divisi pakai 3D Card Effect
  ShowcaseSection.jsx    -> marquee showcase karya pakai Infinite Moving Cards
  Footer.jsx             -> CTA gabung + link sosial
lib/
  utils.js        -> helper gabungin className Tailwind (dipakai semua komponen ui/)
```

> Komponen di `components/ui/` adalah implementasi dari komponen Aceternity UI
> (Aurora Background, Floating Navbar, 3D Card Effect, Bento Grid, Infinite
> Moving Cards) — dibangun mengikuti nama, props, dan perilaku resmi mereka.
> Kalau kamu mau versi 1:1 langsung dari sumbernya, jalankan command CLI resmi
> di project ini (butuh koneksi internet ke ui.aceternity.com):
> ```bash
> npx shadcn@latest add @aceternity/aurora-background
> npx shadcn@latest add @aceternity/floating-navbar
> npx shadcn@latest add @aceternity/3d-card-effect
> npx shadcn@latest add @aceternity/bento-grid
> npx shadcn@latest add @aceternity/infinite-moving-cards
> ```
> Ini akan menimpa file yang senama di `components/ui/` dengan source code asli dari Aceternity.

## Yang Bisa Kamu Ganti

- **Teks & copy**: langsung edit di tiap file component (`Hero.jsx`,
  `AboutSection.jsx`, `DivisionsSection.jsx`, `ShowcaseSection.jsx`).
- **Data divisi**: array `DIVISIONS` di `components/DivisionsSection.jsx`
  — ganti `description`, `tags`, atau warna aksen (`accent`).
- **Data showcase/marquee**: array `SHOWCASE` di `components/ShowcaseSection.jsx`.
- **Warna tema**: `tailwind.config.js` bagian `colors` (`remix`, `creator`, `leadis`, `base`, `ink`).
- **Logo**: taruh file logo di folder `public/`, lalu pakai `<Image>` dari `next/image` di `components/ui/floating-navbar.jsx`.
- **Link sosial & kontak**: `components/Footer.jsx`.

## Deploy

Paling gampang pakai [Vercel](https://vercel.com) — tinggal push ke GitHub,
import repo-nya di Vercel, otomatis ke-deploy dengan free tier.
