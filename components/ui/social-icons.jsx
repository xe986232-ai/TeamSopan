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
