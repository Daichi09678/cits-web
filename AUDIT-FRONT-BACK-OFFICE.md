# Audit Front Office dan Back Office CITS

## Ringkasan

### Hasil tindak lanjut (16 November 2026)

Keenam tahap perbaikan telah diterapkan pada area yang ditinjau:

| Tahap                  | Hasil                                                                                                                                                                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Penyimpanan mitra   | Tambah, edit, dan hapus menunggu konfirmasi server; kegagalan mempertahankan draf. Kontrol mengikuti izin tiap tindakan dan pengiriman berulang dicegah.                                                                                |
| 2. CTA dashboard       | Akses baca menampilkan **Lihat Produk**; ikon tambah hanya muncul untuk izin membuat produk.                                                                                                                                            |
| 3. Modal admin         | Dialog konfirmasi, editor katalog, pengaturan, tim, dan pencarian mobile memakai `AdminDialogSurface`. Fokus awal, pemulihan fokus, serta pembatasan penutupan saat proses berlangsung ditangani bersama.                               |
| 4. Pemeriksaan sesi    | Interval cadangan menjadi 30 detik dan permintaan ditunda saat tab tersembunyi. Perubahan izin/token memicu pemeriksaan segera atau satu pemeriksaan lanjutan jika permintaan masih berjalan.                                           |
| 5. Struktur halaman    | Beranda, Inbox, Portofolio, Produk, Layanan, dan Mitra dipisah menjadi komponen tampilan, state, dan aksi penyimpanan di folder khusus halaman.                                                                                         |
| 6. Konsistensi kontrol | Isian dan label berulang memakai `Input`, `Textarea`, `Select`, dan `FieldLabel`. Tombol proses memakai `Button` dengan status sibuk; error/sukses memakai `FormFeedback`. Penyimpanan kontak dan Beranda juga menunggu respons server. |

Pengujian otomatis mencakup izin baca/tambah/edit/hapus, penyimpanan gagal/lambat, percobaan ulang, reset, pengiriman ganda, modal, sesi ditolak, pergantian akun, serta pelestarian draf dan filter saat berpindah tab. Tes warna tombol telah diselaraskan dengan gaya tombol bersama.

Kontras teks putih pada tombol utama oranye `#c2410c` dihitung sekitar **5,18:1**. Angka ini hanya berlaku untuk pasangan warna tersebut, bukan sertifikasi aksesibilitas seluruh aplikasi.

**Pemeriksaan akhir:** `npm run verify` lulus. Seluruh **240 tes** lulus, TypeScript tidak menghasilkan error, dan pemeriksaan format lulus. ESLint tidak menghasilkan error; masih ada **60 warning** yang perlu ditangani sebagai pekerjaan lanjutan.

**Batas verifikasi:** pengujian visual langsung lintas browser/perangkat, screen reader, zoom 200%, dan pengukuran performa runtime belum dilakukan. Elemen yang khusus untuk satu fitur tetap dapat memakai markup lokal. Temuan di bawah dipertahankan sebagai catatan kondisi sebelum perbaikan.

Audit ini meninjau struktur komponen, konsistensi UI, aksesibilitas, potensi masalah UX, dan peluang optimasi berdasarkan source code. Audit bersifat statis; belum mencakup pengujian visual lintas browser/perangkat atau pengukuran performa saat aplikasi berjalan.

**Kesimpulan utama:** kedua area sudah menggunakan banyak komponen lokal, tetapi pemakaian komponen bersama belum konsisten. Prioritas tindak lanjut adalah memperbaiki alur simpan mitra di editor Beranda, menyelaraskan CTA dashboard dengan izin pengguna, memecah halaman admin yang terlalu besar, dan meninjau pola modal serta pemeriksaan sesi.

---

## Back Office

### Temuan yang perlu diperbaiki

#### P1 — Editor Beranda dapat memberi indikasi sukses sebelum perubahan mitra tersimpan

