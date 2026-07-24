-- Jalankan file ini di Supabase Dashboard > SQL Editor > New query > Run.
-- Lanjutan dari migration_site_settings.sql. Nambah 2 hal ke tabel
-- `site_settings` yang sudah ada (singleton, id = 1):
--
-- 1. logo_shape -- bentuk logo utama ("orb" lama / "soundwave" baru).
--    Dikombinasikan dengan logo_style (warna, sudah ada sebelumnya) jadi
--    total 2 bentuk x 5 warna = 10 kombinasi, semua diatur dari
--    /dashboard/pengaturan. Lihat lib/logo-styles.js.
--
-- 2. Kolom banner pengumuman (banner_enabled, banner_text, banner_link) --
--    ditampilkan sebagai bar tipis di atas navbar pada semua halaman
--    publik kalau banner_enabled = true. Teks & link-nya bebas diisi
--    admin dari dashboard, tidak di-hardcode di kode.

alter table site_settings
  add column if not exists logo_shape text not null default 'soundwave';

alter table site_settings
  add column if not exists banner_enabled boolean not null default false;

alter table site_settings
  add column if not exists banner_text text not null default '';

alter table site_settings
  add column if not exists banner_link text;

-- Pastikan baris singleton (id=1) tetap ada nilainya walau kolom baru
-- ditambahkan setelah baris itu dibuat.
update site_settings
set
  logo_shape = coalesce(logo_shape, 'soundwave'),
  banner_enabled = coalesce(banner_enabled, false),
  banner_text = coalesce(banner_text, '')
where id = 1;

-- Tidak perlu policy RLS baru -- kolom ini masih di tabel yang sama,
-- jadi mengikuti policy "Public can read site settings" (select) yang
-- sudah ada di migration_site_settings.sql. Update tetap cuma lewat
-- server action pakai admin/service-role client (bypass RLS), lihat
-- app/dashboard/pengaturan/actions.js.
