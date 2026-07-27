import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { divisionShortLabel } from "@/lib/division";
import DivisionImageRingClient from "./DivisionImageRingClient";

// Warna badge per divisi, dipertahankan sama seperti sebelumnya supaya
// identitas visual tiap divisi (Remix/Creator/Leadis) tetap konsisten.
const DIVISION_COLORS = {
  remix: { from: "#B026FF", to: "#FF2E92" },
  creator: { from: "#00E5FF", to: "#3D5AFE" },
  leadis: { from: "#FFD166", to: "#FF6FB5" },
};
const DIVISION_ORDER = ["remix", "creator", "leadis"];
const DEFAULT_COLORS = DIVISION_COLORS.remix;

// Ring ini sengaja diisi MINIMAL 20 kartu supaya nggak keliatan kosong/sepi
// pas member aktif masih dikit (mis. baru 3-4 orang). Slot yang belum
// kepakai member asli ditampilkan sebagai kartu "logo default" (bukan
// wajah member palsu). Begitu ada member baru daftar, satu slot default
// otomatis kegantiin member itu -- kalau member aktif sudah lebih dari 20,
// slot default habis semua dan ring isinya murni member asli (bisa lebih
// dari 20 kartu, ring makin padat/halus).
const MIN_SLOT_COUNT = 20;

function buildPlaceholderSlides(count) {
  return Array.from({ length: count }, (_, i) => {
    const divisionSlug = DIVISION_ORDER[i % DIVISION_ORDER.length];
    const colors = DIVISION_COLORS[divisionSlug];
    return {
      id: `slot-default-${i}`,
      isPlaceholder: true,
      division: divisionShortLabel(divisionSlug),
      from: colors.from,
      to: colors.to,
    };
  });
}

// Dipakai HANYA kalau Supabase belum di-setup / lagi error total -- biar
// section ini tidak tampil kosong/rusak. Tetap pakai kartu logo default,
// bukan foto placeholder Unsplash lagi.
const FALLBACK_SLIDES = buildPlaceholderSlides(MIN_SLOT_COUNT);

// Ambil SEMUA member berstatus "aktif" dari database (bukan cuma sampel
// beberapa) -- jumlah kartu ASLI di ring mengikuti persis jumlah baris
// yang balik dari query ini. Sisanya (kalau kurang dari MIN_SLOT_COUNT)
// diisi kartu logo default lewat buildPlaceholderSlides di atas.
async function getMemberSlides() {
  try {
    // Sama seperti AdminSection & halaman /anggota: dibaca dari Server
    // Component pakai admin client, bukan dari browser, jadi tetap aman
    // meskipun tabel `members` tidak punya policy publik.
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("members")
      .select("id, full_name, division, avatar_url")
      .eq("status", "aktif")
      .order("joined_at", { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) return { slides: FALLBACK_SLIDES, activeCount: 0 };

    const memberSlides = data.map((m) => {
      const colors = DIVISION_COLORS[m.division] || DEFAULT_COLORS;
      return {
        id: m.id,
        isPlaceholder: false,
        name: m.full_name,
        division: divisionShortLabel(m.division),
        // Kalau member belum upload foto profil, tetap tampilkan sesuatu
        // yang masuk akal (inisial nama) daripada gambar rusak/kosong.
        avatarUrl:
          m.avatar_url ||
          `https://placehold.co/500x700/${colors.from.replace("#", "")}/white?text=${encodeURIComponent(
            m.full_name?.charAt(0) || "?"
          )}`,
        from: colors.from,
        to: colors.to,
      };
    });

    const shortfall = MIN_SLOT_COUNT - memberSlides.length;
    const slides =
      shortfall > 0
        ? [...memberSlides, ...buildPlaceholderSlides(shortfall)]
        : memberSlides;

    return { slides, activeCount: memberSlides.length };
  } catch (err) {
    console.error(
      "[DivisionImageRing] Gagal ambil data members aktif dari Supabase:",
      err
    );
    return { slides: FALLBACK_SLIDES, activeCount: 0 };
  }
}

export default async function DivisionImageRing() {
  const { slides, activeCount } = await getMemberSlides();
  return <DivisionImageRingClient slides={slides} activeCount={activeCount} />;
}
