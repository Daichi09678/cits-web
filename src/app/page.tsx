import Link from "next/link";
import {
  Lightbulb,
  Monitor,  
  Cog,
  ArrowRight,
  Truck,
  Database,
  Fingerprint,
  Shield,
  CheckCircle2,
  Terminal,
  Activity,
  FileText,
  ArrowUpRight,
  Sparkles,
  Package,
  Map,
} from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import Counter from "@/components/animations/Counter";
import ParticleNetwork from "@/components/animations/ParticleNetwork";
import FloatingShapes from "@/components/animations/FloatingShapes";
import TypewriterText from "@/components/animations/TypewriterText";
import SpotlightCard from "@/components/ui/SpotlightCard";
import HeroMockup from "@/components/ui/HeroMockup";
import GridPattern from "@/components/ui/GridPattern";
import GradientText from "@/components/ui/GradientText";
import Marquee from "@/components/ui/Marquee";

const highlights = [
  { label: "Tahun Berpengalaman", value: "19+" },
  { label: "Proyek Selesai", value: "50+" },
  { label: "Kementerian & Lembaga", value: "15+" },
  { label: "Tim Profesional", value: "30+" },
];

const clients = [
  { name: "Kementerian Dalam Negeri RI", logo: "/clients/kemendagri.svg", showLabel: true },
  { name: "Kementerian Kominfo RI", logo: "/clients/kominfo.png" },
  { name: "Kementerian Perhubungan RI", logo: "/clients/kemenhub.webp", showLabel: true },
  { name: "Kementerian ESDM RI", logo: "/clients/esdm.svg" },
  { name: "Kementerian Ketenagakerjaan RI", logo: "/clients/kemnaker.png" },
  { name: "Kementerian Investasi / BKPM", logo: "/clients/bkpm.webp" },
  { name: "Kementerian Kesehatan RI", logo: "/clients/kemenkes.webp" },
  { name: "Kementerian Perdagangan RI", logo: "/clients/perdagangan.png" },
  { name: "Kementerian Koperasi dan UKM RI", logo: "/clients/kemenkop.png" },
  { name: "Kementerian ATR/BPN", logo: "/clients/atr-bpn.webp", showLabel: true },
  { name: "PT Indonesia Power", logo: "/clients/indonesia-power.webp" },
  { name: "Mahkamah Agung RI", logo: "/clients/makamah-agung.png", showLabel: true },
  { name: "BPPT", logo: "/clients/bppt.png" },
  { name: "BRIN", logo: "/clients/brin.png" },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-[#1A1A2E] min-h-[92vh] flex items-center transition-colors">
        <ParticleNetwork />
        <FloatingShapes />
        <GridPattern />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Headline */}
            <div className="lg:col-span-7">
              <ScrollReveal>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/50 text-orange-800 dark:text-orange-300 text-sm font-semibold mb-6 shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-600 animate-pulse" />
                  <span>Penyedia Solusi Teknologi Informasi Sejak 2006</span>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-dark dark:text-white tracking-tight leading-[1.15]">
                  Ciptakan Solusi
                  <br />
                  <TypewriterText
                    words={[
                      "Sepenuh Hati",
                      "Tingkat Enterprise",
                      "Skala Nasional",
                      "Berbasis Inovasi",
                      "Terpercaya Sejak 2006",
                    ]}
                  />
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <p className="mt-6 text-base sm:text-lg text-gray-600 dark:text-white/90 leading-relaxed max-w-xl">
                  CITS Indonesia hadir sebagai mitra bisnis terpercaya dalam menyediakan solusi integral
                  kesistemanan berbasis teknologi informasi untuk instansi pemerintah, BUMN, dan korporasi.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <div className="mt-8 flex flex-wrap gap-4 items-center">
                  <Link
                    href="/contact"
                    className="group px-7 py-3.5 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-600/25 hover:shadow-xl hover:shadow-orange-600/35 flex items-center gap-2.5 text-sm"
                  >
                    Konsultasi Sekarang
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="/products"
                    className="px-7 py-3.5 border-2 border-gray-200 dark:border-white/20 hover:border-orange-600 dark:hover:border-orange-400 text-gray-700 dark:text-white hover:text-orange-700 dark:hover:text-orange-400 font-semibold rounded-xl transition-all bg-white/70 dark:bg-white/10 backdrop-blur-sm text-sm shadow-sm"
                  >
                    Eksplorasi Produk
                  </Link>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.4}>
                <div className="mt-10 pt-6 border-t border-gray-200/60 dark:border-white/10 flex items-center gap-6 text-xs text-gray-600 dark:text-white/80">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Terdaftar LPSE & SIKaP LKPP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Dukungan Tim Ahli 24/7</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Interactive Mockup */}
            <div className="lg:col-span-5">
              <ScrollReveal direction="right" delay={0.2}>
                <HeroMockup />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section - Foto 1 & 3: #1A1A2E Navy in Dark Mode with White Text */}
      <section className="relative py-20 bg-slate-50 dark:bg-[#151528] border-y border-gray-100 dark:border-white/10 overflow-hidden transition-colors">
        <ParticleNetwork className="opacity-45" />
        <FloatingShapes />
        <GridPattern className="opacity-60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {highlights.map((item) => (
              <div key={item.label} className="p-3">
                <Counter value={item.value} className="text-3xl sm:text-4xl md:text-5xl font-black text-orange-600 dark:text-orange-400 tracking-tight" />
                <p className="mt-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-white">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Bento Grid Section */}
      <section className="relative py-24 bg-white dark:bg-[#1A1A2E] overflow-hidden transition-colors">
        <ParticleNetwork className="opacity-35" />
        <FloatingShapes />
        <GridPattern className="opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/50 text-orange-800 dark:text-orange-300 text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                <span>Pilar Layanan Utama</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark dark:text-white">
                Layanan <GradientText>Unggulan Kami</GradientText>
              </h2>
              <p className="mt-4 text-gray-600 dark:text-white/85 text-sm md:text-base leading-relaxed">
                Kombinasi keahlian teknis tingkat enterprise dan tata kelola berstandar industri dengan prinsip FOCUS.
              </p>
            </div>
          </ScrollReveal>

          {/* Bento Grid Layanan */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Bento Card 1: Software House (Span 2) */}
            <ScrollReveal className="md:col-span-2">
              <SpotlightCard className="h-full">
                <div className="p-8 md:p-10 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-600/20">
                        <Cog className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-xs font-bold text-orange-900 dark:text-orange-300 bg-orange-100 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-800/60 px-3 py-1.5 rounded-full uppercase tracking-wider">
                        Pilar Utama Pengembangan
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-dark dark:text-white">Pengembangan Perangkat Lunak (Software House)</h3>
                    <p className="mt-3 text-gray-700 dark:text-white/85 text-sm md:text-base leading-relaxed max-w-xl">
                      Pengembangan aplikasi custom skala enterprise dari tahap perancangan arsitektur, rekayasa kode, integrasi REST API & Microservices, hingga peluncuran sistem digital yang tangguh.
                    </p>

                    {/* Interactive Architecture Mockup */}
                    <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-[#121222] border border-gray-200 dark:border-white/10 font-mono text-xs text-gray-800 dark:text-white space-y-2.5">
                      <div className="flex items-center justify-between text-gray-700 dark:text-white/70 border-b border-gray-200/80 dark:border-white/10 pb-2">
                        <span className="flex items-center gap-2 text-dark dark:text-white font-medium">
                          <Terminal className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                          <span>Alur Arsitektur Rekayasa Sistem</span>
                        </span>
                        <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-sans font-semibold bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200/70 dark:border-emerald-800/50 px-2 py-0.5 rounded">
                          Pengiriman Berkelanjutan
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 pt-1 font-sans text-xs">
                        <span className="px-2.5 py-1 rounded-md bg-white dark:bg-[#1a1a32] border border-gray-200 dark:border-white/15 text-gray-800 dark:text-white font-medium shadow-sm">
                          Aplikasi Web & Mobile
                        </span>
                        <span className="text-orange-700 dark:text-orange-400 font-bold">→</span>
                        <span className="px-2.5 py-1 rounded-md bg-white dark:bg-[#1a1a32] border border-gray-200 dark:border-white/15 text-gray-800 dark:text-white font-medium shadow-sm">
                          REST API & Microservices
                        </span>
                        <span className="text-orange-700 dark:text-orange-400 font-bold">→</span>
                        <span className="px-2.5 py-1 rounded-md bg-white dark:bg-[#1a1a32] border border-gray-200 dark:border-white/15 text-gray-800 dark:text-white font-medium shadow-sm">
                          Basis Data PostgreSQL / Oracle
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2 text-xs">
                      {["Aplikasi Web", "Aplikasi Mobile", "Integrasi Sistem", "Pengembangan API", "Pemeliharaan Berkala"].map((tech) => (
                        <span key={tech} className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white font-medium border border-gray-200/60 dark:border-white/10">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <Link
                      href="/services#software-house"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-700 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 transition-colors group"
                    >
                      Pelajari Selengkapnya
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </SpotlightCard>
            </ScrollReveal>

            {/* Bento Card 2: IT Consultant (Span 1) */}
            <ScrollReveal delay={0.15}>
              <SpotlightCard className="h-full">
                <div className="p-8 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-600/20">
                        <Lightbulb className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-xs font-bold text-orange-900 dark:text-orange-300 bg-orange-100 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-800/60 px-3 py-1.5 rounded-full uppercase tracking-wider">
                        Konsultasi Strategis
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-dark dark:text-white">Konsultan Teknologi Informasi</h3>
                    <p className="mt-3 text-gray-700 dark:text-white/85 text-sm leading-relaxed">
                      Layanan konsultasi TI strategis untuk membantu organisasi merencanakan, merancang arsitektur, dan memformulasikan cetak biru digital yang tepat guna.
                    </p>

                    <ul className="mt-6 space-y-2.5 text-xs text-gray-700 dark:text-white/90">
                      {[
                        "Analisis kebutuhan sistem informasi",
                        "Perencanaan arsitektur TI enterprise",
                        "Audit infrastruktur & keamanan teknologi",
                        "Rekomendasi solusi & peta jalan digital",
                        "Pendampingan implementasi kesistemanan",
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/10">
                    <Link
                      href="/services#it-consultant"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-700 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 transition-colors group"
                    >
                      Detail Konsultasi
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </SpotlightCard>
            </ScrollReveal>

            {/* Bento Card 3: IT Supplier (Span 1) */}
            <ScrollReveal delay={0.2}>
              <SpotlightCard className="h-full">
                <div className="p-8 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-600/20">
                        <Monitor className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-xs font-bold text-orange-900 dark:text-orange-300 bg-orange-100 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-800/60 px-3 py-1.5 rounded-full uppercase tracking-wider">
                        Perangkat Keras & Jaringan
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-dark dark:text-white">Pengadaan Perangkat TI (IT Supplier)</h3>
                    <p className="mt-3 text-gray-700 dark:text-white/85 text-sm leading-relaxed">
                      Penyediaan perangkat keras dan perangkat lunak berkualitas tinggi dari vendor terpercaya dengan garansi resmi dan dukungan teknis terpadu.
                    </p>

                    <ul className="mt-6 space-y-2.5 text-xs text-gray-700 dark:text-white/90">
                      {[
                        "Perangkat server & infrastruktur jaringan",
                        "Komputer desktop, laptop & periferal kerja",
                        "Lisensi & langganan software resmi",
                        "Instalasi, konfigurasi & pengujian perangkat",
                        "Layanan purna jual & pemeliharaan berkala",
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/10">
                    <Link
                      href="/services#it-supplier"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-700 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 transition-colors group"
                    >
                      Katalog Pengadaan
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </SpotlightCard>
            </ScrollReveal>

            {/* Bento Card 4: Prinsip Kerja FOCUS (Span 2) */}
            <ScrollReveal delay={0.25} className="md:col-span-2">
              <SpotlightCard className="h-full">
                <div className="p-8 md:p-10 flex flex-col justify-between h-full bg-white dark:bg-[#16162c] text-dark dark:text-white">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold text-orange-700 dark:text-orange-400 uppercase tracking-widest">
                        // Budaya Kerja & SLA
                      </span>
                      <span className="text-xs bg-orange-100 dark:bg-orange-950/60 text-orange-900 dark:text-orange-300 border border-orange-200/80 dark:border-orange-800/60 px-3 py-1 rounded-full font-bold">
                        Standar Mutu CITS
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-dark dark:text-white">Prinsip Kerja FOCUS</h3>
                    <p className="mt-2 text-gray-700 dark:text-white/85 text-sm md:text-base leading-relaxed max-w-xl">
                      Setiap tahapan kolaborasi kami berakar pada 5 pilar keunggulan operasional:
                    </p>

                    {/* FOCUS Pill Row */}
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {[
                        { letter: "F", word: "Focus", desc: "Kebutuhan klien" },
                        { letter: "O", word: "On Time", desc: "Tepat waktu" },
                        { letter: "C", word: "Customer", desc: "Kepuasan pelanggan" },
                        { letter: "U", word: "Update", desc: "Teknologi terkini" },
                        { letter: "S", word: "Synergy", desc: "Sinergi tim maksimal" },
                      ].map((item) => (
                        <div
                          key={item.word}
                          className="p-3 rounded-xl bg-orange-50/70 dark:bg-[#121222] border border-orange-200/70 dark:border-white/10 hover:border-orange-500/40 text-center transition-all"
                        >
                          <span className="text-xl font-black text-orange-700 dark:text-orange-400 block">{item.letter}</span>
                          <span className="text-xs font-bold text-dark dark:text-white block mt-0.5">{item.word}</span>
                          <span className="text-[11px] text-gray-700 dark:text-white/80 block mt-1">{item.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
                    <p className="text-xs text-gray-700 dark:text-white/80">Terpercaya menangani sistem kementerian sejak 2006</p>
                    <Link
                      href="/about"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-700 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 transition-colors group"
                    >
                      Kenali CITS Lebih Dekat
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </SpotlightCard>
            </ScrollReveal>
          </div>

          {/* Bottom Bar to Full Services Page */}
          <ScrollReveal delay={0.25}>
            <div className="text-center mt-12">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl border border-gray-200 dark:border-white/20 hover:border-orange-600 dark:hover:border-orange-400 bg-white/80 dark:bg-[#121222]/80 text-gray-800 dark:text-white hover:text-orange-700 dark:hover:text-orange-400 text-sm font-semibold transition-all shadow-sm"
              >
                Lihat Alur Kerja & Spesifikasi Lengkap Layanan
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Featured Products Bento Grid Section */}
      <section className="py-24 bg-slate-50/70 dark:bg-[#151528]/80 relative overflow-hidden transition-colors">
        <ParticleNetwork className="opacity-35" />
        <FloatingShapes />
        <GridPattern className="opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/50 text-orange-800 dark:text-orange-300 text-xs font-semibold mb-4">
                <Shield className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                <span>Solusi Skala Nasional</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark dark:text-white">
                Produk <GradientText>Unggulan CITS</GradientText>
              </h2>
              <p className="mt-4 text-gray-700 dark:text-white/85 text-sm md:text-base leading-relaxed">
                Platform kesistemanan yang telah teruji melayani jutaan transaksi data di berbagai kementerian dan institusi nasional.
              </p>
            </div>
          </ScrollReveal>

          {/* Products Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Product 1: Vehicle Tracking System (Span 2) */}
            <ScrollReveal className="md:col-span-2">
              <SpotlightCard className="h-full">
                <div className="p-8 md:p-10 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-600/20">
                        <Truck className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-xs font-bold text-orange-900 dark:text-orange-300 bg-orange-100 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-800/60 px-3 py-1.5 rounded-full uppercase tracking-wider">
                        IoT & Telemetri Armada
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-dark dark:text-white">CITS FleetTrack™ - Manajemen Armada & Telemetri</h3>
                    <p className="mt-3 text-gray-700 dark:text-white/85 text-sm md:text-base leading-relaxed max-w-xl">
                      Platform pelacakan armada kendaraan waktu nyata untuk optimalisasi logistik dan pemantauan operasional. Dilengkapi monitoring lokasi presisi, efisiensi bahan bakar, dan mitigasi risiko armada.
                    </p>

                    {/* Features Grid */}
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      {[
                        { title: "GPS Waktu Nyata", desc: "Akurasi pelacakan tinggi" },
                        { title: "Geofencing", desc: "Batas perimeter otomatis" },
                        { title: "Riwayat Rute", desc: "Rekam jejak perjalanan" },
                        { title: "Peringatan Darurat", desc: "Notifikasi insiden instan" },
                      ].map((item) => (
                        <div key={item.title} className="p-3 rounded-xl bg-slate-50 dark:bg-[#121222] border border-gray-200 dark:border-white/10">
                          <span className="font-bold text-dark dark:text-white block">{item.title}</span>
                          <span className="text-[11px] text-gray-700 dark:text-white/80 block mt-0.5">{item.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2 text-xs">
                      {["GPS Waktu Nyata", "Geofencing", "Riwayat Rute", "Sistem Peringatan", "Manajemen Armada"].map((tag) => (
                        <span key={tag} className="text-xs bg-orange-50 dark:bg-orange-950/40 text-orange-900 dark:text-orange-300 border border-orange-200/80 dark:border-orange-800/60 font-semibold px-2.5 py-1 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      href="/products#cits-fleettrack"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-700 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 transition-colors group"
                    >
                      Jelajahi Produk
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </SpotlightCard>
            </ScrollReveal>

            {/* Product 2: CITS AssetHub (Span 1) */}
            <ScrollReveal delay={0.15}>
              <SpotlightCard className="h-full">
                <div className="p-8 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-600/20">
                        <Package className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-xs font-bold text-orange-900 dark:text-orange-300 bg-orange-100 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-800/60 px-3 py-1.5 rounded-full uppercase tracking-wider">
                        Manajemen Aset Perusahaan
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-dark dark:text-white">CITS AssetHub™ - Tata Kelola Aset Terpadu</h3>
                    <p className="mt-3 text-gray-700 dark:text-white/85 text-sm leading-relaxed">
                      Sistem pengelolaan aset perusahaan secara terintegrasi dari pengadaan, penempatan, kalkulasi depresiasi nilai, hingga penghapusan aset siap audit.
                    </p>

                    <ul className="mt-6 space-y-2.5 text-xs text-gray-700 dark:text-white/90">
                      {[
                        "Pengelolaan siklus hidup aset lengkap",
                        "Pemindaian kode QR & Barcode presisi",
                        "Kalkulasi penyusutan nilai otomatis",
                        "Pelaporan komprehensif & siap audit",
                      ].map((feat) => (
                        <li key={feat} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/10">
                    <Link
                      href="/products#cits-assethub"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-700 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 transition-colors group"
                    >
                      Detail Manajemen Aset
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </SpotlightCard>
            </ScrollReveal>

            {/* Product 3: CITS DocuVault (Span 1) */}
            <ScrollReveal delay={0.2}>
              <SpotlightCard className="h-full">
                <div className="p-8 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-600/20">
                        <FileText className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-xs font-bold text-orange-900 dark:text-orange-300 bg-orange-100 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-800/60 px-3 py-1.5 rounded-full uppercase tracking-wider">
                        Arsip Digital & Dokumen
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-dark dark:text-white">CITS DocuVault™ - Tata Kelola Arsip & EDMS</h3>
                    <p className="mt-3 text-gray-700 dark:text-white/85 text-sm leading-relaxed">
                      Sistem digitalisasi dan pengarsipan elektronik untuk mengorganisir, mengamankan, dan mendistribusikan dokumen resmi dengan kontrol versi dan TTE.
                    </p>

                    <ul className="mt-6 space-y-2.5 text-xs text-gray-700 dark:text-white/90">
                      {[
                        "Kontrol versi & manajemen hak akses",
                        "Pencarian teks lengkap OCR & barcode",
                        "Klasifikasi dinamis & jejak audit digital",
                        "Cadangan otomatis & enkripsi AES-256",
                      ].map((feat) => (
                        <li key={feat} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/10">
                    <Link
                      href="/products#cits-docuvault"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-700 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 transition-colors group"
                    >
                      Detail Dokumen Digital
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </SpotlightCard>
            </ScrollReveal>

            {/* Product 4: CITS GeoSpatial & Ekosistem Produk CITS (Span 2) */}
            <ScrollReveal delay={0.25} className="md:col-span-2">
              <SpotlightCard className="h-full">
                <div className="p-8 md:p-10 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-600/20">
                        <Map className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-xs font-bold text-orange-900 dark:text-orange-300 bg-orange-100 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-800/60 px-3 py-1.5 rounded-full uppercase tracking-wider">
                        SIG & Ekosistem Produk Terintegrasi
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-dark dark:text-white">CITS GeoSpatial™ & Rangkaian Platform Enterprise</h3>
                    <p className="mt-3 text-gray-700 dark:text-white/85 text-sm md:text-base leading-relaxed max-w-xl">
                      Platform informasi geografis untuk pemetaan infrastruktur dan analisis spasial, dilengkapi rangkaian solusi perangkat lunak teruji CITS lainnya:
                    </p>

                    {/* 4 Additional Products from products/page.tsx */}
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#121222] border border-gray-200 dark:border-white/10">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-orange-600 dark:bg-orange-400" />
                          <span className="font-bold text-dark dark:text-white text-sm">CITS GeoSpatial™</span>
                        </div>
                        <p className="mt-1 text-gray-700 dark:text-white/80 text-[11px] leading-relaxed">
                          Peta interaktif multi-layer, analisis spasial wilayah & monitoring infrastruktur utilitas.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#121222] border border-gray-200 dark:border-white/10">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-orange-600 dark:bg-orange-400" />
                          <span className="font-bold text-dark dark:text-white text-sm">CITS Omnichannel Gateway™</span>
                        </div>
                        <p className="mt-1 text-gray-700 dark:text-white/80 text-[11px] leading-relaxed">
                          Pengiriman pesan massal WhatsApp API & SMS OTP dengan throughput tinggi dan fallback otomatis.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#121222] border border-gray-200 dark:border-white/10">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-orange-600 dark:bg-orange-400" />
                          <span className="font-bold text-dark dark:text-white text-sm">CITS SmartGov Portal™</span>
                        </div>
                        <p className="mt-1 text-gray-700 dark:text-white/80 text-[11px] leading-relaxed">
                          Portal pelayanan publik satu pintu, pelacakan permohonan berkas & gerbang retribusi SPBE.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#121222] border border-gray-200 dark:border-white/10">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-orange-600 dark:bg-orange-400" />
                          <span className="font-bold text-dark dark:text-white text-sm">CITS Executive BI™</span>
                        </div>
                        <p className="mt-1 text-gray-700 dark:text-white/80 text-[11px] leading-relaxed">
                          Dasbor analitik eksekutif real-time, agregasi multi-database & perumusan keputusan pimpinan.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2 text-xs">
                      {["CITS FleetTrack", "CITS AssetHub", "CITS DocuVault", "CITS GeoSpatial", "CITS Omnichannel", "CITS SmartGov"].map((tag) => (
                        <span key={tag} className="text-xs bg-orange-50 dark:bg-orange-950/40 text-orange-900 dark:text-orange-300 border border-orange-200/80 dark:border-orange-800/60 font-semibold px-2.5 py-1 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-700 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 transition-colors group"
                    >
                      Lihat Semua 8 Produk
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </SpotlightCard>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.35}>
            <div className="text-center mt-14">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl border border-gray-200 dark:border-white/20 hover:border-orange-600 dark:hover:border-orange-400 bg-white/80 dark:bg-[#121222]/80 text-gray-800 dark:text-white hover:text-orange-700 dark:hover:text-orange-400 text-sm font-semibold transition-all shadow-sm"
              >
                Eksplorasi Semua 8 Solusi Produk
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Client Logos Marquee */}
      <section className="py-16 bg-white dark:bg-[#1A1A2E] border-t border-gray-100 dark:border-white/10 relative overflow-hidden transition-colors">
        <GridPattern className="opacity-40" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="text-center text-xs md:text-sm text-gray-700 dark:text-white/90 uppercase tracking-widest mb-8 font-semibold">
              Dipercaya oleh Kementerian, BUMN, dan Lembaga Nasional
            </p>
          </ScrollReveal>
          <Marquee items={clients} speed={45} />
        </div>
      </section>

      {/* CTA Section - Foto 5: #151528 Dark Navy with White Text & Orange Buttons */}
      <section className="relative py-24 bg-slate-50 dark:bg-[#151528] border-t border-gray-200/70 dark:border-white/10 overflow-hidden transition-colors">
        <ParticleNetwork className="opacity-45" />
        <FloatingShapes />
        <GridPattern className="opacity-60" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-900 dark:text-orange-300 border border-orange-200/70 dark:border-orange-800/50 text-xs font-semibold mb-6 shadow-sm">
              <Activity className="w-3.5 h-3.5 text-orange-700 dark:text-orange-400" />
              <span>Mitra Transformasi Digital Terpercaya</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-dark dark:text-white tracking-tight leading-tight">
              Siap Mengakselerasi Sistem Informasi Perusahaan Anda?
            </h2>
            <p className="mt-5 text-gray-700 dark:text-white/85 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Konsultasikan kebutuhan IT, rekayasa software custom, atau pengadaan infrastruktur Anda dengan tim profesional CITS Indonesia.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-600/25 hover:shadow-xl hover:shadow-orange-600/35 text-sm"
              >
                Mulai Konsultasi Gratis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-white/10 hover:bg-gray-50 dark:hover:bg-white/15 text-gray-800 dark:text-white font-bold rounded-xl transition-all border border-gray-200 dark:border-white/20 text-sm shadow-sm"
              >
                Pelajari Profil Perusahaan
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
