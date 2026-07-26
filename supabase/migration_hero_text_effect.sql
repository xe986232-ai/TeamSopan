-- Jalankan file ini di Supabase Dashboard > SQL Editor > New query > Run.
-- Lanjutan dari migration_site_settings.sql. Nambah 1 kolom ke tabel
-- `site_settings` yang sudah ada (singleton, id = 1):
--
-- hero_text_effect -- effect animasi teks nama "SOPAN TEAM" di Hero
-- homepage. Ada 3 pilihan (lihat lib/hero-text-effects.js):
--   'crossfade'  -- tiap huruf diisi foto, gonta-ganti foto tiap
--                    beberapa detik (efek yang sudah ada sebelumnya)
--   'sequential' -- foto "berjalan" satu huruf demi satu huruf secara
--                    berurutan, huruf yang sudah dilewati jadi putih
--   'static'     -- tanpa animasi foto sama sekali, teks warna polos
--                    (kuning/hijau muda, seperti desain awal)
-- Diatur dari /dashboard/pengaturan, dibaca oleh
-- components/ui/portfolio-hero.jsx di homepage & /preview-hero.

alter table site_settings
  add column if not exists hero_text_effect text not null default 'crossfade';

-- Pastikan baris singleton (id=1) tetap ada nilainya walau kolom baru
-- ditambahkan setelah baris itu dibuat.
update site_settings
set hero_text_effect = coalesce(hero_text_effect, 'crossfade')
where id = 1;

-- Tidak perlu policy RLS baru -- kolom ini masih di tabel yang sama,
-- jadi mengikuti policy "Public can read site settings" (select) yang
-- sudah ada di migration_site_settings.sql. Update tetap cuma lewat
-- server action pakai admin/service-role client (bypass RLS), lihat
-- app/dashboard/pengaturan/actions.js.
