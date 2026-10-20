"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Target,
  Compass,
  Building2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  History,
  Calendar,
  Sparkles,
  Users,
  Check,
  Zap,
  BadgeCheck,
  FileCheck,
  Lock,
  Server,
  Code,
  FileText,
  Briefcase,
  Layers,
  ExternalLink,
} from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import GradientText from "@/components/ui/GradientText";
import GridPattern from "@/components/ui/GridPattern";
import FloatingShapes from "@/components/animations/FloatingShapes";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { useCitsStore } from "@/stores/citsStore";

interface ValueItem {
  letter: string;
  word: string;
  subtitle: string;
  description: string;
}

const values: ValueItem[] = [
  {
    letter: "F",
    word: "Focus & Agile",
    subtitle: "Ketajaman Prioritas",
    description:
      "Fokus presisi pada kebutuhan inti dan pencapaian target strategis organisasi klien dengan pendekatan rekayasa yang adaptif serta terukur.",
  },
  {
    letter: "O",
    word: "Objective & Strategic",
    subtitle: "Rasional & Terukur",
    description:
      "Menganalisis proses bisnis secara objektif guna merumuskan arsitektur teknologi yang tepat guna, efisien, dan bernilai jangka panjang.",
  },
  {
    letter: "C",
    word: "Customer-Centric",
    subtitle: "Kemitraan Terpercaya",
    description:
      "Menempatkan kepuasan pengguna dan keberlanjutan kemitraan jangka panjang sebagai tolok ukur kesuksesan setiap implementasi kesisteman.",
  },
  {
    letter: "U",
    word: "Up-to-Date Tech",
    subtitle: "Standar Terkini",
    description:
      "Mengadopsi inovasi teknologi modern, standar microservices, integrasi API terpadu, dan kepatuhan keamanan data berstandar enterprise.",
  },
  {
    letter: "S",
    word: "Solid Synergy",
    subtitle: "Kolaborasi Tim Ahli",
    description:
      "Sinergi tenaga ahli multidisiplin yang berintegritas tinggi untuk menghadirkan kualitas rekayasa sistem yang unggul dan dapat diandalkan.",
  },
];

interface MilestoneItem {
  year: string;
  category: string;
  scope: string;
  title: string;
  description: string;
}

const milestones: MilestoneItem[] = [
  {
    year: "2006",
    category: "Awal Pendirian",
    scope: "Rekayasa Sistem Mandiri",
    title: "Pendirian CV CITS Indonesia",
    description:
      "Memulai kiprah sebagai perusahaan mandiri dalam rekayasa perangkat lunak dan pengembangan portal web sistemik berbasis teknologi open-source.",
  },
  {
    year: "2008",
    category: "Layanan Publik",
    scope: "Kesehatan & Perizinan Terpadu",
    title: "Sistem Kesehatan & Perizinan Batam Online",
    description:
      "Pengembangan Sistem Informasi Rumah Sakit, SMS Gateway gateway interaktif, dan portal perizinan terintegrasi Batam Online.",
  },
  {
    year: "2009",
    category: "Instansi Pusat",
    scope: "BKPM RI & Pemerintah Provinsi",
    title: "Kemitraan Strategis BKPM & Sektor Publik",
    description:
      "Dipercaya mengembangkan sistem pendukung perizinan investasi pada BKPM RI serta sistem informasi Dinas Peternakan Jawa Barat.",
  },
  {
    year: "2011",
    category: "Portal Nasional",
    scope: "LPP RRI & Pemeliharaan BKPM",
    title: "Portal Nasional RRI & Pemeliharaan BKPM",
    description:
      "Pembangunan portal nasional terpadu Lembaga Penyiaran Publik RRI dan pelaksanaan pemeliharaan kesisteman berkala infrastruktur BKPM.",
  },
  {
    year: "2014",
    category: "Enterprise BI",
    scope: "IBM Cognos & SPIPISE BKPM",
    title: "BI & EIS SPIPISE Berbasis IBM Cognos",
    description:
      "Pengembangan sistem Business Intelligence & Executive Information System perizinan penanaman modal berskala nasional untuk BKPM RI.",
  },
  {
    year: "2017",
    category: "Lembaga Yudikatif",
    scope: "Mahkamah Agung RI",
    title: "Sistem Manajemen Kepegawaian (SIMKEP) MA RI",
    description:
      "Pengembangan dan modernisasi fungsi Sistem Informasi Kepegawaian (SIMKEP) untuk ribuan aparatur peradilan di seluruh lingkungan Mahkamah Agung RI.",
  },
  {
    year: "2019",
    category: "Riset & Sains",
    scope: "BPPT / BRIN Oseanografi",
    title: "Portal Data Kelautan Nasional (NODC) BPPT / BRIN",
    description:
      "Pembangunan portal integrasi data kelautan nasional dengan visualisasi peta geospasial interaktif dan katalog data oseanografi terpusat.",
  },
  {
    year: "2021",
    category: "Transportasi Laut",
    scope: "Kemenhub & ESDM RI",
    title: "SIMLALA Kemenhub & Managed Service TI ESDM",
    description:
      "Rekayasa ulang platform Sistem Informasi Manajemen Lalu Lintas Angkutan Laut (SIMLALA) serta pendampingan operasional kesisteman TI BPSDM ESDM.",
  },
  {
    year: "2023",
    category: "Kependudukan Nasional",
    scope: "Kemendagri & Ketenagakerjaan",
    title: "Pemeliharaan KTP-el Kemendagri & Satu Data",
    description:
      "Dukungan keandalan kesisteman pada platform kependudukan KTP-el Ditjen Dukcapil yang melayani ratusan juta transaksi data kependudukan nasional.",
  },
  {
    year: "2025",
    category: "Transformasi Digital",
    scope: "Kementerian Investasi & Smart City",
    title: "Satu Data Investasi & Analitik Cerdas Wilayah",
    description:
      "Pengembangan portal interoperabilitas Satu Data Kementerian Investasi/BKPM dan modernisasi platform analitik cerdas lintas kementerian/lembaga.",
  },
];

