-- Jalankan file ini di Supabase Dashboard > SQL Editor > New query > Run
-- Isinya: bikin tabel division_admins, isi data awal, bikin storage bucket
-- buat foto, dan atur siapa yang boleh baca/ubah datanya (RLS).

-- Pastikan extension buat generate UUID aktif
create extension if not exists pgcrypto;

-- 1. Tabel data admin divisi
create table if not exists division_admins (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,          -- 'remix' | 'creator' | 'leadis'
  name text not null,
  role text not null,                 -- label yang tampil, misal "Divisi Remix"
  description text not null default '',
  image_url text,                     -- url publik foto di storage
  updated_at timestamptz not null default now()
);

-- 2. Isi data awal (sama seperti yang sekarang tampil di web, foto masih kosong)
insert into division_admins (slug, name, role, description)
values
  ('remix', 'Candra', 'Divisi Remix', 'Admin Divisi Remix, mengelola karya dan koordinasi kreator remix.'),
  ('creator', 'Gatau dahh', 'Divisi Creator', 'Admin Divisi Creator, mengelola karya dan koordinasi video editor.'),
  ('leadis', 'Apalagi ini', 'Divisi Leadis', 'Admin Divisi Leadis, mengelola karya dan koordinasi kreator konten perempuan.')
on conflict (slug) do nothing;

-- 3. Aktifkan Row Level Security
alter table division_admins enable row level security;

-- 4. Policy: siapa aja (publik) boleh BACA data ini (buat ditampilkan di web)
drop policy if exists "Public can read division admins" on division_admins;
create policy "Public can read division admins"
  on division_admins for select
  to anon, authenticated
  using (true);

-- Catatan: tidak ada policy insert/update/delete untuk publik.
-- Perubahan data (upload foto dari dashboard) dilakukan lewat server action
-- yang pakai secret key (bypass RLS), jadi cuma bisa dilakukan dari server kita.

-- 5. Storage bucket buat foto admin divisi (public read)
insert into storage.buckets (id, name, public)
values ('admin-photos', 'admin-photos', true)
on conflict (id) do nothing;

-- 6. Policy storage: publik boleh baca file di bucket ini
drop policy if exists "Public can read admin photos" on storage.objects;
create policy "Public can read admin photos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'admin-photos');
