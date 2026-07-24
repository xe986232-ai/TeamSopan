"use client";

// Bar tipis pengumuman yang tampil di atas navbar (dipanggil dari
// components/ui/site-navbar.jsx, di dalam wrapper sticky yang sama biar
// ikut nempel pas discroll). Konten & toggle-nya 100% dari database
// (tabel site_settings, kolom banner_enabled/banner_text/banner_link),
// diatur admin dari app/dashboard/pengaturan -- lihat
// AnnouncementBannerEditor.jsx. Tidak render apa-apa kalau nonaktif atau
// teksnya kosong, jadi aman dipasang permanen di navbar.
export default function AnnouncementBanner({ enabled, text, link }) {
  const trimmedText = (text || "").trim();
  if (!enabled || !trimmedText) return null;

  const isExternal = /^https?:\/\//i.test(link || "");

  const content = (
    <span className="flex-1 text-center truncate">{trimmedText}</span>
  );

  return (
    <div className="w-full bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] text-white">
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm">
        {link ? (
          <a
            href={link}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="flex-1 text-center font-medium truncate hover:underline underline-offset-2"
          >
            {trimmedText}
          </a>
        ) : (
          content
        )}
      </div>
    </div>
  );
}
