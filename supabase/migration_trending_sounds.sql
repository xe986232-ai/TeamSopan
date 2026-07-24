-- Jalankan file ini di Supabase Dashboard > SQL Editor > New query > Run
-- (setelah setup.sql). Isinya: tabel `trending_sounds` buat 3 kartu di
-- section "Trending Sound" (Divisi Remix) di homepage, + 2 storage bucket
-- (cover gambar & file audio).
--
-- Alur: admin edit judul/nama kreator + upload cover & audio lewat
-- /dashboard/trending-sound (per slot 1-3) -> file kesimpan di storage bucket
-- -> url publiknya disimpan di kolom cover_url / audio_url -> homepage
-- render kartu dari data ini (sebelumnya hardcode di TrendingSoundSection.jsx).

create extension if not exists pgcrypto;

-- 1. Tabel data kartu trending sound
create table if not exists trending_sounds (
  id uuid primary key default gen_random_uuid(),
  slot int unique not null,           -- posisi kartu: 1, 2, 3 (urutan tampil)
  title text not null,                -- text atas (judul lagu)
  creator text not null default '',   -- text bawah (nama kreator/artist)
  cover_url text,                     -- url publik gambar cover di storage
  audio_url text,                     -- url publik file audio di storage
  panel_color text not null default '#111827', -- warna gradient panel bawah cover
  updated_at timestamptz not null default now()
);

-- 2. Isi 3 slot awal, sama persis kayak yang sekarang tampil (placeholder
-- picsum.photos buat cover & SoundHelix buat audio, tinggal diganti admin
-- lewat dashboard)
insert into trending_sounds (slot, title, creator, cover_url, audio_url, panel_color)
values
  (1, 'Shiver', 'John Summit & Hayla', 'https://picsum.photos/seed/sopan-shiver/700/800', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', '#0d2530'),
  (2, 'Say Nothing', 'Flume & MAY-A', 'https://picsum.photos/seed/sopan-saynothing/700/800', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', '#2b1911'),
  (3, 'Innerbloom', 'RÜFÜS DU SOL', 'https://picsum.photos/seed/sopan-innerbloom/700/800', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', '#211a29')
on conflict (slot) do nothing;

-- 3. Row Level Security
alter table trending_sounds enable row level security;

-- Publik boleh BACA (dipakai buat nampilin kartu trending sound di homepage)
drop policy if exists "Public can read trending sounds" on trending_sounds;
create policy "Public can read trending sounds"
  on trending_sounds for select
  to anon, authenticated
  using (true);

-- Tidak ada policy insert/update/delete untuk publik. Edit teks & upload
-- cover/audio dari /dashboard/trending-sound lewat server action yang
-- pakai secret key (bypass RLS).

-- 4. Storage bucket buat cover gambar (public read, dibatasi 10MB/file)
insert into storage.buckets (id, name, public, file_size_limit)
values ('trending-sound-covers', 'trending-sound-covers', true, 10485760)
on conflict (id) do update set file_size_limit = 10485760;

-- 5. Storage bucket buat file audio (public read, dibatasi 30MB/file)
insert into storage.buckets (id, name, public, file_size_limit)
values ('trending-sound-audio', 'trending-sound-audio', true, 31457280)
on conflict (id) do update set file_size_limit = 31457280;

-- 6. Policy storage: publik boleh baca file di kedua bucket ini
drop policy if exists "Public can read trending sound covers" on storage.objects;
create policy "Public can read trending sound covers"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'trending-sound-covers');

drop policy if exists "Public can read trending sound audio" on storage.objects;
create policy "Public can read trending sound audio"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'trending-sound-audio');
