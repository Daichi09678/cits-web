"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Truck,
  Package,
  FileText,
  Map,
  MessageSquare,
  Globe,
  Smartphone,
  BarChart3,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Layers,
  Cpu,
  ArrowRight,
  Server,
  Zap,
  Lock,
  Headphones,
  SlidersHorizontal,
  X,
  ChevronRight,
  Sparkles,
  Award,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/animations/ScrollReveal";
import GradientText from "@/components/ui/GradientText";
import GridPattern from "@/components/ui/GridPattern";
import FloatingShapes from "@/components/animations/FloatingShapes";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { useCitsStore } from "@/database/store";

const iconMap: Record<string, any> = {
  Truck,
  Package,
  FileText,
  Map,
  MessageSquare,
  Globe,
  Smartphone,
  BarChart3,
};

function getProductIcon(icon: any) {
  if (typeof icon === "function" || (typeof icon === "object" && icon !== null && "$$typeof" in icon)) {
    return icon;
  }
  if (typeof icon === "string" && iconMap[icon]) {
    return iconMap[icon];
  }
  return Package;
}

export interface ProductItem {
  id: string;
  name: string;
  brandCode: string;
  category: string;
  badgeCategory: string;
  version: string;
  tagline: string;
  description: string;
  icon: any;
  features: string[];
  techStack?: string[];
  specifications?: {
    deployment: string;
    architecture: string;
    security: string;
    integration: string;
  };
  modules?: string[];
  idealFor?: string;
  isActive?: boolean;
}

const categories = [
  "Semua Produk",
  "IoT & Telemetri",
  "Aset & Korporasi",
  "Dokumen & Arsip Digital",
  "Sistem Geografis (SIG)",
  "Komunikasi & Layanan Publik",
  "Aplikasi Mobile & Lapangan",
  "Analitik & Intelijen Bisnis",
];

