"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Code2,
  Cpu,
  Server,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Layers,
  Sparkles,
  Zap,
  Building2,
  Headphones,
  Check,
  Award,
  Briefcase,
  FileText,
  Clock,
  Lock,
  FileCheck,
  Database,
  Boxes,
} from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import GradientText from "@/components/ui/GradientText";
import GridPattern from "@/components/ui/GridPattern";
import FloatingShapes from "@/components/animations/FloatingShapes";
import SpotlightCard from "@/components/ui/SpotlightCard";

interface ServiceItem {
  id: string;
  badge: string;
  category: string;
  title: string;
  description: string;
  icon: typeof Code2;
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

const services: ServiceItem[] = [
  {
    id: "software-house",
    badge: "Pilar Layanan 01",
    category: "Software House",
    title: "Pengembangan Perangkat Lunak (Software House)",
    description:
      "Rekayasa sistem informasi dan aplikasi perangkat lunak kustom berstandar enterprise yang dirancang presisi sesuai proses bisnis instansi Anda. Mulai dari formulasi arsitektur, rekayasa kode, audit keamanan, hingga peluncuran sistem digital yang tangguh, aman, dan adaptif.",
    icon: Code2,
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
    techStack: [
      "Next.js / React",
      "TypeScript",
      "Golang",
      "PostgreSQL",
      "Docker / K8s",
      "REST & Microservices",
    ],
    caseStudies: [
      "BI & EIS SPIPISE BKPM RI",
      "SIMLALA Kemenhub RI",
      "Portal Satu Data Kelautan BPPT/BRIN",
    ],
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
    icon: Cpu,
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
    icon: Server,
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

const workProcess = [
  {
    step: "01",
    title: "Konsultasi & Temu Kebutuhan",
    subtitle: "Inisiasi Strategis",
    description:
      "Diskusi mendalam mengenai target institusi, batasan operasional, regulasi kepatuhan, dan sasaran transformasi digital yang ingin dicapai.",
    icon: FileText,
  },
  {
    step: "02",
    title: "Analisis & Perancangan Arsitektur",
    subtitle: "Blueprint Sistem",
    description:
      "Penyusunan arsitektur teknis terpadu, rancangan antarmuka pengguna (UI/UX), skema basis data, dan pemilihan tumpukan teknologi yang optimal.",
    icon: Layers,
  },
  {
    step: "03",
    title: "Rekayasa & Audit Keamanan",
    subtitle: "Implementasi Mutu",
    description:
      "Penulisan kode bersih (clean code) berstandar modern, integrasi microservices, serta pengujian fungsional dan pengujian kerentanan keamanan siber.",
    icon: Code2,
  },
  {
    step: "04",
    title: "Penerapan & Alih Pengetahuan",
    subtitle: "Deployment Mandiri",
    description:
      "Peluncuran sistem ke lingkungan produksi, migrasi data historis, dokumentasi teknis lengkap, serta pelatihan intensif bagi aparatur pengelola.",
    icon: Boxes,
  },
  {
    step: "05",
    title: "Pemeliharaan & SLA Berkelanjutan",
    subtitle: "Kemitraan Berkelanjutan",
    description:
      "Pendampingan operasional berkala, pemantauan kesehatan server secara real-time, dan tim tanggap insiden siap siaga menjamin kelancaran layanan.",
    icon: Clock,
  },
];

const qualityStandards = [
  {
    title: "Kepatuhan Regulasi SPBE",
    description:
      "Seluruh rekayasa sistem dirancang selaras dengan kerangka kerja Sistem Pemerintahan Berbasis Elektronik (SPBE) untuk interoperabilitas nasional.",
    icon: FileCheck,
  },
  {
    title: "Keamanan Siber Teruji",
    description:
      "Menerapkan pengamanan data berlapis, enkripsi end-to-end, dan pemindaian kerentanan berkala sesuai standar praktik terbaik ISO 27001.",
    icon: ShieldCheck,
  },
  {
    title: "Arsitektur Skalabel & Andal",
    description:
      "Sistem dirancang modular untuk memfasilitasi lonjakan transaksi jutaan pengguna tanpa hambatan latensi maupun downtime tak terduga.",
    icon: Layers,
  },
  {
    title: "Dukungan Purna Jual & SLA",
    description:
      "Komitmen pendampingan operasional dengan pusat bantuan teknis profesional untuk penanganan insiden operasional secara cepat dan tuntas.",
    icon: Headphones,
  },
];

interface EngagementModel {
  title: string;
  badge: string;
  scope: string;
  characteristics: string[];
  recommendedFor: string;
  icon: typeof Boxes;
}

const engagementModels: EngagementModel[] = [
  {
    title: "Model Proyek Terikat (Fixed Price / Turnkey)",
    badge: "Sesuai PBJ & LPSE",
    scope: "Pengadaan berbasis Kerangka Acuan Kerja (KAK) definitif dengan target jadwal dan anggaran tetap.",
    characteristics: [
      "Ruang lingkup kerja & deliverable disepakati di awal",
      "Pembayaran bertahap berbasis Berita Acara (Milestone BAST)",
      "Garansi purna jual & pemeliharaan sistem terikat kontrak",
      "Dokumentasi teknis lengkap & transfer knowledge menyeluruh",
    ],
    recommendedFor: "Aplikasi perizinan kustom, portal Satu Data, & pengadaan infrastruktur server.",
    icon: FileText,
  },
  {
    title: "Managed Services & Kontrak Pemeliharaan SLA",
    badge: "Layanan Berkelanjutan",
    scope: "Perjanjian tingkat layanan (SLA) untuk pemeliharaan sistem berkala, audit keamanan, dan operasi TI.",
    characteristics: [
      "Jaminan waktu respon insiden (SLA response time < 2 jam)",
      "Pemantauan performa & keamanan infrastruktur berkala",
      "Pembaruan modul keamanan & optimasi basis data terjadwal",
      "Laporan kinerja bulanan & rekomendasi peningkatan kapasitas",
    ],
    recommendedFor: "Sistem informasi transaksi publik nasional, pusat data (DRC), & aplikasi kritis.",
    icon: Clock,
  },
  {
    title: "Dedicated Expert / Time & Material (T&M)",
    badge: "Fleksibilitas Tinggi",
    scope: "Penyediaan tenaga ahli bersertifikasi yang berkolaborasi langsung memperkuat kapasitas tim internal.",
    characteristics: [
      "Penempatan tenaga ahli (Software Architect, DevSecOps, DBA, PMP)",
      "Fleksibilitas penyesuaian backlog sprint secara dinamis",
      "Pengawasan mutu langsung oleh pimpinan teknis CITS",
      "Efisiensi transfer keahlian langsung ke aparatur instansi",
    ],
    recommendedFor: "Pengembangan sistem inovatif agile, integrasi multi-aplikasi, & asistensi SPBE.",
    icon: Briefcase,
  },
];

export default function ServicesPage() {
  return (
    <main id="main-content" className="min-h-screen bg-white dark:bg-dark text-slate-900 dark:text-white transition-colors">
      {/* 1. HERO SECTION & PROFIL KATALOG LAYANAN (IDDS Standard) */}
      <section
        aria-labelledby="services-hero-heading"
        className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-dark dark:to-slate-950 py-12 md:py-20 overflow-hidden transition-colors border-b border-slate-200/80 dark:border-white/10"
      >
        <FloatingShapes />
        <GridPattern className="opacity-100" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 dark:bg-orange-500/15 text-orange-950 dark:text-orange-200 border border-orange-200/90 dark:border-orange-500/30 text-xs font-bold tracking-wide uppercase shadow-sm mb-4">
                <Sparkles className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" aria-hidden="true" />
                <span>Katalog Resmi Layanan CITS Indonesia • Standar IDDS & SPBE</span>
              </div>
              <h1
                id="services-hero-heading"
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.2]"
              >
                Solusi Terpadu Rekayasa <GradientText>Teknologi Informasi</GradientText> Enterprise
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="mt-5 text-slate-700 dark:text-slate-200 text-base md:text-lg leading-relaxed">
                Menghadirkan tiga pilar layanan terintegrasi untuk mendukung efisiensi proses bisnis, tata kelola pemerintahan digital, dan keandalan operasional kementerian, BUMN, serta korporasi terkemuka.
              </p>
            </ScrollReveal>

            {/* Quick Service Anchor Navigation (High-Contrast & Focus-Visible) */}
            <ScrollReveal delay={0.2}>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a
                  href="#software-house"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1A2E] text-slate-800 dark:text-white border border-slate-200 dark:border-white/15 hover:border-orange-500/60 shadow-xs text-xs font-semibold transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                >
                  <Code2 className="w-4 h-4 text-orange-600 dark:text-orange-400" aria-hidden="true" />
                  <span>Software House</span>
                </a>
                <a
                  href="#it-consultant"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1A2E] text-slate-800 dark:text-white border border-slate-200 dark:border-white/15 hover:border-orange-500/60 shadow-xs text-xs font-semibold transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                >
                  <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  <span>Konsultan TI & SPBE</span>
                </a>
                <a
                  href="#it-supplier"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1A2E] text-slate-800 dark:text-white border border-slate-200 dark:border-white/15 hover:border-orange-500/60 shadow-xs text-xs font-semibold transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                >
                  <Server className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  <span>Pengadaan TI (IT Supplier)</span>
                </a>
                <a
                  href="#alur-kerja"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-50 dark:bg-orange-500/15 text-orange-950 dark:text-orange-200 border border-orange-200/90 dark:border-orange-500/30 hover:bg-orange-100 dark:hover:bg-orange-500/25 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                >
                  <Zap className="w-4 h-4 text-orange-600 dark:text-orange-400" aria-hidden="true" />
                  <span>Alur Metodologi</span>
                </a>
                <a
                  href="#skema-kerjasama"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1A2E] text-slate-800 dark:text-white border border-slate-200 dark:border-white/15 hover:border-orange-500/60 shadow-xs text-xs font-semibold transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                >
                  <Boxes className="w-4 h-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                  <span>Skema Pengadaan PBJ</span>
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 2. DETAIL TIGA PILAR LAYANAN UTAMA (Symmetrical Bento Layout) */}
      <section
        aria-labelledby="services-detail-heading"
        className="py-16 md:py-24 bg-white dark:bg-[#1A1A2E] transition-colors border-b border-slate-200/80 dark:border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 md:space-y-28">
          <h2 id="services-detail-heading" className="sr-only">
            Detail Pilar Layanan CITS Indonesia
          </h2>

          {services.map((service, i) => {
            const Icon = service.icon;
            const isReverse = i % 2 === 1;

            return (
              <div
                key={service.id}
                id={service.id}
                className="scroll-mt-28 grid lg:grid-cols-12 gap-10 lg:gap-12 items-stretch"
              >
                {/* Content Column (Span 7) */}
                <ScrollReveal
                  direction={isReverse ? "right" : "left"}
                  className={`lg:col-span-7 flex flex-col justify-between order-2 ${
                    isReverse ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <div className="space-y-6">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-bold text-orange-950 dark:text-orange-200 bg-orange-50 dark:bg-orange-500/15 border border-orange-200/90 dark:border-orange-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
                        {service.badge}
                      </span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {service.category}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                      {service.title}
                    </h3>

                    <p className="text-slate-700 dark:text-slate-200 text-base leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features list */}
                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#151528] border border-slate-200 dark:border-white/10 space-y-3">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                        Cakupan Solusi & Kemampuan Rekayasa
                      </h4>
                      <ul className="grid sm:grid-cols-2 gap-3 list-none p-0 m-0">
                        {service.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200 leading-normal"
                          >
                            <CheckCircle2 className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" aria-hidden="true" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tech Stacks / Competency Badges */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
                        Standar Teknologi & Kerangka Kerja
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {service.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white border border-slate-200 dark:border-white/15"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Case Studies / Implementasi Riil */}
                    <div>
                      <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Contoh Implementasi Riil:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {service.caseStudies.map((cs) => (
                          <span
                            key={cs}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-950 dark:text-orange-200 bg-orange-50 dark:bg-orange-500/15 border border-orange-200/80 dark:border-orange-500/30 px-2.5 py-1 rounded-md"
                          >
                            <Check className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" aria-hidden="true" />
                            <span>{cs}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="pt-2 flex flex-wrap gap-3">
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold rounded-xl transition-all shadow-md shadow-orange-600/20 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                      >
                        <span>Konsultasikan Kebutuhan Ini</span>
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </Link>
                      <Link
                        href="/portfolio"
                        className="inline-flex items-center gap-2 px-5 py-3 bg-white dark:bg-white/10 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/15 font-semibold rounded-xl border border-slate-200 dark:border-white/15 transition-all text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                      >
                        <Briefcase className="w-4 h-4 text-orange-600 dark:text-orange-400" aria-hidden="true" />
                        <span>Lihat Studi Kasus</span>
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Visual & Deliverables Column (Span 5 - Perfectly Balanced) */}
                <ScrollReveal
                  direction={isReverse ? "left" : "right"}
                  className={`lg:col-span-5 h-full order-1 ${
                    isReverse ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <SpotlightCard className="h-full">
                    <div className="p-5 md:p-6 flex flex-col justify-between h-full space-y-5">
                      {/* Image container */}
                      <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-white/10 aspect-[16/10] bg-slate-100 dark:bg-slate-900">
                        <Image
                          src={service.image}
                          alt={`Ilustrasi layanan ${service.title}`}
                          width={600}
                          height={375}
                          className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Deliverables & SLA Bento Card (Resolves the vertical void) */}
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#121222] border border-slate-200 dark:border-white/10 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <Icon className="w-4 h-4 text-orange-600 dark:text-orange-400" aria-hidden="true" />
                            <span>Deliverable & Jaminan Kualitas</span>
                          </span>
                          <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded">
                            Resmi & Sah
                          </span>
                        </div>

                        <div className="space-y-2.5">
                          {service.deliverables.map((item) => (
                            <div key={item.label} className="text-xs">
                              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                                {item.label}:
                              </span>
                              <span className="text-slate-600 dark:text-slate-400 leading-relaxed block mt-0.5">
                                {item.description}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Service SLA Chip */}
                      <div className="p-3.5 rounded-xl bg-orange-50/80 dark:bg-orange-500/10 border border-orange-200/80 dark:border-orange-500/30 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-orange-600/20">
                          <ShieldCheck className="w-4 h-4 text-white" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                          <span className="block text-xs font-bold text-orange-950 dark:text-orange-200">
                            {service.slaNote}
                          </span>
                          <span className="block text-[11px] text-slate-600 dark:text-slate-400">
                            Dukungan tim tenaga ahli dan kesiapan pemeliharaan purna jual.
                          </span>
                        </div>
                      </div>
                    </div>
                  </SpotlightCard>
                </ScrollReveal>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. ALUR METODOLOGI REKAYASA SISTEM (5 Tahap Kerja IDDS & SDLC Terukur) */}
      <section
        id="alur-kerja"
        aria-labelledby="workflow-heading"
        className="relative py-16 md:py-24 bg-slate-50 dark:bg-[#151528] border-b border-slate-200/80 dark:border-white/10 overflow-hidden transition-colors scroll-mt-20"
      >
        <GridPattern />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="inline-block text-xs font-bold text-orange-950 dark:text-orange-200 bg-orange-50 dark:bg-orange-500/15 border border-orange-200/90 dark:border-orange-500/30 px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                Metodologi Profesional
              </span>
              <h2
                id="workflow-heading"
                className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight"
              >
                Alur Kerja Rekayasa <GradientText>Sistematis</GradientText>
              </h2>
              <p className="mt-4 text-slate-700 dark:text-slate-200 text-base leading-relaxed">
                Lima tahapan berkesinambungan yang kami terapkan dalam memastikan setiap inisiatif proyek selesai tepat waktu, tepat fungsi, teruji aman, dan selaras regulasi.
              </p>
            </div>
          </ScrollReveal>

          {/* Symmetrical 5-Item Grid with balanced tablet and desktop layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 items-stretch">
            {workProcess.map((p, i) => {
              const isLastOnTablet = i === 4;
              const ProcessIcon = p.icon;
              return (
                <ScrollReveal
                  key={p.step}
                  delay={i * 0.08}
                  className={`h-full ${isLastOnTablet ? "md:col-span-2 lg:col-span-1" : ""}`}
                >
                  <SpotlightCard className="h-full">
                    <article className="p-6 h-full flex flex-col justify-between">
                      <div className="w-full">
                        <div className="flex items-center justify-between mb-4">
                          <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-orange-600/25 shrink-0">
                            {p.step}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-orange-950 dark:text-orange-200 bg-orange-50 dark:bg-orange-500/15 border border-orange-200 dark:border-orange-500/30 px-2.5 py-1 rounded-md uppercase">
                            <ProcessIcon className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 shrink-0" aria-hidden="true" />
                            <span>Fase #{i + 1}</span>
                          </span>
                        </div>

                        {/* Title Slot (Normalized height) */}
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-base min-h-[44px] flex items-center">
                          {p.title}
                        </h3>

                        {/* Subtitle Slot (Normalized height) */}
                        <span className="inline-block text-xs font-semibold text-orange-800 dark:text-orange-300 mt-1 mb-2 min-h-[20px]">
                          {p.subtitle}
                        </span>

                        {/* Description Slot (Normalized min-height) */}
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed min-h-[72px]">
                          {p.description}
                        </p>
                      </div>

                      {/* Footer Badge (Normalized baseline) */}
                      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                        <span>Standar Mutu Terverifikasi</span>
                      </div>
                    </article>
                  </SpotlightCard>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. JAMINAN KUALITAS & STANDAR MUTU (IDDS Governance Credibility) */}
      <section
        aria-labelledby="quality-heading"
        className="py-16 md:py-24 bg-white dark:bg-[#1A1A2E] transition-colors border-b border-slate-200/80 dark:border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="inline-block text-xs font-bold text-orange-950 dark:text-orange-200 bg-orange-50 dark:bg-orange-500/15 border border-orange-200/90 dark:border-orange-500/30 px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                Keandalan Layanan
              </span>
              <h2
                id="quality-heading"
                className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight"
              >
                Jaminan Standar Mutu <GradientText>Layanan CITS</GradientText>
              </h2>
              <p className="mt-4 text-slate-700 dark:text-slate-200 text-base leading-relaxed">
                Landasan kepatuhan dan keandalan yang menjadi komitmen kami pada setiap pengadaan dan rekayasa sistem informasi.
              </p>
            </div>
          </ScrollReveal>

          {/* Symmetrical 4-Card Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {qualityStandards.map((item, idx) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={item.title} delay={idx * 0.08} className="h-full">
                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#16162c] border border-slate-200 dark:border-white/10 hover:border-orange-500/40 transition-all shadow-xs h-full flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center mb-4 shadow-md shadow-orange-600/25 shrink-0">
                        <Icon className="w-6 h-6 text-white" aria-hidden="true" />
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base min-h-[44px] flex items-center">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed min-h-[64px]">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-3 border-t border-slate-200 dark:border-white/10 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                      <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                      <span>Sesuai Regulasi Nasional</span>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. SKEMA PENGADAAN & MODEL KEMITRAAN (IDDS Enterprise Standard) */}
      <section
        id="skema-kerjasama"
        aria-labelledby="engagement-heading"
        className="py-16 md:py-24 bg-slate-50 dark:bg-[#151528] border-b border-slate-200/80 dark:border-white/10 transition-colors scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="inline-block text-xs font-bold text-orange-950 dark:text-orange-200 bg-orange-50 dark:bg-orange-500/15 border border-orange-200/90 dark:border-orange-500/30 px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                Transparansi Pengadaan
              </span>
              <h2
                id="engagement-heading"
                className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight"
              >
                Model Kerjasama & <GradientText>Skema Pengadaan PBJ</GradientText>
              </h2>
              <p className="mt-4 text-slate-700 dark:text-slate-200 text-base leading-relaxed">
                Pilihan skema kemitraan yang fleksibel dan akuntabel, memudahkan Pejabat Pembuat Komitmen (PPK) dan manajemen korporasi dalam merealisasikan kebutuhan digital.
              </p>
            </div>
          </ScrollReveal>

          {/* Symmetrical 3-Card Engagement Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {engagementModels.map((model, idx) => {
              const IconModel = model.icon;
              return (
                <ScrollReveal key={model.title} delay={idx * 0.1} className="h-full">
                  <SpotlightCard className="h-full">
                    <div className="p-7 flex flex-col justify-between h-full">
                      <div>
                        {/* Header badge & icon */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-600/25 shrink-0">
                            <IconModel className="w-6 h-6 text-white" aria-hidden="true" />
                          </div>
                          <span className="text-[11px] font-bold text-orange-950 dark:text-orange-200 bg-orange-50 dark:bg-orange-500/15 border border-orange-200 dark:border-orange-500/30 px-2.5 py-1 rounded-md uppercase">
                            {model.badge}
                          </span>
                        </div>

                        <h3 className="font-extrabold text-slate-900 dark:text-white text-base min-h-[44px] flex items-center">
                          {model.title}
                        </h3>

                        <p className="mt-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed min-h-[48px]">
                          {model.scope}
                        </p>

                        {/* Characteristics List */}
                        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/10 space-y-2.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-white block">
                            Karakteristik Skema:
                          </span>
                          {model.characteristics.map((point) => (
                            <div key={point} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                              <span className="leading-tight">{point}</span>
                            </div>
                          ))}
                        </div>

                        {/* Recommendation */}
                        <div className="mt-5 p-3 rounded-xl bg-slate-50 dark:bg-[#121222] border border-slate-200 dark:border-white/10">
                          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block">
                            Paling Tepat Untuk:
                          </span>
                          <span className="text-xs text-slate-600 dark:text-slate-400 mt-1 block">
                            {model.recommendedFor}
                          </span>
                        </div>
                      </div>

                      {/* Action Link */}
                      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10">
                        <Link
                          href="/contact"
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                        >
                          <span>Diskusikan Skema Ini</span>
                          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </SpotlightCard>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION KEMITRAAN RESMI (IDDS Conversion Section) */}
      <section
        aria-labelledby="services-cta-heading"
        className="py-16 md:py-24 bg-white dark:bg-[#1A1A2E] transition-colors"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <div className="p-8 md:p-14 rounded-3xl bg-gradient-to-br from-white via-orange-50/40 to-white dark:from-[#181830] dark:via-[#1F1712] dark:to-[#181830] border border-orange-200/80 dark:border-orange-900/40 shadow-xl">
              <span className="inline-block text-xs font-bold text-orange-950 dark:text-orange-200 bg-orange-50 dark:bg-orange-500/15 border border-orange-200/90 dark:border-orange-500/30 px-3.5 py-1 rounded-full uppercase tracking-wider mb-4">
                Konsultasi & Solusi Kustom
              </span>
              <h2
                id="services-cta-heading"
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug"
              >
                Punya Kebutuhan Khusus untuk Sistem Informasi Instansi Anda?
              </h2>
              <p className="mt-4 text-slate-700 dark:text-slate-200 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                Tim ahli CITS Indonesia siap membantu menganalisis kerangka acuan kerja (KAK), merancang arsitektur sistem SPBE, dan memberikan estimasi implementasi yang efisien serta tepat sasaran.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3.5">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold rounded-xl transition-all shadow-md shadow-orange-600/20 hover:shadow-lg hover:shadow-orange-600/30 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                >
                  <span>Ajukan Diskusi Kebutuhan</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>

                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white dark:bg-white/10 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/15 font-semibold rounded-xl border border-slate-200 dark:border-white/15 transition-all text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                >
                  <Briefcase className="w-4 h-4 text-orange-600 dark:text-orange-400" aria-hidden="true" />
                  <span>Jelajahi Portofolio Klien</span>
                </Link>

                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white dark:bg-white/10 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/15 font-semibold rounded-xl border border-slate-200 dark:border-white/15 transition-all text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                >
                  <Layers className="w-4 h-4 text-orange-600 dark:text-orange-400" aria-hidden="true" />
                  <span>Katalog Produk Enterprise</span>
                </Link>
              </div>

              {/* IDDS Official SLA & Contact Assurance Bar */}
              <div className="mt-10 pt-6 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                  <span>Respon Cepat (&lt; 24 Jam Kerja)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-orange-700 dark:text-orange-400" aria-hidden="true" />
                  <span>Jaminan Kerahasiaan Data (NDA)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-700 dark:text-blue-400" aria-hidden="true" />
                  <span>Terdaftar Resmi LPSE & SIKaP LKPP</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
