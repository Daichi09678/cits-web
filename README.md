# CITS Web — Portal Perusahaan & Back Office

Aplikasi web resmi CITS Indonesia: halaman publik (profil, layanan, produk, portofolio,
kontak) dan back office untuk mengelola konten serta kotak masuk konsultasi.

## Teknologi

| Komponen  | Teknologi                           |
| --------- | ----------------------------------- |
| Framework | Next.js 16 (App Router) + React 19  |
| Bahasa    | TypeScript (strict)                 |
| Styling   | Tailwind CSS v4                     |
| Database  | PostgreSQL (Neon) via `postgres.js` |
| Email     | Nodemailer (SMTP)                   |
| Animasi   | Framer Motion + Lucide Icons        |
| Test      | `node:test`                         |

## Menjalankan Lokal

```bash
npm install
cp .env.example .env.local     # lalu isi nilainya
npm run dev                    # http://localhost:3000
```

### Environment Variable

| Variabel                                              | Wajib | Keterangan                                                   |
| ----------------------------------------------------- | ----- | ------------------------------------------------------------ |
| `DATABASE_URL`                                        | ya    | Connection string PostgreSQL (`?sslmode=require` untuk Neon) |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | tidak | Notifikasi email formulir kontak                             |
| `NOTIFICATION_EMAIL`                                  | tidak | Penerima notifikasi (default: email kontak di database)      |
| `MESSAGE_RETENTION_DAYS`                              | tidak | Retensi inbox, default **30** hari                           |
| `NEXT_PUBLIC_MESSAGE_RETENTION_DAYS`                  | tidak | Teks retensi di halaman admin                                |
| `CRON_SECRET`                                         | tidak | Proteksi endpoint `/api/messages/cleanup`                    |

> Tanpa SMTP, pesan dari formulir tetap tersimpan di database — hanya email
> notifikasinya yang tidak terkirim.

## Perintah

| Perintah            | Fungsi                                 |
| ------------------- | -------------------------------------- |
| `npm run dev`       | Development server (webpack)           |
| `npm run dev:turbo` | Development server (turbopack)         |
| `npm run build`     | Build produksi                         |
| `npm run start`     | Jalankan hasil build                   |
| `npm run typecheck` | Cek tipe TypeScript                    |
| `npm run lint`      | ESLint                                 |
| `npm run test`      | Test (`node:test`)                     |
| `npm run format`    | Rapikan format dengan Prettier         |
| `npm run verify`    | Typecheck + lint + test + format:check |

## Struktur Singkat

```
src/
├─ app/          # routing: (public) | (admin) | api
├─ components/   # layout, ui, animations, admin
├─ config/       # siteConfig, kebijakan inbox
├─ data/         # seed konten awal
├─ lib/          # db, api client, auth, email, audio
├─ stores/       # state global (citsStore)
└─ types/        # tipe domain
```

Detail aturan penempatan, penamaan, dan quality gate ada di
[`CONTRIBUTING.md`](./CONTRIBUTING.md).

## Ringkasan API

| Endpoint                | Method            | Keterangan                             |
| ----------------------- | ----------------- | -------------------------------------- |
| `/api/about`            | GET, PUT          | Profil perusahaan                      |
| `/api/contact`          | GET, PUT          | Info kontak, FAQ, pengumuman           |
| `/api/landing`          | GET, PUT          | Konten landing page                    |
| `/api/services`         | GET, PUT          | Pilar layanan                          |
| `/api/portfolio`        | GET, PUT          | Studi kasus                            |
| `/api/clients`          | GET, POST         | Mitra & klien                          |
| `/api/products`         | GET, POST         | Produk aktif (`?all=true` untuk semua) |
| `/api/products/[id]`    | PATCH, DELETE     | Ubah/hapus produk                      |
| `/api/messages`         | GET, POST, DELETE | Inbox konsultasi                       |
| `/api/messages/[id]`    | DELETE, PATCH     | Hapus/ubah satu pesan                  |
| `/api/messages/cleanup` | GET, POST         | Pembersihan pesan kedaluwarsa (cron)   |
| `/api/uploads`          | POST              | Unggah berkas                          |
| `/api/auth/login`       | POST              | Login admin                            |
| `/api/auth/me`          | GET               | Sesi admin aktif                       |

## Kebijakan Retensi Inbox

Pesan konsultasi yang lebih tua dari `MESSAGE_RETENTION_DAYS` (default 30 hari)
tidak ditampilkan dan dihapus otomatis:

1. **Saat inbox dibuka** — `GET /api/messages` menyaring sekaligus menjalankan
   pembersihan (maksimal 1× per menit per proses).
2. **Endpoint cron** — `POST/GET /api/messages/cleanup`, cocok untuk scheduler.
   Jika `CRON_SECRET` di-set, wajib mengirim `Authorization: Bearer <CRON_SECRET>`.

Contoh `vercel.json` untuk pembersihan harian:

```json
{ "crons": [{ "path": "/api/messages/cleanup", "schedule": "0 3 * * *" }] }
```

## Deploy

Aplikasi dirancang untuk Vercel. Pastikan `DATABASE_URL` (dan variabel lain)
di-set di dashboard sebelum deploy, lalu jalankan `npm run build` secara lokal
untuk memastikan build bersih.