interface AwardItem {
  id: string;
  title: string;
  issuer: string;
  badge: string;
  category: "all" | "kementerian" | "bumn" | "egov";
  description: string;
}

const awards: AwardItem[] = [
  {
    id: "award-1",
    title: "BI & EIS for SPIPISE",
    issuer: "Badan Koordinasi Penanaman Modal RI",
    badge: "Kementerian / BKPM",
    category: "kementerian",
    description:
      "Sertifikat pengembangan Business Intelligence dan Executive Information System untuk pemantauan perizinan modal nasional secara real-time.",
  },
  {
    id: "award-2",
    title: "5 Tahun Operasional Simbakar",
    issuer: "PT Indonesia Power (PLN Nusantara Power)",
    badge: "BUMN Energi",
    category: "bumn",
    description:
      "Apresiasi atas keandalan operasional Sistem Informasi Bahan Bakar PLTU Suralaya selama 5 tahun berturut-turut tanpa insiden sistemik.",
  },
  {
    id: "award-3",
    title: "Situng Pilgub Jawa Barat 2008",
    issuer: "KPU Provinsi Jawa Barat",
    badge: "Penyelenggara Pemilu",
    category: "egov",
    description:
      "Sertifikat keberhasilan rekayasa portal web dan Sistem Informasi Perhitungan Suara Pilgub Jawa Barat secara transparan dan akuntabel.",
  },
  {
    id: "award-4",
    title: "e-Governance Award Nasional",
    issuer: "Badan Pengembangan SIT Daerah Prov. Jabar",
    badge: "Penghargaan Nasional",
    category: "egov",
    description:
      "Penghargaan e-Governance Award Provinsi Tingkat Nasional atas kontribusi pengembangan tata kelola pemerintahan digital terintegrasi.",
  },
  {
    id: "award-5",
    title: "Juara 2 Lomba Website SKPD",
    issuer: "Departemen Pertanian RI",
    badge: "Kementerian Pertanian",
    category: "kementerian",
    description:
      "Penghargaan peringkat kedua dalam ajang seleksi portal informasi unit kerja se-Indonesia lingkup kementerian untuk keterbukaan publik.",
  },
  {
    id: "award-6",
    title: "Sistem Informasi Diklat BPSDM",
    issuer: "BPSDM Kementerian ESDM RI",
    badge: "Kementerian ESDM",
    category: "kementerian",
    description:
      "Sertifikat pengembangan modul terintegrasi SIA, eLearning, DUPAK Online, dan platform kerja sama kelembagaan aparatur energi.",
  },
  {
    id: "award-7",
    title: "Portal Data Kelautan Nasional",
    issuer: "BPPT / BRIN",
    badge: "Riset & Inovasi",
    category: "kementerian",
    description:
      "Sertifikat pengembangan portal pertukaran data oseanografi nasional berbasis visualisasi peta geospasial interaktif dan katalog terpusat.",
  },
  {
    id: "award-8",
    title: "Sistem Informasi Kepegawaian",
    issuer: "Mahkamah Agung RI",
    badge: "Lembaga Yudikatif",
    category: "kementerian",
    description:
      "Sertifikat peningkatan dan optimalisasi arsitektur Sistem Informasi Kepegawaian (SIMKEP) bagi seluruh satuan kerja pengadilan se-Indonesia.",
  },
  {
    id: "award-9",
    title: "SIMLALA Pelayanan Publik",
    issuer: "Kementerian Perhubungan RI",
    badge: "Pelayanan Publik",
    category: "bumn",
    description:
      "Sertifikat rekayasa ulang dan pemeliharaan platform Manajemen Lalu Lintas Angkutan Laut untuk percepatan perizinan operasional kapal.",
  },
  {
    id: "award-10",
    title: "E-PNBP Minerba & Operasional TI",
    issuer: "Kementerian ESDM RI",
    badge: "Pendapatan Negara",
    category: "kementerian",
    description:
      "Sertifikat penyediaan helpdesk dan rekayasa modul transaksi sistem pelaporan penerimaan negara bukan pajak sektor pertambangan minerba.",
  },
  {
    id: "award-11",
    title: "Portal Pos & Informatika serta DRC",
    issuer: "Kementerian Kominfo RI",
    badge: "Regulasi & Kominfo",
    category: "egov",
    description:
      "Sertifikat pengembangan portal pelaporan penyelenggaraan pos dan informatika beserta infrastruktur Disaster Recovery Center (DRC).",
  },
  {
    id: "award-12",
    title: "Integrasi Satu Data & Kepatuhan SPBE",
    issuer: "Kementerian Investasi / BKPM RI",
    badge: "Satu Data & SPBE",
    category: "kementerian",
    description:
      "Sertifikat perancangan arsitektur integrasi Satu Data Investasi dan kepatuhan interoperabilitas sistem pemerintahan berbasis elektronik nasional.",
  },
];

