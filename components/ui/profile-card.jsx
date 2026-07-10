"use client";

import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";

/**
 * --- Glassmorphism Profile Card (versi ringan) ---
 * Kartu profil dengan efek glass sederhana, tanpa animation loop atau
 * mix-blend-mode berat. Warna mengikuti token project (ink/base).
 *
 * @param {string} avatarUrl - URL foto avatar.
 * @param {string} name - Nama.
 * @param {string} title - Jabatan / role.
 * @param {string} bio - Deskripsi singkat.
 * @param {{id:string, icon:React.ElementType, label:string, href:string}[]} socialLinks
 * @param {{text:string, href:string}} actionButton
 */
export default function ProfileCard({
  avatarUrl,
  name,
  title,
  bio,
  socialLinks = [],
  actionButton,
}) {
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <div className="relative w-full max-w-sm">
      <div
        className="relative flex flex-col items-center p-8 rounded-3xl border transition-all duration-500 ease-out backdrop-blur-xl bg-base-elevated/60 border-black/10 dark:border-white/10"
        style={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)" }}
      >
        <div className="w-24 h-24 mb-4 rounded-full p-1 border-2 border-black/10 dark:border-white/20">
          <img
            src={avatarUrl}
            alt={`Foto ${name}`}
            className="w-full h-full rounded-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/96x96/B026FF/white?text=${name?.charAt(0) || "?"}`;
            }}
          />
        </div>

        <h2 className="font-display font-bold text-2xl text-ink">{name}</h2>
        <p className="font-body font-medium text-sm mt-1 text-pink-500">{title}</p>
        {bio && (
          <p className="font-body font-normal mt-4 text-center text-sm leading-relaxed text-ink-muted">
            {bio}
          </p>
        )}

        {socialLinks.length > 0 && (
          <div className="w-1/2 h-px my-6 rounded-full bg-black/10 dark:bg-white/10" />
        )}

        {socialLinks.length > 0 && (
          <div className="flex items-center justify-center gap-3">
            {socialLinks.map((item) => (
              <SocialButton
                key={item.id}
                item={item}
                setHoveredItem={setHoveredItem}
                hoveredItem={hoveredItem}
              />
            ))}
          </div>
        )}

        {actionButton && <ActionButton action={actionButton} />}
      </div>

      <div className="absolute inset-0 rounded-3xl -z-10 opacity-30 blur-2xl bg-gradient-to-r from-remix-from/50 to-leadis-to/50" />
    </div>
  );
}

const SocialButton = ({ item, setHoveredItem, hoveredItem }) => (
  <div className="relative">
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ease-out group overflow-hidden bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10"
      onMouseEnter={() => setHoveredItem(item.id)}
      onMouseLeave={() => setHoveredItem(null)}
      aria-label={item.label}
    >
      <item.icon
        size={20}
        className="transition-all duration-200 ease-out text-ink-muted group-hover:text-ink"
      />
    </a>
    <Tooltip item={item} hoveredItem={hoveredItem} />
  </div>
);

const ActionButton = ({ action }) => (
  <a
    href={action.href}
    className="flex items-center gap-2 px-6 py-3 mt-8 rounded-full font-semibold text-sm transition-all duration-300 ease-out hover:scale-[1.03] active:scale-95 group text-white bg-ink-solid dark:bg-white dark:text-ink-solid"
    style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
  >
    <span>{action.text}</span>
    <ArrowUpRight
      size={16}
      className="transition-transform duration-300 ease-out group-hover:rotate-45"
    />
  </a>
);

const Tooltip = ({ item, hoveredItem }) => (
  <div
    role="tooltip"
    className={`absolute -top-11 left-1/2 -translate-x-1/2 z-50 px-3 py-1.5 rounded-lg backdrop-blur-md border text-xs font-medium whitespace-nowrap transition-all duration-300 ease-out pointer-events-none bg-base-elevated text-ink border-black/10 dark:border-white/10 ${
      hoveredItem === item.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
    }`}
    style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
  >
    {item.label}
  </div>
);
