"use client";

import ProfileCard from "@/components/ui/profile-card";
import { Instagram, Music2, Youtube } from "lucide-react";

const sample = {
  name: "Candra",
  title: "Divisi Remix",
  bio: "Admin Divisi Remix, mengelola karya dan koordinasi kreator remix di SOPAN TEAM.",
  avatarUrl:
    "https://images.unsplash.com/photo-1603871165848-0aa92c869fa1?auto=format&fit=crop&q=80&w=800",
  socialLinks: [
    { id: "instagram", icon: Instagram, label: "Instagram", href: "#" },
    { id: "tiktok", icon: Music2, label: "TikTok", href: "#" },
    { id: "youtube", icon: Youtube, label: "YouTube", href: "#" },
  ],
  actionButton: { text: "Contact Me", href: "#" },
};

export default function ProfileCardPreviewSection() {
  return (
    <section className="bg-base py-16 sm:py-24 px-4">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <p className="font-body font-semibold text-sm tracking-widest text-pink-500 uppercase">
          Preview
        </p>
        <h1 className="font-display font-extrabold mt-2 text-3xl sm:text-4xl text-ink">
          ProfileCard
        </h1>
        <p className="font-body font-normal text-ink-muted mt-2 text-sm">
          Halaman sementara buat lihat tampilan komponen ProfileCard.
        </p>
      </div>

      <div className="max-w-6xl mx-auto flex justify-center">
        <ProfileCard {...sample} />
      </div>
    </section>
  );
}
