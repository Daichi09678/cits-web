import { ProductItem, ContactInfo, ContactMessage, AboutData, ClientPartner, LandingPageData, ServicePillar } from "./schema";

export const initialProducts: ProductItem[] = [
  {
    id: "sms-gateway",
    name: "SMS Gateway Enterprise",
    category: "Communication",
    description: "Platform pengiriman SMS massal dan transaksional yang andal untuk kebutuhan notifikasi, OTP, promosi, dan komunikasi bisnis instansi.",
    features: ["Pengiriman massal (Bulk SMS)", "Integrasi REST API", "Laporan pengiriman real-time", "Template pesan dinamis", "High throughput gateway"],
    tags: ["Bulk SMS", "OTP", "API Ready", "SMPP Protocol"],
    icon: "MessageSquare",
    isActive: true,
    updatedAt: "2026-10-12T10:00:00Z",
  },
  {
    id: "j2me-data-collector",
    name: "J2ME & Mobile Data Collector",
    category: "Mobile",
    description: "Aplikasi pengumpulan data lapangan berbasis mobile untuk survei statistik, sensus daerah, dan pendataan lapangan terverifikasi GPS.",
    features: ["Mode offline storage", "Pelacakan koordinat GPS", "Form builder dinamis", "Sinkronisasi otomatis saat online", "Validasi data instan"],
    tags: ["Survey Field", "GPS Tracking", "Offline First", "Android & Cross-platform"],
    icon: "Smartphone",
    isActive: true,
    updatedAt: "2026-10-12T10:00:00Z",
  },
  {
    id: "dokumen-manajemen",
    name: "Dokumen Manajemen (EDMS)",
    category: "Enterprise",
    description: "Sistem pengelolaan dokumen digital terpadu untuk mengorganisir, menyimpan, mengindeks, dan berbagi berkas kedinasan secara aman.",
    features: ["Kontrol versi dokumen (Versioning)", "Manajemen hak akses bertingkat", "Pencarian teks lengkap (Full-text)", "Audit trail riwayat akses", "Enkripsi arsip digital"],
    tags: ["EDMS", "Paperless Office", "ISO 27001", "Digital Archive"],
    icon: "FileText",
    isActive: true,
    updatedAt: "2026-10-12T10:00:00Z",
  },
  {
    id: "situng-pilkada",
    name: "Situng Pilkada & Pemilu",
    category: "Government",
    description: "Sistem informasi hitung cepat dan rekapitulasi data perolehan suara terdistribusi dengan verifikasi berjenjang dan audit keamanan siber.",
    features: ["Tabulasi suara real-time", "Pemindaian formulir C1 digital", "Dashboard publik transparan", "Audit integritas enkripsi kriptografi", "High availability server"],
    tags: ["E-Voting", "Tabulasi Suara", "KPU Ready", "High Security"],
    icon: "Vote",
    isActive: true,
    updatedAt: "2026-10-12T10:00:00Z",
  },
  {
    id: "cms-ecommerce",
    name: "Website CMS & Portal Enterprise",
    category: "Web",
    description: "Portal terpadu dan sistem manajemen konten kustom berkinerja tinggi yang dirancang adaptif untuk kebutuhan branding korporasi dan pelayanan publik.",
    features: ["Manajemen konten WYSIWYG intuitif", "Desain responsif multi-device", "Optimasi SEO & performa CWV", "Integrasi payment gateway nasional", "Modul analitik kunjungan"],
    tags: ["Portal Web", "GovTech", "E-Commerce", "CMS Kustom"],
    icon: "Globe",
    isActive: true,
    updatedAt: "2026-10-12T10:00:00Z",
  },
  {
    id: "e-filing",
    name: "E-Filing & Arsip Pajak",
    category: "Enterprise",
    description: "Sistem pelaporan berkas dan pengarsipan kepatuhan elektronik yang terintegrasi dengan validasi tanda tangan digital dan jejak rekam terpercaya.",
    features: ["Pelaporan berkas digital mandiri", "Tanda tangan digital tersertifikasi", "Validasi format data otomatis", "Arsip berbasis cloud terenkripsi", "Notifikasi tenggat waktu"],
    tags: ["E-Tax", "Tanda Tangan Digital", "Compliance", "Arsip Elektronik"],
    icon: "Archive",
    isActive: true,
    updatedAt: "2026-10-12T10:00:00Z",
  },
];

