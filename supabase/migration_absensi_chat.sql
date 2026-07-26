-- Jalankan file ini di Supabase Dashboard > SQL Editor > New query > Run
-- (setelah setup.sql, migration_members.sql, & migration_absensi.sql).
--
-- Fitur baru: obrolan singkat + reaksi emoji di atas avatar anggota yang
-- SUDAH absen di halaman /absensi/[roomId]. Tiap member bisa kirim 1
-- pesan pendek per sesi (pesan baru menimpa/jadi "status" terbaru dia --
-- yang ditampilkan cuma pesan TERAKHIR tiap member, lihat query di
-- app/absensi/[roomId]/page.js), dan siapa aja yang sudah absen boleh
-- kasih reaksi emoji ke pesan itu.

create extension if not exists pgcrypto;

-- 1. Tabel pesan/status singkat per sesi absensi
create table if not exists attendance_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references attendance_sessions(id) on delete cascade,
  member_id uuid not null references members(id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now()
);

alter table attendance_messages enable row level security;

-- Siapa aja yang login boleh baca (buat nampilin bubble chat di halaman
-- absensi). Insert SELALU lewat server action (sendMessage di
-- app/absensi/[roomId]/actions.js) pakai secret key -- browser tidak
-- pernah insert baris ini langsung.
drop policy if exists "Authenticated can read attendance messages" on attendance_messages;
create policy "Authenticated can read attendance messages"
  on attendance_messages for select
  to authenticated
  using (true);

-- 2. Tabel reaksi emoji ke sebuah pesan
create table if not exists attendance_reactions (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references attendance_messages(id) on delete cascade,
  member_id uuid not null references members(id) on delete cascade,
  emoji text not null,
  created_at timestamptz not null default now(),
  unique (message_id, member_id, emoji) -- 1 member cuma bisa kasih 1 emoji yang sama sekali per pesan (tap lagi = toggle hapus)
);

alter table attendance_reactions enable row level security;

drop policy if exists "Authenticated can read attendance reactions" on attendance_reactions;
create policy "Authenticated can read attendance reactions"
  on attendance_reactions for select
  to authenticated
  using (true);

-- 3. Index buat query yang sering dipakai
create index if not exists attendance_messages_session_idx on attendance_messages (session_id);
create index if not exists attendance_messages_member_idx on attendance_messages (member_id, created_at desc);
create index if not exists attendance_reactions_message_idx on attendance_reactions (message_id);
