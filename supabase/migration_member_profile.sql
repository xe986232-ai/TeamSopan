-- Jalankan file ini di Supabase Dashboard > SQL Editor > New query > Run
-- (setelah setup.sql, migration_members.sql & migration_member_avatar.sql).
-- Isinya: nambahin kolom bio & link sosmed di tabel members, supaya member
-- bisa isi/edit profil sendiri lewat halaman /profil.

-- 1. Kolom tambahan di tabel members (semua nullable, boleh kosong)
alter table members
  add column if not exists bio text,
  add column if not exists instagram_url text,
  add column if not exists tiktok_url text,
  add column if not exists youtube_url text;

-- Catatan penting soal keamanan:
-- Tidak ada policy UPDATE publik/authenticated yang ditambahkan di sini
-- dengan sengaja. Semua perubahan profil (nama, bio, sosmed, avatar) dari
-- halaman /profil dilakukan lewat server action (app/profil/actions.js)
-- yang PERTAMA memverifikasi sesi login user lewat cookie (siapa yang lagi
-- login sekarang), BARU setelah itu pakai secret key (bypass RLS) untuk
-- update baris members MILIK USER ITU SENDIRI SAJA (where id = user.id).
--
-- Ini pola yang sama seperti "activateAccount" di app/masuk/actions.js —
-- browser tidak pernah bisa UPDATE tabel members secara langsung, semua
-- lewat server yang sudah cek identitas dulu.
