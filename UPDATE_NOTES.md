# Update: Trending Sound sekarang render dari database

Sebelumnya kartu "Trending Sound" (Divisi Remix, di homepage) datanya
hardcode langsung di `components/TrendingSoundSection.jsx` (judul, nama
kreator, cover, dan file audio). Sekarang datanya disimpan di Supabase
(tabel `trending_sounds`) dan bisa diedit dari dashboard, mirip pola
"Trending Edit" (Divisi Creator) yang sudah ada duluan.

## Yang perlu kamu lakukan

### 1. Jalankan migration SQL baru

Buka **Supabase Dashboard > SQL Editor > New query**, jalankan isi file
`supabase/migration_trending_sounds.sql` (setelah `setup.sql`). File ini
bikin tabel `trending_sounds` (3 slot, terisi data placeholder yang sama
seperti tampilan sebelumnya) + 2 storage bucket baru: `trending-sound-covers`
(gambar cover, max 10MB/file) dan `trending-sound-audio` (file audio, max
30MB/file).

Tidak ada environment variable baru — masih pakai 3 variable Supabase yang
sudah ada.

## Cara pakai

Buka **`/dashboard/trending-sound`** (menu baru di grup "Divisi", sidebar
dashboard). Di sana kamu bisa, per slot (1-3):
- Edit **text atas** (judul lagu) dan **text bawah** (nama kreator/artist)
- Upload/ganti **cover** (gambar)
- Upload/ganti **audio** (file lagu yang diputar pas tombol play dipencet)

Perubahan langsung tampil di homepage begitu disimpan/diupload (tidak perlu
redeploy).

## File-file baru / yang berubah

- `supabase/migration_trending_sounds.sql` — skema tabel `trending_sounds`
  + 2 storage bucket baru
- `components/TrendingSoundSection.jsx` — sekarang Server Component, ambil
  data dari Supabase (fallback ke data placeholder kalau tabel belum ada /
  Supabase error), lalu kirim ke `TrendingSoundPlayer` lewat prop `tracks`
- `components/TrendingSoundPlayer.jsx` — file baru, isinya persis logic
  interaktif (`"use client"`) yang sebelumnya ada di `TrendingSoundSection.jsx`
  (stage 3D, audio player, dll), sekarang terima `tracks` dari prop, bukan
  konstanta hardcode
- `app/dashboard/trending-sound/page.js` — halaman dashboard baru
- `app/dashboard/trending-sound/TrendingSoundSlotCard.jsx` — kartu admin per
  slot (upload cover/audio + edit teks)
- `app/dashboard/trending-sound/actions.js` — server action upload cover,
  upload audio, edit teks, hapus cover/audio
- `components/dashboard/DashboardSidebar.jsx` — tambahan menu "Trending
  Sound" di grup Divisi

## Batasan yang perlu kamu tahu

- Kalau tabel `trending_sounds` belum di-migration atau Supabase lagi
  error, homepage & dashboard tetap tampil pakai data placeholder (sama
  seperti tampilan sebelum update ini) — tidak akan crash/blank.
- Durasi audio yang tampil di player homepage selalu ngikutin metadata
  asli file yang diupload (bukan angka hardcode lagi), jadi pastikan file
  audio yang diupload valid.

---

# Update: Alur Pendaftaran → Seleksi → Akun Member

Ringkasan perubahan yang baru ditambahkan ke project ini.

## Alur lengkap

1. Orang isi form di **`/gabung`** → data tersimpan di tabel `registrants`
   (status: `menunggu`).
2. Admin **chat manual** ke nomor WhatsApp yang didaftarkan untuk sesi
   seleksi (di luar sistem, seperti biasa).
3. Kalau lolos, admin buka **`/dashboard/pendaftar`**, klik tombol **Terima**
   pada pendaftar tersebut. Sistem otomatis:
   - Membuat akun login (Supabase Auth) dengan email format
     `namadepan` + `sopan` + `@teamsopan.com` (contoh: `renosopan@teamsopan.com`)
   - Membuat password acak
   - Membuat **link aktivasi acak, sekali pakai** (`/masuk?token=...`)
   - Menampilkan modal berisi Email, Password, dan Link — admin tinggal
     klik ikon salin, lalu kirim manual ke pendaftar lewat WhatsApp
     (ada juga tombol "Buka Chat WhatsApp" langsung ke nomornya).
