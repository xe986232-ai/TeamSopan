"use client";

import * as React from "react";
import { Instagram, Music2, Youtube, Pencil, Loader2, LogOut } from "lucide-react";
import { TextField } from "./ui/text-field";
import { TextareaField } from "./ui/textarea-field";
import { Button } from "./ui/button";
import { ToastProvider, useToast } from "./ui/toast";
import { useRouter } from "next/navigation";
import { createPublicSupabaseClient } from "@/lib/supabase/client";
import { divisionLabel } from "@/lib/division";
import { updateOwnProfile } from "@/app/profil/actions";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB

// Dashboard profil member yang lagi login — hasil duplikat & pengembangan
// dari /preview-profilecard. Bedanya: datanya asli dari database (bukan
// contoh statis), avatar bisa diganti lewat ikon pensil, dan ada form
// buat edit nama, bio & link sosmed sendiri.
export default function ProfileDashboardSection({ profile }) {
  return (
    <ToastProvider>
      <ProfileDashboardInner profile={profile} />
    </ToastProvider>
  );
}

function ProfileDashboardInner({ profile }) {
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = React.useRef(null);

  const [data, setData] = React.useState(profile);
  const [avatarPreview, setAvatarPreview] = React.useState(profile.avatar_url || null);
  const [avatarLoading, setAvatarLoading] = React.useState(false);

  const [form, setForm] = React.useState({
    full_name: profile.full_name || "",
    bio: profile.bio || "",
    instagram_url: profile.instagram_url || "",
    tiktok_url: profile.tiktok_url || "",
    youtube_url: profile.youtube_url || "",
  });
  const [saving, setSaving] = React.useState(false);

  const updateField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // Klik ikon pensil -> buka file picker -> begitu file dipilih, langsung
  // upload & simpan (tanpa perlu klik tombol simpan terpisah untuk avatar).
  function openAvatarPicker() {
    fileInputRef.current?.click();
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type?.startsWith("image/")) {
      toast({
        variant: "error",
        title: "File tidak didukung",
        description: "Pilih file gambar (jpg, png, webp, dll).",
      });
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      toast({
        variant: "error",
        title: "Ukuran terlalu besar",
        description: "Ukuran foto maksimal 5MB.",
      });
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setAvatarPreview(localPreview);
    setAvatarLoading(true);

    try {
      const formData = new FormData();
      formData.set("full_name", form.full_name);
      formData.set("bio", form.bio);
      formData.set("instagram_url", form.instagram_url);
      formData.set("tiktok_url", form.tiktok_url);
      formData.set("youtube_url", form.youtube_url);
      formData.set("avatar", file);

      const result = await updateOwnProfile(formData);
      if (result.error) throw new Error(result.error);

      setData(result.data);
      setAvatarPreview(result.data.avatar_url);
      toast({
        variant: "success",
        title: "Foto profil diperbarui",
        description: "Avatar baru kamu sudah tersimpan.",
      });
      router.refresh();
    } catch (err) {
      toast({
        variant: "error",
        title: "Gagal ganti foto",
        description: err.message || "Coba lagi dalam beberapa saat, ya.",
      });
      setAvatarPreview(data.avatar_url || null);
    } finally {
      setAvatarLoading(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.full_name.trim()) {
      toast({
        variant: "error",
        title: "Nama tidak boleh kosong",
        description: "Isi dulu nama kamu sebelum menyimpan.",
      });
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.set("full_name", form.full_name.trim());
      formData.set("bio", form.bio.trim());
      formData.set("instagram_url", form.instagram_url.trim());
      formData.set("tiktok_url", form.tiktok_url.trim());
      formData.set("youtube_url", form.youtube_url.trim());

      const result = await updateOwnProfile(formData);
      if (result.error) throw new Error(result.error);

      setData(result.data);
      toast({
        variant: "success",
        title: "Profil disimpan",
        description: "Perubahan kamu berhasil disimpan.",
      });
      router.refresh();
    } catch (err) {
      toast({
        variant: "error",
        title: "Gagal menyimpan",
        description: err.message || "Coba lagi dalam beberapa saat, ya.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    const supabase = createPublicSupabaseClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <section className="bg-base py-16 sm:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <span className="font-body font-semibold text-sm tracking-[0.3em] uppercase text-ink-muted">
            Dashboard
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl mt-3 text-ink">
            Profil Saya
          </h1>
          <p className="font-body text-sm text-ink-muted mt-2">
            Kelola informasi profil yang tampil di SOPAN TEAM.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,320px)_1fr] items-start">
          {/* Kartu preview profil, dengan ikon pensil buat ganti avatar */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-full max-w-sm">
              <div
                className="relative flex flex-col items-center p-8 rounded-3xl border transition-all duration-500 ease-out backdrop-blur-xl bg-gradient-to-br from-base-elevated/70 via-base-elevated/60 to-remix-from/10 dark:to-leadis-to/10 border-black/10 dark:border-white/10 overflow-hidden"
                style={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="pointer-events-none absolute -top-24 -right-24 w-56 h-56 rounded-full bg-gradient-to-br from-remix-from/25 via-creator-from/15 to-transparent blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 w-56 h-56 rounded-full bg-gradient-to-tr from-leadis-to/20 to-transparent blur-3xl" />

                <div className="relative z-10 flex flex-col items-center w-full">
                  <div className="relative w-24 h-24 mb-4">
                    <div className="w-24 h-24 rounded-full p-1 border-2 border-black/10 dark:border-white/20">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt={`Foto ${data.full_name}`}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full flex items-center justify-center bg-black/5 dark:bg-white/10 font-display font-bold text-2xl text-ink">
                          {data.full_name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                      )}
                      {avatarLoading && (
                        <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40">
                          <Loader2 size={20} className="animate-spin text-white" />
                        </div>
                      )}
                    </div>

                    {/* Ikon pensil buat ganti avatar */}
                    <button
                      type="button"
                      onClick={openAvatarPicker}
                      disabled={avatarLoading}
                      aria-label="Ganti foto profil"
                      className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-base bg-ink-solid text-white dark:bg-white dark:text-ink-solid shadow-md hover:opacity-90 transition-opacity disabled:opacity-60"
                    >
                      <Pencil size={13} />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="sr-only"
                      aria-label="Upload foto profil baru"
                    />
                  </div>

                  <h2 className="font-display font-bold text-2xl text-ink text-center">
                    {data.full_name}
                  </h2>
                  <p className="font-body font-medium text-sm mt-1 text-pink-500">
                    {divisionLabel(data.division)}
                  </p>
                  {data.bio && (
                    <p className="font-body font-normal mt-4 text-center text-sm leading-relaxed text-ink-muted">
                      {data.bio}
                    </p>
                  )}

                  {(data.instagram_url || data.tiktok_url || data.youtube_url) && (
                    <div className="w-1/2 h-px my-6 rounded-full bg-black/10 dark:bg-white/10" />
                  )}

                  {(data.instagram_url || data.tiktok_url || data.youtube_url) && (
                    <div className="flex items-center justify-center gap-3">
                      {data.instagram_url && (
                        <SocialButton icon={Instagram} label="Instagram" href={data.instagram_url} />
                      )}
                      {data.tiktok_url && (
                        <SocialButton icon={Music2} label="TikTok" href={data.tiktok_url} />
                      )}
                      {data.youtube_url && (
                        <SocialButton icon={Youtube} label="YouTube" href={data.youtube_url} />
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute inset-0 rounded-3xl -z-10 opacity-30 blur-2xl bg-gradient-to-r from-remix-from/50 to-leadis-to/50" />
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ink transition-colors"
            >
              <LogOut size={13} />
              Keluar
            </button>
          </div>

          {/* Form edit profil */}
          <form
            onSubmit={handleSave}
            className="space-y-5 rounded-3xl border border-black/10 dark:border-white/10 bg-base-elevated/50 p-6 sm:p-8"
          >
            <h3 className="font-display font-bold text-lg text-ink">Edit Profil</h3>

            <TextField
              id="full_name"
              label="Nama"
              placeholder="Nama kamu"
              value={form.full_name}
              onChange={updateField("full_name")}
            />

            <TextareaField
              id="bio"
              label="Bio"
              placeholder="Ceritakan sedikit tentang kamu..."
              rows={4}
              value={form.bio}
              onChange={updateField("bio")}
            />

            <div className="grid gap-4 sm:grid-cols-1">
              <TextField
                id="instagram_url"
                label="Instagram"
                placeholder="https://instagram.com/username"
                value={form.instagram_url}
                onChange={updateField("instagram_url")}
              />
              <TextField
                id="tiktok_url"
                label="TikTok"
                placeholder="https://tiktok.com/@username"
                value={form.tiktok_url}
                onChange={updateField("tiktok_url")}
              />
              <TextField
                id="youtube_url"
                label="YouTube"
                placeholder="https://youtube.com/@username"
                value={form.youtube_url}
                onChange={updateField("youtube_url")}
              />
            </div>

            <Button
              type="submit"
              disabled={saving}
              className="group relative w-full sm:w-auto disabled:opacity-100"
            >
              <span className={saving ? "opacity-0" : "opacity-100"}>
                Simpan Perubahan
              </span>
              {saving && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Loader2 size={16} className="animate-spin" />
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

const SocialButton = ({ icon: Icon, label, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ease-out bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10"
  >
    <Icon size={20} className="text-ink-muted hover:text-ink transition-colors" />
  </a>
);
