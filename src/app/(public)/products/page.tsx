"use client";

import { useState } from "react";
import Link from "next/link";
import ProductPhoto from "@/components/ui/ProductPhoto";
import { consultationHref } from "@/lib/consultation";
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
  Layers,
  Cpu,
  ArrowRight,
  ChevronRight,
  Award,
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import type { ProductItem } from "@/types/schema";
import ProductDetailsDialog from "@/components/ui/ProductDetailsDialog";
import ScrollReveal from "@/components/animations/ScrollReveal";
import GradientText from "@/components/ui/GradientText";
import GridPattern from "@/components/ui/GridPattern";
import FloatingShapes from "@/components/animations/FloatingShapes";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { useCitsStore } from "@/stores/citsStore";

const iconMap: Record<string, LucideIcon> = {
  Truck,
  Package,
  FileText,
  Map,
  MessageSquare,
  Globe,
  Smartphone,
  BarChart3,
};

function getProductIcon(icon: string): LucideIcon {
  return iconMap[icon] || Package;
}

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
  const { activeProducts } = useCitsStore();
  const categories = ["Semua Produk", ...new Set(activeProducts.map((product) => product.category))];
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua Produk");
  const [selectedModalProduct, setActiveModalProduct] = useState<ProductItem | null>(null);
  const activeModalProduct = activeProducts.find((product) => product.id === selectedModalProduct?.id);
  const effectiveCategory = categories.includes(selectedCategory) ? selectedCategory : "Semua Produk";

  const filteredProducts =
    effectiveCategory === "Semua Produk"
      ? activeProducts
      : activeProducts.filter((p) => p.category === effectiveCategory);

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
              Rangkaian platform perangkat lunak siap pakai dan dapat dikustomisasi, dirancang dengan arsitektur
              enterprise modular, kepatuhan tata kelola SPBE, dan keamanan siber tinggi untuk mempercepat digitalisasi
              organisasi Anda.
            </p>
          </ScrollReveal>

          {/* Interactive Filter Pills */}
          <ScrollReveal delay={0.3}>
            <div
              className="mt-12 flex flex-wrap justify-center gap-2"
              role="tablist"
              aria-label="Filter Kategori Produk"
            >
              {categories.map((cat) => {
                const isActive = effectiveCategory === cat;
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

          {filteredProducts.length === 0 && (
            <p role="status" className="text-center text-gray-700 dark:text-white/80 py-10">
              Belum ada produk aktif pada kategori ini.
            </p>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch" data-testid="product-catalog">
            {filteredProducts.map((product, i) => {
              const Icon = getProductIcon(product.icon);

              return (
                <ScrollReveal key={product.id} delay={(i % 3) * 0.08} className="h-full">
                  <div id={product.id} className="h-full scroll-mt-28">
                    <SpotlightCard className="h-full">
                      <article
                        data-product-id={product.id}
                        className="p-6 sm:p-7 flex flex-col justify-between h-full bg-white dark:bg-[#16162c] space-y-6"
                      >
                        <div>
                          {/* Product Image Banner if available */}
                          <div className="relative w-full h-44 -mt-1 mb-4 rounded-2xl overflow-hidden bg-slate-100 dark:bg-white/5">
                            <ProductPhoto
                              image={product.image}
                              name={product.name}
                              className="h-full group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>

                          {/* Icon & Product Name */}
                          <div className="flex items-center gap-3.5 mb-3">
                            <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-800/60 flex items-center justify-center text-orange-700 dark:text-orange-400 shadow-sm shrink-0">
                              <Icon className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="text-xl font-extrabold text-dark dark:text-white tracking-tight leading-tight">
                                {product.name}
                              </h3>
                            </div>
                          </div>

                          {/* Tagline & Business Overview */}
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

                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {product.tags.map((tag) => (
                              <span
                                key={tag}
                                className="max-w-full break-words rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200"
                              >
                                {tag}
                              </span>
                            ))}
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
                            href={consultationHref({ productId: product.id, purpose: "demo", source: "products" })}
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
              <h2 id="licensing-heading" className="text-3xl md:text-4xl font-extrabold text-dark dark:text-white">
                Model Penerapan & Lisensi <GradientText>Fleksibel</GradientText>
              </h2>
              <p className="mt-4 text-gray-700 dark:text-white/85 text-base leading-relaxed">
                Pilih model deployment dan skema kepemilikan yang paling selaras dengan kebijakan tata kelola teknologi
                dan anggaran instansi Anda.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {licensingModels.map((item, idx) => (
              <ScrollReveal key={item.title} delay={idx * 0.12} className="h-full">
                <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#16162c] border border-gray-200 dark:border-white/10 hover:border-orange-500/40 transition-all shadow-sm h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-extrabold text-dark dark:text-white">{item.title}</h3>
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
                      href={consultationHref({ service: `Konsultasi Produk: ${item.title}`, source: "products" })}
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
              <h2 id="advantages-heading" className="text-3xl md:text-4xl font-extrabold text-dark dark:text-white">
                Mengapa Memilih Platform Produk <GradientText>CITS Indonesia?</GradientText>
              </h2>
              <p className="mt-4 text-gray-700 dark:text-white/85 text-base leading-relaxed">
                Kami membangun produk perangkat lunak dengan rekayasa mandiri yang mengutamakan keberlanjutan pemakaian,
                kemudahan integrasi, dan kepatuhan hukum jangka panjang.
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
                      <h3 className="font-bold text-dark dark:text-white text-base">{adv.title}</h3>
                      <p className="mt-2 text-xs md:text-sm text-gray-700 dark:text-white/80 leading-relaxed">
                        {adv.description}
                      </p>
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
              <h2
                id="products-cta-heading"
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-dark dark:text-white tracking-tight"
              >
                Ingin Melihat Demo Langsung atau Menyesuaikan Modul Produk?
              </h2>
              <p className="mt-4 text-gray-700 dark:text-white/85 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                Jadwalkan sesi demonstrasi langsung bersama konsultan teknis CITS Indonesia. Kami siap mempresentasikan
                kapabilitas platform dan mendiskusikan integrasi dengan sistem Anda.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href={consultationHref({ purpose: "demo", source: "products" })}
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

      {activeModalProduct && (
        <ProductDetailsDialog
          key={activeModalProduct.id}
          product={activeModalProduct}
          onClose={() => setActiveModalProduct(null)}
        />
      )}
    </main>
  );
}