4. Pendaftar buka link aktivasi → diminta **membuat password sendiri**
   (bukan pakai password acak dari admin) → begitu berhasil, otomatis
   masuk ke `/dashboard` dan link tadi langsung mati (tidak bisa dipakai
   ulang).
5. Login berikutnya cukup lewat **`/masuk`** biasa: email + password yang
   sudah mereka buat sendiri.
6. Kalau admin klik **Tolak**, status pendaftar berubah jadi `ditolak`,
   tidak ada akun yang dibuat.

Anggota yang sudah aktif tampil datanya di **`/dashboard/anggota`**
(bukan data contoh lagi).

## Yang perlu kamu lakukan sebelum jalanin ini

### 1. Jalankan migration SQL baru

Buka **Supabase Dashboard > SQL Editor > New query**, lalu jalankan isi
file `supabase/migration_members.sql` (setelah `supabase/setup.sql`
kalau belum pernah dijalankan). File ini bikin 3 tabel baru:
`registrants`, `members`, `activation_tokens`.

### 2. Tambah 1 environment variable baru

Selain 3 variable Supabase yang sudah ada, tambahkan satu lagi di
`.env.local` (development) dan di Vercel Project Settings (production):

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Untuk production, ganti dengan domain asli kamu, contoh:
`NEXT_PUBLIC_SITE_URL=https://teamsopan.vercel.app` (tanpa garis miring
di akhir). Ini dipakai buat membentuk link aktivasi yang lengkap.

### 3. Install dependency baru

Ada 1 package baru (`@supabase/ssr`, dipakai untuk sesi login berbasis
cookie). Tinggal jalankan seperti biasa:

```bash
npm install
npm run dev
```

### 4. Pastikan email/password auth aktif di Supabase

Di Supabase Dashboard > Authentication > Providers, pastikan **Email**
provider aktif (biasanya sudah aktif secara default). Karena email yang
dipakai (`...sopan@teamsopan.com`) bukan email sungguhan, kamu TIDAK
perlu setting SMTP apapun — akun dibuat langsung dengan
`email_confirm: true` lewat Admin API, jadi tidak ada email konfirmasi
yang dikirim.

## File-file baru / yang berubah

- `supabase/migration_members.sql` — skema tabel baru
- `middleware.js` — melindungi semua halaman `/dashboard/*`, redirect ke
  `/masuk` kalau belum login
- `lib/members.js` — helper generate email, password, token
- `lib/supabase/client.js` — diubah ke `createBrowserClient` (sesi cookie)
- `lib/supabase/server.js` — tambahan `createServerSupabaseClient()`
- `app/gabung/actions.js` — server action simpan pendaftaran ke database
- `app/dashboard/pendaftar/actions.js` — server action Terima/Tolak
- `app/dashboard/pendaftar/page.js` + `components/dashboard/PendaftarList.jsx`
  — data asli dari database + modal kredensial
- `app/dashboard/anggota/page.js` — data anggota asli dari database
- `app/masuk/actions.js` — server action cek & proses aktivasi token
- `app/masuk/page.js` + `app/masuk/MasukContent.jsx` +
  `components/ActivationForm.jsx` — mode login biasa vs mode aktivasi
  link
- `components/LoginForm.jsx` — login pakai email + password asli
- `components/dashboard/DashboardSidebar.jsx` — tombol Keluar (logout)
  yang berfungsi

## Batasan yang perlu kamu tahu

- Domain `@teamsopan.com` hanya format string untuk login, **bukan**
  email sungguhan — jangan coba kirim email ke alamat itu.
- Pengiriman email/password/link ke pendaftar masih **manual** (admin
  copy-paste ke WhatsApp), sesuai yang diminta — belum ada pengiriman
  otomatis.
- Halaman lain di dashboard (Absensi, Admin Divisi, dll.) belum diubah
  di update ini, masih seperti sebelumnya.
