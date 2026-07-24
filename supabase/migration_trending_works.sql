-- Jalankan file ini di Supabase Dashboard > SQL Editor > New query > Run
-- (setelah setup.sql). Isinya: tabel `trending_works` buat 4 kartu di section
-- "Trending Edit" (Divisi Creator) di homepage, + storage bucket buat video-nya.
--
-- Alur: admin upload video lewat /dashboard/trending (per slot 1-4) -> video
-- kesimpan di storage bucket 'trending-videos' -> url publiknya disimpan di
-- kolom video_url -> homepage nampilin video itu pas tombol play diklik
-- (sebelumnya cuma gradient + link keluar ke TikTok, sekarang beneran muter
-- video sendiri).

create extension if not exists pgcrypto;

-- 1. Tabel data kartu trending
create table if not exists trending_works (
  id uuid primary key default gen_random_uuid(),
  slot int unique not null,           -- posisi kartu: 1, 2, 3, 4 (urutan tampil)
  title text not null,
  subtitle text not null default '',
  likes int not null default 0,
  gradient text not null,             -- CSS gradient thumbnail, dipertahankan sebagai fallback + animasi fade
  video_url text,                     -- url publik video di storage, null = belum diupload
  updated_at timestamptz not null default now()
);

-- 2. Isi 4 slot awal, sama persis kayak yang sekarang tampil (video masih kosong)
insert into trending_works (slot, title, subtitle, likes, gradient)
values
  (1, 'Cinematic Transition Pack', 'Alight Motion Edit', 5614, 'linear-gradient(155deg, #00E5FF, #3D5AFE)'),
  (2, 'Beat Sync Edit', 'Motion Graphic', 8098, 'linear-gradient(155deg, #3D5AFE, #00E5FF)'),
  (3, 'Animated Text Reel', 'Animation Text', 2948, 'linear-gradient(155deg, #00C2FF, #2946FF)'),
  (4, 'Color Grading Showcase', 'Video Editing', 1204, 'linear-gradient(155deg, #2946FF, #00E5FF)')
on conflict (slot) do nothing;

-- 3. Row Level Security
alter table trending_works enable row level security;

-- Publik boleh BACA (dipakai buat nampilin card + video di homepage)
drop policy if exists "Public can read trending works" on trending_works;
create policy "Public can read trending works"
  on trending_works for select
  to anon, authenticated
  using (true);

-- Tidak ada policy insert/update/delete untuk publik. Upload video dari
-- /dashboard/trending lewat server action yang pakai secret key (bypass RLS).

-- 4. Storage bucket buat video trending (public read, video lumayan besar
-- jadi dikasih limit 100MB per file lewat pengaturan bucket)
insert into storage.buckets (id, name, public, file_size_limit)
values ('trending-videos', 'trending-videos', true, 104857600)
on conflict (id) do update set file_size_limit = 104857600;

-- 5. Policy storage: publik boleh baca file di bucket ini
drop policy if exists "Public can read trending videos" on storage.objects;
create policy "Public can read trending videos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'trending-videos');
