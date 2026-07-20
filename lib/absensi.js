// Helper untuk sesi absensi.
// Konsep: link absensi = /absensi/{divisi}-{token-acak}, misal /absensi/remix-k3f9x2.
// Prefix divisi dipakai supaya link tetap "acak" tapi tetap ketahuan
// itu sesi punya divisi mana. Nanti kalau dashboard admin sudah dibuat,
// generateRoomId() ini yang dipanggil pas admin klik "Buat Sesi Absensi".

export const DIVISIONS_ABSENSI = {
  remix: {
    id: "remix",
    name: "Remix",
    accentFrom: "#B026FF",
    accentTo: "#FF2E92",
  },
  creator: {
    id: "creator",
    name: "Creator",
    accentFrom: "#00E5FF",
    accentTo: "#3D5AFE",
  },
  leadis: {
    id: "leadis",
    name: "Leadis",
    accentFrom: "#FFD166",
    accentTo: "#FF6FB5",
  },
};

// Anggota yang "sudah absen duluan" — cuma buat preview biar list-nya
// gak keliatan sepi pas halaman baru dibuka. Nanti diganti data asli
// dari database begitu backend sudah nyambung.
export const SEED_MEMBERS = {
  remix: [
    { name: "Dio P.", minutesAgo: 6 },
    { name: "Fajar N.", minutesAgo: 14 },
  ],
  creator: [
    { name: "Yoga S.", minutesAgo: 3 },
    { name: "Rian K.", minutesAgo: 9 },
  ],
  leadis: [
    { name: "Nadia R.", minutesAgo: 5 },
    { name: "Vira L.", minutesAgo: 11 },
  ],
};

export function generateRoomId(divisionId) {
  const token =
    Math.random().toString(36).slice(2, 8) +
    Date.now().toString(36).slice(-4);
  return `${divisionId}-${token}`;
}

export function parseRoomId(roomId) {
  if (!roomId) return null;
  const [divisionId] = roomId.split("-");
  return DIVISIONS_ABSENSI[divisionId] || null;
}
