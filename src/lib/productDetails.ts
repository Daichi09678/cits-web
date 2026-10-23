import type { ProductItem } from "@/types/schema";

const DISCOVERY_QUESTIONS: Record<string, string[]> = {
  "cms-ecommerce": [
    "Jenis portal, struktur halaman, dan konten yang akan dikelola",
    "Peran editor, proses publikasi, serta kebutuhan transaksi dan pembayaran",
    "Integrasi sistem, domain, hosting, dan perkiraan kunjungan",
  ],
  "e-filing": [
    "Jenis berkas, format pelaporan, dan jadwal tenggat yang perlu dipantau",
    "Alur validasi, penandatanganan digital, serta hak akses pengguna",
    "Jumlah arsip, masa penyimpanan, dan sumber data yang perlu dihubungkan",
  ],
  "sms-gateway": [
    "Jenis pesan: notifikasi, OTP, promosi, atau komunikasi internal",
    "Perkiraan jumlah penerima dan volume pesan per hari",
    "Aplikasi yang akan dihubungkan dan penyedia gateway yang digunakan",
  ],
  "j2me-data-collector": [
    "Jenis formulir, survei, atau pendataan lapangan yang dibutuhkan",
    "Jumlah petugas, perangkat, dan kondisi koneksi internet di lapangan",
    "Kebutuhan validasi GPS, sinkronisasi, dan format rekap data",
  ],
  "dokumen-manajemen": [
    "Jenis dokumen, jumlah arsip, dan struktur klasifikasinya",
    "Peran pengguna, hak akses, dan alur persetujuan dokumen",
    "Sumber arsip lama yang akan dipindahkan dan kebutuhan pencarian",
  ],
  "situng-pilkada": [
    "Wilayah, sumber data, dan tahapan rekapitulasi yang diperlukan",
    "Alur verifikasi, peran operator, dan bentuk laporan",
    "Perkiraan beban akses serta kebutuhan integrasi dan audit",
  ],
};

/** Questions for sizing and implementation, distinct from confirmed catalog capabilities. */
export function productDiscoveryQuestions(product: ProductItem): string[] {
  return (
    DISCOVERY_QUESTIONS[product.id] || [
      "Proses kerja dan hasil yang ingin dicapai dengan produk ini",
      "Jumlah pengguna, volume data, dan sistem yang sudah digunakan",
      "Kebutuhan integrasi, lokasi penerapan, dan target waktu implementasi",
    ]
  );
}
