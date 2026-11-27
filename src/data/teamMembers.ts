import type { TeamMember } from "@/lib/team";

const rinaProfile = {
  description:
    "Memimpin perancangan arsitektur aplikasi skala enterprise dan memastikan standar kualitas rekayasa perangkat lunak terpenuhi di setiap siklus pengembangan klien CITS Indonesia.",
  expertise: ["Arsitektur Sistem", "Microservices", "Code Review", "Cloud Native"],
  projectRoles: [
    "Merancang arsitektur teknis aplikasi yang skalabel, aman, dan mudah dipelihara.",
    "Membimbing tim pengembangan melalui code review dan penerapan praktik terbaik CI/CD.",
    "Menyelaraskan keputusan teknis dengan target bisnis serta kebutuhan operasional klien.",
  ],
  serviceFocus: "Rekayasa Perangkat Lunak & Produk Digital",
  availability: "Tersedia untuk diskusi & konsultasi proyek",
};

// Fictional profiles for layout previews, never official staff identities.
const exampleTeams = [
  {
    name: "Pengembangan Aplikasi",
    serviceFocus: "Rekayasa Perangkat Lunak & Produk Digital",
    members: [
      [2, "Rina Amalia", "Lead Software Engineer"],
      [5, "Aditya Pratama", "Full Stack Developer"],
      [6, "Nabila Putri", "Frontend Developer"],
      [7, "Fajar Ramadhan", "Backend Developer"],
      [8, "Siti Rahmawati", "Mobile Developer"],
      [9, "Rizky Maulana", "Quality Assurance Engineer"],
    ],
  },
  {
    name: "Konsultasi TI",
    serviceFocus: "Strategi dan Tata Kelola TI",
    members: [
      [3, "Budi Prasetyo", "Lead IT Consultant"],
      [10, "Intan Permatasari", "Business Analyst"],
      [11, "Dimas Saputra", "Enterprise Architect"],
      [12, "Ayu Kartika", "IT Governance Consultant"],
      [13, "Arif Wibowo", "Information Security Consultant"],
      [14, "Maya Anggraini", "Data Management Consultant"],
    ],
  },
  {
    name: "Infrastruktur & Pengadaan",
    serviceFocus: "Infrastruktur, Pengadaan & Dukungan TI",
    members: [
      [15, "Hendra Setiawan", "Infrastructure Lead"],
      [16, "Putri Maharani", "IT Procurement Specialist"],
      [17, "Yoga Pratama", "System Administrator"],
      [18, "Reza Firmansyah", "Network Engineer"],
      [19, "Dian Puspita", "Hardware & Storage Specialist"],
      [20, "Taufik Hidayat", "Technical Support Engineer"],
    ],
  },
  {
    name: "Manajemen Proyek",
    serviceFocus: "Pelaksanaan Proyek & Kemitraan",
    members: [
      [1, "Andi Setiawan", "Head of Project Management"],
      [4, "Dewi Lestari", "Business Development Manager"],
      [21, "Bagus Kurniawan", "Project Manager"],
      [22, "Ratna Sari", "Project Coordinator"],
      [23, "Farhan Akbar", "Account Executive"],
      [24, "Lestari Wulandari", "Technical Documentation Specialist"],
    ],
  },
] as const;

