-- Jalankan file ini di Supabase Dashboard > SQL Editor > New query > Run.
-- Isinya: tabel `site_settings`, dipakai buat nyimpen preferensi tampilan
-- situs yang sifatnya "singleton" (cuma 1 baris, id = 1). Dipakai pertama
-- kali buat nyimpen pilihan style gradient logo utama ("S" di navbar),
-- diatur dari /dashboard/pengaturan, lalu dibaca sama komponen navbar
-- (components/ui/site-navbar.jsx) di semua halaman publik.

create table if not exists site_settings (
  id smallint primary key default 1,
  logo_style text not null default 'aurora', -- key preset, lihat lib/logo-styles.js
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

insert into site_settings (id, logo_style)
values (1, 'aurora')
on conflict (id) do nothing;

-- Row Level Security
alter table site_settings enable row level security;

-- Publik boleh BACA (navbar di semua halaman perlu tahu style logo yang
-- lagi aktif)
drop policy if exists "Public can read site settings" on site_settings;
create policy "Public can read site settings"
  on site_settings for select
  to anon, authenticated
  using (true);

-- Tidak ada policy insert/update/delete untuk publik. Diubah dari
-- /dashboard/pengaturan lewat server action yang pakai secret key (bypass
-- RLS) -- lihat app/dashboard/pengaturan/actions.js.
