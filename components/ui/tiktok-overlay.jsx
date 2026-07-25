"use client";

import * as React from "react";
import { Search, Plus, Heart, MessageCircle, Bookmark, Forward, Home, ShoppingBag, Mail, User } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// TiktokOverlay -- cuma "kulit" (chrome) UI ala TikTok: status bar, tab
// Teman/Mengikuti/Saran + search, kolom aksi kanan (avatar+follow, like,
// komen, simpan, bagikan), baris username/caption, dan bottom nav
// (Beranda/Toko/+/Kotak masuk/Profil).
//
// Overlay ini TIDAK render konten video/foto apa pun -- itu tanggung jawab
// `children` yang dikasih dari luar (misal video generate, foto, dsb).
// Pasang komponen ini di dalam mockup <Iphone15Pro> sebagai layer paling
// atas, dengan konten (children dari Iphone15Pro) sebagai layer di
// belakangnya. Semua angka (like/komen/simpan/bagikan) & teks bisa
// dikustomisasi lewat props, defaultnya cuma placeholder netral.
// ============================================================================
export function TiktokOverlay({
  className,
  activeTab = "Saran",
  tabs = ["Teman", "Mengikuti", "Saran"],
  likeCount = 0,
  commentCount = 0,
  saveCount = 0,
  shareCount = 0,
  username = "username",
  caption = "caption teks di sini",
  showBottomNav = true,
}) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 flex flex-col text-white select-none", className)}>
      {/* ---- status bar ---- */}
      <div className="flex items-center justify-between px-3 pt-2.5 text-[11px] font-medium">
        <span>9:41</span>
        <span className="tracking-wide">•••</span>
      </div>

      {/* ---- top bar: LIVE badge, tabs, search ---- */}
      <div className="mt-1 flex items-center justify-between px-3">
        <span className="rounded border border-white/90 px-1 py-px text-[9px] font-semibold">LIVE</span>
        <div className="flex items-center gap-3.5 text-[13px] text-white/70">
          {tabs.map((tab) => (
            <span
              key={tab}
              className={cn(
                "pb-1",
                tab === activeTab && "border-b-2 border-white font-medium text-white"
              )}
            >
              {tab}
            </span>
          ))}
        </div>
        <Search size={18} strokeWidth={2} />
      </div>

      {/* ---- spacer: area ini tempat children (video/foto) keliatan ---- */}
      <div className="flex-1" />

      {/* ---- kolom aksi kanan ---- */}
      <div className="absolute right-2.5 bottom-[92px] flex flex-col items-center gap-5">
        <div className="relative">
          <div className="h-11 w-11 rounded-full border-2 border-white bg-white/20" />
          <div className="absolute -bottom-2 left-1/2 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full bg-[#fe2c55]">
            <Plus size={13} strokeWidth={3} />
          </div>
        </div>

        <ActionIcon icon={Heart} count={likeCount} />
        <ActionIcon icon={MessageCircle} count={commentCount} />
        <ActionIcon icon={Bookmark} count={saveCount} />
        <ActionIcon icon={Forward} count={shareCount} />
      </div>

      {/* ---- username & caption ---- */}
      <div className="absolute bottom-[92px] left-3 right-16">
        <p className="text-[14px] font-medium">{username}</p>
        <p className="mt-1 text-[12px] leading-snug text-white/90">{caption}</p>
      </div>

      {/* ---- bottom nav ---- */}
      {showBottomNav && (
        <div className="flex items-center justify-between border-t border-white/10 bg-black/90 px-2 pb-3.5 pt-2.5">
          <NavItem icon={Home} label="Beranda" active />
          <NavItem icon={ShoppingBag} label="Toko" />
          <div className="flex flex-1 items-center justify-center">
            <div className="flex h-6.5 w-9 items-center justify-center rounded-lg bg-white">
              <Plus size={16} strokeWidth={2.5} className="text-black" />
            </div>
          </div>
          <NavItem icon={Mail} label="Kotak masuk" />
          <NavItem icon={User} label="Profil" />
        </div>
      )}
    </div>
  );
}

function ActionIcon({ icon: Icon, count }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <Icon size={32} strokeWidth={1.75} />
      <span className="text-[12px] font-medium">{count}</span>
    </div>
  );
}

function NavItem({ icon: Icon, label, active = false }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-0.5">
      <Icon size={20} strokeWidth={1.75} className={active ? "text-white" : "text-white/50"} />
      <span className={cn("text-[9px]", active ? "text-white" : "text-white/50")}>{label}</span>
    </div>
  );
}
