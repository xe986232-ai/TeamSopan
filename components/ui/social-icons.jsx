// Icon asli tiap platform sosmed (bukan icon generik lucide), dipakai di
// menu "Tambah Sosial Media" & tombol link sosmed pada ProfileDashboardSection.
// Semua SVG pakai viewBox 24x24 biar gampang disamain ukurannya lewat prop size.

export function InstagramIcon({ size = 20, className }) {
  const gradId = "ig-gradient";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={gradId} cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5.5" fill={`url(#${gradId})`} />
      <rect
        x="6.2"
        y="6.2"
        width="11.6"
        height="11.6"
        rx="3.6"
        fill="none"
        stroke="#fff"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="3.4" fill="none" stroke="#fff" strokeWidth="1.6" />
      <circle cx="16.4" cy="7.6" r="1" fill="#fff" />
    </svg>
  );
}

export function YoutubeIcon({ size = 20, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="1.5" y="5" width="21" height="14" rx="4" fill="#FF0000" />
      <path d="M10 8.6l6 3.4-6 3.4V8.6z" fill="#fff" />
    </svg>
  );
}

export function TiktokIcon({ size = 20, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="1.5" y="1.5" width="21" height="21" rx="5.5" fill="#000" />
      <path
        d="M15.4 5.5c.4 1.5 1.4 2.5 3.1 2.6v2.2c-1.1 0-2.1-.3-3-.9v4.6c0 2.3-1.9 4.2-4.2 4.2S7 16.3 7 14s1.9-4.2 4.2-4.2c.2 0 .4 0 .6.1v2.3c-.2-.1-.4-.1-.6-.1-1.1 0-1.9.9-1.9 1.9s.9 1.9 1.9 1.9 2-.8 2-1.9V5.5h2.2z"
        fill="#fff"
      />
      <path
        d="M14.8 5.5c.4 1.5 1.4 2.5 3.1 2.6v2.2c-1.1 0-2.1-.3-3-.9v4.6c0 2.3-1.9 4.2-4.2 4.2S6.5 16.3 6.5 14s1.9-4.2 4.2-4.2c.2 0 .4 0 .6.1v2.3c-.2-.1-.4-.1-.6-.1-1.1 0-1.9.9-1.9 1.9s.9 1.9 1.9 1.9 2-.8 2-1.9V5.5h2.1z"
        fill="#25F4EE"
        opacity="0.75"
        transform="translate(-0.6,0)"
      />
    </svg>
  );
}

export function FacebookIcon({ size = 20, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="1.5" y="1.5" width="21" height="21" rx="5.5" fill="#1877F2" />
      <path
        d="M14.7 22V13.9h2.7l.4-3.2h-3.1V8.6c0-.9.3-1.6 1.6-1.6h1.7V4.1c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v2.5H8.8v3.2h2.7V22h3.2z"
        fill="#fff"
      />
    </svg>
  );
}

export const SOCIAL_PLATFORMS = [
  {
    key: "instagram",
    field: "instagram_url",
    label: "Instagram",
    icon: InstagramIcon,
    placeholder: "https://instagram.com/username",
  },
  {
    key: "youtube",
    field: "youtube_url",
    label: "YouTube",
    icon: YoutubeIcon,
    placeholder: "https://youtube.com/@username",
  },
  {
    key: "tiktok",
    field: "tiktok_url",
    label: "TikTok",
    icon: TiktokIcon,
    placeholder: "https://tiktok.com/@username",
  },
  {
    key: "facebook",
    field: "facebook_url",
    label: "Facebook",
    icon: FacebookIcon,
    placeholder: "https://facebook.com/username",
  },
];

// --- Versi outline / single-color ---
// Bentuknya tetap mengikuti logo asli tiap platform (bukan icon generik
// kayak Music2 buat TikTok), tapi tanpa warna brand — semua pakai
// `currentColor` biar gampang di-styling ikut warna teks sekitarnya
// (mis. text-ink-muted hover:text-ink). Dipakai di kartu anggota /anggota.

export function InstagramGlyph({ size = 18, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YoutubeGlyph({ size = 18, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.3 9.1l5.2 2.9-5.2 2.9V9.1z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TiktokGlyph({ size = 18, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M14 3v10.3a3.2 3.2 0 1 1-2.4-3.1" />
      <path d="M14 3c.4 2.6 2.1 4.3 4.3 4.5" />
    </svg>
  );
}

export function FacebookGlyph({ size = 18, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9.2" />
      <path d="M13.8 21.5v-7.3h2.4l.4-2.9h-2.8V9.4c0-.8.2-1.4 1.4-1.4h1.5V5.4c-.3 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6v2.4H8.6v2.9h2.5v7.3" />
    </svg>
  );
}

// Mapping key sosmed -> komponen glyph outline, dipakai TeamSectionSimple01.
export const SOCIAL_GLYPHS = {
  instagram: InstagramGlyph,
  youtube: YoutubeGlyph,
  tiktok: TiktokGlyph,
  facebook: FacebookGlyph,
};