interface GovernancePillar {
  title: string;
  badge: string;
  description: string;
  icon: typeof ShieldCheck;
  items: string[];
}

const governancePillars: GovernancePillar[] = [
  {
    title: "Legalitas Usaha OSS-RBA & KBLI",
    badge: "Perizinan Berusaha Terverifikasi",
    description:
      "Memiliki legalitas hukum resmi dan kepatuhan perizinan berusaha berbasis risiko yang terdaftar sah di sistem OSS Republik Indonesia.",
    icon: Building2,
    items: [
      "Nomor Induk Berusaha (NIB) Resmi Berbasis Risiko",
      "KBLI 62019: Aktivitas Pemrograman Komputer Lainnya",
      "KBLI 62020: Aktivitas Konsultasi Komputer & Fasilitas TI",
      "KBLI 62090: Aktivitas Teknologi Informasi & Jasa Komputer",
      "KBLI 63111: Aktivitas Pengolahan Data & Web Hosting",
    ],
  },
  {
    title: "Kualifikasi Pengadaan Pemerintah",
    badge: "Mitra Sah LKPP & LPSE",
    description:
      "Memenuhi kualifikasi tertib administrasi fiskal dan terdaftar aktif dalam ekosistem Pengadaan Barang/Jasa Pemerintah (PBJ).",
    icon: FileCheck,
    items: [
      "Penyedia Terdaftar Aktif di SIKaP LKPP Nasional",
      "Akun Rekanan Terverifikasi di LPSE K/L/D",
      "Kesiapan Penyedia Katalog Elektronik (e-Katalog LKPP)",
      "Kepatuhan Faktur Pajak & Konfirmasi Status Wajib Pajak (KSWP)",
      "Rekam Jejak Berita Acara Serah Terima (BAST) 100% Selesai",
    ],
  },
  {
    title: "Kepatuhan Regulasi SPBE & Siber",
    badge: "Standar Regulasi Nasional",
    description:
      "Arsitektur perangkat lunak dan tata kelola data dirancang selaras dengan kerangka kebijakan digital pemerintah pusat.",
    icon: ShieldCheck,
    items: [
      "Kepatuhan Arsitektur SPBE (Perpres No. 95 Tahun 2018)",
      "Penerapan Standar Interoperabilitas Satu Data (Perpres 39/2019)",
      "Kepatuhan UU Perlindungan Data Pribadi (UU No. 27/2022)",
      "Penerapan Prinsip Kesiapan ISO/IEC 27001 Sistem Manajemen Keamanan",
      "Prosedur Disaster Recovery Plan (DRP) & Audit Trail Teruji",
    ],
  },
  {
    title: "Kompetensi Tenaga Ahli Bersertifikasi",
    badge: "Keahlian Multi-Disiplin",
    description:
      "Didukung oleh tenaga ahli rekayasa perangkat lunak, analis data, dan arsitek sistem yang memegang sertifikasi profesi resmi.",
    icon: Users,
    items: [
      "Arsitek Perangkat Lunak Enterprise (TOGAF, Microservices)",
      "Spesialis Keamanan Siber & DevSecOps (CISA / CEH Ready)",
      "Database Administrator & Spesialis Big Data / BI",
      "Manajer Proyek Tersertifikasi (PMP, Scrum Master, ITIL v4)",
      "Komitmen Integritas Non-Disclosure Agreement (NDA) Ketat",
    ],
  },
];

