-- Jalankan file ini di Supabase Dashboard > SQL Editor > New query > Run
-- (setelah setup.sql). Isinya: alur pendaftar -> seleksi -> member beneran.
--
-- Alur singkat:
-- 1. Orang isi form di /gabung -> masuk tabel `registrants` (status: menunggu).
-- 2. Admin chat WA nomor yang didaftarkan buat sesi seleksi (di luar sistem).
-- 3. Admin klik "Terima" di /dashboard/pendaftar ->
--    - dibuatkan akun login (Supabase Auth) + baris di `members`
--    - dibuatkan 1 baris di `activation_tokens` (link acak, sekali pakai)
--    - dashboard nampilin email + password + link aktivasi buat admin
--      salin & kirim manual ke pendaftar (lewat WA)
-- 4. Pendaftar buka link (/masuk?token=xxx) -> set password sendiri ->
--    token langsung mati (used = true) -> lanjut ke /dashboard.
-- 5. Login berikutnya pakai /masuk biasa (email + password).

create extension if not exists pgcrypto;

-- 1. Tabel pendaftar (hasil isi form /gabung)
create table if not exists registrants (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  age int not null,
  domicile text not null,
  whatsapp text not null,
  division text not null,              -- 'remix' | 'creator' | 'leadis'
  experience text not null default '',
  portfolio text default '',
  reason text not null default '',
  status text not null default 'menunggu',   -- 'menunggu' | 'diterima' | 'ditolak'
  member_id uuid,                       -- diisi otomatis begitu diterima
  submitted_at timestamptz not null default now()
);

alter table registrants enable row level security;

-- Publik (form /gabung) boleh INSERT pendaftaran baru, tapi tidak boleh
-- baca/ubah data pendaftar siapapun (privasi + biar gak bisa disadap).
drop policy if exists "Public can submit registration" on registrants;
create policy "Public can submit registration"
  on registrants for insert
  to anon, authenticated
  with check (true);

-- Tidak ada policy select/update/delete untuk publik — dashboard admin
-- baca & ubah data ini lewat server action pakai secret key (bypass RLS).

-- 2. Tabel member (akun yang sudah lolos seleksi & aktif)
create table if not exists members (
  id uuid primary key,                  -- sama dengan auth.users.id
  full_name text not null,
  email text unique not null,           -- format: namasopan@teamsopan.com
  division text not null,               -- 'remix' | 'creator' | 'leadis'
  role text not null default 'Member',
  status text not null default 'trial', -- 'trial' | 'aktif' | 'nonaktif'
  registrant_id uuid references registrants(id),
  joined_at timestamptz not null default now()
);

alter table members enable row level security;

-- Member yang sudah login boleh baca datanya sendiri.
drop policy if exists "Members can read own profile" on members;
create policy "Members can read own profile"
  on members for select
  to authenticated
  using (auth.uid() = id);

-- 3. Tabel token aktivasi (link acak sekali pakai)
create table if not exists activation_tokens (
  token text primary key,               -- string acak, jadi bagian dari URL
  member_id uuid not null references members(id) on delete cascade,
  used boolean not null default false,
  created_at timestamptz not null default now(),
  used_at timestamptz
);

alter table activation_tokens enable row level security;
-- Tidak ada policy publik sama sekali di tabel ini — validasi token
-- SELALU lewat server action (secret key), tidak pernah lewat browser
-- langsung, supaya token gak bisa ditebak/diakses acak dari client.

-- 4. Index buat pencarian cepat
create index if not exists registrants_status_idx on registrants (status);
create index if not exists members_division_idx on members (division);