Di `src/app/(admin)/admin/landing/page.tsx` (sekitar baris 68–130), alur tambah/edit/hapus mitra memanggil aksi async tanpa menunggu hasilnya. Sebaliknya, `src/stores/citsStore.ts` (baris 352–369) menunggu API dan melempar error jika operasi gagal. Akibatnya, modal atau pesan sukses bisa tampil sebelum penyimpanan berhasil, sementara error berpotensi tidak ditangani.

Pengelolaan mitra juga tersedia di `src/app/(admin)/admin/clients/page.tsx`. Duplikasi alur ini berpotensi membuat perilaku dan validasi berbeda. Selain itu, aksi mitra dari halaman Beranda tetap tunduk pada izin `clients`; pengguna dengan akses Beranda saja dapat melihat kontrol yang kemudian ditolak oleh pemeriksaan izin/API.

**Saran:** jadikan satu halaman sebagai tempat utama CRUD mitra atau pastikan kontrol Beranda mengikuti izin klien. Tunggu hasil aksi sebelum menutup modal/menampilkan sukses, dan tampilkan error yang jelas jika gagal.

#### P2 — CTA “Kelola Produk” tidak membedakan izin lihat dan izin edit

`src/app/(admin)/admin/page.tsx` menampilkan CTA “Kelola Produk” berdasarkan izin melihat produk (`canManageProducts`), bukan izin membuat/mengedit. Pengguna dengan akses baca dapat diarahkan ke halaman pengelolaan tanpa kemampuan mengubah data.

**Saran:** sesuaikan CTA dan label dengan izin tindakan, atau arahkan pengguna baca ke tampilan yang memang tersedia untuk mereka.

### Optimasi struktur dan performa

- **Pecah halaman yang terlalu besar.** `src/app/(admin)/admin/landing/page.tsx` berisi sekitar 2.000 baris; halaman Inbox melampaui 1.600 baris; halaman Portofolio sekitar 970 baris; halaman Produk, Layanan, dan Klien juga memiliki banyak logika dan UI dalam satu file. Ini melebihi panduan ukuran praktis 300–400 baris di `CONTRIBUTING.md`.
- **Kurangi beban pemeriksaan sesi berkala.** `src/components/pages/admin/AdminSessionSync.tsx` menjalankan pemeriksaan sesi setiap 3 detik ketika halaman terlihat, selain pemeriksaan pada fokus, `pageshow`, dan perubahan storage. Pertimbangkan interval yang lebih jarang atau pendekatan event-driven agar permintaan ke server tidak terlalu sering.
- **Pisahkan editor kompleks menjadi komponen domain.** Editor Beranda, Inbox, serta form Produk/Layanan akan lebih mudah diuji dan dipelihara jika toolbar, filter, daftar, modal, dan tiap kelompok field dipisah.

### Redesign dan aksesibilitas

- **Inbox Konsultasi:** halaman `src/app/(admin)/admin/contact/page.tsx` memuat banyak alur sekaligus—navigasi tab, filter, pengelolaan pesan, balasan email, serta detail konsultasi. Pecah per area dan buat alur tindak lanjut pesan lebih mudah dipindai.
- **Editor Beranda dan katalog:** kelompokkan form panjang menjadi bagian yang jelas; pertimbangkan indikator bagian dan lokasi aksi simpan yang konsisten.
- **Standarkan modal:** admin menggunakan beberapa pola berbeda, termasuk `AdminDialogProvider`/`AdminDialogSurface`, modal khusus halaman, dan native `<dialog>` pada fitur Tim. Pada dialog umum di `src/components/pages/admin/AdminDialogProvider.tsx`, kode mengelola Escape dan fokus awal, tetapi belum terlihat penguncian fokus di dalam dialog atau pemulihan fokus ke pemicu setelah dialog ditutup. Tinjau perilaku keyboard dan screen reader.
- **CTA dan kontrol aksi:** tampilkan aksi yang relevan dengan izin create/edit/delete pengguna, dan bedakan secara konsisten kondisi loading, sukses, dan gagal.

### Pemakaian komponen lokal Back Office