const products: ProductItem[] = [
  {
    id: "cits-fleettrack",
    name: "CITS FleetTrack™",
    brandCode: "IoT-01",
    category: "IoT & Telemetri",
    badgeCategory: "IoT & Telemetri",
    version: "v4.5 Enterprise",
    tagline: "Platform Pemantauan Armada & Telemetri Logistik Waktu Nyata",
    description:
      "Solusi cerdas pelacakan kendaraan dan telemetri armada logistik untuk mengoptimalkan efisiensi rute, pemantauan konsumsi BBM presisi, perlindungan aset bergerak, dan peringatan dini insiden darurat.",
    icon: Truck,
    features: [
      "Pelacakan lokasi satelit multi-GPS waktu nyata (real-time tracking)",
      "Pembatasan wilayah operasional digital otomatis (Dynamic Geofencing)",
      "Sensor telemetri konsumsi bahan bakar, temperatur kargo, & kecepatan",
      "Peringatan dini insiden, rekam jejak rute historis, & perilaku pengemudi",
    ],
    techStack: ["GPS Telematics", "MQTT Protocol", "WebSockets", "Mapbox/Leaflet", "Time-series DB"],
    specifications: {
      deployment: "Private Cloud / On-Premise Data Center",
      architecture: "Event-Driven Microservices",
      security: "Enkripsi TLS 1.3 & Device Token Auth",
      integration: "RESTful API & Webhook Telemetri",
    },
    modules: [
      "Live Fleet Tracker Map",
      "Fuel Consumption Telemetry",
      "Geofence Alert Engine",
      "Driver Scorecard & Maintenance Log",
    ],
    idealFor: "Armada Transportasi Kementerian, BUMN Logistik, & Pengelola Aset Kendaraan Dinas",
  },
  {
    id: "cits-assethub",
    name: "CITS AssetHub™",
    brandCode: "AST-02",
    category: "Aset & Korporasi",
    badgeCategory: "Aset & Korporasi",
    version: "v5.0 Enterprise",
    tagline: "Sistem Manajemen Siklus Hidup Aset Enterprise Terpadu",
    description:
      "Platform terintegrasi untuk mengelola seluruh siklus hidup aset instansi dari tahap perencanaan kebutuhan, pengadaan, inventarisasi barcode/RFID, kalkulasi depresiasi nilai buku, hingga penghapusan aset siap audit.",
    icon: Package,
    features: [
      "Pengelolaan siklus hidup aset lengkap (End-to-End Asset Lifecycle)",
      "Pemindaian fisik inventaris berbasis Barcode 1D/2D, QR Code, & integrasi RFID",
      "Kalkulasi penyusutan nilai buku & depresiasi otomatis sesuai kaidah akuntansi",
      "Rekonsiliasi fisik berkala & pelaporan siap audit BPK / KAP independen",
    ],
    techStack: ["PostgreSQL Enterprise", "QR/Barcode Generator", "Audit Trail Engine", "Export Excel/PDF", "REST API"],
    specifications: {
      deployment: "Enterprise Private Cloud / On-Premise",
      architecture: "Modular Multi-Tier Enterprise",
      security: "Role-Based Access Control & Tamper-Proof Audit",
      integration: "Konektor ERP (SAP / Oracle) & SIMAK BMN",
    },
    modules: [
      "Katalog Registrasi Aset",
      "Depreciation Calculator Engine",
      "Stock Opname Mobile Scanner",
      "Modul Pemeliharaan & Disposal Aset",
    ],
    idealFor: "BUMN Infrastruktur & Energi, Kementerian/Lembaga, & Rumah Sakit Umum",
  },
  {
    id: "cits-docuvault",
    name: "CITS DocuVault™",
    brandCode: "DOC-03",
    category: "Dokumen & Arsip Digital",
    badgeCategory: "Dokumen & Arsip Digital",
    version: "v3.8 Secure",
    tagline: "Tata Kelola Arsip & Repositori Dokumen Elektronik Berstandar Kearsipan",
    description:
      "Solusi tata kelola dokumen elektronik instansi berstandar kearsipan nasional (ANRI) dengan perlindungan enkripsi AES-256, pengenalan teks cerdas (OCR), kontrol versi otomatis, dan integrasi Tanda Tangan Elektronik (TTE).",
    icon: FileText,
    features: [
      "Repositori arsip terpusat dengan klasifikasi dinamis & retensi dokumen",
      "Pencarian teks lengkap cerdas (Full-text Elastic Search) berbasis OCR",
      "Kontrol versi dokumen otomatis (Version Control) & jejak audit akses pembacaan",
      "Hak akses bertingkat (RBAC) & integrasi Tanda Tangan Elektronik tersertifikasi BSrE",
    ],
    techStack: ["Encrypted Vault", "Elasticsearch", "Document Viewer Engine", "Role-Based Access", "OCR Parser"],
    specifications: {
      deployment: "Government Secure Cloud / On-Premise Vault",
      architecture: "Microservices High-Capacity Storage",
      security: "Enkripsi Data AES-256 at-rest & in-transit",
      integration: "REST Webhook & TTE Gateway BSrE",
    },
    modules: [
      "Dokumen Indexer & OCR Parser",
      "Dynamic Approval Workflow",
      "Versioning & Digital Signature Hub",
      "Automated Backup & Archival Engine",
    ],
    idealFor: "Lembaga Peradilan, Satuan Kerja Kementerian, Sekretariat Daerah, & BUMN",
  },
  {
    id: "cits-geospatial",
    name: "CITS GeoSpatial™",
    brandCode: "GIS-04",
    category: "Sistem Geografis (SIG)",
    badgeCategory: "Sistem Geografis (SIG)",
    version: "v4.0 Pro",
    tagline: "Platform Informasi Geografis & Analisis Spasial Multi-Layer",
    description:
      "Platform pemetaan digital dan visualisasi data geospasial interaktif multi-lapisan untuk monitoring infrastruktur utilitas, analisis tata ruang wilayah, dan integrasi repositori Satu Data Geospasial Indonesia.",
    icon: Map,
    features: [
      "Peta interaktif multi-lapisan (Multi-layer Spatial Overlay) performa tinggi",
      "Analisis data spasial jarak, topologi wilayah, kepadatan titik, & buffer zona",
      "Pencatatan status kondisi aset utilitas jaringan secara visual pada peta",
      "Dukungan format standar geospasial internasional (GeoJSON, Shapefile, KML, PostGIS)",
    ],
    techStack: ["PostGIS Spatial", "GeoServer", "OpenLayers / Mapbox", "Spatial Topology Validator", "OGC Standards"],
    specifications: {
      deployment: "High-Performance Cloud / Dedicated Server",
      architecture: "OGC Compliant Spatial Architecture",
      security: "Spatial Data Protection & Domain Restriction",
      integration: "WMS, WFS, WCS & Satu Data Indonesia Geoportal",
    },
    modules: [
      "Interactive Spatial Studio",
      "Thematic Layer Manager",
      "Topology Conflict Detector",
      "Spatial Report & Map Exporter",
    ],
    idealFor: "Dinas Tata Ruang, Badan Informasi Geospasial, Pengelola Utilitas Publik, & Peneliti Kemaritiman",
  },
  {
    id: "cits-omnichannel",
    name: "CITS Omnichannel Gateway™",
    brandCode: "MSG-05",
    category: "Komunikasi & Layanan Publik",
    badgeCategory: "Komunikasi & Layanan Publik",
    version: "v3.2 High-Throughput",
    tagline: "Infrastruktur Pesan Massal, OTP Transaksi, & Notifikasi Multi-Kanal",
    description:
      "Infrastruktur pengiriman pesan massal terprogram dengan throughput tinggi melalui WhatsApp Business API, SMS OTP, Email Gateway, dan Webhook untuk layanan perbankan, perizinan publik, dan diseminasi informasi instansi.",
    icon: MessageSquare,
    features: [
      "Agregasi multi-kanal: WhatsApp Official API, SMS Gateway performa tinggi, & Email",
      "Throughput masif melayani ribuan pesan per detik dengan sistem antrean cerdas (Queue)",
      "Laporan status pengiriman pesan langsung (Real-Time Delivery Report & Fallback)",
      "Manajemen template pesan dinamis, penjadwalan terotomasi, & token verifikasi OTP",
    ],
    techStack: ["SMPP Protocol", "WhatsApp Business API", "Redis Message Queue", "RESTful Webhooks", "High-Throughput Node Engine"],
    specifications: {
      deployment: "Dedicated Gateway Server / Cloud Hybrid",
      architecture: "Asynchronous Queue Worker Engine",
      security: "Rate Limiting, DDoS Shield, & Token Encryption",
      integration: "REST API Client, Webhook Callback, & SDK",
    },
    modules: [
      "Multi-Channel Broadcast Hub",
      "OTP Security Authenticator",
      "Dynamic Template Engine",
      "Real-Time Delivery Analytics",
    ],
    idealFor: "Sistem Rumah Sakit, Portal Layanan Pajak/Retribusi Daerah, Bank Pembangunan Daerah, & BUMN",
  },
  {
    id: "cits-smartgov",
    name: "CITS SmartGov Portal™",
    brandCode: "GOV-06",
    category: "Komunikasi & Layanan Publik",
    badgeCategory: "Komunikasi & Layanan Publik",
    version: "v5.2 SPBE Ready",
    tagline: "Platform Portal Satu Pintu & Pelayanan Publik Terpadu SPBE",
    description:
      "Framework portal pelayanan publik modern yang memadukan manajemen konten dinamis (WYSIWYG CMS), modul permohonan perizinan online, gerbang pembayaran retribusi digital, dan kepatuhan standar SPBE nasional.",
    icon: Globe,
    features: [
      "Manajemen konten visual ramah pengguna (WYSIWYG Enterprise CMS terpadu)",
      "Integrasi Single Sign-On (SSO) dan autentikasi identitas publik / pegawai",
      "Katalog layanan permohonan publik dengan pelacakan status berkas real-time",
      "Integrasi gerbang pembayaran resmi (Payment Gateway) untuk retribusi & PAD",
    ],
    techStack: ["Next.js / TypeScript", "Headless CMS Architecture", "Payment Gateway Gateway", "Edge CDN", "WCAG 2.1 Standard"],
    specifications: {
      deployment: "Government Cloud / Edge CDN",
      architecture: "Headless Decoupled Architecture",
      security: "WAF Protection, Anti-Defacement, & SSL TLS 1.3",
      integration: "Payment Gateway, Portal Satu Data, & SSO Dukcapil",
    },
    modules: [
      "Dynamic Page & Content Builder",
      "Public Service Request Tracker",
      "E-Payment Gateway Connector",
      "SPBE Analytics & Visitor Insight",
    ],
    idealFor: "Portal Resmi Kementerian, Pemprov/Pemkab/Pemkot, & Lembaga Penyiaran Publik",
  },
  {
    id: "cits-fieldsurvey",
    name: "CITS FieldSurvey Pro™",
    brandCode: "MOB-07",
    category: "Aplikasi Mobile & Lapangan",
    badgeCategory: "Aplikasi Mobile & Lapangan",
    version: "v3.0 Native",
    tagline: "Aplikasi Mobile Inspeksi Fisik, Pendataan Sensus, & Survei Offline",
    description:
      "Aplikasi survei lapangan cerdas untuk pendataan sensus, inspeksi fisik aset, dan pemantauan wilayah dengan kapabilitas offline-first, penandaan koordinat GPS terverifikasi, dan sinkronisasi otomatis saat online.",
    icon: Smartphone,
    features: [
      "Pengoperasian penuh dalam mode luring tanpa koneksi internet (Offline-First Storage)",
      "Perekaman otomatis koordinat lokasi GPS presisi & foto bukti ber-watermark waktu",
      "Pembuat formulir survei dinamis yang mudah dikonfigurasi tanpa koding ulang",
      "Sinkronisasi data terenkripsi otomatis ke server pusat saat tersambung internet",
    ],
    techStack: ["Offline SQLite", "GPS Tagging Engine", "Data Sync Conflict Resolver", "Android Client", "Encrypted Sync"],
    specifications: {
      deployment: "Android Client & Central Cloud Dashboard",
      architecture: "Offline-First Sync Architecture",
      security: "Biometric Auth & Local Encrypted Database",
      integration: "Central Rest API & Geoportal Sync",
    },
    modules: [
      "Dynamic Survey Form Builder",
      "GPS Geotagger & Photo Watermarker",
      "Offline Storage Engine",
      "Central Two-Way Sync Bridge",
    ],
    idealFor: "Dinas Pertanian & Peternakan, Surveyor Lapangan BUMN, Tim Pendataan Aset, & Petugas Pajak PBB",
  },
  {
    id: "cits-executive-bi",
    name: "CITS Executive BI™",
    brandCode: "BI-08",
    category: "Analitik & Intelijen Bisnis",
    badgeCategory: "Analitik & Intelijen Bisnis",
    version: "v4.1 Insight",
    tagline: "Mesin Dasbor Analitik Eksekutif & Agregator Data Lintas Sumber",
    description:
      "Platform visualisasi data eksekutif dan analitik bisnis yang mengagregasi data dari berbagai sumber basis data ke dalam dasbor interaktif real-time untuk perumusan keputusan strategis pimpinan.",
    icon: BarChart3,
    features: [
      "Dasbor pemantauan indikator kinerja utama (KPI) dengan visualisasi grafik interaktif",
      "Konektor agregasi multi-database (Oracle, PostgreSQL, MySQL, SQL Server) otomatis",
      "Kemampuan penelusuran data mendalam (Drill-Down Analytics) hingga level unit kerja",
      "Jadwal ekspor otomatis laporan analitik pimpinan dalam format PDF & Spreadsheet",
    ],
    techStack: ["BI Analytics Engine", "Data Warehouse Schema", "ETL Pipeline", "Interactive Charting", "Role Dashboard"],
    specifications: {
      deployment: "Private Cloud / On-Premise Server",
      architecture: "Data Warehouse & ETL Pipeline",
      security: "Executive-Level Access Control & Data Masking",
      integration: "Multi-Source Database Drivers & API Ingestion",
    },
    modules: [
      "Executive KPI Visualizer",
      "Multi-Source ETL Pipeline",
      "Drill-Down Matrix Analyzer",
      "Automated Report Dispatcher",
    ],
    idealFor: "Pimpinan Kementerian, Direksi BUMN, Kepala Bappeda, & Pengambil Keputusan Korporasi",
  },
];

