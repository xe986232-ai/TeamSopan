// Data dummy buat tampilan dashboard. Semua di sini murni contoh — belum
// nyambung ke database apapun. Nanti pas backend udah ada, isi array di
// file ini yang bakal diganti jadi fetch dari Firebase/API, tapi bentuk
// datanya (shape) diusahakan udah mirip apa yang bakal dipakai beneran.

export const MEMBERS = [
  { id: "m1", name: "Raka Aditya", username: "rakaaditya", division: "remix", role: "Lead Remixer", status: "aktif", joinedAt: "12 Jan 2026" },
  { id: "m2", name: "Dio Prakoso", username: "diopk", division: "remix", role: "Sound Designer", status: "aktif", joinedAt: "18 Jan 2026" },
  { id: "m3", name: "Fajar Nugraha", username: "fajarn", division: "remix", role: "Mix Engineer", status: "nonaktif", joinedAt: "02 Feb 2026" },
  { id: "m4", name: "Bagas Wicaksono", username: "bagasw", division: "creator", role: "Video Editor", status: "aktif", joinedAt: "20 Feb 2026" },
  { id: "m5", name: "Yoga Saputra", username: "yogasp", division: "creator", role: "Colorist", status: "aktif", joinedAt: "05 Mar 2026" },
  { id: "m6", name: "Rian Kurniawan", username: "riank", division: "creator", role: "Motion Designer", status: "aktif", joinedAt: "14 Mar 2026" },
  { id: "m7", name: "Sasa Maharani", username: "sasam", division: "leadis", role: "Content Creator", status: "aktif", joinedAt: "01 Apr 2026" },
  { id: "m8", name: "Nadia Ramadhani", username: "nadiar", division: "leadis", role: "Host & Showcase", status: "aktif", joinedAt: "09 Apr 2026" },
  { id: "m9", name: "Vira Larasati", username: "viral", division: "leadis", role: "Personal Brand", status: "nonaktif", joinedAt: "22 Apr 2026" },
];

export const REGISTRANTS = [
  { id: "r1", name: "Andika Pratama", email: "andika.p@email.com", division: "remix", submittedAt: "18 Jul 2026", status: "menunggu" },
  { id: "r2", name: "Citra Ayu", email: "citra.ayu@email.com", division: "leadis", submittedAt: "18 Jul 2026", status: "menunggu" },
  { id: "r3", name: "Bima Setiawan", email: "bima.s@email.com", division: "creator", submittedAt: "17 Jul 2026", status: "menunggu" },
  { id: "r4", name: "Wulan Sari", email: "wulan.sari@email.com", division: "leadis", submittedAt: "16 Jul 2026", status: "menunggu" },
  { id: "r5", name: "Reza Firmansyah", email: "reza.f@email.com", division: "remix", submittedAt: "14 Jul 2026", status: "diterima" },
  { id: "r6", name: "Putri Anggraini", email: "putri.a@email.com", division: "creator", submittedAt: "12 Jul 2026", status: "ditolak" },
];

export const ATTENDANCE_SESSIONS = [
  { id: "s1", division: "remix", date: "19 Jul 2026", time: "19:00", attendeeCount: 9, totalMembers: 12, status: "selesai" },
  { id: "s2", division: "creator", date: "18 Jul 2026", time: "20:00", attendeeCount: 7, totalMembers: 10, status: "selesai" },
  { id: "s3", division: "leadis", date: "17 Jul 2026", time: "19:30", attendeeCount: 8, totalMembers: 9, status: "selesai" },
  { id: "s4", division: "remix", date: "12 Jul 2026", time: "19:00", attendeeCount: 10, totalMembers: 12, status: "selesai" },
];

export const DIVISION_ADMINS = [
  { id: "a1", name: "Candra", division: "remix", desc: "Mengelola karya dan koordinasi kreator remix." },
  { id: "a2", name: "Gatau Dahh", division: "creator", desc: "Mengelola karya dan koordinasi video editor." },
  { id: "a3", name: "Apalagi Ini", division: "leadis", desc: "Mengelola karya dan koordinasi kreator konten perempuan." },
];

export const LOGIN_ACTIVITY = [
  { id: "l1", username: "rakaaditya", time: "20 Jul 2026, 14:20", status: "berhasil", device: "Chrome · Android" },
  { id: "l2", username: "yogasp", time: "20 Jul 2026, 11:05", status: "berhasil", device: "Safari · iOS" },
  { id: "l3", username: "unknown_user22", time: "19 Jul 2026, 23:41", status: "gagal", device: "Chrome · Windows" },
  { id: "l4", username: "sasam", time: "19 Jul 2026, 18:12", status: "berhasil", device: "Chrome · Android" },
  { id: "l5", username: "nadiar", time: "18 Jul 2026, 09:30", status: "berhasil", device: "Chrome · macOS" },
];

export const DIVISION_CONTENT = {
  remix: {
    items: [
      { id: "c1", title: "Bootleg Malam Jumat", type: "Audio", updatedAt: "15 Jul 2026" },
      { id: "c2", title: "Mashup Showcase Vol. 3", type: "Audio", updatedAt: "10 Jul 2026" },
    ],
  },
  creator: {
    items: [
      { id: "c3", title: "Behind The Scenes: Sesi Absensi", type: "Video", updatedAt: "16 Jul 2026" },
      { id: "c4", title: "Color Grading Showcase", type: "Video", updatedAt: "08 Jul 2026" },
    ],
  },
  leadis: {
    items: [
      { id: "c5", title: "Spotlight: Cerita Anggota Leadis", type: "Artikel", updatedAt: "14 Jul 2026" },
    ],
  },
};