export const initialContactInfo: ContactInfo = {
  address: "Gedung Wisma Mampang, Lt. 5, Jl. Mampang Prapatan No. 1, Jakarta Selatan 12790, Indonesia",
  phone: "021 - 39719677",
  email: "info@citsindonesia.co.id",
  workingHours: "Senin - Jumat: 08:30 - 17:30 WIB",
  emergencyPhone: "+62 811-1971-9677",
  mapsUrl: "https://maps.google.com/?q=Wisma+Mampang+Jakarta+Selatan",
};

export const initialContactMessages: ContactMessage[] = [
  {
    id: "msg-101",
    name: "Bambang Sudarmono",
    email: "bambang.s@dephub.go.id",
    phone: "081288992211",
    company: "Kementerian Perhubungan RI",
    serviceRequested: "Software House",
    message: "Kami bermaksud menjadwalkan audiensi teknis terkait rencana modernisasi aplikasi pemantauan pelabuhan logistik untuk anggaran 2027.",
    status: "unread",
    createdAt: "2026-10-13T09:30:00Z",
  },
  {
    id: "msg-102",
    name: "Dian Permatasari",
    email: "dian.p@esdm.go.id",
    phone: "081399887766",
    company: "Kementerian ESDM",
    serviceRequested: "IT Consultant",
    message: "Mohon informasi ketersediaan jadwal tim ahli CITS untuk pendampingan penyelarasan arsitektur SPBE sektor ketenagalistrikan.",
    status: "read",
    createdAt: "2026-10-12T14:15:00Z",
  },
  {
    id: "msg-103",
    name: "Ir. Hendra Gunawan",
    email: "hendra.g@indonesiapower.co.id",
    phone: "081122334455",
    company: "PT Indonesia Power",
    serviceRequested: "IT Supplier",
    message: "Klarifikasi spesifikasi pengadaan server rackmount enterprise dan perangkat firewall redundancy untuk DRC kantor pusat.",
    status: "replied",
    createdAt: "2026-10-11T11:00:00Z",
  },
];

export const initialAboutData: AboutData = {
  title: "Tentang CITS Indonesia",
  subtitle: "Cipta Integrasi Teknologi Solusi — Mitra Strategis Rekayasa Sistem Sejak 2006",
  story: "Berdiri sejak tahun 2006, PT Cipta Integrasi Teknologi Solusi (CITS) telah mendedikasikan keahlian dan kapasitas teknisnya untuk menjadi mitra transformasi digital terpercaya bagi kementerian, instansi pemerintah, BUMN, dan korporasi terkemuka di Indonesia. Kami memadukan kepatuhan regulasi SPBE, standar rekayasa perangkat lunak enterprise, dan keamanan siber berstandar internasional.",
  vision: "Menjadi mitra terdepan dan terpercaya dalam rekayasa teknologi informasi dan tata kelola digital terpadu yang memajukan efisiensi nasional.",
  mission: [
    "Menyediakan solusi perangkat lunak kustom berkinerja tinggi, aman, dan adaptif terhadap kebutuhan proses bisnis.",
    "Memberikan layanan konsultansi strategis TI dan SPBE yang akuntabel, efisien, dan selaras regulasi.",
    "Mendukung keandalan infrastruktur teknologi melalui pengadaan perangkat keras enterprise orisinal bergaransi resmi.",
    "Membangun kemitraan jangka panjang berlandaskan integritas, profesionalisme, dan alih pengetahuan berkelanjutan.",
  ],
  coreValues: [
    { title: "Integritas & Akuntabilitas", description: "Menjunjung transparansi pengadaan dan kepatuhan penuh terhadap standar hukum PBJ LKPP." },
    { title: "Keunggulan Rekayasa", description: "Penerapan clean code, arsitektur modern, dan pengujian kualitas yang ketat tanpa kompromi." },
    { title: "Keamanan Siber Terpadu", description: "Perlindungan data berlapis dan enkripsi end-to-end sesuai prinsip ISO 27001 dan UU PDP." },
    { title: "Kemitraan Berkelanjutan", description: "Pendampingan operasional purna jual dan SLA siap siaga menjamin kelancaran layanan." },
  ],
  stats: [
    { label: "Tahun Pengalaman", value: "18+", description: "Rekam jejak teruji sejak 2006 di berbagai sektor industri dan pemerintahan" },
    { label: "Inisiatif Proyek Sukses", value: "150+", description: "Sistem enterprise, portal kementerian, dan implementasi infrastruktur" },
    { label: "Kementerian & BUMN", value: "40+", description: "Institusi terpercaya yang menjadi mitra strategis CITS Indonesia" },
    { label: "Komitmen SLA Ketersediaan", value: "99.9%", description: "Standar ketersediaan sistem dan respon penanganan teknis" },
  ],
};