export default function AboutPage() {
  const { aboutData } = useCitsStore();
  const [awardFilter, setAwardFilter] = useState<"all" | "kementerian" | "bumn" | "egov">("all");

  const filteredAwards = awardFilter === "all" ? awards : awards.filter((item) => item.category === awardFilter);

  return (
    <main
      id="main-content"
      className="min-h-screen bg-white dark:bg-dark text-slate-900 dark:text-white transition-colors"
    >
      {/* 1. HERO SECTION & PROFIL RESMI INSTANSI (IDDS Standard) */}
      <section
        aria-labelledby="about-hero-heading"
        className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-dark dark:to-slate-950 py-12 md:py-20 overflow-hidden transition-colors border-b border-slate-200/70 dark:border-white/10"
      >
        <FloatingShapes />
        <GridPattern className="opacity-100" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Official Profile Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <ScrollReveal>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/70 text-orange-900 dark:text-orange-200 border border-orange-300 dark:border-orange-800/80 text-xs font-bold tracking-wide uppercase shadow-sm">
                  <Building2 className="w-4 h-4 text-orange-700 dark:text-orange-400" aria-hidden="true" />
                  <span>{aboutData?.subtitle || "Profil Resmi CITS Indonesia • Standar IDDS & SPBE"}</span>
                </div>
                <h1
                  id="about-hero-heading"
                  className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.2]"
                >
                  {aboutData?.title || (
                    <>
                      Membangun Kemandirian <GradientText>Teknologi Informasi</GradientText> Skala Nasional
                    </>
                  )}
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                {aboutData?.story ? (
                  <p className="text-slate-700 dark:text-slate-200 text-base md:text-lg leading-relaxed whitespace-pre-line">
                    {aboutData.story}
                  </p>
                ) : (
                  <>
                    <p className="text-slate-700 dark:text-slate-200 text-base md:text-lg leading-relaxed">
                      <strong className="text-slate-900 dark:text-white font-semibold">
                        Cipta Integrasi Teknologi Solusi Indonesia (CITS Indonesia)
                      </strong>{" "}
                      adalah mitra rekayasa perangkat lunak dan arsitektur data enterprise terpercaya yang telah
                      mendampingi kementerian, lembaga tinggi negara, BUMN, dan korporasi terkemuka sejak tahun 2006.
                    </p>
                    <p className="mt-4 text-slate-700 dark:text-slate-200 text-sm md:text-base leading-relaxed">
                      Lahir dari komitmen penguatan ekosistem teknologi nasional, CITS memadukan standar ketat tata
                      kelola pemerintahan digital (SPBE) dengan agilitas rekayasa modern. Pendekatan kami tidak hanya
                      berfokus pada penulisan kode, melainkan perancangan arsitektur kesisteman yang aman,
                      interoperabel, dan berdaya guna jangka panjang bagi efisiensi pelayanan publik Indonesia.
                    </p>
                  </>
                )}
              </ScrollReveal>

              {/* 4 Credential Badges (High Contrast WCAG AA) */}
              <ScrollReveal delay={0.3}>
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-semibold shadow-xs">
                    <ShieldCheck
                      className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0"
                      aria-hidden="true"
                    />
                    <span>Kepatuhan SPBE & Keamanan Siber</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-semibold shadow-xs">
                    <CheckCircle2
                      className="w-4 h-4 text-orange-700 dark:text-orange-400 shrink-0"
                      aria-hidden="true"
                    />
                    <span>Mitra Rekayasa 18+ Tahun</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-semibold shadow-xs">
                    <Users className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0" aria-hidden="true" />
                    <span>Tenaga Ahli Bersertifikasi Nasional</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-semibold shadow-xs">
                    <BadgeCheck className="w-4 h-4 text-indigo-700 dark:text-indigo-400 shrink-0" aria-hidden="true" />
                    <span>Terdaftar OSS-RBA & SIKaP LKPP</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column: Symmetrical Credential Box */}
            <div className="lg:col-span-5">
              <ScrollReveal direction="right">
                <SpotlightCard className="shadow-lg shadow-orange-600/5">
                  <div className="p-7 md:p-8 flex flex-col justify-between h-full space-y-6">
                    <div className="flex items-center justify-between pb-5 border-b border-slate-200 dark:border-white/10">
                      <div>
                        {/* Logo Mode Terang */}
                        <Image
                          src="/logo.webp"
                          alt="Logo Resmi CITS Indonesia - Cipta Integrasi Teknologi Solusi"
                          width={150}
                          height={44}
                          unoptimized
                          className="h-9 w-auto block dark:hidden"
                          priority
                        />
                        {/* Logo Putih Mode Gelap */}
                        <Image
                          src="/logo-dark.webp"
                          alt="Logo Resmi CITS Indonesia - Cipta Integrasi Teknologi Solusi"
                          width={150}
                          height={44}
                          unoptimized
                          className="h-9 w-auto hidden dark:block"
                          priority
                        />
                        <p className="mt-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                          Cipta Integrasi Teknologi Solusi
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-orange-900 dark:text-orange-200 bg-orange-100 dark:bg-orange-950/70 border border-orange-300 dark:border-orange-800/80 px-2.5 py-1 rounded-md uppercase">
                        Legalitas Resmi
                      </span>
                    </div>

                    {/* 4 Key Statistics Cards (Symmetrical 2x2 Grid) */}
                    <div className="grid grid-cols-2 gap-3.5" role="region" aria-label="Statistik Kunci Perusahaan">
                      {(aboutData?.stats && aboutData.stats.length >= 4
                        ? aboutData.stats.slice(0, 4)
                        : [
                            { value: "2006", label: "Tahun Berdiri" },
                            { value: "50+", label: "Proyek Nasional" },
                            { value: "15+", label: "Kementerian & BUMN" },
                            { value: "FOCUS", label: "Prinsip Kerja" },
                          ]
                      ).map((st, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-slate-50 dark:bg-[#121222] border border-slate-200 dark:border-white/10 text-center"
                        >
                          <span className="block text-2xl md:text-3xl font-extrabold text-orange-700 dark:text-orange-400">
                            {st.value}
                          </span>
                          <span className="block mt-1 text-xs text-slate-700 dark:text-slate-300 font-medium">
                            {st.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Symmetrical Action Buttons */}
                    <div className="pt-2 space-y-2.5">
                      <Link
                        href="/contact"
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold rounded-xl transition-all shadow-md shadow-orange-600/20 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                      >
                        <span>Konsultasi Kemitraan Bersama Tim CITS</span>
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </Link>

                      <a
                        href="#legalitas-governance"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white font-semibold text-xs border border-slate-200 dark:border-white/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                      >
                        <ShieldCheck
                          className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400"
                          aria-hidden="true"
                        />
                        <span>Verifikasi Legalitas & Kepatuhan SPBE</span>
                      </a>
                    </div>
                  </div>
                </SpotlightCard>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VISI & MISI (Bento Grid Symmetry Architecture) */}
      <section
        aria-labelledby="vision-mission-heading"
        className="py-16 md:py-24 bg-white dark:bg-[#1A1A2E] transition-colors border-b border-slate-200/80 dark:border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="inline-block text-xs font-bold text-orange-900 dark:text-orange-200 bg-orange-100 dark:bg-orange-950/70 border border-orange-300 dark:border-orange-800/80 px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                Komitmen & Landasan Filosofis
              </span>
              <h2
                id="vision-mission-heading"
                className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight"
              >
                Visi & Misi <GradientText>Perusahaan</GradientText>
              </h2>
              <p className="mt-4 text-slate-700 dark:text-slate-200 text-base leading-relaxed">
                Panduan terarah yang mendasari setiap rekayasa arsitektur, kepatuhan tata kelola, dan hubungan kerja
                sama strategis CITS bersama pemangku kepentingan digital Indonesia.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            {/* Visi Card (Span 5 - Symmetrical Height) */}
            <ScrollReveal className="lg:col-span-5 h-full">
              <div className="h-full relative p-8 md:p-10 rounded-2xl bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800 text-white shadow-xl shadow-orange-600/15 overflow-hidden flex flex-col justify-between">
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center mb-6 shadow-md">
                    <Target className="w-7 h-7 text-white" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-200">
                    Arah Jangka Panjang
                  </span>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white mt-1 mb-4">Visi CITS Indonesia</h3>
                  <blockquote className="text-white/95 text-base md:text-lg leading-relaxed font-medium border-l-4 border-white/40 pl-4 my-6 italic">
                    &ldquo;
                    {aboutData?.vision ||
                      "Menjadi aset bangsa yang mampu bersaing di pasar dunia, sebagai penyedia solusi integral proses bisnis berbasis teknologi informasi yang terpercaya, adaptif, dan berkelanjutan."}
                    &rdquo;
                  </blockquote>
                </div>

                <div className="relative z-10 pt-6 border-t border-white/20 space-y-3 text-xs text-white/90">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-white shrink-0" aria-hidden="true" />
                    <span>Kemandirian dan ketahanan teknologi informasi nasional</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-white shrink-0" aria-hidden="true" />
                    <span>Daya saing berstandar mutu rekayasa enterprise global</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-white shrink-0" aria-hidden="true" />
                    <span>Dampak nyata bagi efisiensi dan transparansi publik</span>
                  </div>
                </div>

                {/* Ambient glow decoration */}
                <div
                  aria-hidden="true"
                  className="absolute -bottom-16 -right-16 w-52 h-52 bg-white/10 rounded-full blur-2xl pointer-events-none"
                />
              </div>
            </ScrollReveal>

            {/* Misi Card (Span 7 - Symmetrical Bento Pillars) */}
            <ScrollReveal delay={0.15} className="lg:col-span-7 h-full">
              <SpotlightCard className="h-full">
                <div className="p-8 md:p-10 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-600/20 text-white">
                        <Compass className="w-7 h-7 text-white" aria-hidden="true" />
                      </div>
                      <span className="text-xs font-bold text-orange-900 dark:text-orange-200 bg-orange-100 dark:bg-orange-950/70 border border-orange-300 dark:border-orange-800/80 px-3 py-1.5 rounded-full uppercase tracking-wider">
                        Tiga Pilar Misi
                      </span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
                      Misi Strategis Perusahaan
                    </h3>
                    <p className="text-slate-700 dark:text-slate-200 text-sm md:text-base leading-relaxed mb-6">
                      Tiga komitmen nyata yang kami laksanakan secara berkesinambungan untuk merealisasikan visi
                      perusahaan:
                    </p>

                    <div className="space-y-4">
                      {(
                        aboutData?.mission || [
                          "Pengembangan & Kontribusi Ekosistem TI: Memberikan sumbangsih arah, merancang arsitektur mandiri, dan mendorong kematangan teknologi informasi sebagai pilar utama transformasi digital instansi negara.",
                          "Solusi Integral Proses Bisnis Berbasis TI: Menghadirkan platform perangkat lunak dan infrastruktur terpadu yang presisi menyelesaikan hambatan operasional, menjamin integritas data, serta meningkatkan akuntabilitas publik.",
                          "Kecerdasan Sumber Daya Multi-Dimensi: Membina tenaga ahli yang tidak hanya unggul secara intelektual teknis, melainkan matang secara emosional dan berintegritas spiritual dalam setiap penugasan berintegritas tinggi.",
                        ]
                      ).map((misiItem, idx) => {
                        const colonIdx = misiItem.indexOf(":");
                        const title = colonIdx !== -1 ? misiItem.slice(0, colonIdx).trim() : `Pilar Misi #${idx + 1}`;
                        const desc = colonIdx !== -1 ? misiItem.slice(colonIdx + 1).trim() : misiItem;
                        return (
                          <div
                            key={idx}
                            className="p-4 rounded-xl bg-slate-50 dark:bg-[#121222] border border-slate-200 dark:border-white/10 flex items-start gap-4"
                          >
                            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/70 text-orange-900 dark:text-orange-200 border border-orange-300 dark:border-orange-800/80 flex items-center justify-center font-extrabold text-sm shrink-0 mt-0.5">
                              {idx + 1}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 dark:text-white text-sm">{title}</h4>
                              {desc && (
                                <p className="mt-1 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                                  {desc}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 3. BUDAYA KERJA & PRINSIP FOCUS (Symmetrical Heights across 5 items) */}
      <section
        aria-labelledby="values-heading"
        className="relative py-16 md:py-24 bg-slate-50 dark:bg-[#151528] border-b border-slate-200/80 dark:border-white/10 overflow-hidden transition-colors"
      >
        <GridPattern />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="inline-block text-xs font-bold text-orange-900 dark:text-orange-200 bg-orange-100 dark:bg-orange-950/70 border border-orange-300 dark:border-orange-800/80 px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                Etos Kerja & Budaya Mutu
              </span>
              <h2
                id="values-heading"
                className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight"
              >
                Prinsip Layanan <GradientText>FOCUS</GradientText>
              </h2>
              <p className="mt-4 text-slate-700 dark:text-slate-200 text-base leading-relaxed">
                Lima pilar operasional terpadu yang memandu etos kerja profesional seluruh personel CITS dalam
                memastikan keberhasilan proyek rekayasa teknologi informasi.
              </p>
            </div>
          </ScrollReveal>

          {/* Symmetrical 5-Item Grid with uniform height and baseline alignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 items-stretch">
            {values.map((v, i) => {
              const isLastOnTablet = i === 4;
              return (
                <ScrollReveal
                  key={v.letter}
                  delay={i * 0.08}
                  className={`h-full ${isLastOnTablet ? "sm:col-span-2 lg:col-span-1" : ""}`}
                >
                  <SpotlightCard className="h-full">
                    <div className="h-full p-6 flex flex-col justify-between text-center items-center">
                      <div className="w-full flex flex-col items-center">
                        {/* Letter Avatar */}
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-600 to-orange-500 text-white flex items-center justify-center font-extrabold text-2xl mb-4 shadow-md shadow-orange-600/20 shrink-0">
                          {v.letter}
                        </div>

                        {/* Title Slot (Normalized height) */}
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-base min-h-[44px] flex items-center justify-center">
                          {v.word}
                        </h3>

                        {/* Subtitle Slot (Normalized height) */}
                        <span className="inline-block text-[11px] font-semibold text-orange-800 dark:text-orange-400 mt-1 mb-3">
                          {v.subtitle}
                        </span>

                        {/* Description Slot (Normalized min-height for symmetrical alignment) */}
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed min-h-[72px]">
                          {v.description}
                        </p>
                      </div>

                      {/* Footer Badge (Normalized baseline) */}
                      <div className="mt-6 pt-4 w-full border-t border-slate-200 dark:border-white/10 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-orange-800 dark:text-orange-400">
                        <Zap className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Standar Mutu #{i + 1}</span>
                      </div>
                    </div>
                  </SpotlightCard>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. REKAM JEJAK SEJARAH & LINIMASA (Responsive Symmetrical Stepper) */}
      <section
        aria-labelledby="milestones-heading"
        className="py-16 md:py-24 bg-white dark:bg-[#1A1A2E] transition-colors border-b border-slate-200/80 dark:border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="inline-block text-xs font-bold text-orange-900 dark:text-orange-200 bg-orange-100 dark:bg-orange-950/70 border border-orange-300 dark:border-orange-800/80 px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                Rekam Jejak & Pengalaman
              </span>
              <h2
                id="milestones-heading"
                className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight"
              >
                Linimasa Perjalanan <GradientText>CITS Indonesia</GradientText>
              </h2>
              <p className="mt-4 text-slate-700 dark:text-slate-200 text-base leading-relaxed">
                Bukti konsistensi dedikasi kami dalam menghadirkan solusi teknologi informasi strategis di berbagai
                sektor krusial tanah air secara berkesinambungan sejak 2006.
              </p>
            </div>
          </ScrollReveal>

          {/* Timeline Wrapper (Clean Mobile & Desktop Spine) */}
          <div className="max-w-4xl mx-auto relative">
            {/* Desktop Center Connecting Line */}
            <div
              aria-hidden="true"
              className="hidden md:block absolute left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-orange-500 via-orange-400/50 to-orange-500/20 -translate-x-1/2"
            />

            {/* Mobile Left Connecting Line */}
            <div
              aria-hidden="true"
              className="block md:hidden absolute left-5 top-4 bottom-4 w-0.5 bg-gradient-to-b from-orange-500 via-orange-400/50 to-orange-500/20"
            />

            <ol className="space-y-8 md:space-y-12 list-none p-0 m-0" aria-label="Daftar Linimasa Milestone Perusahaan">
              {milestones.map((m, i) => {
                const isEven = i % 2 === 0;
                return (
                  <li key={m.year}>
                    <ScrollReveal delay={i * 0.05} direction={isEven ? "left" : "right"}>
                      <div className="relative grid md:grid-cols-2 gap-6 md:gap-12 items-center">
                        {/* Desktop Center Node Badge */}
                        <div
                          aria-hidden="true"
                          className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white dark:bg-[#16162c] border-2 border-orange-600 dark:border-orange-500 items-center justify-center text-orange-700 dark:text-orange-400 shadow-md z-10"
                        >
                          <History className="w-4 h-4" />
                        </div>

                        {/* Mobile Left Node Badge */}
                        <div
                          aria-hidden="true"
                          className="flex md:hidden absolute left-5 -translate-x-1/2 w-7 h-7 rounded-full bg-white dark:bg-[#16162c] border-2 border-orange-600 items-center justify-center text-orange-700 dark:text-orange-400 shadow-sm z-10"
                        >
                          <div className="w-2 h-2 rounded-full bg-orange-600" />
                        </div>

                        {/* Content Card (Left or Right on desktop, indented on mobile) */}
                        <div className={`pl-11 md:pl-0 ${isEven ? "md:text-right md:pr-4" : "md:col-start-2 md:pl-4"}`}>
                          <article className="p-6 rounded-2xl bg-slate-50 dark:bg-[#16162c] border border-slate-200 dark:border-white/10 hover:border-orange-500/40 transition-all shadow-sm">
                            <div
                              className={`flex flex-wrap items-center gap-2 mb-2.5 ${
                                isEven ? "md:justify-end" : "justify-start"
                              }`}
                            >
                              <time
                                dateTime={m.year}
                                className="px-2.5 py-1 rounded-md bg-orange-600 text-white font-extrabold text-xs shadow-xs"
                              >
                                {m.year}
                              </time>
                              <span className="text-xs font-semibold text-orange-900 dark:text-orange-200 bg-orange-100 dark:bg-orange-950/70 border border-orange-300 dark:border-orange-800/80 px-2 py-0.5 rounded">
                                {m.category}
                              </span>
                              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                                • {m.scope}
                              </span>
                            </div>

                            <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">{m.title}</h3>
                            <p className="mt-2 text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                              {m.description}
                            </p>
                          </article>
                        </div>
                      </div>
                    </ScrollReveal>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* 5. SERTIFIKASI & PENGHARGAAN RESMI (12 Symmetrical Items + Interactive Sector Filter) */}
      <section
        aria-labelledby="awards-heading"
        className="relative py-16 md:py-24 bg-slate-50 dark:bg-[#151528] border-b border-slate-200/80 dark:border-white/10 overflow-hidden transition-colors"
      >
        <GridPattern />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="inline-block text-xs font-bold text-orange-900 dark:text-orange-200 bg-orange-100 dark:bg-orange-950/70 border border-orange-300 dark:border-orange-800/80 px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                Kredibilitas & Pengakuan Resmi
              </span>
              <h2
                id="awards-heading"
                className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight"
              >
                Sertifikasi & <GradientText>Penghargaan Resmi</GradientText>
              </h2>
              <p className="mt-4 text-slate-700 dark:text-slate-200 text-base leading-relaxed">
                Dokumentasi resmi apresiasi dan sertifikat penyelesaian proyek dari kementerian, BUMN, dan lembaga
                negara atas integritas layanan CITS Indonesia.
              </p>
            </div>

            {/* Interactive Sector Filter (WCAG Keyboard Accessible) */}
            <div
              role="tablist"
              aria-label="Filter Kategori Sertifikasi dan Penghargaan"
              className="flex flex-wrap items-center justify-center gap-2 mb-10"
            >
              {[
                { key: "all", label: "Semua Sertifikasi (12)" },
                { key: "kementerian", label: "Kementerian & Lembaga (7)" },
                { key: "bumn", label: "BUMN & Pelayanan Publik (2)" },
                { key: "egov", label: "Tata Kelola & e-Gov (3)" },
              ].map((tab) => {
                const isActive = awardFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setAwardFilter(tab.key as typeof awardFilter)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
                      isActive
                        ? "bg-orange-600 text-white shadow-sm shadow-orange-600/30"
                        : "bg-white dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/15 border border-slate-200 dark:border-white/10"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </ScrollReveal>

          {/* 12-Item Perfectly Symmetrical Grid (3 columns on lg, 2 on md) */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filteredAwards.map((item, i) => (
              <ScrollReveal key={item.id} delay={(i % 3) * 0.06} className="h-full">
                <SpotlightCard className="h-full">
                  <article className="p-6 flex flex-col justify-between h-full">
                    <div>
                      {/* Top Metadata */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/70 border border-orange-300 dark:border-orange-800/80 flex items-center justify-center text-orange-700 dark:text-orange-400 shadow-xs shrink-0">
                          <Award className="w-6 h-6" aria-hidden="true" />
                        </div>
                        <span className="text-[11px] font-bold text-orange-900 dark:text-orange-200 bg-orange-100 dark:bg-orange-950/70 border border-orange-300 dark:border-orange-800/80 px-2.5 py-1 rounded-md uppercase">
                          {item.badge}
                        </span>
                      </div>

                      {/* Title Slot (Normalized min-height for uniform alignment) */}
                      <h3 className="font-bold text-slate-900 dark:text-white text-base min-h-[44px] flex items-center">
                        {item.title}
                      </h3>

                      {/* Issuer Slot */}
                      <p className="text-xs font-semibold text-orange-800 dark:text-orange-400 mt-1 min-h-[20px]">
                        {item.issuer}
                      </p>

                      {/* Description Slot (Normalized min-height) */}
                      <p className="mt-3 text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed min-h-[64px]">
                        {item.description}
                      </p>
                    </div>

                    {/* Footer Verification Badge */}
                    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 dark:text-emerald-400">
                      <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>Sertifikat Terdokumentasi & Sah</span>
                    </div>
                  </article>
                </SpotlightCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. STRUKTUR LEGALITAS & TATA KELOLA PERUSAHAAN (IDDS Standard & SPBE Governance) */}
      <section
        id="legalitas-governance"
        aria-labelledby="governance-heading"
        className="py-16 md:py-24 bg-white dark:bg-[#1A1A2E] transition-colors border-b border-slate-200/80 dark:border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="inline-block text-xs font-bold text-orange-900 dark:text-orange-200 bg-orange-100 dark:bg-orange-950/70 border border-orange-300 dark:border-orange-800/80 px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                Kredibilitas Hukum & Transparansi
              </span>
              <h2
                id="governance-heading"
                className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight"
              >
                Tata Kelola & <GradientText>Legalitas Perusahaan</GradientText>
              </h2>
              <p className="mt-4 text-slate-700 dark:text-slate-200 text-base leading-relaxed">
                Kepatuhan institusional dan perizinan berusaha resmi yang menjamin akuntabilitas serta keamanan CITS
                Indonesia sebagai penyedia pengadaan barang/jasa instansi publik.
              </p>
            </div>
          </ScrollReveal>

          {/* Symmetrical 4-Card Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {governancePillars.map((pillar, i) => {
              const IconComp = pillar.icon;
              return (
                <ScrollReveal key={pillar.title} delay={i * 0.08} className="h-full">
                  <SpotlightCard className="h-full">
                    <div className="p-6 md:p-7 flex flex-col justify-between h-full">
                      <div>
                        {/* Header Badge & Icon */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/70 border border-orange-300 dark:border-orange-800/80 flex items-center justify-center text-orange-700 dark:text-orange-400 shadow-xs shrink-0">
                            <IconComp className="w-6 h-6" aria-hidden="true" />
                          </div>
                        </div>

                        <span className="inline-block text-[10px] font-bold text-orange-900 dark:text-orange-200 bg-orange-100 dark:bg-orange-950/70 border border-orange-300 dark:border-orange-800/80 px-2 py-0.5 rounded uppercase mb-2">
                          {pillar.badge}
                        </span>

                        <h3 className="font-extrabold text-slate-900 dark:text-white text-base min-h-[44px] flex items-center">
                          {pillar.title}
                        </h3>

                        <p className="mt-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed min-h-[52px]">
                          {pillar.description}
                        </p>

                        {/* Checklist items */}
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 space-y-2.5">
                          {pillar.items.map((point) => (
                            <div
                              key={point}
                              className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300"
                            >
                              <CheckCircle2
                                className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5"
                                aria-hidden="true"
                              />
                              <span className="leading-tight">{point}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Verified Status Tag */}
                      <div className="mt-6 pt-3 border-t border-slate-200 dark:border-white/10 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 dark:text-emerald-400">
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Kepatuhan Terverifikasi</span>
                      </div>
                    </div>
                  </SpotlightCard>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION & KANAL RESMI KEMITRAAN (IDDS Accessible Conversion) */}
      <section
        aria-labelledby="about-cta-heading"
        className="py-16 md:py-24 bg-slate-50 dark:bg-[#151528] transition-colors"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <div className="p-8 md:p-14 rounded-3xl bg-gradient-to-br from-white via-orange-50/40 to-white dark:from-[#181830] dark:via-[#1F1712] dark:to-[#181830] border border-orange-200/80 dark:border-orange-900/40 shadow-xl">
              <span className="inline-block text-xs font-bold text-orange-900 dark:text-orange-200 bg-orange-100 dark:bg-orange-950/70 border border-orange-300 dark:border-orange-800/80 px-3.5 py-1 rounded-full uppercase tracking-wider mb-4">
                Kolaborasi Solusi Digital Terpadu
              </span>
              <h2
                id="about-cta-heading"
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug"
              >
                Siap Bermitra Membangun Solusi TI Bersama CITS Indonesia?
              </h2>
              <p className="mt-4 text-slate-700 dark:text-slate-200 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                Diskusikan rencana transformasi digital, kebutuhan konsultasi arsitektur SPBE, atau pengembangan sistem
                kustom instansi Anda bersama tim tenaga ahli kami.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3.5">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold rounded-xl transition-all shadow-md shadow-orange-600/20 hover:shadow-lg hover:shadow-orange-600/30 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                >
                  <span>Hubungi Tim Ahli Kami</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>

                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white dark:bg-white/10 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/15 font-semibold rounded-xl border border-slate-200 dark:border-white/15 transition-all text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                >
                  <Briefcase className="w-4 h-4 text-orange-600 dark:text-orange-400" aria-hidden="true" />
                  <span>Lihat Seluruh Portofolio</span>
                </Link>

                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white dark:bg-white/10 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/15 font-semibold rounded-xl border border-slate-200 dark:border-white/15 transition-all text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                >
                  <Layers className="w-4 h-4 text-orange-600 dark:text-orange-400" aria-hidden="true" />
                  <span>Katalog Solusi Produk</span>
                </Link>
              </div>

              {/* IDDS Official SLA & Contact Assurance Bar */}
              <div className="mt-10 pt-6 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                  <span>Komitmen SLA Respon Cepat (&lt; 24 Jam Kerja)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-orange-700 dark:text-orange-400" aria-hidden="true" />
                  <span>Perjanjian Kerahasiaan Data (NDA) Dijamin</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-700 dark:text-blue-400" aria-hidden="true" />
                  <span>Kantor Operasional & Representasi Resmi</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
