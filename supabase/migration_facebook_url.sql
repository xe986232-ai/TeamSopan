-- Jalankan file ini di Supabase Dashboard > SQL Editor > New query > Run
-- (setelah migration_member_profile.sql).
-- Isinya: nambahin kolom facebook_url di tabel members, supaya member
-- bisa nambahin link Facebook lewat menu "Tambah Sosial Media" di /profil,
-- selain Instagram, TikTok & YouTube yang sudah ada sebelumnya.

alter table members
  add column if not exists facebook_url text;

-- Catatan keamanan: sama seperti kolom sosmed lainnya, tidak ada policy
-- UPDATE publik yang ditambahkan di sini. Perubahan tetap lewat server
-- action app/profil/actions.js yang cek sesi login dulu.
