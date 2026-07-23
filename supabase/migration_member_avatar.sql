-- Jalankan file ini di Supabase Dashboard > SQL Editor > New query > Run
-- (setelah setup.sql & migration_members.sql). Isinya: nambahin foto profil
-- buat member, diisi pas pendaftar upload foto di halaman aktivasi (/masuk?token=xxx).

create extension if not exists pgcrypto;

-- 1. Kolom foto profil di tabel members (nullable, boleh kosong -> fallback inisial)
alter table members
  add column if not exists avatar_url text;

-- 2. Storage bucket buat foto profil member (public read)
insert into storage.buckets (id, name, public)
values ('member-photos', 'member-photos', true)
on conflict (id) do nothing;

-- 3. Policy storage: publik boleh baca file di bucket ini (buat ditampilkan di dashboard,
-- profile card, animasi welcome, dll)
drop policy if exists "Public can read member photos" on storage.objects;
create policy "Public can read member photos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'member-photos');

-- Catatan: upload/replace foto dilakukan lewat server action (activateAccount) yang
-- pakai secret key (bypass RLS), bukan langsung dari browser — jadi tidak perlu
-- policy insert/update/delete untuk publik di sini.
