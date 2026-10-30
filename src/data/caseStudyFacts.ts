/**
 * Fakta pendukung studi kasus portofolio.
 *
 * Semua angka pada `facts` dikutip dari publikasi resmi instansi (situs
 * kementerian/lembaga) atau pemberitaan yang mengutip pejabat berwenang.
 * Tautan sumber disimpan di `sources` agar bisa diverifikasi pembaca.
 *
 * Catatan: metrik dampak proyek (measurableImpact) tetap berasal dari
 * dokumentasi internal CITS, sehingga ditampilkan terpisah dari fakta ini.
 */

export interface CaseStudyFact {
  label: string;
  value: string;
  detail: string;
}

export interface CaseStudySource {
  label: string;
  publisher: string;
  url: string;
  date?: string;
}

export interface CaseStudyEvidence {
  overview: string;
  facts: CaseStudyFact[];
  sources: CaseStudySource[];
}

const KTP_OVERVIEW =
  "KTP elektronik (KTP-el) adalah identitas resmi tunggal penduduk Indonesia yang diterbitkan berdasarkan UU No. 24 Tahun 2013 tentang Administrasi Kependudukan. NIK bersifat unik, tunggal, wajib, dan berlaku seumur hidup, sehingga dipakai sebagai kunci verifikasi layanan publik. Pemanfaatan data oleh lembaga pengguna dilakukan lewat verifikasi NIK (card reader, face recognition) dan Identitas Kependudukan Digital (IKD).";

const SIMLALA_OVERVIEW =
  "SIMLALA (Sistem Informasi Manajemen Lalu Lintas Angkutan Laut) adalah aplikasi Direktorat Jenderal Perhubungan Laut, Kementerian Perhubungan, untuk mengajukan dan memantau layanan perizinan angkutan laut secara online. Layanan yang ditangani mencakup SIUPAL, SIOPSUS, SIUPKK, spesifikasi kapal (SPEK), rencana pengoperasian kapal (RPK liner/tramper/khusus), PKKA, pembukaan kantor cabang, hingga omisi dan deviasi.";

const BKPM_OVERVIEW =
  "Satu Data Kementerian Investasi dan Hilirisasi/BKPM adalah portal data terbuka yang menyajikan dataset, infografis, dan visualisasi realisasi penanaman modal. Datanya bersumber dari Laporan Kegiatan Penanaman Modal (LKPM) perusahaan PMA dan PMDN, dengan Ditjen Data dan Informasi BKPM berperan sebagai walidata penanaman modal.";

