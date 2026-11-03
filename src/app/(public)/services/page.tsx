"use client";

import ServicePhoto from "@/components/ui/ServicePhoto";
import Link from "next/link";
import { consultationHref } from "@/lib/consultation";
import { Code2, ShieldCheck, CheckCircle2, Layers, Zap, Building2, Headphones, Check, Award, Briefcase, FileText, Clock, FileCheck, Boxes } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import GradientText from "@/components/ui/GradientText";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { useCitsStore } from "@/stores/citsStore";
import { getPillarIcon } from "@/lib/serviceIcons";
import { resolveServiceCatalog } from "@/lib/serviceCatalog";

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
    title: "Perencanaan Keamanan Sistem",
    description:
      "Kebutuhan pengamanan data, enkripsi, dan pengujian kerentanan dibahas sesuai ruang lingkup proyek.",
    icon: ShieldCheck,
  },
  {
    title: "Arsitektur Skalabel & Andal",
    description:
      "Arsitektur modular disesuaikan dengan kebutuhan transaksi, integrasi, dan kapasitas operasional.",
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
      "Waktu respons insiden disepakati dalam SLA",
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
  const { services: storeServices } = useCitsStore();

  const displayServices = resolveServiceCatalog(storeServices);

  return (
    <main
      id="main-content"
      className="min-h-screen bg-white dark:bg-dark text-slate-900 dark:text-white transition-colors"
    >
      <section
        aria-labelledby="services-hero-heading"
        className="relative py-12 md:py-20 overflow-hidden transition-colors border-b border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-[#0f172a]"
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <ScrollReveal>
              
              <h1
                id="services-hero-heading"
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.2]"
              >
                Solusi Terpadu Rekayasa <GradientText>Teknologi Informasi</GradientText> Enterprise
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="mt-5 text-slate-700 dark:text-slate-200 text-base md:text-lg leading-relaxed">
                Layanan pengembangan perangkat lunak, konsultasi TI, dan pengadaan infrastruktur untuk mendampingi
                kebutuhan teknologi instansi serta perusahaan Anda.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {displayServices.map((item) => {
                  const NavIcon = getPillarIcon(item.icon);
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#111827] text-slate-800 dark:text-white border border-slate-200 dark:border-white/15 hover:border-orange-500/60  text-xs font-semibold transition-all  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                    >
                      <NavIcon className="w-4 h-4 text-orange-600 dark:text-orange-400" aria-hidden="true" />
                      <span>{item.category}</span>
                    </a>
                  );
                })}
                <a
                  href="#alur-kerja"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-50 dark:bg-orange-500/15 text-orange-950 dark:text-orange-200 border border-orange-200/90 dark:border-orange-500/30 hover:bg-orange-100 dark:hover:bg-orange-500/25 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                >
                  <Zap className="w-4 h-4 text-orange-600 dark:text-orange-400" aria-hidden="true" />
                  <span>Alur Metodologi</span>
                </a>
                <a
                  href="#skema-kerjasama"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#111827] text-slate-800 dark:text-white border border-slate-200 dark:border-white/15 hover:border-orange-500/60  text-xs font-semibold transition-all  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                >
                  <Boxes className="w-4 h-4 text-slate-600 dark:text-slate-400" aria-hidden="true" />
                  <span>Skema Pengadaan PBJ</span>
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
      <section
        data-testid="service-details"
        aria-labelledby="services-detail-heading"
        className="py-16 md:py-24 bg-white dark:bg-[#111827] transition-colors border-b border-slate-200/80 dark:border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 md:space-y-28">
          <h2 id="services-detail-heading" className="sr-only">
            Detail Pilar Layanan CITS Indonesia
          </h2>

          {displayServices.map((service, i) => {
            const Icon = getPillarIcon(service.icon);
            const isReverse = i % 2 === 1;

            return (
              <div
                key={service.id}
                id={service.id}
                className="scroll-mt-28 grid lg:grid-cols-12 gap-10 lg:gap-12 items-stretch min-w-0 [overflow-wrap:anywhere]"
              >
                {/* Content Column (Span 7) */}
                <ScrollReveal
                  direction={isReverse ? "right" : "left"}
                  className={`min-w-0 lg:col-span-7 flex flex-col justify-between order-2 ${
                    isReverse ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center gap-2.5">
                      
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

                    {service.details && service.details !== service.description && (
                      <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0f172a] p-5">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Tentang Layanan Ini</h4>
                        <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-slate-700 dark:text-slate-200">
                          {service.details}
                        </p>
                      </div>
                    )}

                    {/* Features list */}
                    {service.features.length > 0 && (
                      <div className="p-6 rounded-xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 space-y-3">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white   mb-2">
                          Cakupan Solusi & Kemampuan Rekayasa
                        </h4>
                        <ul className="grid sm:grid-cols-2 gap-3 list-none p-0 m-0">
                          {service.features.map((feature) => (
                            <li
                              key={feature}
                              className="flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200 leading-normal"
                            >
                              <CheckCircle2
                                className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5"
                                aria-hidden="true"
                              />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {service.techStack.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300   mb-2.5">
                          Standar Teknologi & Kerangka Kerja
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {service.techStack.map((tech) => (
                            <span key={tech} className="text-xs leading-relaxed text-slate-600 dark:text-slate-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Case Studies / Implementasi Riil */}
                    {service.caseStudies.length > 0 && (
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
                    )}

                    {/* CTA Buttons */}
                    <div className="pt-2 flex flex-wrap gap-3">
                      <Link
                        href={consultationHref({ service: service.title, source: "services" })}
                        className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl transition-all   text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 bg-orange-700 hover:bg-orange-800"
                      >
                        <span>Konsultasikan Kebutuhan Ini</span>
                        
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
                  className={`min-w-0 lg:col-span-5 h-full order-1 ${isReverse ? "lg:order-1" : "lg:order-2"}`}
                >
                  <SpotlightCard className="h-full">
                    <div className="p-5 md:p-6 flex flex-col justify-between h-full space-y-5">
                      {/* Image container */}
                      <div className="relative rounded-xl overflow-hidden  border border-slate-200 dark:border-white/10 aspect-[16/10] bg-slate-100 dark:bg-slate-900">
                        <ServicePhoto
                          image={service.image}
                          name={service.title}
                          className="h-full transform hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      {service.deliverables.length > 0 && (
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0b1220] border border-slate-200 dark:border-white/10 space-y-3">
                          <div className="flex flex-wrap gap-2 items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2.5">
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
                      )}

                      {/* Service SLA Chip */}
                      <div className="p-3.5 rounded-xl bg-orange-50/80 dark:bg-orange-500/10 border border-orange-200/80 dark:border-orange-500/30 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg text-white flex items-center justify-center shrink-0   bg-orange-700">
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
      <section
        id="alur-kerja"
        aria-labelledby="workflow-heading"
        className="relative py-16 md:py-24 bg-slate-50 dark:bg-[#0f172a] border-b border-slate-200/80 dark:border-white/10 overflow-hidden transition-colors scroll-mt-20"
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-14">
              
              <h2
                id="workflow-heading"
                className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight"
              >
                Alur Kerja Rekayasa <GradientText>Sistematis</GradientText>
              </h2>
              <p className="mt-4 text-slate-700 dark:text-slate-200 text-base leading-relaxed">
                Lima tahapan berkesinambungan yang kami terapkan dalam memastikan setiap inisiatif proyek selesai tepat
                waktu, tepat fungsi, teruji aman, dan selaras regulasi.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 items-stretch">
            {workProcess.map((p, i) => {
              const isLastOnTablet = i === 4;
              
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
                          <span className="w-12 h-12 rounded-xl text-white font-extrabold text-lg flex items-center justify-center   shrink-0 bg-orange-700">
                            {p.step}
                          </span>
                          
                        </div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-base min-h-[44px] flex items-center">
                          {p.title}
                        </h3>
                        <span className="inline-block text-xs font-semibold text-orange-800 dark:text-orange-300 mt-1 mb-2 min-h-[20px]">
                          {p.subtitle}
                        </span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed min-h-[72px]">
                          {p.description}
                        </p>
                      </div>
                      
                    </article>
                  </SpotlightCard>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>
      <section
        aria-labelledby="quality-heading"
        className="py-16 md:py-24 bg-white dark:bg-[#111827] transition-colors border-b border-slate-200/80 dark:border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-14">
              
              <h2
                id="quality-heading"
                className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight"
              >
                Jaminan Standar Mutu <GradientText>Layanan CITS</GradientText>
              </h2>
              <p className="mt-4 text-slate-700 dark:text-slate-200 text-base leading-relaxed">
                Landasan kepatuhan dan keandalan yang menjadi komitmen kami pada setiap pengadaan dan rekayasa sistem
                informasi.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {qualityStandards.map((item, idx) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={item.title} delay={idx * 0.08} className="h-full">
                  <div className="p-6 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-white/10 hover:border-orange-500/40 transition-all  h-full flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-xl text-white flex items-center justify-center mb-4   shrink-0 bg-orange-700">
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
      <section
        id="skema-kerjasama"
        aria-labelledby="engagement-heading"
        className="py-16 md:py-24 bg-slate-50 dark:bg-[#0f172a] border-b border-slate-200/80 dark:border-white/10 transition-colors scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-14">
              
              <h2
                id="engagement-heading"
                className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight"
              >
                Model Kerjasama & <GradientText>Skema Pengadaan PBJ</GradientText>
              </h2>
              <p className="mt-4 text-slate-700 dark:text-slate-200 text-base leading-relaxed">
                Pilihan skema kemitraan yang fleksibel dan akuntabel, memudahkan Pejabat Pembuat Komitmen (PPK) dan
                manajemen korporasi dalam merealisasikan kebutuhan digital.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {engagementModels.map((model, idx) => {
              const IconModel = model.icon;
              return (
                <ScrollReveal key={model.title} delay={idx * 0.1} className="h-full">
                  <SpotlightCard className="h-full">
                    <div className="p-7 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl text-white flex items-center justify-center   shrink-0 bg-orange-700">
                            <IconModel className="w-6 h-6 text-white" aria-hidden="true" />
                          </div>
                          
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

                        {/* Recommendation */}
                        <div className="mt-5 p-3 rounded-xl bg-slate-50 dark:bg-[#0b1220] border border-slate-200 dark:border-white/10">
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
                          href={consultationHref({ service: model.title, source: "services" })}
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-700 hover:bg-orange-800 text-white font-semibold text-xs transition-colors  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                        >
                          <span>Diskusikan Skema Ini</span>
                          
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
      <section
        aria-labelledby="services-cta-heading"
        className="py-16 md:py-24 bg-white dark:bg-[#111827] transition-colors"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <div className="p-8 md:p-14 rounded-xl border border-orange-200/80 dark:border-orange-900/40  bg-slate-50 dark:bg-[#0f172a]">
              
              <h2
                id="services-cta-heading"
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug"
              >
                Punya Kebutuhan Khusus untuk Sistem Informasi Instansi Anda?
              </h2>
              <p className="mt-4 text-slate-700 dark:text-slate-200 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                Tim ahli CITS Indonesia siap membantu menganalisis kerangka acuan kerja (KAK), merancang arsitektur
                sistem SPBE, dan memberikan estimasi implementasi yang efisien serta tepat sasaran.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3.5">
                <Link
                  href={consultationHref({ source: "services" })}
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-white font-semibold rounded-xl transition-all     text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 bg-orange-700 hover:bg-orange-800"
                >
                  <span>Ajukan Diskusi Kebutuhan</span>
                  
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
                  <Building2 className="w-4 h-4 text-slate-700 dark:text-slate-400" aria-hidden="true" />
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
