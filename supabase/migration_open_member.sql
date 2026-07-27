-- Jalankan file ini di Supabase Dashboard > SQL Editor > New query > Run.
-- Lanjutan dari migration_site_settings.sql. Nambah kolom `open_member`
-- ke tabel `site_settings` (singleton, id = 1).
--
-- open_member -- kalau true (default), tombol "Gabung" di navbar & footer
-- homepage aktif & mengarah ke /gabung seperti biasa. Kalau di-nonaktifkan
-- dari /dashboard/pengaturan (toggle "Buka Pendaftaran Member"), kedua
-- tombol itu otomatis jadi nonaktif ("Pendaftaran Ditutup") di semua
-- halaman publik tanpa perlu deploy ulang.

alter table site_settings
  add column if not exists open_member boolean not null default true;

update site_settings
set open_member = coalesce(open_member, true)
where id = 1;

-- Tidak perlu policy RLS baru -- kolom ini masih di tabel yang sama,
-- jadi mengikuti policy "Public can read site settings" (select) yang
-- sudah ada di migration_site_settings.sql. Update tetap cuma lewat
-- server action pakai admin/service-role client (bypass RLS), lihat
-- app/dashboard/pengaturan/actions.js.