Back Office **sudah memakai banyak komponen lokal**, contohnya `AdminTopbar`, `AdminSidebar`, `Pagination`, `MetricCard`, `ContactInboxRow`, `ConsultationDetailModal`, `PortfolioEditor`, serta komponen khusus pengaturan dan tim.

Namun, pemakaiannya **belum konsisten untuk seluruh UI**. Primitif lokal `src/components/ui/Button.tsx` dan `src/components/ui/Input.tsx` masih jarang digunakan pada form admin. Banyak halaman masih menulis `<button>`, `<input>`, `<select>`, modal, dan kelas styling langsung di file halaman. Ini membuat ukuran, fokus, pesan validasi, dan tampilan kontrol lebih mudah berbeda antarhalaman.

**Saran:** gunakan atau kembangkan komponen lokal bersama untuk pola yang memang berulang. Elemen HTML langsung tetap sesuai untuk kontrol yang benar-benar khusus halaman; targetnya adalah konsistensi pola, bukan membungkus setiap elemen tanpa kebutuhan.

### Akses dan izin

UI menggunakan `canAccessPage`/`canPerformAction` dan `PageAccessGate`; rute API untuk modul yang ditinjau juga menunjukkan penggunaan `requireAdmin` dengan izin tindakan. Ini merupakan fondasi yang baik. Tetap cocokkan kontrol UI dengan izin tindakan agar pengguna tidak ditawari aksi yang akan ditolak server.

---

## Front Office

### Pemakaian komponen lokal

Front Office **sudah banyak menggunakan komponen lokal**, baik komponen bersama dari `src/components/ui/` maupun komponen khusus halaman di `src/components/pages/`. Contohnya:

- `FeaturedCatalog`, `ProductDetailsDialog`, `FaqChat`, dan `ConsultationRequirementsFields`.
- `PublicSelect`, `Navbar`, `Footer`, dan `CompanyBrand`.
- `TeamDirectory`, `TeamMemberCard`, `ServiceCaseStudyLinks`, serta `CaseStudyDetail`.
- Komponen animasi seperti `ScrollReveal`, `FloatingShapes`, `ParticleNetwork`, dan `TypewriterText`.

Jadi, fondasi komponen lokal untuk Front Office sudah cukup luas, khususnya pada area fitur dan konten yang kompleks.

### Peluang konsistensi

- Belum semua elemen interaktif menjadi komponen bersama. Beberapa halaman masih mendefinisikan tombol dan kontrol secara langsung, misalnya pada halaman Produk, Portofolio, Tentang, dan Konsultasi.
- `Button.tsx` dan `Input.tsx` tersedia sebagai primitif lokal, tetapi tidak semua CTA atau field halaman menggunakannya. Sebagian styling masih didefinisikan secara inline pada masing-masing halaman.
- Penggunaan elemen HTML langsung tidak otomatis menjadi masalah—sering kali tepat untuk aksi yang unik pada halaman itu. Prioritasnya adalah menyatukan pola berulang agar tampilan, status fokus, disabled, dan responsif tetap konsisten.

**Kesimpulan Front Office:** sudah menggunakan komponen lokal secara luas, tetapi penggunaan primitif bersama untuk kontrol umum belum menyeluruh. Ini serupa dengan Back Office, sementara Front Office memiliki lebih banyak komponen khusus fitur/area.

---

## Urutan tindak lanjut yang disarankan

1. Perbaiki penanganan hasil async dan izin CRUD mitra pada editor Beranda.
2. Selaraskan CTA “Kelola Produk” dengan izin pengguna.
3. Standarkan pengalaman modal dan fokus keyboard.
4. Kurangi frekuensi pemeriksaan sesi berkala.
5. Pecah halaman Back Office yang sangat panjang, mulai dari Beranda dan Inbox.
6. Tingkatkan konsistensi komponen kontrol lokal di kedua area secara bertahap.

## Batasan audit

Audit ini hanya meninjau source code. Belum dilakukan pengujian visual langsung pada viewport desktop/mobile, pengujian screen reader, maupun pengukuran performa runtime.