const categoryColors: Record<string, string> = {
  "IoT & Telemetri":
    "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60",
  "Aset & Korporasi":
    "bg-amber-100 dark:bg-amber-950/60 text-amber-950 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60",
  "Dokumen & Arsip Digital":
    "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60",
  "Sistem Geografis (SIG)":
    "bg-teal-100 dark:bg-teal-950/60 text-teal-900 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/60",
  "Komunikasi & Layanan Publik":
    "bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60",
  "Aplikasi Mobile & Lapangan":
    "bg-orange-100 dark:bg-orange-950/60 text-orange-900 dark:text-orange-300 border border-orange-200/80 dark:border-orange-800/60",
  "Analitik & Intelijen Bisnis":
    "bg-purple-100 dark:bg-purple-950/60 text-purple-950 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/60",
};

const advantages = [
  {
    title: "100% Kepemilikan Kode Mandiri",
    description:
      "Seluruh produk dikembangkan mandiri oleh tim rekayasa CITS tanpa ketergantungan lisensi black-box pihak luar, memberikan kebebasan kustomisasi penuh tanpa biaya lisensi tersembunyi.",
    icon: Cpu,
  },
  {
    title: "Interoperabilitas SPBE & Satu Data",
    description:
      "Arsitektur modular siap diintegrasikan melalui REST API dan standar data terpadu nasional untuk mendukung integrasi Satu Data Indonesia.",
    icon: Layers,
  },
  {
    title: "Keamanan Berstandar Enterprise",
    description:
      "Dilengkapi pengamanan data sensitif berlapis, audit trail aktivitas pengguna, enkripsi data at-rest/in-transit, dan kepatuhan standar Undang-Undang Perlindungan Data Pribadi (UU PDP).",
    icon: ShieldCheck,
  },
  {
    title: "Pendampingan & Pelatihan Operator",
    description:
      "Paket implementasi menyeluruh mencakup instalasi teknis, konfigurasi server, pelatihan operator hingga mahir, serta garansi pemeliharaan teknis purna jual.",
    icon: Award,
  },
];

