"use client";

import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  Building2,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  MessageSquare,
  HelpCircle,
  Check,
  User,
  Copy,
  CheckCheck,
  ChevronDown,
} from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import GradientText from "@/components/ui/GradientText";
import GridPattern from "@/components/ui/GridPattern";
import FloatingShapes from "@/components/animations/FloatingShapes";
import SpotlightCard from "@/components/ui/SpotlightCard";
import CustomSelect from "@/components/ui/CustomSelect";

const serviceOptions = [
  "Pengembangan Perangkat Lunak (Software House)",
  "Konsultan Teknologi Informasi & SPBE",
  "Pengadaan Perangkat TI & Infrastruktur (IT Supplier)",
  "Solusi Produk Siap Pakai (Tracking, Aset, SIG, dsb.)",
  "Dukungan Pemeliharaan & Supervisi Sistem",
  "Kemitraan Strategis / Kebutuhan Lainnya",
];

const faqs = [
  {
    question: "Bagaimana tahapan awal konsultasi proyek dengan CITS?",
    answer:
      "Setelah Anda mengirimkan formulir kebutuhan atau menghubungi kami, tim analis CITS akan menjadwalkan sesi diskusi awal (daring atau luring) dalam 1x24 jam kerja untuk memetakan ruang lingkup, estimasi waktu, dan arsitektur solusi.",
  },
  {
    question: "Apakah CITS terdaftar resmi dalam pengadaan pemerintah?",
    answer:
      "Ya. CITS Indonesia adalah badan usaha legal yang telah berpengalaman sejak 2006, terdaftar di sistem LPSE, SIKaP LKPP, memiliki Nomor Induk Berusaha (NIB) resmi, serta NPWP dan SIUP aktif.",
  },
  {
    question: "Apakah sistem yang dibangun selaras dengan regulasi SPBE?",
    answer:
      "Tentu. Seluruh arsitektur perangkat lunak dan integrasi data yang kami kembangkan mematuhi kerangka kerja Sistem Pemerintahan Berbasis Elektronik (SPBE), Satu Data Indonesia, dan standar keamanan data nasional.",
  },
  {
    question: "Apakah data dan dokumen kebutuhan instansi dijamin kerahasiaannya?",
    answer:
      "Kami menerapkan standar kerahasiaan ketat. CITS siap menandatangani Non-Disclosure Agreement (NDA) resmi sebelum dokumen teknis, Kerangka Acuan Kerja (KAK), atau data institusi Anda dibagikan.",
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <main id="main-content" className="min-h-screen">
      {/* 1. HERO SECTION (Clean, WCAG compliant, No breadcrumbs, No black border line) */}
      <section
        aria-labelledby="contact-hero-heading"
        className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-dark dark:to-slate-950 py-14 md:py-22 overflow-hidden transition-colors"
      >
        <FloatingShapes />
        <GridPattern className="opacity-100" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-900 dark:text-orange-300 border border-orange-200/80 dark:border-orange-800/60 text-xs font-bold tracking-wide uppercase shadow-sm mb-4">
              <Sparkles className="w-3.5 h-3.5 text-orange-700 dark:text-orange-400" />
              <span>Saluran Komunikasi & Konsultasi Resmi</span>
            </div>

            <h1
              id="contact-hero-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-dark dark:text-white tracking-tight leading-[1.2]"
            >
              Konsultasikan Kebutuhan TI dengan <GradientText>Tim Ahli CITS</GradientText>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="mt-5 text-gray-700 dark:text-white/85 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              Kami siap mendampingi kementerian, lembaga tinggi negara, BUMN, dan korporasi dalam merumuskan arsitektur sistem digital yang andal, aman, dan berdaya guna jangka panjang.
            </p>
          </ScrollReveal>

          {/* Quick Credential Highlights */}
          <ScrollReveal delay={0.2}>
            <div className="mt-8 flex flex-wrap justify-center gap-2.5 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/10 text-gray-800 dark:text-white font-semibold border border-gray-200 dark:border-white/15">
                <Clock className="w-4 h-4 text-orange-700 dark:text-orange-400" />
                Respon Cepat 1x24 Jam Kerja
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/10 text-gray-800 dark:text-white font-semibold border border-gray-200 dark:border-white/15">
                <Building2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                Terdaftar Resmi LPSE & SIKaP LKPP
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/10 text-gray-800 dark:text-white font-semibold border border-gray-200 dark:border-white/15">
                <ShieldCheck className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                Jaminan Kerahasiaan Data (NDA)
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. CONTACT DETAILS & FORM BENTO (Perfect Symmetry & Visual Polish) */}
      <section
        aria-labelledby="contact-form-heading"
        className="py-16 md:py-24 bg-white dark:bg-[#1A1A2E] transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="contact-form-heading" className="sr-only">
            Formulir Kontak dan Lokasi Kantor CITS Indonesia
          </h2>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left Column: Office Info & Direct Channels (Span 5) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <ScrollReveal>
                <div>
                  <span className="text-xs font-bold text-orange-900 dark:text-orange-300 bg-orange-100 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-800/60 px-3 py-1 rounded-full uppercase tracking-wider">
                    Kantor & Saluran Resmi
                  </span>
                  <h3 className="mt-3 text-2xl md:text-3xl font-extrabold text-dark dark:text-white">
                    Hubungi Kantor CITS
                  </h3>
                  <p className="mt-2 text-xs md:text-sm text-gray-700 dark:text-white/85 leading-relaxed">
                    Kunjungi kantor operasional kami atau hubungi saluran resmi berikut untuk penjadwalan audiensi dan konsultasi teknis.
                  </p>
                </div>
              </ScrollReveal>

              <div className="space-y-3.5 flex-1 flex flex-col justify-between">
                {/* Address Card */}
                <ScrollReveal delay={0.1}>
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#16162c] border border-gray-200 dark:border-white/10 flex items-start gap-4 hover:border-orange-500/40 transition-all shadow-sm">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-800/60 flex items-center justify-center text-orange-700 dark:text-orange-400 shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-dark dark:text-white text-sm">
                        Alamat Kantor Operasional
                      </h4>
                      <p className="mt-1 text-xs md:text-sm text-gray-700 dark:text-white/85 leading-relaxed">
                        Gedung Wisma Mampang, Lantai 5<br />
                        Jl. Mampang Prapatan No. 1<br />
                        Jakarta Selatan 12790, DKI Jakarta
                      </p>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Phone Card with Click-to-Call & Copy button */}
                <ScrollReveal delay={0.15}>
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#16162c] border border-gray-200 dark:border-white/10 flex items-start gap-4 hover:border-orange-500/40 transition-all shadow-sm">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-800/60 flex items-center justify-center text-orange-700 dark:text-orange-400 shrink-0 mt-0.5">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-dark dark:text-white text-sm">
                          Telepon Kantor
                        </h4>
                        <button
                          type="button"
                          onClick={() => handleCopy("02139719677", "phone")}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-800 dark:text-orange-300 hover:text-orange-900 bg-orange-100/70 dark:bg-orange-950/50 px-2 py-0.5 rounded transition-colors"
                          title="Salin nomor telepon"
                        >
                          {copiedKey === "phone" ? (
                            <>
                              <CheckCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                              <span>Tersalin</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Salin</span>
                            </>
                          )}
                        </button>
                      </div>
                      <a
                        href="tel:02139719677"
                        className="mt-1 inline-block text-xs md:text-sm text-orange-700 dark:text-orange-400 font-bold hover:underline"
                      >
                        (021) 39719677
                      </a>
                      <span className="block mt-0.5 text-[11px] text-gray-700 dark:text-white/70">
                        Senin – Jumat (08.30 – 17.30 WIB)
                      </span>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Email Card with Click-to-Mail & Copy button */}
                <ScrollReveal delay={0.2}>
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#16162c] border border-gray-200 dark:border-white/10 flex items-start gap-4 hover:border-orange-500/40 transition-all shadow-sm">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-800/60 flex items-center justify-center text-orange-700 dark:text-orange-400 shrink-0 mt-0.5">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-dark dark:text-white text-sm">
                          Email Korespondensi Resmi
                        </h4>
                        <button
                          type="button"
                          onClick={() => handleCopy("info@citsindonesia.co.id", "email")}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-800 dark:text-orange-300 hover:text-orange-900 bg-orange-100/70 dark:bg-orange-950/50 px-2 py-0.5 rounded transition-colors"
                          title="Salin alamat email"
                        >
                          {copiedKey === "email" ? (
                            <>
                              <CheckCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                              <span>Tersalin</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Salin</span>
                            </>
                          )}
                        </button>
                      </div>
                      <a
                        href="mailto:info@citsindonesia.co.id"
                        className="mt-1 inline-block text-xs md:text-sm text-orange-700 dark:text-orange-400 font-bold hover:underline break-all"
                      >
                        info@citsindonesia.co.id
                      </a>
                      <span className="block mt-0.5 text-[11px] text-gray-700 dark:text-white/70">
                        Untuk penawaran, KAK, dan surat dinas
                      </span>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Interactive Google Maps Card */}
                <ScrollReveal delay={0.25}>
                  <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-sm bg-slate-100 dark:bg-slate-900">
                    <div className="p-3 bg-slate-50 dark:bg-[#16162c] border-b border-gray-200 dark:border-white/10 flex items-center justify-between text-xs">
                      <span className="font-semibold text-dark dark:text-white flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-orange-700 dark:text-orange-400" />
                        Peta Lokasi Kantor Wisma Mampang
                      </span>
                      <a
                        href="https://maps.google.com/?q=CV+CITS+Indonesia+Wisma+Mampang"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-700 dark:text-orange-400 hover:underline"
                      >
                        Buka di Google Maps
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="h-48 w-full">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d991.5!2d106.8260758!3d-6.2423607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e7af73d3dd95%3A0x66f83299f875bb2a!2sCV%20CITS%20Indonesia!5e0!3m2!1sid!2sid!4v1700000000000"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Lokasi Kantor CITS Indonesia di Wisma Mampang"
                      />
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>

            {/* Right Column: Inquire Form (Span 7) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <ScrollReveal direction="right" className="h-full">
                <SpotlightCard className="h-full">
                  <div className="p-7 md:p-10 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-150 dark:border-white/10">
                        <div>
                          <h3 className="text-xl md:text-2xl font-extrabold text-dark dark:text-white">
                            Formulir Diskusi Kebutuhan Proyek
                          </h3>
                          <p className="mt-1 text-xs md:text-sm text-gray-700 dark:text-white/85">
                            Sampaikan detail kebutuhan instansi Anda. Kami siap merespons segera.
                          </p>
                        </div>
                        <div className="hidden sm:flex w-11 h-11 rounded-xl bg-orange-100 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-800/60 items-center justify-center text-orange-700 dark:text-orange-400 shrink-0">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                      </div>

                      {submitted ? (
                        <div
                          role="status"
                          aria-live="polite"
                          className="p-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-center space-y-4 my-8"
                        >
                          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mx-auto text-emerald-700 dark:text-emerald-300">
                            <CheckCircle2 className="w-8 h-8" />
                          </div>
                          <h4 className="text-xl font-extrabold text-emerald-900 dark:text-emerald-200">
                            Pesan Berhasil Terkirim!
                          </h4>
                          <p className="text-sm text-emerald-800 dark:text-emerald-300 max-w-md mx-auto leading-relaxed">
                            Terima kasih telah menghubungi CITS Indonesia. Tim konsultan kami akan meninjau pesan Anda dan segera menghubungi Anda kembali dalam 1x24 jam kerja.
                          </p>
                          <button
                            type="button"
                            onClick={() => setSubmitted(false)}
                            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-orange-800 dark:text-orange-300 hover:underline cursor-pointer"
                          >
                            Kirim Formulir Lain
                          </button>
                        </div>
                      ) : (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            setSubmitted(true);
                          }}
                          className="space-y-4 sm:space-y-5"
                        >
                          {/* Nama & Instansi */}
                          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                            <div>
                              <label
                                htmlFor="contact-nama"
                                className="block text-xs font-bold text-gray-800 dark:text-white/90 mb-1.5"
                              >
                                Nama Lengkap <span className="text-red-600">*</span>
                              </label>
                              <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40 pointer-events-none">
                                  <User className="w-4 h-4" />
                                </div>
                                <input
                                  id="contact-nama"
                                  name="nama"
                                  type="text"
                                  required
                                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-white/15 bg-white dark:bg-[#121222] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-sm"
                                  placeholder="cth. Ir. Budi Santoso"
                                />
                              </div>
                            </div>

                            <div>
                              <label
                                htmlFor="contact-instansi"
                                className="block text-xs font-bold text-gray-800 dark:text-white/90 mb-1.5"
                              >
                                Instansi / Perusahaan <span className="text-red-600">*</span>
                              </label>
                              <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40 pointer-events-none">
                                  <Building2 className="w-4 h-4" />
                                </div>
                                <input
                                  id="contact-instansi"
                                  name="instansi"
                                  type="text"
                                  required
                                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-white/15 bg-white dark:bg-[#121222] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-sm"
                                  placeholder="cth. Kementerian / BUMN / PT"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Email & Telepon */}
                          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                            <div>
                              <label
                                htmlFor="contact-email"
                                className="block text-xs font-bold text-gray-800 dark:text-white/90 mb-1.5"
                              >
                                Email Resmi / Dinas <span className="text-red-600">*</span>
                              </label>
                              <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40 pointer-events-none">
                                  <Mail className="w-4 h-4" />
                                </div>
                                <input
                                  id="contact-email"
                                  name="email"
                                  type="email"
                                  required
                                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-white/15 bg-white dark:bg-[#121222] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-sm"
                                  placeholder="nama@instansi.go.id"
                                />
                              </div>
                            </div>

                            <div>
                              <label
                                htmlFor="contact-telepon"
                                className="block text-xs font-bold text-gray-800 dark:text-white/90 mb-1.5"
                              >
                                Nomor Telepon / WhatsApp <span className="text-red-600">*</span>
                              </label>
                              <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40 pointer-events-none">
                                  <Phone className="w-4 h-4" />
                                </div>
                                <input
                                  id="contact-telepon"
                                  name="telepon"
                                  type="tel"
                                  required
                                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-white/15 bg-white dark:bg-[#121222] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-sm"
                                  placeholder="0812-xxxx-xxxx"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Pilar Layanan */}
                          <div>
                            <label
                              id="service-select-label"
                              className="block text-xs font-bold text-gray-800 dark:text-white/90 mb-1.5"
                            >
                              Pilar Layanan yang Dibutuhkan
                            </label>
                            <CustomSelect
                              placeholder="Pilih jenis layanan atau produk yang dibutuhkan"
                              options={serviceOptions}
                              value={selectedService}
                              onChange={(val) => setSelectedService(val)}
                            />
                          </div>

                          {/* Uraian Pesan */}
                          <div>
                            <label
                              htmlFor="contact-pesan"
                              className="block text-xs font-bold text-gray-800 dark:text-white/90 mb-1.5"
                            >
                              Uraian Singkat Kebutuhan / Kerangka Kerja <span className="text-red-600">*</span>
                            </label>
                            <textarea
                              id="contact-pesan"
                              name="pesan"
                              required
                              rows={4}
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/15 bg-white dark:bg-[#121222] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all resize-none text-sm"
                              placeholder="Jelaskan gambaran inisiatif sistem, sasaran instansi, atau jadwal target yang ingin dicapai..."
                            />
                          </div>

                          {/* Consent Checkbox */}
                          <div className="flex items-start gap-2.5 pt-1">
                            <input
                              id="contact-consent"
                              type="checkbox"
                              required
                              defaultChecked
                              className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 accent-orange-600 mt-0.5 cursor-pointer"
                            />
                            <label
                              htmlFor="contact-consent"
                              className="text-xs text-gray-700 dark:text-white/80 leading-normal cursor-pointer select-none"
                            >
                              Saya menyetujui data formulir ini digunakan oleh CITS Indonesia untuk keperluan komunikasi teknis dan penyusunan proposal konsultasi.
                            </label>
                          </div>

                          {/* Submit Button */}
                          <div className="pt-2">
                            <button
                              type="submit"
                              className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-600/30 transition-all flex items-center justify-center gap-2 group cursor-pointer text-sm shadow-md shadow-orange-600/20 active:scale-[0.99]"
                            >
                              <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                              Kirim Permintaan Konsultasi
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </SpotlightCard>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FAQ SECTION (IDDS Inquiries Accordion with Smooth Interactivity) */}
      <section
        aria-labelledby="faq-heading"
        className="py-16 md:py-24 bg-gray-50 dark:bg-[#151528] transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block text-xs font-bold text-orange-900 dark:text-orange-300 bg-orange-100 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-800/60 px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                Pertanyaan Umum
              </span>
              <h2
                id="faq-heading"
                className="text-3xl md:text-4xl font-extrabold text-dark dark:text-white"
              >
                Informasi & <GradientText>Tanya Jawab</GradientText>
              </h2>
              <p className="mt-4 text-gray-700 dark:text-white/85 text-base leading-relaxed">
                Jawaban atas pertanyaan yang sering diajukan seputar tata kelola kerja sama, proses pengadaan, dan kepatuhan sistem bersama CITS Indonesia.
              </p>
            </div>
          </ScrollReveal>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <ScrollReveal key={faq.question} delay={idx * 0.06}>
                  <div className="rounded-2xl bg-white dark:bg-[#16162c] border border-gray-200 dark:border-white/10 hover:border-orange-500/40 transition-all shadow-sm overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-800/60 flex items-center justify-center text-orange-700 dark:text-orange-400 shrink-0">
                          <HelpCircle className="w-4 h-4" />
                        </div>
                        <h3 className="font-extrabold text-dark dark:text-white text-base">
                          {faq.question}
                        </h3>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-500 dark:text-white/60 transition-transform duration-300 shrink-0 ${
                          isOpen ? "rotate-180 text-orange-600 dark:text-orange-400" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-6 pt-1 border-t border-gray-150 dark:border-white/10">
                        <p className="pl-12 text-xs md:text-sm text-gray-700 dark:text-white/85 leading-relaxed">
                          {faq.answer}
                        </p>
                        <div className="mt-4 pl-12 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 dark:text-emerald-400">
                          <Check className="w-3.5 h-3.5" />
                          <span>Informasi Resmi Terverifikasi</span>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
