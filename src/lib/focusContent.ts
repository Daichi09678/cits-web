import type { LandingServicesIntro } from "@/types/schema";

type FocusItem = NonNullable<NonNullable<LandingServicesIntro["cardFocus"]>["focusItems"]>[number];

export const DEFAULT_FOCUS_EXPLANATION =
  "FOCUS menjadi panduan kerja dalam memahami kebutuhan, merencanakan tahapan proyek, dan mendampingi penggunaan solusi. Setiap prinsip diterapkan melalui komunikasi yang jelas, evaluasi bersama, serta dokumentasi yang membantu tim Anda mengelola sistem secara berkelanjutan.";

export const DEFAULT_FOCUS_ITEMS: FocusItem[] = [
  {
    letter: "F",
    word: "Focus",
    desc: "Kebutuhan klien",
    detail:
      "Kami memulai dengan memahami proses kerja, kendala, dan hasil yang ingin dicapai. Kebutuhan tersebut menjadi dasar untuk menentukan prioritas serta ruang lingkup solusi yang relevan bagi instansi atau perusahaan Anda.",
  },
  {
    letter: "O",
    word: "On Time",
    desc: "Tepat waktu",
    detail:
      "Tahapan pekerjaan disusun dengan target dan jadwal yang disepakati. Perkembangan, risiko, serta perubahan kebutuhan dibahas bersama agar keputusan dapat diambil lebih awal dan pelaksanaan proyek tetap terarah.",
  },
  {
    letter: "C",
    word: "Customer",
    desc: "Kepuasan pelanggan",
    detail:
      "Masukan pengguna menjadi bagian dari proses evaluasi dan penyempurnaan solusi. Diskusi, pengujian fungsi, dan pendampingan membantu memastikan sistem mendukung kebutuhan operasional serta mudah digunakan oleh tim Anda.",
  },
  {
    letter: "U",
    word: "Update",
    desc: "Teknologi terkini",
    detail:
      "Pilihan teknologi disesuaikan dengan kebutuhan, kesiapan infrastruktur, dan keberlanjutan pengelolaan sistem. Perbaikan serta pembaruan direncanakan dengan mempertimbangkan keamanan, kompatibilitas, dan kemudahan pemeliharaan.",
  },
  {
    letter: "S",
    word: "Synergy",
    desc: "Sinergi tim maksimal",
    detail:
      "Tim CITS bekerja bersama pemangku kepentingan, pengguna, dan pengelola TI. Pembagian peran, dokumentasi, serta alih pengetahuan membantu menjaga keselarasan sejak perencanaan hingga sistem digunakan dalam kegiatan sehari-hari.",
  },
];

/** Older landing records retain their labels while receiving the new explanatory copy. */
export function resolveFocusItems(items?: FocusItem[]): FocusItem[] {
  return (items?.length ? items : DEFAULT_FOCUS_ITEMS).map((item) => ({
    ...item,
    detail:
      item.detail ??
      DEFAULT_FOCUS_ITEMS.find((fallback) => fallback.letter === item.letter.trim().toUpperCase())?.detail,
  }));
}
