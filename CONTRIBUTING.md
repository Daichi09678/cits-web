# Panduan Kontribusi & Standar Kode

Dokumen ini adalah acuan resmi untuk penempatan folder, penamaan, dan kualitas kode
di aplikasi web CITS (`cits-web`). Tujuannya agar setiap perubahan mudah dibaca,
direview, dan dirawat oleh tim.

## 1. Struktur Folder

```
src/
├─ app/                     # Next.js App Router (routing saja)
│  ├─ (public)/             # Route group halaman publik
│  ├─ (admin)/admin/        # Route group back office
│  ├─ api/                  # Route handler HTTP
│  ├─ layout.tsx            # Root layout
│  └─ globals.css
├─ components/              # Komponen presentasional
│  ├─ layout/               # Navbar, Footer, ThemeToggle (kerangka halaman)
│  ├─ ui/                   # Primitif UI (card, marquee, select, pattern)
│  ├─ animations/           # Komponen animasi (counter, typewriter, reveal)
│  └─ admin/                # Komponen khusus back office
├─ config/                  # Konfigurasi aplikasi (siteConfig, inbox)
├─ data/                    # Data seed / konten awal (initialData)
├─ lib/                     # Infrastruktur: db, api client, auth, email, audio
├─ stores/                  # State global client (React hook store)
├─ types/                   # Tipe domain & skema data (schema)
└─ tests/ (root /tests)     # Test runner (node:test)
```

**Aturan penempatan**

| Jenis kode                           | Lokasi                    | Jangan taruh di           |
| ------------------------------------ | ------------------------- | ------------------------- |
| Halaman / route                      | `src/app/**/page.tsx`     | `components/`             |
| Route handler API                    | `src/app/api/**/route.ts` | `lib/`                    |
| Komponen yang dipakai lintas halaman | `components/<kategori>/`  | `app/`                    |
| Akses database & query               | `lib/db.ts`               | komponen / route langsung |
| Panggilan HTTP dari client           | `lib/api.ts`              | komponen langsung `fetch` |
| State global                         | `stores/`                 | `lib/` atau `types/`      |
| Tipe & interface domain              | `types/schema.ts`         | `lib/`                    |
| Konstanta konfigurasi                | `config/`                 | hardcode di komponen      |

`app/` hanya berisi routing dan komposisi. Logika bisnis, query, dan state
dipisah ke `lib/`, `stores/`, dan `types/` agar bisa diuji tanpa React.

## 2. Konvensi Penamaan

| Entitas           | Gaya                 | Contoh                            |
| ----------------- | -------------------- | --------------------------------- |
| Folder            | `kebab-case`         | `components/layout/`              |
| Komponen React    | `PascalCase.tsx`     | `AdminSidebar.tsx`                |
| Hook / store      | `camelCase.ts`       | `citsStore.ts`                    |
| Modul utilitas    | `camelCase.ts`       | `siteConfig.ts`, `initialData.ts` |
| Route API         | `kebab-case`, plural | `/api/messages`, `/api/products`  |
| Variabel & fungsi | `camelCase`          | `purgeExpiredMessages`            |
| Konstanta         | `UPPER_SNAKE_CASE`   | `DEFAULT_MESSAGE_RETENTION_DAYS`  |
| Tipe / interface  | `PascalCase`         | `ContactMessage`                  |
| Kolom database    | `snake_case`         | `created_at`, `deal_stage`        |

**Import wajib memakai alias `@/`** (bukan `../../`), kecuali file di folder yang
sama. Contoh: `import { DbRepo } from "@/lib/db";`

## 3. Standar Route API

- Bentuk respons konsisten:
  - Sukses: `{ success: true, data: ... }`
  - Gagal: `{ success: false, message: string }` + status HTTP yang sesuai
- Varian data memakai **query parameter**, bukan segmen URL tambahan.
  Contoh: `GET /api/products?all=true` (bukan `/api/products/all`).
- Setiap route membungkus akses data dengan `try/catch` dan mengembalikan pesan error
  yang bisa dibaca, bukan stack trace mentah.
- Route yang menulis data wajib menyebutkan efek sampingnya di komentar singkat.

## 4. Standar Akses Database (`src/lib/db.ts`)

- Semua query lewat `DbRepo`; jangan menulis SQL di route/komponen.
- Gunakan **daftar kolom eksplisit** (`SELECT id, name, ...`), jangan `SELECT *`,
  agar prepared statement tidak gagal saat skema berubah
  (`cached plan must not change result type`).
- Kolom `jsonb` ditulis dengan helper `jsonb(sql, value)` — **jangan**
  `JSON.stringify(...)`, karena akan tersimpan sebagai JSON string (double-encoded).
- Migrasi DDL dijalankan **satu perintah per query** dan tanpa prepared statement
  (`sql.unsafe(stmt, [], { prepare: false })`).
