"use client";

import { Instagram, Linkedin, Twitter } from "lucide-react";

const teamMembers = [
  {
    name: "Raka A.",
    title: "Lead Remixer",
    avatarUrl:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    division: "Remix",
    social: { twitter: "#", linkedin: "#" },
  },
  {
    name: "Dio P.",
    title: "Sound Designer",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    division: "Remix",
    social: { twitter: "#", instagram: "#" },
  },
  {
    name: "Fajar N.",
    title: "Mix Engineer",
    avatarUrl:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=400&q=80",
    division: "Remix",
    social: { linkedin: "#" },
  },
  {
    name: "Bagas W.",
    title: "Video Editor",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    division: "Creator",
    social: { instagram: "#", twitter: "#" },
  },
  {
    name: "Yoga S.",
    title: "Colorist",
    avatarUrl:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80",
    division: "Creator",
    social: { instagram: "#" },
  },
  {
    name: "Rian K.",
    title: "Motion Designer",
    avatarUrl:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80",
    division: "Creator",
    social: { linkedin: "#", twitter: "#" },
  },
  {
    name: "Sasa M.",
    title: "Content Creator",
    avatarUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    division: "Leadis",
    social: { instagram: "#" },
  },
  {
    name: "Nadia R.",
    title: "Host & Showcase",
    avatarUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    division: "Leadis",
    social: { linkedin: "#" },
  },
  {
    name: "Vira L.",
    title: "Personal Brand",
    avatarUrl:
      "https://images.unsplash.com/photo-1517849845537-4d257902861a?auto=format&fit=crop&w=400&q=80",
    division: "Leadis",
    social: { instagram: "#", linkedin: "#" },
  },
];

const socialIconMap = {
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
};

export const TeamSectionSimple01 = () => {
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

        <div className="mt-12 md:mt-16">
          <ul className="grid w-full grid-cols-2 justify-items-center gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
            {teamMembers.map((item) => (
              <li key={item.name} className="flex flex-col items-center gap-2">
                <img
                  src={item.avatarUrl}
                  alt={item.name}
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
      </div>
    </section>
  );
};