export const initialClients: ClientPartner[] = [
  { id: "c-1", name: "Kementerian Perhubungan RI", logo: "/clients/kemenhub.webp", category: "Kementerian", isActive: true },
  { id: "c-2", name: "Kementerian ESDM", logo: "/clients/esdm.webp", category: "Kementerian", isActive: true },
  { id: "c-3", name: "Kementerian Ketenagakerjaan RI", logo: "/clients/kemnaker.webp", category: "Kementerian", isActive: true },
  { id: "c-4", name: "Kementerian Investasi / BKPM", logo: "/clients/bkpm.webp", category: "Kementerian", isActive: true },
  { id: "c-5", name: "Kementerian Kesehatan RI", logo: "/clients/kemenkes.webp", category: "Kementerian", isActive: true },
];

export const initialServicePillars: ServicePillar[] = [
  {
    id: "pillar-1",
    title: "Software House",
    badge: "Pilar 01",
    icon: "Code2",
    desc: "Pengembangan Perangkat Lunak Kustom & Enterprise Web/Mobile",
    sla: "Target Ketersediaan 99.9%",
    features: ["Arsitektur Microservices / Monorepo", "Clean Code & Automated Testing", "Dukungan SLA 24/7"],
    isActive: true,
  },
  {
    id: "pillar-2",
    title: "IT Consultant",
    badge: "Pilar 02",
    icon: "Cpu",
    desc: "Konsultasi Tata Kelola TI, Enterprise Architecture, & Penyelarasan SPBE",
    sla: "Metodologi TOGAF & LKPP",
    features: ["Penyusunan Masterplan TI", "Audit Keamanan & Kepatuhan SPBE", "Katalog Satu Data Indonesia"],
    isActive: true,
  },
  {
    id: "pillar-3",
    title: "IT Supplier",
    badge: "Pilar 03",
    icon: "Server",
    desc: "Pengadaan Perangkat Keras Enterprise, Server Data Center, & Jaringan",
    sla: "Faktur Resmi & SIKaP LKPP",
    features: ["Server Rackmount & SAN Storage", "Perangkat Jaringan Cisco/Mikrotik", "Garansi Resmi Distributor"],
    isActive: true,
  },
];

export const defaultSectionVisibility = {
  hero: true,
  highlights: true,
  services: true,
  products: true,
  clients: true,
  cta: true,
};