const licensingModels = [
  {
    title: "On-Premise Enterprise License",
    badge: "Kepemilikan Mandiri",
    desc: "Instalasi penuh pada pusat data (data center) lokal milik instansi Anda dengan akses kontrol infrastruktur internal 100%.",
    features: [
      "Deployment di server data center instansi",
      "Akses basis data lokal terisolasi & aman",
      "Satu kali lisensi enterprise tanpa langganan",
      "Dokumentasi arsitektur sistem lengkap",
    ],
  },
  {
    title: "Dedicated Managed Cloud",
    badge: "Praktis & Terkelola",
    desc: "Infrastruktur cloud privat terisolasi yang dipelihara dan dipantau performanya secara berkala oleh tim teknis CITS.",
    features: [
      "Siap pakai tanpa investasi perangkat keras server",
      "Pencadangan data (backup) harian otomatis",
      "SLA ketersediaan sistem 99.9% uptime",
      "Monitoring performa & pembaruan keamanan",
    ],
  },
  {
    title: "Customized Enterprise Extension",
    badge: "Kustomisasi Penuh",
    desc: "Penyesuaian modul produk dengan alur proses bisnis spesifik, format pelaporan khusus, dan integrasi sistem eksisting organisasi Anda.",
    features: [
      "Penambahan modul custom sesuai SOP instansi",
      "Integrasi bi-directional dengan sistem eksisting",
      "Dukungan tim rekayasa software berdedikasi",
      "Alih pengetahuan & pelatihan teknis intensif",
    ],
  },
];

