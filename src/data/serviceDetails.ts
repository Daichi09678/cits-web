export interface ServicePresentation {
  id: string;
  badge: string;
  category: string;
  title: string;
  description: string;
  details?: string;
  icon: string;
  gradient: string;
  image: string;
  features: string[];
  techStack: string[];
  caseStudies: string[];
  deliverables: {
    label: string;
    description: string;
  }[];
  slaNote: string;
}

export const defaultServicePresentations: ServicePresentation[] = [
  {
    id: "software-house",
    badge: "Pilar Layanan 01",
    category: "Software House",
    title: "Pengembangan Perangkat Lunak (Software House)",
    description:
      "Rekayasa sistem informasi dan aplikasi perangkat lunak kustom berstandar enterprise yang dirancang presisi sesuai proses bisnis instansi Anda. Mulai dari formulasi arsitektur, rekayasa kode, audit keamanan, hingga peluncuran sistem digital yang tangguh, aman, dan adaptif.",
    icon: "Code2",
    gradient: "from-orange-600 to-amber-500",
    image: "/services/software-house.webp",
    features: [
      "Pengembangan aplikasi web modern, portal terpadu, & Satu Data",
      "Pengembangan aplikasi mobile lintas platform (Android & iOS)",
      "Integrasi sistem enterprise, interoperabilitas data, & antar-lembaga",
      "Perancangan arsitektur REST API, GraphQL, & Microservices",
      "Pengujian otomatis, audit keamanan kode (SAST), & optimasi performa",
      "Pemeliharaan berkala, perbaikan bug, & penyempurnaan fungsi sistem",
    ],
    techStack: ["Next.js / React", "TypeScript", "Golang", "PostgreSQL", "Docker / K8s", "REST & Microservices"],
    caseStudies: ["BI & EIS SPIPISE BKPM RI", "SIMLALA Kemenhub RI", "Portal Satu Data Kelautan BPPT/BRIN"],
    deliverables: [
      {
        label: "Deliverable Utama",
        description: "Full Source Code, Dokumen Arsitektur (SAD), & Manual Book Pengguna",
      },
      {
        label: "Jaminan Mutu",
        description: "Garansi Pemeliharaan Pasca-BAST (12 Bulan) & Uji Kerentanan Siber",
      },
      {
        label: "Alih Pengetahuan",
        description: "Pelatihan Intensif dan Transfer Knowledge Lengkap untuk Tim Teknis Internal",
      },
    ],
    slaNote: "Target Ketersediaan Sistem 99.9% High Availability",
  },
  {
    id: "it-consultant",
    badge: "Pilar Layanan 02",
    category: "IT Consultant",
    title: "Konsultasi Teknologi Informasi & SPBE",
    description:
      "Layanan konsultansi strategis untuk mendampingi pimpinan instansi dan korporasi dalam merencanakan, merumuskan peta jalan (roadmap), serta mengevaluasi implementasi teknologi informasi yang tepat guna, efisien anggaran, dan patuh terhadap regulasi SPBE nasional.",
    icon: "Cpu",
    gradient: "from-blue-600 to-cyan-500",
    image: "/services/it-consultant.webp",
    features: [
      "Analisis kebutuhan bisnis & penyusunan IT Master Plan (Rencana Induk TI)",
      "Perancangan Enterprise Architecture & keselarasan arsitektur SPBE",
      "Audit kesiapan infrastruktur, kapasitas server, & tata kelola TI",
      "Penilaian risiko siber (cybersecurity assessment) & tata kelola data",
      "Pendampingan teknis (supervisi kesistemanan) & evaluasi berkala",
      "Penyusunan kerangka acuan kerja (KAK/TOR) & estimasi kelayakan biaya",
    ],
    techStack: [
      "TOGAF Framework",
      "Standar SPBE (Perpres 95/2018)",
      "COBIT Governance",
      "ISO 27001 Security",
      "Data Governance",
      "Kepatuhan UU PDP",
    ],
    caseStudies: [
      "Sistem Informasi Diklat BPSDM ESDM",
      "Modernisasi SIMKEP Mahkamah Agung",
      "Perencanaan DRC Kominfo RI",
    ],
    deliverables: [
      {
        label: "Deliverable Utama",
        description: "Dokumen IT Master Plan, Blueprint Arsitektur SPBE, & Dokumen KAK Definitif",
      },
      {
        label: "Kepatuhan Regulasi",
        description: "Penyelarasan Regulasi Perpres No. 95/2018 & Kebijakan Satu Data Indonesia",
      },
      {
        label: "Supervisi Proyek",
        description: "Pendampingan Teknis Berkala & Supervisi Pengadaan Barang/Jasa TI",
      },
    ],
    slaNote: "Metodologi Terstandar TOGAF & Standar Pengadaan LKPP",
  },
  {
    id: "it-supplier",
    badge: "Pilar Layanan 03",
    category: "IT Supplier",
    title: "Pengadaan Perangkat TI & Infrastruktur (IT Supplier)",
    description:
      "Penyediaan perangkat keras, infrastruktur jaringan, dan lisensi perangkat lunak resmi bergaransi prinsipal dari vendor global terpercaya. Didukung pengujian menyeluruh, instalasi di lokasi (on-site configuration), dan layanan purna jual resmi.",
    icon: "Server",
    gradient: "from-emerald-600 to-teal-500",
    image: "/services/it-supplier.webp",
    features: [
      "Server enterprise, rak data center, & perangkat storage penyimpanan",
      "Peralatan jaringan (Router, Core Switch, Firewall, & Access Point)",
      "Workstation, PC desktop, laptop bisnis, & periferal perkantoran",
      "Lisensi sistem operasi resmi, database enterprise, & tool produktivitas",
      "Jasa instalasi, pengkabelan terstruktur (structured cabling), & konfigurasi",
      "Dukungan purna jual, suku cadang resmi, & kontrak pemeliharaan berkala",
    ],
    techStack: [
      "Enterprise Servers",
      "Cisco & Mikrotik",
      "Next-Gen Firewall",
      "Storage Area Network",
      "Enterprise OS License",
      "UPS & Power Backup",
    ],
    caseStudies: [
      "Infrastruktur Simbakar PT Indonesia Power",
      "Pengadaan DRC Kementerian Kominfo",
      "Infrastruktur KTP-el Kemendagri",
    ],
    deliverables: [
      {
        label: "Deliverable Utama",
        description: "Perangkat Keras Enterprise Orisinal, Sertifikat Keaslian Lisensi (CoA), & BAST",
      },
      {
        label: "Jaminan Garansi",
        description: "Garansi Resmi Prinsipal 1-3 Tahun & Ketersediaan Suku Cadang Asli",
      },
      {
        label: "Layanan Lapangan",
        description: "On-Site Installation, Pengkabelan Terstruktur, & Berita Acara Uji Fungsi (FAT/SAT)",
      },
    ],
    slaNote: "Legalitas Faktur Pajak Resmi & Terdaftar SIKaP LKPP",
  },
];