- Setiap operasi baca harus punya fallback yang jelas (memory cache) bila database
  tidak tersedia, kecuali operasi yang memang menuntut penyimpanan permanen (inbox).

## 5. Kualitas Kode (Quality Gate)

Sebelum commit / merge, jalankan:

```bash
npm run verify          # typecheck + lint + test + format:check
```

| Perintah               | Fungsi                                                |
| ---------------------- | ----------------------------------------------------- |
| `npm run typecheck`    | `tsc --noEmit` — tipe wajib bersih                    |
| `npm run lint`         | ESLint (Next core-web-vitals + TypeScript + Prettier) |
| `npm run test`         | Test runner `node:test`                               |
| `npm run format`       | Rapikan format seluruh kode (Prettier)                |
| `npm run format:check` | Pastikan format sudah sesuai                          |

**Aturan wajib**

- `typecheck` dan `lint` **tidak boleh error** (warning masih ditoleransi dan
  dicatat sebagai utang teknis).
- Jangan menonaktifkan aturan ESLint tanpa komentar alasan.
- Satu pull request = satu tujuan perubahan; jangan campur refactor besar dengan
  perubahan perilaku.

## 6. Gaya Penulisan Kode

- Format mengikuti `.prettierrc` (lebar 120, kutip ganda, titik koma, LF).
- Line ending **LF** untuk semua file (lihat `.gitattributes`).
- Komponen React: fungsi + hook, tanpa `class`.
- Batas praktis ukuran file komponen: **300–400 baris**. Jika melebihi, pecah menjadi
  sub-komponen di folder yang sama (mis. `admin/contact/InboxToolbar.tsx`).
- Hindari `any` pada kode baru. Jika terpaksa (payload eksternal dinamis), beri
  komentar alasan dan tipekan hasil akhirnya.
- Nama variabel/parameter yang tidak dipakai diawali `_` (mis. `_req`).

## 7. Alur Kerja Git

- Branch: `feat/<ringkas>`, `fix/<ringkas>`, `refactor/<ringkas>`, `chore/<ringkas>`.
- Commit: `type(scope): ringkasan` — contoh `fix(inbox): hapus pesan lebih dari 30 hari`.
- Dilarang push ke `main` tanpa review. Jangan commit file `.env*` atau build artifact.

### Branch frontend per area

Semua branch berisi aplikasi lengkap; tabel ini menentukan fokus pekerjaan, bukan pembatas akses file.

| Branch                              | Area utama                                                         |
| ----------------------------------- | ------------------------------------------------------------------ |
| `main`                              | Versi utama yang sudah digabung                                    |
| `feat/service-details-consultation` | Branch fitur layanan dan konsultasi yang dipertahankan             |
| `feat/user-management`              | Frontend pengguna/publik: `src/app/(public)/` dan komponen terkait |
| `feat/admin-management`             | Frontend dashboard: `src/app/(admin)/` dan `src/components/admin/` |

Contoh mengerjakan beranda dari folder `frontend`:

```bash
git status
git switch feat/user-management
# Edit beranda dan komponen khusus beranda.
npm run verify
git add "src/app/(public)/page.tsx"
git commit -m "fix(home): rapikan tampilan beranda"
```

Simpan perubahan dengan commit pada branch yang sesuai sebelum berpindah branch.
Perubahan yang belum di-commit dapat ikut terbawa ketika menjalankan `git switch`.
Tambahkan hanya file yang berkaitan dengan perubahan, termasuk komponen dan tes jika diubah.

Branch memisahkan riwayat pekerjaan. Setelah perubahan digabung, komponen bersama tetap
memengaruhi semua halaman yang menggunakannya. Untuk membatasi dampak perubahan:

- Tempatkan komponen khusus halaman di `src/components/pages/<area>/`, misalnya
  `src/components/pages/home/`. Komponen lama boleh dipindahkan secara bertahap saat dikerjakan;
  periksa seluruh pemakainya sebelum memindahkan atau mengubah perilakunya.
- Gunakan CSS Module atau class lokal pada komponen untuk style khusus halaman.
  Hindari mengubah selector global demi memperbaiki satu halaman.
- Untuk perubahan khusus satu pemakai komponen bersama, gunakan prop/varian dengan
  perilaku default yang tetap sama untuk pemakai lain, atau buat komponen khusus halaman.
- Untuk perubahan yang berlaku lintas area, periksa seluruh halaman publik dan admin
  yang memakai komponen tersebut, termasuk tampilan mobile dan tema.
- Perubahan data melalui admin atau sumber data bersama tetap dapat muncul di beberapa halaman;
  branch Git tidak memisahkan database maupun konten.

Setiap perubahan tetap melalui review sebelum digabung ke `main`. Setelah perubahan bersama
digabung, perbarui branch halaman dengan `git merge main` agar tidak tertinggal.
Untuk memublikasikan branch baru, gunakan `git push -u origin <nama-branch>`.
