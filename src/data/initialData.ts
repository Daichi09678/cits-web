import {
  ProductItem,
  ContactInfo,
  ContactMessage,
  AboutData,
  ClientPartner,
  LandingPageData,
  ServicePillar,
  CaseStudyItem,
} from "@/types/schema";

export const initialProducts: ProductItem[] = [
  {
    id: "sms-gateway",
    name: "SMS Gateway Enterprise",
    category: "Communication",
    description:
      "Platform pengiriman SMS massal dan transaksional yang andal untuk kebutuhan notifikasi, OTP, promosi, dan komunikasi bisnis instansi.",
    features: [
      "Pengiriman massal (Bulk SMS)",
      "Integrasi REST API",
      "Laporan pengiriman real-time",
      "Template pesan dinamis",
      "High throughput gateway",
    ],
    tags: ["Bulk SMS", "OTP", "API Ready", "SMPP Protocol"],
    icon: "MessageSquare",
    image: "/services/it-consultant.webp",
    isActive: true,
    updatedAt: "2026-10-12T10:00:00Z",
  },
  {
    id: "j2me-data-collector",
    name: "J2ME & Mobile Data Collector",
    category: "Mobile",
    description:
      "Aplikasi pengumpulan data lapangan berbasis mobile untuk survei statistik, sensus daerah, dan pendataan lapangan terverifikasi GPS.",
    features: [
      "Mode offline storage",
      "Pelacakan koordinat GPS",
      "Form builder dinamis",
      "Sinkronisasi otomatis saat online",
      "Validasi data instan",
    ],
    tags: ["Survey Field", "GPS Tracking", "Offline First", "Android & Cross-platform"],
    icon: "Smartphone",
    image: "/services/software-house.webp",
    isActive: true,
    updatedAt: "2026-10-12T10:00:00Z",
  },
  {
    id: "dokumen-manajemen",
    name: "Dokumen Manajemen (EDMS)",
    category: "Enterprise",
    description:
      "Sistem pengelolaan dokumen digital terpadu untuk mengorganisir, menyimpan, mengindeks, dan berbagi berkas kedinasan secara aman.",
    features: [
      "Kontrol versi dokumen (Versioning)",
      "Manajemen hak akses bertingkat",
      "Pencarian teks lengkap (Full-text)",
      "Audit trail riwayat akses",
      "Enkripsi arsip digital",
    ],
    tags: ["EDMS", "Paperless Office", "ISO 27001", "Digital Archive"],
    icon: "FileText",
    image: "/services/it-supplier.webp",
    isActive: true,
    updatedAt: "2026-10-12T10:00:00Z",
  },
  {
    id: "situng-pilkada",
    name: "Situng Pilkada & Pemilu",
    category: "Government",
    description:
      "Sistem informasi hitung cepat dan rekapitulasi data perolehan suara terdistribusi dengan verifikasi berjenjang dan audit keamanan siber.",
    features: [
      "Tabulasi suara real-time",
      "Pemindaian formulir C1 digital",
      "Dashboard publik transparan",
      "Audit integritas enkripsi kriptografi",
      "High availability server",
    ],
    tags: ["E-Voting", "Tabulasi Suara", "KPU Ready", "High Security"],
    icon: "Vote",
    image: "/services/software-house.webp",
    isActive: true,
    updatedAt: "2026-10-12T10:00:00Z",
  },
  {
    id: "cms-ecommerce",
    name: "Website CMS & Portal Enterprise",
    category: "Web",
    description:
      "Portal terpadu dan sistem manajemen konten kustom berkinerja tinggi yang dirancang adaptif untuk kebutuhan branding korporasi dan pelayanan publik.",
    features: [
      "Manajemen konten WYSIWYG intuitif",
      "Desain responsif multi-device",
      "Optimasi SEO & performa CWV",
      "Integrasi payment gateway nasional",
      "Modul analitik kunjungan",
    ],
    tags: ["Portal Web", "GovTech", "E-Commerce", "CMS Kustom"],
    icon: "Globe",
    image: "/services/it-consultant.webp",
    isActive: true,
    updatedAt: "2026-10-12T10:00:00Z",
  },
  {
    id: "e-filing",
    name: "E-Filing & Arsip Pajak",
    category: "Enterprise",
    description:
      "Sistem pelaporan berkas dan pengarsipan kepatuhan elektronik yang terintegrasi dengan validasi tanda tangan digital dan jejak rekam terpercaya.",
    features: [
      "Pelaporan berkas digital mandiri",
      "Tanda tangan digital tersertifikasi",
      "Validasi format data otomatis",
      "Arsip berbasis cloud terenkripsi",
      "Notifikasi tenggat waktu",
    ],
    tags: ["E-Tax", "Tanda Tangan Digital", "Compliance", "Arsip Elektronik"],
    icon: "Archive",
    image: "/services/it-supplier.webp",
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
  customServices: [
    "Pengembangan Perangkat Lunak (Software House)",
    "Konsultan Teknologi Informasi & SPBE",
    "Pengadaan Perangkat TI & Infrastruktur (IT Supplier)",
    "Solusi Produk Siap Pakai (Tracking, Aset, SIG, dsb.)",
    "Dukungan Pemeliharaan & Supervisi Sistem",
    "Kemitraan Strategis / Kebutuhan Lainnya",
  ],
  faqs: [
    {
      id: "faq-1",
      question: "Bagaimana tahapan awal konsultasi proyek dengan CITS?",
      answer:
        "Setelah Anda mengirimkan formulir kebutuhan atau menghubungi kami, tim analis CITS akan menjadwalkan sesi diskusi awal (daring atau luring) dalam 1x24 jam kerja untuk memetakan ruang lingkup, estimasi waktu, dan arsitektur solusi.",
      isActive: true,
    },
    {
      id: "faq-2",
      question: "Apakah CITS terdaftar resmi dalam pengadaan pemerintah?",
      answer:
        "Ya. CITS Indonesia adalah badan usaha legal yang telah berpengalaman sejak 2006, terdaftar di sistem LPSE, SIKaP LKPP, memiliki Nomor Induk Berusaha (NIB) resmi, serta NPWP dan SIUP aktif.",
      isActive: true,
    },
    {
      id: "faq-3",
      question: "Apakah sistem yang dibangun selaras dengan regulasi SPBE?",
      answer:
        "Tentu. Seluruh arsitektur perangkat lunak dan integrasi data yang kami kembangkan mematuhi kerangka kerja Sistem Pemerintahan Berbasis Elektronik (SPBE), Satu Data Indonesia, dan standar keamanan data nasional.",
      isActive: true,
    },
    {
      id: "faq-4",
      question: "Apakah data dan dokumen kebutuhan instansi dijamin kerahasiaannya?",
      answer:
        "Kami menerapkan standar kerahasiaan ketat. CITS siap menandatangani Non-Disclosure Agreement (NDA) resmi sebelum dokumen teknis, Kerangka Acuan Kerja (KAK), atau data institusi Anda dibagikan.",
      isActive: true,
    },
  ],
  announcement: {
    isActive: false,
    text: "Konsultasi tatap muka dan presentasi teknis KAK dapat dijadwalkan secara langsung di kantor pusat Wisma Mampang atau melalui daring.",
    linkText: "Hubungi via WhatsApp",
    linkUrl: "https://wa.me/6281119719677",
    type: "info",
  },
};

export const initialContactMessages: ContactMessage[] = [];

export const initialAboutData: AboutData = {
  title: "Tentang CITS Indonesia",
  subtitle: "Cipta Integrasi Teknologi Solusi — Mitra Strategis Rekayasa Sistem Sejak 2006",
  story:
    "Berdiri sejak tahun 2006, PT Cipta Integrasi Teknologi Solusi (CITS) telah mendedikasikan keahlian dan kapasitas teknisnya untuk menjadi mitra transformasi digital terpercaya bagi kementerian, instansi pemerintah, BUMN, dan korporasi terkemuka di Indonesia. Kami memadukan kepatuhan regulasi SPBE, standar rekayasa perangkat lunak enterprise, dan keamanan siber berstandar internasional.",
  vision:
    "Menjadi mitra terdepan dan terpercaya dalam rekayasa teknologi informasi dan tata kelola digital terpadu yang memajukan efisiensi nasional.",
  mission: [
    "Menyediakan solusi perangkat lunak kustom berkinerja tinggi, aman, dan adaptif terhadap kebutuhan proses bisnis.",
    "Memberikan layanan konsultansi strategis TI dan SPBE yang akuntabel, efisien, dan selaras regulasi.",
    "Mendukung keandalan infrastruktur teknologi melalui pengadaan perangkat keras enterprise orisinal bergaransi resmi.",
    "Membangun kemitraan jangka panjang berlandaskan integritas, profesionalisme, dan alih pengetahuan berkelanjutan.",
  ],
  coreValues: [
    {
      title: "Integritas & Akuntabilitas",
      description: "Menjunjung transparansi pengadaan dan kepatuhan penuh terhadap standar hukum PBJ LKPP.",
    },
    {
      title: "Keunggulan Rekayasa",
      description: "Penerapan clean code, arsitektur modern, dan pengujian kualitas yang ketat tanpa kompromi.",
    },
    {
      title: "Keamanan Siber Terpadu",
      description: "Perlindungan data berlapis dan enkripsi end-to-end sesuai prinsip ISO 27001 dan UU PDP.",
    },
    {
      title: "Kemitraan Berkelanjutan",
      description: "Pendampingan operasional purna jual dan SLA siap siaga menjamin kelancaran layanan.",
    },
  ],
  stats: [
    {
      label: "Tahun Pengalaman",
      value: "18+",
      description: "Rekam jejak teruji sejak 2006 di berbagai sektor industri dan pemerintahan",
    },
    {
      label: "Inisiatif Proyek Sukses",
      value: "150+",
      description: "Sistem enterprise, portal kementerian, dan implementasi infrastruktur",
    },
    {
      label: "Kementerian & BUMN",
      value: "40+",
      description: "Institusi terpercaya yang menjadi mitra strategis CITS Indonesia",
    },
    {
      label: "Komitmen SLA Ketersediaan",
      value: "99.9%",
      description: "Standar ketersediaan sistem dan respon penanganan teknis",
    },
  ],
};

export const initialClients: ClientPartner[] = [
  {
    id: "c-1",
    name: "Kementerian Perhubungan RI",
    logo: "/clients/kemenhub.webp",
    category: "Kementerian",
    isActive: true,
  },
  { id: "c-2", name: "Kementerian ESDM", logo: "/clients/esdm.webp", category: "Kementerian", isActive: true },
  {
    id: "c-3",
    name: "Kementerian Ketenagakerjaan RI",
    logo: "/clients/kemnaker.webp",
    category: "Kementerian",
    isActive: true,
  },
  {
    id: "c-4",
    name: "Kementerian Investasi / BKPM",
    logo: "/clients/bkpm.webp",
    category: "Kementerian",
    isActive: true,
  },
  {
    id: "c-5",
    name: "Kementerian Kesehatan RI",
    logo: "/clients/kemenkes.webp",
    category: "Kementerian",
    isActive: true,
  },
  {
    id: "c-6",
    name: "Kementerian Dalam Negeri RI",
    logo: "/clients/kemendagri.svg",
    category: "Kementerian",
    isActive: true,
  },
  { id: "c-7", name: "Kementerian Kominfo RI", logo: "/clients/kominfo.webp", category: "Kementerian", isActive: true },
  {
    id: "c-8",
    name: "Kementerian Perdagangan RI",
    logo: "/clients/perdagangan.webp",
    category: "Kementerian",
    isActive: true,
  },
  {
    id: "c-9",
    name: "Kementerian Koperasi dan UKM RI",
    logo: "/clients/kemenkop.webp",
    category: "Kementerian",
    isActive: true,
  },
  { id: "c-10", name: "Kementerian ATR/BPN", logo: "/clients/atr-bpn.webp", category: "Kementerian", isActive: true },
  { id: "c-11", name: "PT Indonesia Power", logo: "/clients/indonesia-power.webp", category: "BUMN", isActive: true },
  { id: "c-12", name: "Mahkamah Agung RI", logo: "/clients/makamah-agung.webp", category: "Lembaga", isActive: true },
  { id: "c-13", name: "BPPT", logo: "/clients/bppt.webp", category: "Lembaga", isActive: true },
  { id: "c-14", name: "BRIN", logo: "/clients/brin.webp", category: "Lembaga", isActive: true },
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
    badgeText: "Mitra Transformasi Digital Terpercaya Sejak 2006",
    headlinePrefix: "Bangun Sistem",
    typewriterWords: [
      "Yang Siap Bertumbuh",
      "Untuk Operasi Lebih Efisien",
      "Dengan Standar Enterprise",
      "Berbasis Data",
      "Untuk Dampak Nyata",
    ],
    subheadline:
      "Kami merancang, membangun, dan menjaga solusi digital yang membuat layanan publik dan bisnis berjalan lebih cepat, aman, serta mudah dikembangkan.",
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
    title: "Solusi yang Siap Dipakai dan Dikembangkan",
    subtitle: "Pilih kapabilitas yang sesuai kebutuhan Anda—mulai dari rekayasa perangkat lunak, konsultasi strategis, hingga infrastruktur TI.",
    cardSoftwareHouse: {
      badge: "Pilar Utama Pengembangan",
      title: "Pengembangan Perangkat Lunak (Software House)",
      desc: "Pengembangan aplikasi custom skala enterprise dari tahap perancangan arsitektur, rekayasa kode, integrasi REST API & Microservices, hingga peluncuran sistem digital yang tangguh.",
      linkText: "Pelajari Selengkapnya",
      linkUrl: "/services#software-house",
      pipelineSteps: ["Aplikasi Web & Mobile", "REST API & Microservices", "Basis Data PostgreSQL / Oracle"],
      tags: ["Aplikasi Web", "Aplikasi Mobile", "Integrasi Sistem", "Pengembangan API", "Pemeliharaan Berkala"],
    },
    cardConsultant: {
      badge: "Konsultasi Strategis",
      title: "Konsultan Teknologi Informasi",
      desc: "Layanan konsultasi TI strategis untuk membantu organisasi merencanakan, merancang arsitektur, dan memformulasikan cetak biru digital yang tepat guna.",
      linkText: "Detail Konsultasi",
      linkUrl: "/services#it-consultant",
      items: [
        "Analisis kebutuhan sistem informasi",
        "Perencanaan arsitektur TI enterprise",
        "Audit infrastruktur & keamanan teknologi",
        "Rekomendasi solusi & peta jalan digital",
        "Pendampingan implementasi kesistemanan",
      ],
    },
    cardSupplier: {
      badge: "Perangkat Keras & Jaringan",
      title: "Pengadaan Perangkat TI (IT Supplier)",
      desc: "Penyediaan perangkat keras dan perangkat lunak berkualitas tinggi dari vendor terpercaya dengan garansi resmi dan dukungan teknis terpadu.",
      linkText: "Katalog Pengadaan",
      linkUrl: "/services#it-supplier",
      items: [
        "Perangkat server & infrastruktur jaringan",
        "Komputer desktop, laptop & periferal kerja",
        "Lisensi & langganan software resmi",
        "Instalasi, konfigurasi & pengujian perangkat",
        "Layanan purna jual & pemeliharaan berkala",
      ],
    },
    cardFocus: {
      badge: "Budaya Kerja & Standar SLA",
      title: "Prinsip Kerja FOCUS",
      desc: "Setiap tahapan kolaborasi kami berakar pada 5 pilar keunggulan operasional:",
      footerText: "Terpercaya menangani sistem kementerian sejak 2006",
      linkText: "Kenali CITS Lebih Dekat",
      linkUrl: "/about",
      focusItems: [
        { letter: "F", word: "Focus", desc: "Kebutuhan klien" },
        { letter: "O", word: "On Time", desc: "Tepat waktu" },
        { letter: "C", word: "Customer", desc: "Kepuasan pelanggan" },
        { letter: "U", word: "Update", desc: "Teknologi terkini" },
        { letter: "S", word: "Synergy", desc: "Sinergi tim maksimal" },
      ],
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
      features: [
        { title: "GPS Waktu Nyata", desc: "Akurasi pelacakan tinggi" },
        { title: "Geofencing", desc: "Batas perimeter otomatis" },
        { title: "Riwayat Rute", desc: "Rekam jejak perjalanan" },
        { title: "Peringatan Darurat", desc: "Notifikasi insiden instan" },
      ],
      tags: ["GPS Waktu Nyata", "Geofencing", "Riwayat Rute", "Sistem Peringatan", "Manajemen Armada"],
    },
    card2: {
      badge: "Manajemen Aset Perusahaan",
      title: "CITS AssetHub™ - Tata Kelola Aset Terpadu",
      desc: "Sistem pengelolaan aset perusahaan secara terintegrasi dari pengadaan, penempatan, kalkulasi depresiasi nilai, hingga penghapusan aset siap audit.",
      linkUrl: "/products#cits-assethub",
      features: [
        "Pengelolaan siklus hidup aset lengkap",
        "Pemindaian kode QR & Barcode presisi",
        "Kalkulasi penyusutan nilai otomatis",
        "Pelaporan komprehensif & siap audit",
      ],
    },
    card3: {
      badge: "Arsip Digital & Dokumen",
      title: "CITS DocuVault™ - Tata Kelola Arsip & EDMS",
      desc: "Sistem digitalisasi dan pengarsipan elektronik untuk mengorganisir, mengamankan, dan mendistribusikan dokumen resmi dengan kontrol versi dan TTE.",
      linkUrl: "/products#cits-docuvault",
      features: [
        "Kontrol versi & manajemen hak akses",
        "Pencarian teks lengkap OCR & barcode",
        "Klasifikasi dinamis & jejak audit digital",
        "Cadangan otomatis & enkripsi AES-256",
      ],
    },
    card4: {
      badge: "SIG & Ekosistem Produk Terintegrasi",
      title: "CITS GeoSpatial™ & Rangkaian Platform Enterprise",
      desc: "Platform informasi geografis untuk pemetaan infrastruktur dan analisis spasial, dilengkapi rangkaian solusi perangkat lunak teruji CITS lainnya:",
      linkUrl: "/products",
      subProducts: [
        {
          name: "CITS GeoSpatial™",
          desc: "Peta interaktif multi-layer, analisis spasial wilayah & monitoring infrastruktur utilitas.",
        },
        {
          name: "CITS Omnichannel Gateway™",
          desc: "Pengiriman pesan massal WhatsApp API & SMS OTP dengan throughput tinggi dan fallback otomatis.",
        },
        {
          name: "CITS SmartGov Portal™",
          desc: "Portal pelayanan publik satu pintu, pelacakan permohonan berkas & gerbang retribusi SPBE.",
        },
        {
          name: "CITS Executive BI™",
          desc: "Dasbor analitik eksekutif real-time, agregasi multi-database & perumusan keputusan pimpinan.",
        },
      ],
      tags: [
        "CITS FleetTrack",
        "CITS AssetHub",
        "CITS DocuVault",
        "CITS GeoSpatial",
        "CITS Omnichannel",
        "CITS SmartGov",
      ],
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

export const initialCaseStudies: CaseStudyItem[] = [
  {
    id: "ktp-el",
    title: "Pemeliharaan & Rekayasa Arsitektur KTP Elektronik Nasional",
    client: "Kementerian Dalam Negeri RI (Ditjen Dukcapil)",
    clientShort: "Kemendagri RI",
    clientLogo: "/clients/kemendagri.svg",
    sector: "Kementerian & Lembaga Pusat",
    categoryTag: "Kependudukan & Identitas Digital",
    period: "Multi-Tahun (Operasional Aktif)",
    servicePillar: "Software House & Pemeliharaan Mission-Critical",
    isFlagship: true,
    tagline:
      "Menopang keandalan infrastruktur verifikasi data kependudukan nasional untuk ribuan instansi mitra perbankan dan publik tanpa henti.",
    challenge:
      "Mengelola pemanfaatan data kependudukan ratusan juta warga negara dengan lalu lintas jutaan hit verifikasi API per hari dari perbankan, kepolisian, dan kementerian, di mana downtime sistem dapat melumpuhkan layanan publik nasional.",
    solution:
      "Rekayasa API Webservices integrasi chip KTP-el, perancangan Dasbor Analitik Pelaporan real-time, penguatan arsitektur database Oracle RAC berkecepatan tinggi, integrasi modul Hardware Cryptography, serta pemeliharaan hardware dan software di data center secara terpadu 24/7.",
    measurableImpact: {
      highlightValue: "100+ Juta",
      highlightLabel: "Transaksi Verifikasi NIK / Tahun",
      detail:
        "Menjamin latensi respons verifikasi identitas di bawah 1,5 detik dengan ketersediaan sistem 99,98% bagi 2.000+ institusi mitra nasional.",
    },
    scopeOfWork: [
      "Rekayasa API Webservices Chip KTP-el",
      "Pemeliharaan Infrastruktur Server Data Center",
      "Integrasi Modul Kriptografi Keamanan (HSM)",
      "Perancangan Dasbor Pelaporan Eksekutif",
      "Dukungan Tim Ahli Siaga 24/7",
    ],
    techStack: [
      "Java Enterprise",
      "Oracle Database RAC",
      "Web Services API",
      "Hardware Crypto / HSM",
      "High Availability Clustering",
    ],
    deliverables: [
      "API Gateway Webservices Chip KTP-el",
      "Dasbor Analisis Pemanfaatan Data Kependudukan",
      "SLA Pemeliharaan Server Data Center Tanpa Henti",
    ],
  },
  {
    id: "simlala",
    title: "SIMLALA - Sistem Manajemen Lalu Lintas & Perizinan Angkutan Laut",
    client: "Kementerian Perhubungan RI (Ditjen Perhubungan Laut)",
    clientShort: "Kemenhub RI",
    clientLogo: "/clients/kemenhub.webp",
    sector: "Transportasi & Maritim",
    categoryTag: "Layanan Transportasi Laut",
    period: "Operasional Nasional Berkelanjutan",
    servicePillar: "Software House & Integrasi Sistem Publik",
    isFlagship: true,
    tagline:
      "Transformasi digital perizinan trayek dan pengoperasian kapal niaga di seluruh pelabuhan kepulauan Indonesia.",
    challenge:
      "Proses perizinan trayek pelayaran kapal niaga sebelumnya berjalan secara manual dan terfragmentasi antar-kantor pelabuhan, mengakibatkan waktu tunggu verifikasi berhari-hari serta kesulitan dalam rekonsiliasi data pelabuhan.",
    solution:
      "Rekayasa ulang portal pelayanan publik terpadu berbasis microservices, integrasi bi-directional dengan ekosistem Online Single Submission (OSS), Inaportnet, dan INWS, dilengkapi otomasi alur kerja persetujuan dan helpdesk teknis siaga 24/7.",
    measurableImpact: {
      highlightValue: "70%",
      highlightLabel: "Efisiensi Waktu Perizinan Trayek",
      detail:
        "Memangkas durasi penerbitan persetujuan trayek kapal dari 7 hari kerja menjadi kurang dari 48 jam di seluruh pelabuhan nasional.",
    },
    scopeOfWork: [
      "Rekayasa Ulang Arsitektur Microservices",
      "Integrasi Sistem OSS, Inaportnet & INWS",
      "Pembangunan Portal Layanan Publik Terpadu",
      "Otomasi Validasi Dokumen Legalitas Kapal",
      "Layanan Pendampingan Helpdesk 24/7",
    ],
    techStack: [
      "Microservices Architecture",
      "PostgreSQL",
      "RESTful API & Gateway",
      "Inaportnet Integration",
      "24/7 Helpdesk Engine",
    ],
    deliverables: [
      "Portal Pelayanan SIMLALA Kemenhub",
      "Modul Integrasi Single Submission OSS",
      "Layanan Dukungan Operasional Pengguna 24 Jam",
    ],
  },
  {
    id: "satu-data-bkpm",
    title: "Portal Satu Data & Integrasi Pelaporan Realisasi Investasi",
    client: "Kementerian Investasi / BKPM RI",
    clientShort: "Kementerian Investasi / BKPM",
    clientLogo: "/clients/bkpm.webp",
    sector: "Kementerian & Lembaga Pusat",
    categoryTag: "Konsolidasi Satu Data Indonesia",
    period: "Implementasi & Pemeliharaan",
    servicePillar: "IT Consultant & Arsitektur Data Enterprise",
    tagline:
      "Penyatuan data realisasi penanaman modal dari 38 provinsi ke dalam repositori Satu Data terstandardisasi.",
    challenge:
      "Tantangan redundansi dan disparitas format data perizinan penanaman modal dari dinas DPMPTSP daerah di 38 provinsi yang menyulitkan agregasi angka realisasi investasi nasional.",
    solution:
      "Pembangunan Portal Satu Data terpadu dengan arsitektur server performa tinggi, pipeline otomatisasi CI/CD, deployment kontainer Docker, serta engine sinkronisasi data antar-wilayah berbasis standar metadata SPBE.",
    measurableImpact: {
      highlightValue: "5x Lebih Cepat",
      highlightLabel: "Kecepatan Konsolidasi Data Provinsi",
      detail:
        "Memungkinkan pelaporan berkala realisasi investasi ratusan triliun rupiah disajikan transparan dan akuntabel kepada publik.",
    },
    scopeOfWork: [
      "Perancangan Arsitektur Satu Data SPBE",
      "Deployment Container Docker & Pipeline CI/CD",
      "Pembangunan Engine Agregasi Data 38 Provinsi",
      "Dasbor Analitik Realisasi Investasi Terpadu",
    ],
    techStack: [
      "High-Performance PHP & Go",
      "Docker Containers",
      "PostgreSQL Enterprise",
      "CI/CD Pipeline",
      "Analytics Engine",
    ],
    deliverables: [
      "Portal Satu Data Kementerian Investasi",
      "Pipeline Integrasi Data Daerah ke Pusat",
      "Modul Dashboard Analisis Penanaman Modal",
    ],
  },
  {
    id: "pos-informatika",
    title: "Portal Pengawasan Pelayanan Pos, Informatika & DRC Siaga Bencana",
    client: "Kementerian Komunikasi dan Informatika RI (Kominfo)",
    clientShort: "Kementerian Kominfo RI",
    clientLogo: "/clients/kominfo.png",
    sector: "Kementerian & Lembaga Pusat",
    categoryTag: "Regulasi & Ketahanan Infrastruktur (DRC)",
    period: "Implementasi Multi-Fase",
    servicePillar: "Software House & Infrastruktur DRC",
    tagline:
      "Menjamin akuntabilitas penerimaan negara BHP Telekomunikasi serta kepatuhan regulasi dengan ketahanan sistem tanpa risiko data loss.",
    challenge:
      "Kebutuhan pengawasan kepatuhan pelaporan keuangan BHP Telekomunikasi dan kontribusi USO yang bernilai triliunan rupiah dengan persyaratan ketahanan sistem tanpa toleransi kehilangan data saat insiden darurat.",
    solution:
      "Pembangunan portal pelayanan pelaporan penyelenggaraan pos dan informatika mencakup modul audit Laporan Keuangan BHP Telekomunikasi, integrasi server perizinan KPU/USO, serta pembangunan infrastruktur Disaster Recovery Center (DRC) bersiaga tinggi.",
    measurableImpact: {
      highlightValue: "100%",
      highlightLabel: "Integritas & Kepatuhan Audit Keuangan",
      detail:
        "Memastikan kelangsungan operasional sistem pelaporan regulasi telekomunikasi nasional dengan RPO/RTO minimal saat simulasi bencana.",
    },
    scopeOfWork: [
      "Pembangunan Modul Audit Keuangan BHP & USO",
      "Pembangunan Arsitektur Disaster Recovery Center (DRC)",
      "Sinkronisasi Replikasi Basis Data Antar-Data Center",
      "Sistem Penjadwalan Elektronik (e-Scheduling)",
    ],
    techStack: [
      "Java Enterprise",
      "DRC Replication Cluster",
      "Financial Audit Engine",
      "Web Services",
      "Secure Vault Storage",
    ],
    deliverables: [
      "Portal Pelaporan Pos & Informatika Terpadu",
      "Infrastruktur Data Center Cadangan (DRC Siaga)",
      "Modul Rekonsiliasi Penerimaan Negara Bukan Pajak (PNBP)",
    ],
  },
  {
    id: "simbakar",
    title: "Sistem Informasi Bahan Bakar (SIMBAKAR) PLTU Suralaya",
    client: "PT Indonesia Power (PLN Indonesia Power)",
    clientShort: "PT Indonesia Power",
    clientLogo: "/clients/indonesia-power.webp",
    sector: "BUMN & Energi Strategis",
    categoryTag: "Logistik Energi Pembangkit Listrik",
    period: "Kemitraan Berkelanjutan > 5 Tahun",
    servicePillar: "Software House & Pemeliharaan Logistik Energi",
    tagline:
      "Menjaga kontinuitas dan transparansi rantai pasok batu bara dan BBM untuk pembangkit penopang utama sistem kelistrikan Jawa-Bali.",
    challenge:
      "Monitoring konsumsi harian dan penerimaan jutaan ton bahan bakar fosil pembangkit PLTU Suralaya memerlukan akurasi timbang, pencatatan tongkang, dan rekonsiliasi stok tanpa celah disparitas data.",
    solution:
      "Pengembangan dan pemeliharaan operasional jangka panjang Sistem Informasi Bahan Bakar (SIMBAKAR) terintegrasi dengan instrumen SCADA PLTU, rekonsiliasi pasokan tongkang kapal, serta pelaporan audit inventarisasi logistik energi.",
    measurableImpact: {
      highlightValue: "5+ Tahun",
      highlightLabel: "Operasional Kontinu Tanpa Kendala",
      detail:
        "Dipercaya selama lebih dari setengah dekade mengawal akuntabilitas pasokan bahan bakar pembangkit kapasitas 3.400 MW Jawa-Bali.",
    },
    scopeOfWork: [
      "Integrasi Data Sensor Timbangan SCADA & Tongkang",
      "Modul Manajemen Inventarisasi Batu Bara & BBM",
      "Sistem Peringatan Dini Batas Kritis Pasokan Bahan Bakar",
      "Dukungan Pemeliharaan & SLA Tim Ahli di Lokasi",
    ],
    techStack: [
      "Java Enterprise",
      "Oracle Enterprise DB",
      "SCADA Telemetry Interface",
      "Fuel Inventory Tracker",
      "Long-term SLA Management",
    ],
    deliverables: [
      "Aplikasi SIMBAKAR Terintegrasi PLTU Suralaya",
      "Dasbor Monitoring Real-Time Stok Bahan Bakar",
      "SOP & Laporan Pemeliharaan Berkala 5 Tahun",
    ],
  },
  {
    id: "spipise-bi",
    title: "Executive Information System (EIS) & Business Intelligence SPIPISE",
    client: "Kementerian Investasi / BKPM RI",
    clientShort: "Kementerian Investasi / BKPM",
    clientLogo: "/clients/bkpm.webp",
    sector: "Intelijen Bisnis & Analitik",
    categoryTag: "Executive BI & Analytics",
    period: "Tuntas dengan Apresiasi Resmi",
    servicePillar: "IT Consultant & Business Intelligence",
    tagline:
      "Penyediaan visibilitas analitik real-time bagi jajaran pengambil keputusan perizinan penanaman modal skala nasional.",
    challenge:
      "Pengambil kebijakan di kementerian membutuhkan ringkasan tren investasi modal asing (PMA) dan dalam negeri (PMDN) yang cepat, intuitif, dan dapat ditelusuri hingga level sektor dan kabupaten/kota secara instan.",
    solution:
      "Pembangunan arsitektur Business Intelligence berbasis IBM Cognos dan Oracle Data Warehouse, penyusunan dasbor eksekutif multi-dimensi, serta modul persetujuan perizinan terotomasi untuk pimpinan PTSP pusat.",
    measurableImpact: {
      highlightValue: "Real-Time",
      highlightLabel: "Visibilitas Analisis Investasi Nasional",
      detail:
        "Memangkas waktu penyusunan laporan evaluasi pimpinan dari hitungan minggu menjadi hitungan detik dengan akurasi data warehouse 100%.",
    },
    scopeOfWork: [
      "Perancangan Data Warehouse & Skema ETL",
      "Implementasi Platform IBM Cognos BI Enterprise",
      "Perancangan Dasbor Eksekutif (EIS) Interaktif",
      "Modul Alur Kerja Persetujuan Otomatis (Automated Approval)",
    ],
    techStack: [
      "IBM Cognos BI",
      "Oracle Data Warehouse",
      "ETL Data Pipelines",
      "Executive Dashboard UI",
      "Automated Approval Engine",
    ],
    deliverables: [
      "Dasbor Eksekutif SPIPISE Pimpinan BKPM",
      "Data Warehouse Investasi Terintegrasi",
      "Modul Laporan Analitik Tren Sektoral",
    ],
  },
  {
    id: "nodc-ocean",
    title: "Portal Repositori & Pemetaan Data Oseanografi Nasional (NODC)",
    client: "BPPT / Badan Riset dan Inovasi Nasional (BRIN)",
    clientShort: "BPPT / BRIN",
    clientLogo: "/clients/brin.png",
    sector: "Satu Data & Geospasial",
    categoryTag: "SIG & Riset Oseanografi Maritim",
    period: "Pusat Rujukan Maritim Nasional",
    servicePillar: "Software House & Rekayasa GIS Spasial",
    tagline:
      "Modernisasi repositori geospasial kelautan nasional untuk standardisasi pertukaran data riset maritim Indonesia.",
    challenge:
      "Data hasil riset oseanografi nasional selama puluhan tahun tersebar di berbagai pusat penelitian tanpa standar metadata internasional, menyulitkan kolaborasi ilmiah dan perumusan kebijakan kemaritiman.",
    solution:
      "Modernisasi arsitektur National Oceanographic Data Center (NODC), pembangunan portal pertukaran data kelautan dengan GeoServer interaktif, standardisasi metadata berbasis standar IODE/UNESCO, dan visualisasi pemetaan spasial terintegrasi.",
    measurableImpact: {
      highlightValue: "1 Portal Terpadu",
      highlightLabel: "Rujukan Tunggal Riset Oseanografi",
      detail:
        "Mengintegrasikan ribuan set data riset kelautan dari berbagai ekspedisi ilmiah ke dalam katalog spasial publik yang interaktif.",
    },
    scopeOfWork: [
      "Standardisasi Metadata Data Kelautan IODE/UNESCO",
      "Pembangunan Portal Katalog Spasial Interaktif",
      "Konfigurasi Server Pemetaan Spasial GeoServer",
      "Perancangan Antarmuka Penelusuran Metadata Riset",
    ],
    techStack: [
      "GeoServer",
      "PostGIS Spatial DB",
      "OpenLayers / Map Visualizer",
      "CMS Portal Interaktif",
      "Metadata Standard Engine",
    ],
    deliverables: [
      "Portal Publik NODC Indonesia",
      "Katalog Geospasial Data Kelautan Nasional",
      "Modul Unduh & Visualisasi Data Oseanografi",
    ],
  },
  {
    id: "jakarta-smart-city",
    title: "Platform Tata Kelola Lisensi Perangkat Lunak Jakarta Smart City",
    client: "Unit Pengelola Jakarta Smart City (Diskominfotik Pemprov DKI Jakarta)",
    clientShort: "Pemprov DKI Jakarta",
    clientLogo: "/clients/kominfo.png",
    sector: "Kementerian & Lembaga Pusat",
    categoryTag: "Smart City & Lisensi Enterprise",
    period: "Implementasi Pemda DKI",
    servicePillar: "IT Supplier & Manajemen Lisensi Enterprise",
    tagline:
      "Optimalisasi pengelolaan aset digital dan lisensi perangkat lunak analitik untuk ekosistem smart city ibu kota.",
    challenge:
      "Kompleksitas pemantauan masa aktif, kepatuhan lisensi, dan utilisasi perangkat lunak analitik yang digunakan oleh puluhan divisi pada ekosistem Jakarta Smart City.",
    solution:
      "Penyediaan solusi tata kelola lisensi perangkat lunak terpusat, pengadaan lisensi resmi vendor global, serta integrasi sistem operasional monitoring penggunaan software guna memastikan efisiensi anggaran daerah.",
    measurableImpact: {
      highlightValue: "100%",
      highlightLabel: "Kepatuhan Kebutuhan Lisensi Resmi",
      detail:
        "Menjamin seluruh komponen software pendukung analitik smart city ibu kota beroperasi legal, bergaransi, dan terkelola rapi.",
    },
    scopeOfWork: [
      "Audit Inventarisasi Kebutuhan Lisensi Perangkat Lunak",
      "Pengadaan & Manajemen Lisensi Enterprise Resmi",
      "Konfigurasi Arsitektur Cloud Pendukung Analitik",
      "Dasbor Pemantauan Utilisasi Aset Perangkat Lunak",
    ],
    techStack: ["Enterprise License Manager", "Cloud Infrastructure", "System Integration", "Audit Trail & Compliance"],
    deliverables: [
      "Laporan Rekonsiliasi Lisensi Jakarta Smart City",
      "Aktivasi Lisensi Software Analitik Terverifikasi",
      "Panduan Tata Kelola Pemanfaatan Software",
    ],
  },
  {
    id: "atr-bpn-gis",
    title: "Sistem Validasi Data Geospasial & Pemetaan Tematik Pertanahan",
    client: "Kementerian Agraria dan Tata Ruang / Badan Pertanahan Nasional",
    clientShort: "Kementerian ATR/BPN",
    clientLogo: "/clients/atr-bpn.webp",
    sector: "Satu Data & Geospasial",
    categoryTag: "SIG & Tata Ruang Wilayah",
    period: "Implementasi Sistem Informasi",
    servicePillar: "IT Consultant & Rekayasa SIG",
    tagline:
      "Penguatan integrasi data spasial bidang tanah dan sinkronisasi informasi tekstual untuk tata kelola pertanahan modern.",
    challenge:
      "Sinkronisasi data tekstual kepemilikan tanah dengan peta spasial poligon bidang tanah di berbagai kantor pertanahan daerah memerlukan validasi topologi ketat untuk mencegah tumpang tindih lahan.",
    solution:
      "Pengembangan modul validasi spasial geospasial tematik, integrasi basis data spasial berkecepatan tinggi, dan penyediaan dasbor pemantauan progres pendaftaran tanah sistematis lengkap (PTSL).",
    measurableImpact: {
      highlightValue: "Presisi Tinggi",
      highlightLabel: "Validasi Topologi Spasial Pertanahan",
      detail:
        "Mendukung keandalan pemetaan tematik tanah dan meminimalisir anomali data spasial dalam sistem pelayanan kantor pertanahan.",
    },
    scopeOfWork: [
      "Perancangan Engine Validasi Topologi Geospasial",
      "Integrasi Database Spasial Tematik",
      "Dasbor Pemantauan Progres Bidang Tanah",
      "Pelatihan Teknis bagi Operator Pemetaan",
    ],
    techStack: [
      "PostGIS Spatial",
      "GeoServer",
      "Spatial Data Cleaning Engine",
      "RESTful Mapping API",
      "QGIS Integration",
    ],
    deliverables: [
      "Modul Validasi Poligon Spasial Bidang Tanah",
      "Katalog Peta Tematik Pertanahan Terpadu",
      "Dokumentasi Teknis Integrasi SPBE Geospasial",
    ],
  },
  {
    id: "makamah-agung-arsip",
    title: "Sistem Manajemen Dokumen Digital & Arsip Berkas Perkara",
    client: "Satuan Kerja Mahkamah Agung Republik Indonesia",
    clientShort: "Mahkamah Agung RI",
    clientLogo: "/clients/makamah-agung.png",
    sector: "Kementerian & Lembaga Pusat",
    categoryTag: "Tata Kelola Dokumen & Peradilan Elektronik",
    period: "Implementasi Satuan Kerja",
    servicePillar: "Software House & Manajemen Dokumen Terpadu",
    tagline:
      "Perlindungan integritas dan percepatan temu kembali berkas perkara hukum dalam satu repositori terenkripsi.",
    challenge:
      "Volume berkas perkara fisik yang terus bertambah memerlukan digitalisasi cepat dengan jaminan keaslian dokumen, kontrol versi ketat, serta pembatasan akses rahasia negara.",
    solution:
      "Implementasi platform tata kelola dokumen elektronik terlindungi enkripsi, modul OCR cerdas untuk pencarian teks berkas putusan, dan rekam jejak audit digital aktivitas pembacaan dokumen hukum.",
    measurableImpact: {
      highlightValue: "< 3 Detik",
      highlightLabel: "Temu Kembali Berkas Perkara Digital",
      detail:
        "Mempercepat proses penelusuran riwayat perkara oleh panitera dan hakim tanpa risiko kehilangan atau kerusakan fisik dokumen asli.",
    },
    scopeOfWork: [
      "Pembangunan Repositori Dokumen Hukum Terenkripsi",
      "Engine Pencarian Teks Penuh (Full-Text Search OCR)",
      "Audit Trail & Manajemen Hak Akses Bertingkat",
      "Pencadangan Berkas Otomatis Tahan Kerusakan",
    ],
    techStack: [
      "Encrypted Document Vault",
      "Elasticsearch",
      "Role-Based Access Control",
      "OCR Engine",
      "Audit Trail Logger",
    ],
    deliverables: [
      "Platform Repositori Berkas Perkara Mahkamah Agung",
      "Modul Pencarian Cerdas Dokumen Hukum",
      "Sistem Audit Keamanan Akses Berkas",
    ],
  },
];