export const caseStudyEvidence: Record<string, CaseStudyEvidence> = {
  "ktp-el": {
    overview: KTP_OVERVIEW,
    facts: [
      {
        label: "Penduduk terdata by name by address",
        value: "279,1 juta jiwa",
        detail: "Data kependudukan Semester I 2023 mencatat 279.118.866 jiwa dalam bigdata Dukcapil.",
      },
      {
        label: "Perekaman KTP-el",
        value: "202,9 juta jiwa",
        detail: "Dari 204.281.006 wajib KTP-el (±99,3%) per Februari 2024.",
      },
      {
        label: "Lembaga pengguna berhak akses verifikasi",
        value: "6.444 lembaga",
        detail: "Per Februari 2024, naik dari 6.144 lembaga pada 2023; setiap lembaga menandatangani PKS pemanfaatan data.",
      },
      {
        label: "Dasar hukum NIK sebagai basis layanan",
        value: "UU 24/2013",
        detail: "NIK menjadi backbone SPBE dan verifikator data penduduk penerima layanan publik.",
      },
      {
        label: "Aktivasi Identitas Kependudukan Digital",
        value: "8,19 juta pengguna",
        detail: "Per 22 Februari 2024; IKD diposisikan sebagai identitas digital dasar (Perpres 82/2023).",
      },
      {
        label: "PNBP pemanfaatan data 2023",
        value: "Rp793,8 miliar",
        detail: "Penerimaan negara dari hak akses verifikasi data kependudukan sepanjang 2023.",
      },
    ],
    sources: [
      {
        label: "Kawal Penerapan SPBE, Kemendagri Siapkan NIK Sebagai Basis Data",
        publisher: "Ditjen Dukcapil Kemendagri",
        url: "https://dukcapil.kemendagri.go.id/phln/read/kawal-penerapan-spbe-kemendagri-siapkan-nik-sebagai-basis-data",
        date: "17 Oktober 2023",
      },
      {
        label: "Pemerintah Jadikan IKD Sebagai Identitas Digital Dasar",
        publisher: "Ditjen Dukcapil Kemendagri",
        url: "https://dukcapil.kemendagri.go.id/blog/read/pemerintah-jadikan-ikd-sebagai-identitas-digital-dasar",
        date: "28 Februari 2024",
      },
      {
        label: "Data Kependudukan (statistik resmi Dukcapil)",
        publisher: "Ditjen Dukcapil Kemendagri",
        url: "https://dukcapil.kemendagri.go.id/page/read/data-kependudukan",
      },
      {
        label: "Dukcapil Optimis Sumbang ke Kas Negara melalui PNBP 1 Triliun di 2025",
        publisher: "Disdukcapil Kota Pangkalpinang (kutipan Dirjen Dukcapil)",
        url: "https://disdukcapil.pangkalpinangkota.go.id/2025/09/09/dukcapil-optimis-sumbang-ke-kas-negara-melalui-pnbp-1-triliun-di-2025/",
        date: "9 September 2025",
      },
    ],
  },

  simlala: {
    overview: SIMLALA_OVERVIEW,
    facts: [
      {
        label: "Mulai diimplementasikan",
        value: "2012",
        detail:
          "Diterapkan bertahap sejak 2012 dan diluncurkan penuh (commercial launching) pada 4 April 2016 dengan seluruh proses dilakukan pemohon secara online.",
      },
      {
        label: "Layanan publik online",
        value: "31 layanan",
        detail:
          "Mencakup SIUPAL, SIOPSUS, SIUPKK, spesifikasi kapal, RPK liner/tramper/khusus, PKKA, pembukaan kantor cabang, penambahan pelabuhan, hingga omisi dan deviasi.",
      },
      {
        label: "Batas verifikasi RPK",
        value: "1 hari kerja",
        detail:
          "Verifikasi RPK liner/tramper, omisi, deviasi, substitusi kapal, penambahan pelabuhan singgah, dan penonaktifan RPK paling lama 1 hari kerja per verifikator (KP Dirjen 626/2025).",
      },
      {
        label: "Batas pengajuan RPK",
        value: "14 hari kerja",
        detail: "Paling lambat 14 hari kerja sebelum kapal dioperasikan untuk RPK liner.",
      },
      {
        label: "Integrasi pembayaran PNBP",
        value: "SIMPONI",
        detail:
          "Kode billing diterbitkan lewat invoice SIMLALA, dibayar melalui channel SIMPONI Kemenkeu dengan batas 3×24 jam sebelum kedaluwarsa.",
      },
    ],
    sources: [
      {
        label: "Sistem Informasi Manajemen Lalu Lintas (SIMLALA)",
        publisher: "Kementerian Perhubungan RI",
        url: "https://www.kemenhub.go.id/post/read/sistem-inforamsi-manajemen-lalu-lintas-simlala",
      },
      {
        label: "Penyederhanaan Proses Perizinan Usaha Angkutan Laut melalui SIMLALA",
        publisher: "Ditjen Perhubungan Laut, Kemenhub",
        url: "https://hubla.kemenhub.go.id/home/post/read/5407/penyederhanaan-proses-perizinan-usaha-angkutan-laut-melalui-simlala-21",
      },
      {
        label: "Pusat Data Hasil Layanan SIMLALA",
        publisher: "SIMLALA — Ditjen Perhubungan Laut",
        url: "https://simlala.dephub.go.id/pusatdata",
      },
      {
        label: "Keputusan Dirjen Perhubungan Laut No. 626 Tahun 2025 (Petunjuk Teknis Layanan SIMLALA)",
        publisher: "Ditjen Perhubungan Laut, Kemenhub",
        url: "https://hubla.dephub.go.id/storage/portal/documents/post/28357/KP-DJPL_626_TAHUN_2025_TENTANG_PETUNJUK_TEKNIS_PELAKSANAAN_LAYANAN_BIDANG_LALU_LINTAS_DAN_ANGKUTAN_LAUT_MELALUI_SIMLALA.pdf",
        date: "2025",
      },
      {
        label: "Kemenhub luncurkan SIMLALA daring, percepat perizinan",
        publisher: "ANTARA News",
        url: "https://www.antaranews.com/berita/553422/kemenhub-luncurkan-simlala-daring-percepat-perizinan",
        date: "4 April 2016",
      },
    ],
  },

  "satu-data-bkpm": {
    overview: BKPM_OVERVIEW,
    facts: [
      {
        label: "Bentuk layanan",
        value: "Dataset terbuka",
        detail:
          "Tersedia dalam format CSV, XLSX, JSON, dan PDF, dilengkapi infografis serta visualisasi interaktif yang dapat diakses publik.",
      },
      {
        label: "Sumber angka realisasi",
        value: "LKPM",
        detail:
          "Realisasi investasi dihitung dari Laporan Kegiatan Penanaman Modal yang diterima BKPM dari perusahaan PMA dan PMDN.",
      },
      {
        label: "Granularitas data",
        value: "Per provinsi",
        detail:
          "Dataset dan visualisasi realisasi investasi tersedia hingga tingkat provinsi, termasuk capaian per triwulan.",
      },
      {
        label: "Periode publikasi",
        value: "Triwulanan",
        detail:
          "Laporan realisasi investasi diterbitkan setiap triwulan (TW I–IV) dan dipublikasikan terbuka di portal Satu Data.",
      },
      {
        label: "Sistem pendahulu perizinan",
        value: "SPIPISE (2009)",
        detail:
          "BKPM meluncurkan SPIPISE pada 2009 sebagai sistem perizinan investasi online; sejak 2018 dilanjutkan OSS dan OSS Berbasis Risiko (2021).",
      },
    ],
    sources: [
      {
        label: "Satu Data Kementerian Investasi dan Hilirisasi/BKPM",
        publisher: "Kementerian Investasi dan Hilirisasi/BKPM",
        url: "https://data.bkpm.go.id/home",
      },
      {
        label: "Sejarah Waktu BKPM (peluncuran SPIPISE 2009)",
        publisher: "Kementerian Investasi dan Hilirisasi/BKPM",
        url: "https://bkpm.go.id/id/tentang-bkpm/sejarah-waktu",
      },
      {
        label: "Layanan Satu Data BKPM",
        publisher: "Kementerian Investasi dan Hilirisasi/BKPM",
        url: "https://bkpm.go.id/id/dukungan-dan-bantuan/satu-data",
      },
      {
        label: "Peraturan Kepala BKPM No. 14 Tahun 2011 tentang SPIPISE",
        publisher: "JDIH BKPM",
        url: "https://jdih-storage.bkpm.go.id/jdih/userfiles/documents/2021/11/2011PerKaBKPM014.pdf",
        date: "2011",
      },
    ],
  },
};