export const initialLandingPageData: LandingPageData = {
  sectionVisibility: {
    hero: true,
    highlights: true,
    services: true,
    products: true,
    clients: true,
    cta: true,
  },
  hero: {
    badgeText: "Penyedia Solusi Teknologi Informasi Sejak 2006",
    headlinePrefix: "Ciptakan Solusi",
    typewriterWords: [
      "Sepenuh Hati",
      "Tingkat Enterprise",
      "Skala Nasional",
      "Berbasis Inovasi",
      "Terpercaya Sejak 2006",
    ],
    subheadline:
      "CITS Indonesia hadir sebagai mitra bisnis terpercaya dalam menyediakan solusi integral kesistemanan berbasis teknologi informasi untuk instansi pemerintah, BUMN, dan korporasi.",
    primaryCtaText: "Konsultasi Sekarang",
    primaryCtaLink: "/contact",
    secondaryCtaText: "Eksplorasi Produk",
    secondaryCtaLink: "/products",
    trustBadges: ["Terdaftar LPSE & SIKaP LKPP", "Dukungan Tim Ahli 24/7"],
    showMockup: true,
    mockupTitle: "CITS Enterprise System Portal",
    mockupStatus: "Sistem Aktif",
  },
  highlights: [
    { label: "Tahun Berpengalaman", value: "19+", isActive: true },
    { label: "Proyek Selesai", value: "50+", isActive: true },
    { label: "Kementerian & Lembaga", value: "15+", isActive: true },
    { label: "Tim Profesional", value: "30+", isActive: true },
  ],
  servicesIntro: {
    badge: "Pilar Layanan Utama",
    title: "Layanan Unggulan Kami",
    subtitle:
      "Kombinasi keahlian teknis tingkat enterprise dan tata kelola berstandar industri dengan prinsip FOCUS.",
    cardSoftwareHouse: {
      badge: "Pilar Utama Pengembangan",
      title: "Pengembangan Perangkat Lunak (Software House)",
      desc: "Pengembangan aplikasi custom skala enterprise dari tahap perancangan arsitektur, rekayasa kode, integrasi REST API & Microservices, hingga peluncuran sistem digital yang tangguh.",
      linkText: "Pelajari Selengkapnya",
      linkUrl: "/services#software-house",
    },
    cardConsultant: {
      badge: "Konsultasi Strategis",
      title: "Konsultan Teknologi Informasi",
      desc: "Layanan konsultasi TI strategis untuk membantu organisasi merencanakan, merancang arsitektur, dan memformulasikan cetak biru digital yang tepat guna.",
      linkText: "Detail Konsultasi",
      linkUrl: "/services#it-consultant",
    },
    cardSupplier: {
      badge: "Perangkat Keras & Jaringan",
      title: "Pengadaan Perangkat TI (IT Supplier)",
      desc: "Penyediaan perangkat keras dan perangkat lunak berkualitas tinggi dari vendor terpercaya dengan garansi resmi dan dukungan teknis terpadu.",
      linkText: "Katalog Pengadaan",
      linkUrl: "/services#it-supplier",
    },
    cardFocus: {
      badge: "Budaya Kerja & Standar SLA",
      title: "Prinsip Kerja FOCUS",
      desc: "Setiap tahapan kolaborasi kami berakar pada 5 pilar keunggulan operasional:",
      footerText: "Terpercaya menangani sistem kementerian sejak 2006",
      linkText: "Kenali CITS Lebih Dekat",
      linkUrl: "/about",
    },
    bottomCtaText: "Lihat Alur Kerja & Spesifikasi Lengkap Layanan",
    bottomCtaLink: "/services",
  },
  productsIntro: {
    badge: "Solusi Skala Nasional",
    title: "Produk Unggulan CITS",
    subtitle:
      "Platform kesistemanan yang telah teruji melayani jutaan transaksi data di berbagai kementerian dan institusi nasional.",
    card1: {
      badge: "IoT & Telemetri Armada",
      title: "CITS FleetTrack™ - Manajemen Armada & Telemetri",
      desc: "Platform pelacakan armada kendaraan waktu nyata untuk optimalisasi logistik dan pemantauan operasional. Dilengkapi monitoring lokasi presisi, efisiensi bahan bakar, dan mitigasi risiko armada.",
      linkUrl: "/products#cits-fleettrack",
    },
    card2: {
      badge: "Manajemen Aset Perusahaan",
      title: "CITS AssetHub™ - Tata Kelola Aset Terpadu",
      desc: "Sistem pengelolaan aset perusahaan secara terintegrasi dari pengadaan, penempatan, kalkulasi depresiasi nilai, hingga penghapusan aset siap audit.",
      linkUrl: "/products#cits-assethub",
    },
    card3: {
      badge: "Arsip Digital & Dokumen",
      title: "CITS DocuVault™ - Tata Kelola Arsip & EDMS",
      desc: "Sistem digitalisasi dan pengarsipan elektronik untuk mengorganisir, mengamankan, dan mendistribusikan dokumen resmi dengan kontrol versi dan TTE.",
      linkUrl: "/products#cits-docuvault",
    },
    card4: {
      badge: "SIG & Ekosistem Produk Terintegrasi",
      title: "CITS GeoSpatial™ & Rangkaian Platform Enterprise",
      desc: "Platform informasi geografis untuk pemetaan infrastruktur dan analisis spasial, dilengkapi rangkaian solusi perangkat lunak teruji CITS lainnya:",
      linkUrl: "/products",
    },
    bottomCtaText: "Eksplorasi Semua 8 Solusi Produk",
    bottomCtaLink: "/products",
  },
  clientsIntro: {
    title: "Dipercaya oleh Kementerian, BUMN, dan Lembaga Nasional",
  },
  cta: {
    badge: "Mitra Transformasi Digital Terpercaya",
    title: "Siap Mengakselerasi Sistem Informasi Perusahaan Anda?",
    subtitle:
      "Konsultasikan kebutuhan IT, rekayasa software custom, atau pengadaan infrastruktur Anda dengan tim profesional CITS Indonesia.",
    primaryText: "Mulai Konsultasi Gratis",
    primaryLink: "/contact",
    secondaryText: "Pelajari Profil Perusahaan",
    secondaryLink: "/about",
  },
};



