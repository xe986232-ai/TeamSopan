"use client";

import Image from "next/image";
import { Instagram, Music2, Youtube } from "lucide-react";

const socialIconMap = {
  instagram: Instagram,
  tiktok: Music2,
  youtube: Youtube,
};

// Menampilkan daftar anggota tim. Data datang dari props `members` (diisi
// oleh app/anggota/page.js hasil query ke tabel `members` di Supabase) —
// bukan data dummy lagi.
export const TeamSectionSimple01 = ({ members = [], loadError }) => {
  return (
    <section className="bg-base py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          <span className="font-body font-semibold text-sm text-pink-500">Kenalan yuk</span>
          <h2 className="font-display font-extrabold mt-3 text-3xl text-ink sm:text-4xl">
            Anggota Komunitas Kami
          </h2>
          <p className="font-body font-normal mt-4 text-lg text-ink-muted">
            Kenalan sama member-member SOPAN TEAM — dari divisi Remix, Creator, sampai Leadis.
          </p>
        </div>

        {loadError && (
          <p className="mt-8 text-center text-sm text-rose-500">
            Gagal memuat data anggota: {loadError}
          </p>
        )}

        {!loadError && members.length === 0 && (
          <p className="mt-8 text-center text-sm text-ink-muted">
            Belum ada anggota aktif yang ditampilkan.
          </p>
        )}

        {members.length > 0 && (
          <div className="mt-12 md:mt-16">
            <ul className="grid w-full grid-cols-2 justify-items-center gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
              {members.map((item) => (
                <li key={item.id} className="flex flex-col items-center gap-2">
                  <Image
                    src={item.avatarUrl}
                    alt={item.name}
                    width={96}
                    height={96}
                    unoptimized
                    className="h-20 w-20 rounded-full object-cover border border-black/10 md:h-24 md:w-24"
                  />
                  <div className="text-center">
                    <h3 className="font-display font-bold text-lg text-ink">{item.name}</h3>
                    <p className="font-body font-medium text-sm text-pink-500">{item.title}</p>
                    {item.division && (
                      <p className="font-body font-normal text-sm text-ink-muted mt-0.5">{item.division}</p>
                    )}
                  </div>

                  {item.social && (
                    <div className="flex items-center gap-3">
                      {Object.entries(item.social).map(([key, url]) => {
                        const Icon = socialIconMap[key];
                        if (!Icon || !url) return null;
                        return (
                          <a
                            key={key}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${item.name} di ${key}`}
                            className="text-ink-muted hover:text-ink transition-colors"
                          >
                            <Icon size={16} />
                          </a>
                        );
                      })}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};
