import DashboardShell from "@/components/dashboard/DashboardShell";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardRightPanel from "@/components/dashboard/DashboardRightPanel";
import LogoStylePicker from "./LogoStylePicker";
import AnnouncementBannerEditor from "./AnnouncementBannerEditor";
import OpenMemberToggle from "./OpenMemberToggle";
import HeroTextEffectPicker from "./HeroTextEffectPicker";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { DEFAULT_LOGO_STYLE, DEFAULT_LOGO_SHAPE } from "@/lib/logo-styles";
import { DEFAULT_HERO_TEXT_EFFECT } from "@/lib/hero-text-effects";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pengaturan | Dashboard SOPAN TEAM",
};

const SETTINGS_FIELDS = [
  { label: "Nama Situs", value: "SOPAN TEAM", type: "text" },
  { label: "Email Kontak", value: "admin@sopanteam.id", type: "text" },
];

const SETTINGS_TOGGLES = [
  { label: "Notifikasi pendaftar baru", desc: "Kirim notifikasi tiap ada formulir pendaftaran masuk.", checked: true },
  { label: "Mode pemeliharaan", desc: "Tampilkan halaman maintenance ke pengunjung situs.", checked: false },
];

const DEFAULT_SITE_SETTINGS = {
  logoStyle: DEFAULT_LOGO_STYLE,
  logoShape: DEFAULT_LOGO_SHAPE,
  bannerEnabled: false,
  bannerText: "",
  bannerLink: "",
  heroTextEffect: DEFAULT_HERO_TEXT_EFFECT,
  openMember: true,
};

async function getSiteSettings() {
  try {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select(
        "logo_style, logo_shape, banner_enabled, banner_text, banner_link, hero_text_effect, open_member"
      )
      .eq("id", 1)
      .maybeSingle();

    if (error || !data) {
      throw error || new Error("site_settings kosong / tidak ada data");
    }

    return {
      logoStyle: data.logo_style || DEFAULT_LOGO_STYLE,
      logoShape: data.logo_shape || DEFAULT_LOGO_SHAPE,
      bannerEnabled: !!data.banner_enabled,
      bannerText: data.banner_text || "",
      bannerLink: data.banner_link || "",
      heroTextEffect: data.hero_text_effect || DEFAULT_HERO_TEXT_EFFECT,
      openMember: data.open_member === null || data.open_member === undefined
        ? true
        : !!data.open_member,
    };
  } catch (err) {
    console.error("[dashboard/pengaturan] Gagal ambil site_settings:", err);
    return DEFAULT_SITE_SETTINGS;
  }
}

export default async function PengaturanPage() {
  const settings = await getSiteSettings();

  return (
    <DashboardShell rightPanel={<DashboardRightPanel />}>
      <DashboardTopbar
        title="Pengaturan"
        subtitle="Atur informasi umum dan preferensi situs SOPAN TEAM."
        searchPlaceholder="Cari pengaturan..."
      />

      <LogoStylePicker
        currentStyle={settings.logoStyle}
        currentShape={settings.logoShape}
      />

      <HeroTextEffectPicker currentEffect={settings.heroTextEffect} />

      <AnnouncementBannerEditor
        currentEnabled={settings.bannerEnabled}
        currentText={settings.bannerText}
        currentLink={settings.bannerLink}
      />

      <OpenMemberToggle currentEnabled={settings.openMember} />

      <div className="rounded-2xl border border-black/[0.06] p-5 mb-4 flex flex-col gap-4">
        {SETTINGS_FIELDS.map((field) => (
          <div key={field.label}>
            <label className="text-xs font-semibold text-black/50 mb-1.5 block">
              {field.label}
            </label>
            <input
              type={field.type}
              defaultValue={field.value}
              className="w-full rounded-xl border border-black/10 bg-black/[0.02] px-3.5 py-2.5 text-sm text-black/80 outline-none focus:border-black/20"
            />
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-black/[0.06] overflow-hidden">
        {SETTINGS_TOGGLES.map((toggle, i) => (
          <div
            key={toggle.label}
            className={`flex items-center justify-between gap-4 p-4 ${
              i !== SETTINGS_TOGGLES.length - 1 ? "border-b border-black/[0.06]" : ""
            }`}
          >
            <div>
              <p className="font-body font-semibold text-sm text-[#111827]">
                {toggle.label}
              </p>
              <p className="text-xs text-black/45 mt-0.5">{toggle.desc}</p>
            </div>
            <span
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                toggle.checked ? "bg-[#1677F5]" : "bg-black/10"
              }`}
            >
              <span
                className={`absolute h-4.5 w-4.5 rounded-full bg-white shadow-sm transition-all ${
                  toggle.checked ? "left-[22px]" : "left-1"
                }`}
              />
            </span>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