export default function ProductsPage() {
  const { products: storeProducts } = useCitsStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua Produk");
  const [activeModalProduct, setActiveModalProduct] = useState<any | null>(null);

  // Fallback to static products list if store is still loading or empty, and filter out inactive items
  const productSource = storeProducts && storeProducts.length > 0 ? storeProducts : products;
  const activeProducts = productSource.filter((p: any) => p.isActive !== false);

  const filteredProducts =
    selectedCategory === "Semua Produk"
      ? activeProducts
      : activeProducts.filter((p: any) => p.category === selectedCategory);

  return (
    <main id="main-content" className="min-h-screen">
      {/* 1. HERO SECTION */}
      <section
        aria-labelledby="products-hero-heading"
        className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-[#1A1A2E] dark:to-slate-950 py-16 md:py-24 overflow-hidden transition-colors"
      >
        <FloatingShapes />
        <GridPattern className="opacity-90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-900 dark:text-orange-300 border border-orange-200/80 dark:border-orange-800/60 text-xs font-bold tracking-wide uppercase shadow-sm mb-5">
              <Zap className="w-3.5 h-3.5 text-orange-700 dark:text-orange-400" />
              <span>Platform Perangkat Lunak & Solusi Digital Siap Pakai</span>
            </div>

            <h1
              id="products-hero-heading"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-dark dark:text-white tracking-tight leading-[1.15]"
            >
              Solusi Perangkat Lunak Enterprise <br />
              <GradientText>Mandiri, Teruji, & Siap Diimplementasikan</GradientText>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="mt-5 text-gray-700 dark:text-white/85 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
              Rangkaian platform perangkat lunak siap pakai dan dapat dikustomisasi, dirancang dengan
              arsitektur enterprise modular, kepatuhan tata kelola SPBE, dan keamanan siber tinggi untuk
              mempercepat digitalisasi organisasi Anda.
            </p>
          </ScrollReveal>

          {/* Quick Credential Highlights */}
          <ScrollReveal delay={0.2}>
            <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs">
              <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/10 text-gray-800 dark:text-white font-semibold border border-gray-200 dark:border-white/15 shadow-sm">
                <Building2 className="w-4 h-4 text-orange-700 dark:text-orange-400" />
                8 Rangkaian Solusi Enterprise Siap Pakai
              </span>
              <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/10 text-gray-800 dark:text-white font-semibold border border-gray-200 dark:border-white/15 shadow-sm">
                <Cpu className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                100% Kepemilikan Kode Mandiri Tanpa Vendor Lock-in
              </span>
              <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/10 text-gray-800 dark:text-white font-semibold border border-gray-200 dark:border-white/15 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                Kepatuhan Standar SPBE & Perlindungan Data Pribadi
              </span>
            </div>
          </ScrollReveal>

          {/* Interactive Filter Pills */}
          <ScrollReveal delay={0.3}>
            <div
              className="mt-12 flex flex-wrap justify-center gap-2"
              role="tablist"
              aria-label="Filter Kategori Produk"
            >
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-md shadow-orange-600/25 scale-105"
                        : "bg-white dark:bg-[#16162c] text-gray-800 dark:text-white border border-gray-200 dark:border-white/15 hover:border-orange-500/40 hover:text-orange-700 dark:hover:text-orange-400"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. PRODUCTS SHOWCASE BENTO GRID */}
      <section
        aria-labelledby="products-grid-heading"
        className="py-16 md:py-24 bg-white dark:bg-[#1A1A2E] transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="products-grid-heading" className="sr-only">
            Katalog Platform Perangkat Lunak CITS Indonesia
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {filteredProducts.map((product: any, i: number) => {
              const Icon = getProductIcon(product.icon);

              return (
                <ScrollReveal
                  key={product.id}
                  delay={(i % 3) * 0.08}
                  className="h-full"
                >
                  <div id={product.id} className="h-full scroll-mt-28">
                    <SpotlightCard className="h-full">
                      <article className="p-6 sm:p-7 flex flex-col justify-between h-full bg-white dark:bg-[#16162c] space-y-6">
                        <div>
                          {/* Card Header: Category & Release Version */}
                          <div className="flex items-center justify-between gap-3 mb-4">
                            <span
                              className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                                categoryColors[product.badgeCategory] ||
                                "bg-slate-100 dark:bg-white/10 text-gray-800 dark:text-white"
                              }`}
                            >
                              {product.badgeCategory}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-gray-500 dark:text-white/60 bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded border border-gray-200 dark:border-white/10">
                              {product.version}
                            </span>
                          </div>

                          {/* Icon & Product Name */}
                          <div className="flex items-center gap-3.5 mb-3">
                            <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-800/60 flex items-center justify-center text-orange-700 dark:text-orange-400 shadow-sm shrink-0">
                              <Icon className="w-6 h-6" />
                            </div>
                            <div>
                              <span className="block text-[11px] font-mono font-bold text-orange-800 dark:text-orange-400 uppercase tracking-widest">
                                {product.brandCode}
                              </span>
                              <h3 className="text-xl font-extrabold text-dark dark:text-white tracking-tight leading-tight">
                                {product.name}
                              </h3>
                            </div>
                          </div>

                          {/* Tagline & Business Overview */}
                          <p className="text-xs font-semibold text-dark dark:text-white/95 leading-relaxed">
                            {product.tagline}
                          </p>
                          <p className="mt-2 text-xs text-gray-700 dark:text-white/80 leading-relaxed line-clamp-3">
                            {product.description}
                          </p>

                          {/* Core Capabilities */}
                          <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-[#121222] border border-gray-200 dark:border-white/10 space-y-2">
                            <h4 className="text-[11px] font-bold text-dark dark:text-white uppercase tracking-wider">
                              Fitur & Kapabilitas Inti:
                            </h4>
                            <ul className="space-y-1.5">
                              {product.features?.map((feat: string) => (
                                <li
                                  key={feat}
                                  className="flex items-start gap-2 text-xs text-gray-800 dark:text-white/90 leading-tight"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-700 dark:text-orange-400 shrink-0 mt-0.5" />
                                  <span>{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Technical Specifications Mini Bento */}
                          <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
                            <div className="p-2.5 rounded-lg bg-slate-100/80 dark:bg-white/5 border border-gray-200/80 dark:border-white/10">
                              <span className="block text-[10px] text-gray-500 dark:text-white/60 font-medium">
                                Model Deployment:
                              </span>
                              <span className="block font-semibold text-dark dark:text-white mt-0.5 line-clamp-1">
                                {product.specifications?.deployment ? product.specifications.deployment.split("/")[0] : "Enterprise Cloud"}
                              </span>
                            </div>
                            <div className="p-2.5 rounded-lg bg-slate-100/80 dark:bg-white/5 border border-gray-200/80 dark:border-white/10">
                              <span className="block text-[10px] text-gray-500 dark:text-white/60 font-medium">
                                Standar Keamanan:
                              </span>
                              <span className="block font-semibold text-dark dark:text-white mt-0.5 line-clamp-1">
                                {product.specifications?.security ? product.specifications.security.split("&")[0] : "TLS 1.3 & Auth"}
                              </span>
                            </div>
                          </div>

                          {/* Included Modules Pills */}
                          <div className="mt-4 pt-3 border-t border-gray-150 dark:border-white/10">
                            <span className="block text-[11px] font-semibold text-gray-700 dark:text-white/70 mb-2">
                              Modul Sistem yang Disertakan:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {product.modules?.slice(0, 3).map((m: string) => (
                                <span
                                  key={m}
                                  className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-gray-800 dark:text-white border border-gray-200 dark:border-white/15"
                                >
                                  {m}
                                </span>
                              ))}
                              {product.modules && product.modules.length > 3 && (
                                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-gray-600 dark:text-white/70">
                                  +{product.modules.length - 3} modul
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                          <button
                            onClick={() => setActiveModalProduct(product)}
                            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-gray-800 dark:text-white text-xs font-bold border border-gray-200 dark:border-white/15 transition-all cursor-pointer"
                          >
                            Spesifikasi Lengkap
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                          <Link
                            href="/contact"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white text-xs font-bold transition-all shadow-md shadow-orange-600/20 hover:shadow-orange-600/30"
                          >
                            Minta Demo
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </article>
                    </SpotlightCard>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. LICENSING & DEPLOYMENT MODELS */}
      <section
        aria-labelledby="licensing-heading"
        className="py-16 md:py-24 bg-gray-50 dark:bg-[#151528] transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block text-xs font-bold text-orange-900 dark:text-orange-300 bg-orange-100 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-800/60 px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                Opsi Implementasi
              </span>
              <h2
                id="licensing-heading"
                className="text-3xl md:text-4xl font-extrabold text-dark dark:text-white"
              >
                Model Penerapan & Lisensi <GradientText>Fleksibel</GradientText>
              </h2>
              <p className="mt-4 text-gray-700 dark:text-white/85 text-base leading-relaxed">
                Pilih model deployment dan skema kepemilikan yang paling selaras dengan kebijakan tata kelola teknologi dan anggaran instansi Anda.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {licensingModels.map((item, idx) => (
              <ScrollReveal key={item.title} delay={idx * 0.12} className="h-full">
                <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#16162c] border border-gray-200 dark:border-white/10 hover:border-orange-500/40 transition-all shadow-sm h-full flex flex-col justify-between">
                  <div>
                    <span className="inline-block text-[11px] font-bold text-orange-900 dark:text-orange-300 bg-orange-100 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-800/60 px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                      {item.badge}
                    </span>
                    <h3 className="text-xl font-extrabold text-dark dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-xs md:text-sm text-gray-700 dark:text-white/80 leading-relaxed">
                      {item.desc}
                    </p>

                    <div className="mt-6 pt-5 border-t border-gray-150 dark:border-white/10 space-y-2.5">
                      <span className="block text-[11px] font-bold text-dark dark:text-white uppercase tracking-wider">
                        Cakupan Layanan:
                      </span>
                      <ul className="space-y-2 text-xs text-gray-800 dark:text-white/90">
                        {item.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 pt-4">
                    <Link
                      href="/contact"
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-orange-600 hover:text-white text-gray-800 dark:text-white text-xs font-bold border border-gray-200 dark:border-white/15 transition-all shadow-sm"
                    >
                      Konsultasikan Skema Ini
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. VALUE PROPOSITION SECTION */}
      <section
        aria-labelledby="advantages-heading"
        className="py-16 md:py-24 bg-white dark:bg-[#1A1A2E] transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block text-xs font-bold text-orange-900 dark:text-orange-300 bg-orange-100 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-800/60 px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                Keunggulan Solusi
              </span>
              <h2
                id="advantages-heading"
                className="text-3xl md:text-4xl font-extrabold text-dark dark:text-white"
              >
                Mengapa Memilih Platform Produk <GradientText>CITS Indonesia?</GradientText>
              </h2>
              <p className="mt-4 text-gray-700 dark:text-white/85 text-base leading-relaxed">
                Kami membangun produk perangkat lunak dengan rekayasa mandiri yang mengutamakan keberlanjutan pemakaian, kemudahan integrasi, dan kepatuhan hukum jangka panjang.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {advantages.map((adv, idx) => {
              const AdvIcon = adv.icon;
              return (
                <ScrollReveal key={adv.title} delay={idx * 0.1} className="h-full">
                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#16162c] border border-gray-200 dark:border-white/10 hover:border-orange-500/40 transition-all shadow-sm h-full flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-800/60 flex items-center justify-center text-orange-700 dark:text-orange-400 mb-4 shadow-sm">
                        <AdvIcon className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-dark dark:text-white text-base">
                        {adv.title}
                      </h3>
                      <p className="mt-2 text-xs md:text-sm text-gray-700 dark:text-white/80 leading-relaxed">
                        {adv.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-3 border-t border-gray-150 dark:border-white/10 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 dark:text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Standar Mutu Terjamin</span>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION SECTION */}
      <section
        aria-labelledby="products-cta-heading"
        className="py-16 md:py-24 bg-gray-50 dark:bg-[#151528] transition-colors"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <div className="p-8 md:p-14 rounded-3xl bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-50 dark:from-[#151528] dark:via-[#1E1710] dark:to-[#151528] border border-orange-200/60 dark:border-orange-900/30 shadow-lg">
              <span className="inline-block text-xs font-bold text-orange-900 dark:text-orange-300 bg-orange-100 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-800/60 px-3.5 py-1 rounded-full uppercase tracking-wider mb-4">
                Konsultasi & Uji Coba Demo
              </span>
              <h2
                id="products-cta-heading"
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-dark dark:text-white tracking-tight"
              >
                Ingin Melihat Demo Langsung atau Menyesuaikan Modul Produk?
              </h2>
              <p className="mt-4 text-gray-700 dark:text-white/85 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                Jadwalkan sesi demonstrasi langsung bersama konsultan teknis CITS Indonesia. Kami siap mempresentasikan kapabilitas platform dan mendiskusikan integrasi dengan sistem Anda.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold rounded-xl transition-all shadow-md shadow-orange-600/20 hover:shadow-lg hover:shadow-orange-600/30 text-sm"
                >
                  Jadwalkan Demo Produk
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-100 dark:bg-white/10 text-gray-800 dark:text-white hover:bg-slate-200 dark:hover:bg-white/15 font-semibold rounded-xl border border-gray-200 dark:border-white/15 transition-all text-sm"
                >
                  Lihat Rekam Jejak Portofolio
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 6. INTERACTIVE PRODUCT DEEP-DIVE MODAL */}
      <AnimatePresence>
        {activeModalProduct && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-product-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#16162c] border border-gray-200 dark:border-white/15 shadow-2xl p-6 sm:p-9 text-dark dark:text-white"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalProduct(null)}
                aria-label="Tutup jendela spesifikasi produk"
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-white/10 text-gray-600 dark:text-white/80 hover:bg-orange-600 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-4 pr-10">
                <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-800/60 flex items-center justify-center text-orange-700 dark:text-orange-400 shrink-0">
                  {(() => {
                    const ModalIcon = getProductIcon(activeModalProduct.icon);
                    return <ModalIcon className="w-7 h-7" />;
                  })()}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-orange-800 dark:text-orange-400">
                      {activeModalProduct.brandCode}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-gray-700 dark:text-white/80 border border-gray-200 dark:border-white/10">
                      {activeModalProduct.version}
                    </span>
                  </div>
                  <h3
                    id="modal-product-title"
                    className="mt-1 text-2xl font-extrabold text-dark dark:text-white leading-tight"
                  >
                    {activeModalProduct.name}
                  </h3>
                </div>
              </div>

              {/* Tagline */}
              <div className="mt-4 p-4 rounded-xl bg-orange-50/70 dark:bg-orange-950/30 border border-orange-200/70 dark:border-orange-900/40">
                <p className="text-xs sm:text-sm font-semibold text-orange-950 dark:text-orange-200 leading-relaxed">
                  {activeModalProduct.tagline}
                </p>
              </div>

              {/* Full Description */}
              <p className="mt-4 text-xs sm:text-sm text-gray-700 dark:text-white/85 leading-relaxed">
                {activeModalProduct.description}
              </p>

              {/* Specifications Matrix */}
              <div className="mt-6">
                <span className="block text-xs font-bold text-dark dark:text-white uppercase tracking-wider mb-2.5">
                  Spesifikasi Teknis & Lingkungan Sistem:
                </span>
                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#121222] border border-gray-200/80 dark:border-white/10">
                    <span className="block text-[10px] text-gray-500 dark:text-white/60 font-medium">
                      Model Penerapan (Deployment):
                    </span>
                    <span className="block font-bold text-dark dark:text-white mt-0.5">
                      {activeModalProduct.specifications.deployment}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#121222] border border-gray-200/80 dark:border-white/10">
                    <span className="block text-[10px] text-gray-500 dark:text-white/60 font-medium">
                      Pola Arsitektur:
                    </span>
                    <span className="block font-bold text-dark dark:text-white mt-0.5">
                      {activeModalProduct.specifications.architecture}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#121222] border border-gray-200/80 dark:border-white/10">
                    <span className="block text-[10px] text-gray-500 dark:text-white/60 font-medium">
                      Standar Keamanan Siber:
                    </span>
                    <span className="block font-bold text-dark dark:text-white mt-0.5">
                      {activeModalProduct.specifications.security}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#121222] border border-gray-200/80 dark:border-white/10">
                    <span className="block text-[10px] text-gray-500 dark:text-white/60 font-medium">
                      Protokol & Integrasi:
                    </span>
                    <span className="block font-bold text-dark dark:text-white mt-0.5">
                      {activeModalProduct.specifications.integration}
                    </span>
                  </div>
                </div>
              </div>

              {/* Included Modules */}
              <div className="mt-6">
                <span className="block text-xs font-bold text-dark dark:text-white uppercase tracking-wider mb-2.5">
                  Daftar Modul Sistem yang Disertakan:
                </span>
                <div className="grid sm:grid-cols-2 gap-2">
                  {activeModalProduct.modules?.map((m: string) => (
                    <div
                      key={m}
                      className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-[#121222] border border-gray-200/80 dark:border-white/10 text-xs text-gray-800 dark:text-white/90"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target / Ideal Users */}
              <div className="mt-6 p-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <span className="block text-[11px] font-bold text-dark dark:text-white uppercase tracking-wider">
                  Target Pengguna Ideal:
                </span>
                <p className="mt-1 text-xs text-gray-700 dark:text-white/85">
                  {activeModalProduct.idealFor}
                </p>
              </div>

              {/* Modal Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-gray-600 dark:text-white/70">
                  Paket Termasuk: <strong>Instalasi, Pelatihan Operator, & Garansi Resmi</strong>
                </span>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveModalProduct(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-gray-700 dark:text-white text-xs font-semibold transition-all cursor-pointer"
                  >
                    Tutup
                  </button>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-md shadow-orange-600/20"
                  >
                    Minta Penawaran Resmi
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
