-- Jalankan file ini di Supabase Dashboard > SQL Editor > New query > Run
-- (setelah setup.sql & migration_members.sql). Isinya: skema sesi absensi
-- beneran (dulu masih dummy/hardcode di lib/absensi.js).
--
-- Alur baru:
-- 1. Admin bikin sesi absensi dari /dashboard/absensi (pilih divisi,
--    tanggal, jam mulai, durasi) -> tersimpan di `attendance_sessions`,
--    dapat link acak /absensi/{room_id} buat dibagikan ke anggota.
-- 2. Anggota buka link itu (harus sudah login) -> halaman /absensi/[roomId]
--    otomatis kebaca nama dari akun yang login (bukan input manual lagi),
--    nampilin hitungan mundur durasi sesi, dan tombol Absen aktif cuma
--    selama jendela waktu sesi berlangsung.
-- 3. Klik Absen -> tersimpan 1 baris di `attendance_records` (kalau belum
--    pernah absen di sesi itu).

create extension if not exists pgcrypto;

-- 1. Tabel sesi absensi
create table if not exists attendance_sessions (
  id uuid primary key default gen_random_uuid(),
  room_id text unique not null,        -- dipakai di URL: /absensi/{room_id}
  division text not null,              -- 'remix' | 'creator' | 'leadis'
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table attendance_sessions enable row level security;

-- Siapa aja yang sudah login boleh BACA data sesi (perlu buat nampilin
-- hitungan mundur & status sesi di halaman absensi). Insert/update/delete
-- TIDAK ada policy publik sama sekali -- cuma lewat server action pakai
-- secret key dari /dashboard/absensi (halaman itu sendiri sudah dijaga
-- middleware, cuma admin yang bisa akses).
drop policy if exists "Authenticated can read attendance sessions" on attendance_sessions;
create policy "Authenticated can read attendance sessions"
  on attendance_sessions for select
  to authenticated
  using (true);

-- 2. Tabel catatan kehadiran (siapa absen di sesi mana)
create table if not exists attendance_records (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references attendance_sessions(id) on delete cascade,
  member_id uuid not null references members(id) on delete cascade,
  full_name text not null,             -- snapshot nama saat absen
  checked_in_at timestamptz not null default now(),
  unique (session_id, member_id)        -- 1 member cuma bisa absen sekali per sesi
);

alter table attendance_records enable row level security;

-- Siapa aja yang login boleh baca daftar yang sudah absen (buat
-- ditampilkan di halaman /absensi/[roomId]). Tidak ada policy INSERT
-- untuk authenticated -- absen SELALU lewat server action
-- (app/absensi/[roomId]/actions.js) yang PERTAMA verifikasi sesi login +
-- jendela waktu sesi, BARU insert pakai secret key (bypass RLS). Browser
-- tidak pernah bisa insert baris ini langsung.
drop policy if exists "Authenticated can read attendance records" on attendance_records;
create policy "Authenticated can read attendance records"
  on attendance_records for select
  to authenticated
  using (true);

-- 3. Index buat query yang sering dipakai
create index if not exists attendance_sessions_division_idx on attendance_sessions (division);
create index if not exists attendance_records_session_idx on attendance_records (session_id);