const exampleDetails = {
  2: rinaProfile,
  1: {
    description:
      "Mengarahkan portofolio proyek agar prioritas, kebutuhan sumber daya, dan target penyelesaian tetap selaras di seluruh tim.",
    expertise: ["Tata Kelola Proyek", "Perencanaan Portofolio", "Manajemen Risiko", "Manajemen Sumber Daya"],
    projectRoles: [
      "Menetapkan standar pelaporan dan keputusan eskalasi.",
      "Meninjau risiko lintas proyek dan menyepakati tindak lanjut bersama pimpinan tim.",
      "Menyeimbangkan alokasi personel berdasarkan jadwal dan prioritas setiap proyek.",
    ],
  },
  3: {
    description:
      "Mendampingi organisasi memetakan kebutuhan TI dan menyusun tahapan transformasi yang sesuai dengan kapasitas serta sasaran bisnis.",
    expertise: ["Strategi TI", "Roadmap Transformasi", "Analisis Kebutuhan", "Studi Kelayakan"],
    projectRoles: [
      "Memimpin lokakarya penemuan kebutuhan dengan pemangku kepentingan.",
      "Menyusun rekomendasi investasi dan prioritas implementasi.",
      "Mengevaluasi opsi penerapan berdasarkan biaya, manfaat, dan kesiapan organisasi.",
    ],
  },
  4: {
    description:
      "Mengembangkan peluang kemitraan dengan mempertemukan kebutuhan klien dan layanan yang dapat diberikan tim CITS.",
    expertise: ["Pengembangan Bisnis", "Kemitraan", "Penyusunan Proposal", "Analisis Pasar"],
    projectRoles: [
      "Menggali sasaran awal dan kriteria keberhasilan bersama klien.",
      "Mengoordinasikan penawaran dengan tim teknis dan pelaksana.",
      "Menilai peluang kerja sama berdasarkan kebutuhan sektor dan kapasitas layanan.",
    ],
  },
  5: {
    description:
      "Mengembangkan fitur dari antarmuka hingga basis data dengan perhatian pada alur pengguna dan kemudahan pemeliharaan.",
    expertise: ["Pengembangan Web", "Integrasi API", "Basis Data", "Pengujian Integrasi"],
    projectRoles: [
      "Mengerjakan fitur lintas lapisan dan menguji integrasinya.",
      "Mendokumentasikan perubahan agar mudah dirawat tim.",
      "Menangani alur data antara antarmuka dan server serta memeriksa penanganan kesalahan.",
    ],
  },
  6: {
    description:
      "Membangun antarmuka web yang responsif, mudah dipahami, dan dapat digunakan dengan papan ketik maupun pembaca layar.",
    expertise: ["React", "Aksesibilitas Web", "Komponen UI", "Desain Responsif"],
    projectRoles: [
      "Menerjemahkan desain menjadi komponen antarmuka yang dapat dipakai ulang.",
      "Memeriksa tampilan dan interaksi pada berbagai ukuran layar.",
      "Memperbaiki komponen yang menyulitkan navigasi atau pembacaan konten.",
    ],
  },
  7: {
    description:
      "Membangun layanan backend untuk pengolahan data, integrasi antarsistem, dan proses bisnis yang memerlukan keandalan.",
    expertise: ["Desain API", "Pemodelan Data", "Pemrosesan Latar Belakang", "Optimasi Kueri"],
    projectRoles: [
      "Merancang kontrak API dan aturan validasi untuk alur bisnis.",
      "Menguji performa kueri serta menyiapkan pemantauan kesalahan layanan.",
      "Menyiapkan pemantauan kinerja dan mendokumentasikan kontrak layanan.",
    ],
  },
  8: {
    description:
      "Mengembangkan aplikasi seluler dengan memperhatikan alur penggunaan, kondisi koneksi terbatas, dan perilaku pada berbagai perangkat.",
    expertise: ["Aplikasi Seluler", "Integrasi API", "Sinkronisasi Data", "Pengujian Perangkat"],
    projectRoles: [
      "Membangun tampilan dan alur pengguna yang terhubung ke layanan backend.",
      "Menguji aplikasi pada perangkat fisik sebelum rilis.",
      "Memastikan fungsi utama tetap dapat digunakan saat koneksi terputus.",
    ],
  },
  9: {
    description:
      "Menjaga mutu rilis melalui pengujian fungsi, regresi, dan skenario yang mengikuti kebutuhan pengguna.",
    expertise: ["Pengujian Fungsional", "Uji Regresi", "Pelaporan Temuan", "Otomatisasi Uji"],
    projectRoles: [
      "Menyusun skenario uji dari kriteria penerimaan proyek.",
      "Mereproduksi temuan dan memverifikasi perbaikan sebelum rilis.",
      "Mengotomatiskan pemeriksaan berulang untuk fungsi yang paling sering digunakan.",
    ],
  },
  10: {
    description:
      "Mengurai kebutuhan pemangku kepentingan menjadi alur kerja dan persyaratan yang bisa disepakati bersama tim implementasi.",
    expertise: ["Analisis Proses Bisnis", "Fasilitasi Lokakarya", "Persyaratan Sistem", "Pemodelan Alur Kerja"],
    projectRoles: [
      "Memetakan proses berjalan dan mengidentifikasi hambatan utama.",
      "Menyiapkan cerita pengguna dan kriteria penerimaan fitur.",
      "Memastikan persyaratan dan perubahan dipahami oleh pengguna serta tim pengembang.",
    ],
  },
  11: {
    description:
      "Merancang hubungan antara aplikasi, data, dan infrastruktur agar perubahan sistem tetap sejalan dengan arsitektur organisasi.",
    expertise: ["Arsitektur Enterprise", "Pemetaan Aplikasi", "Integrasi Sistem", "Standar Arsitektur"],
    projectRoles: [
      "Menyusun rancangan arsitektur dan batas integrasi antarsistem.",
      "Meninjau keputusan teknis terhadap peta jalan organisasi.",
      "Mencatat keputusan arsitektur dan dampaknya bagi sistem yang sudah berjalan.",
    ],
  },
  12: {
    description:
      "Membantu organisasi menetapkan tanggung jawab, proses pengambilan keputusan, dan indikator penilaian layanan TI.",
    expertise: ["Tata Kelola TI", "Pemetaan Proses", "Penilaian Kematangan", "Evaluasi Layanan"],
    projectRoles: [
      "Meninjau kebijakan dan pembagian tanggung jawab layanan TI.",
      "Menyusun rencana perbaikan berdasarkan hasil penilaian.",
      "Menetapkan indikator untuk memantau kemajuan perbaikan tata kelola.",
    ],
  },
  13: {
    description:
      "Meninjau kebutuhan perlindungan informasi dan membantu tim menerapkan kontrol yang sesuai dengan risiko operasional.",
    expertise: ["Manajemen Risiko Informasi", "Kontrol Akses", "Penilaian Keamanan", "Klasifikasi Informasi"],
    projectRoles: [
      "Memetakan aset dan kebutuhan perlindungan bersama pemilik sistem.",
      "Meninjau penerapan kontrol dan mendokumentasikan tindak lanjut.",
      "Mendokumentasikan klasifikasi data dan persyaratan akses untuk tim pelaksana.",
    ],
  },
  14: {
    description:
      "Mendampingi pengelolaan data agar definisi, kualitas, dan tanggung jawab tiap sumber data dapat diterapkan secara konsisten.",
    expertise: ["Tata Kelola Data", "Kualitas Data", "Katalog Data", "Metadata"],
    projectRoles: [
      "Menyepakati definisi data dan penanggung jawab dengan pemilik proses.",
      "Menyiapkan pemeriksaan kualitas untuk sumber data utama.",
      "Mendokumentasikan metadata dan silsilah data untuk sumber yang dipakai bersama.",
    ],
  },
  15: {
    description:
      "Mengoordinasikan rancangan dan kesiapan infrastruktur untuk mendukung kebutuhan kapasitas dan ketersediaan layanan.",
    expertise: ["Perencanaan Kapasitas", "Arsitektur Infrastruktur", "Ketersediaan Layanan", "Rencana Pemulihan"],
    projectRoles: [
      "Menilai kebutuhan komputasi, jaringan, dan penyimpanan.",
      "Menyusun rencana implementasi dan pengujian kesiapan operasi.",
      "Menetapkan skenario pemulihan layanan bersama tim operasi sebelum serah terima.",
    ],
  },
  16: {
    description:
      "Mendampingi pengadaan perangkat dan lisensi berdasarkan kebutuhan teknis, biaya, kompatibilitas, serta dukungan purnajual.",
    expertise: ["Pengadaan TI", "Evaluasi Vendor", "Spesifikasi Teknis", "Evaluasi Biaya"],
    projectRoles: [
      "Menyusun kriteria pengadaan bersama tim teknis.",
      "Membandingkan penawaran, cakupan garansi, dan jadwal pengiriman.",
      "Memeriksa kesesuaian barang dan lisensi dengan spesifikasi pada saat penerimaan.",
    ],
  },
  17: {
    description:
      "Memelihara lingkungan server dan membantu tim operasi menjaga konfigurasi, pemantauan, serta pencadangan layanan.",
    expertise: ["Administrasi Server", "Pemantauan Sistem", "Pencadangan", "Manajemen Konfigurasi"],
    projectRoles: [
      "Menyiapkan konfigurasi server dan catatan perubahan.",
      "Memeriksa pencadangan dan melakukan uji pemulihan berkala.",
      "Meninjau peringatan operasional dan mencatat perubahan konfigurasi yang diperlukan.",
    ],
  },
  18: {
    description:
      "Merancang konektivitas dan memantau kinerja jaringan agar lokasi, perangkat, dan layanan dapat berkomunikasi dengan andal.",
    expertise: ["Desain Jaringan", "Segmentasi", "Pemantauan Koneksi", "Dokumentasi Topologi"],
    projectRoles: [
      "Memetakan topologi dan kebutuhan koneksi antar lokasi.",
      "Menguji kapasitas jaringan serta menelusuri gangguan konektivitas.",
      "Memperbarui dokumentasi topologi dan konfigurasi setelah perubahan jaringan.",
    ],
  },
  19: {
    description:
      "Menilai kebutuhan perangkat keras dan penyimpanan berdasarkan kapasitas, beban kerja, dan rencana pertumbuhan.",
    expertise: ["Perangkat Keras Server", "Penyimpanan Data", "Perencanaan Kapasitas", "Evaluasi Kompatibilitas"],
    projectRoles: [
      "Menyusun spesifikasi perangkat yang sesuai beban kerja.",
      "Memeriksa kompatibilitas dan kinerja pada tahap penerimaan.",
      "Membandingkan opsi pengembangan kapasitas berdasarkan hasil pengujian beban.",
    ],
  },
  20: {
    description:
      "Membantu pengguna mengatasi gangguan teknis dan mencatat penyelesaian agar masalah serupa bisa ditangani lebih cepat.",
    expertise: ["Dukungan Pengguna", "Diagnostik Perangkat", "Manajemen Tiket", "Dokumentasi Solusi"],
    projectRoles: [
      "Mencatat gejala, dampak, dan langkah penanganan dalam tiket.",
      "Meneruskan kasus yang memerlukan penanganan spesialis.",
      "Menyusun panduan singkat untuk penyelesaian masalah yang sering berulang.",
    ],
  },
  21: {
    description:
      "Mengelola pekerjaan harian proyek dengan menyelaraskan ruang lingkup, jadwal, dan keputusan bersama tim serta klien.",
    expertise: ["Penjadwalan Proyek", "Manajemen Ruang Lingkup", "Komunikasi Proyek", "Pelaporan Progres"],
    projectRoles: [
      "Menjaga jadwal kerja, ketergantungan, dan daftar risiko proyek.",
      "Memfasilitasi keputusan perubahan serta melaporkan kemajuan.",
      "Memastikan hasil pekerjaan dan dokumen serah terima memenuhi kriteria penerimaan.",
    ],
  },
  22: {
    description:
      "Menjaga koordinasi pekerjaan lintas tim dengan mencatat keputusan, jadwal kegiatan, dan tindak lanjut rapat.",
    expertise: ["Koordinasi Tim", "Pelacakan Tindak Lanjut", "Administrasi Proyek", "Manajemen Dokumen"],
    projectRoles: [
      "Menyiapkan agenda, notulen, dan daftar tindak lanjut rapat.",
      "Memperbarui status pekerjaan dan menandai hambatan kepada manajer proyek.",
      "Memastikan tim dapat menemukan dokumen terkini dan catatan keputusan proyek.",
    ],
  },
  23: {
    description:
      "Menjadi penghubung antara klien dan tim pelaksana agar kebutuhan, pertanyaan, serta perkembangan pekerjaan tersampaikan dengan jelas.",
    expertise: ["Pengelolaan Akun", "Komunikasi Klien", "Koordinasi Layanan", "Pemantauan Kepuasan"],
    projectRoles: [
      "Mencatat kebutuhan dan pertanyaan klien untuk tim terkait.",
      "Menjaga komunikasi selama penawaran, pelaksanaan, dan serah terima.",
      "Mengumpulkan masukan klien untuk menentukan prioritas perbaikan layanan.",
    ],
  },
  24: {
    description:
      "Menyusun dokumentasi yang membantu pengguna dan tim operasi memahami sistem, menjalankan prosedur, dan menemukan informasi penting.",
    expertise: ["Penulisan Teknis", "Panduan Pengguna", "Dokumentasi Operasional", "Pengelolaan Versi"],
    projectRoles: [
      "Mengumpulkan informasi teknis dari tim produk dan implementasi.",
      "Menguji langkah dalam panduan dan memperbaruinya sesuai perubahan sistem.",
      "Menata versi dokumen agar panduan yang tersedia selalu sesuai dengan versi sistem.",
    ],
  },
} satisfies Record<
  (typeof exampleTeams)[number]["members"][number][0],
  Required<Pick<TeamMember, "description" | "expertise" | "projectRoles">>
>;

export const demoTeamMembers: TeamMember[] = exampleTeams.flatMap((team, teamIndex) =>
  team.members.map(([id, name, position], memberIndex) => ({
    serviceFocus: team.serviceFocus,
    availability: "Diskusi kebutuhan proyek melalui Tim CITS",
    ...exampleDetails[id],
    id: `demo-team-${id}`,
    name,
    position,
    teamName: team.name,
    photoUrl: null,
    // Interleave leads so the homepage preview represents all four teams.
    displayOrder: memberIndex * exampleTeams.length + teamIndex + 1,
    isActive: true,
    showOnHomepage: true,
    isDemo: true,
  }))
);

export function withExampleProfileDetails(member: TeamMember): TeamMember {
  if (member.isDemo !== true) return member;
  const example = demoTeamMembers.find((sample) => sample.id === member.id && sample.name === member.name);
  if (!example) return member;
  const { description, expertise, projectRoles, serviceFocus, availability } = example;
  return { description, expertise, projectRoles, serviceFocus, availability, ...member };
}
