"use client";
import Button from "@/components/ui/Button";
import FieldLabel from "@/components/ui/FieldLabel";
import FormFeedback from "@/components/ui/FormFeedback";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import ConsultationSelection from "@/components/ui/ConsultationSelection";
import ConsultationRequirementsFields, {
  type RequirementsFormValue,
} from "@/components/ui/ConsultationRequirementsFields";
import { consultationPurpose, consultationSource, CONSULTATION_SOURCES } from "@/lib/consultation";
import { resolveServiceCatalog } from "@/lib/serviceCatalog";
import type { ConsultationPurpose, ConsultationSource } from "@/types/schema";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  Building2,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  User,
  Copy,
  CheckCheck,
} from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import GradientText from "@/components/ui/GradientText";
import GridPattern from "@/components/ui/GridPattern";
import FloatingShapes from "@/components/animations/FloatingShapes";
import SpotlightCard from "@/components/ui/SpotlightCard";
import CustomSelect from "@/components/pages/public/PublicSelect";
import formStyles from "@/components/pages/contact/ContactForm.module.css";
import Input, { Textarea } from "@/components/ui/Input";
import { useCitsStore } from "@/stores/citsStore";
import { contactPresentation } from "@/lib/contactPresentation";
import FaqChat from "@/components/pages/contact/FaqChat";

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

const emptyRequirements = (purpose: ConsultationPurpose = "discussion"): RequirementsFormValue => ({
  purpose,
  expectedOutcome: "",
  currentSystem: "",
  timeline: "",
  usageEstimate: "",
});

function ContactPageContent({
  initialService,
  initialProduct,
  initialPurpose,
  initialFeatures,
  initialSource,
  initialReference,
}: {
  initialService: string;
  initialProduct: string;
  initialPurpose: ConsultationPurpose;
  initialFeatures: string[];
  initialSource: ConsultationSource;
  initialReference: string;
}) {
  const { contactInfo, actions, services, activeProducts, activeCaseStudies } = useCitsStore();
  const { mapUrl, mapEmbedUrl, whatsappUrl } = contactPresentation(contactInfo);
  const [referenceId, setReferenceId] = useState(initialReference);
  const selectedPortfolio = activeCaseStudies.find((item) => item.id === referenceId);
  const [submitted, setSubmitted] = useState(false);
  const [selectedService, setSelectedService] = useState(initialService);
  const [selectedProductId, setSelectedProductId] = useState(initialProduct);
  const selectedProduct = activeProducts.find((product) => product.id === selectedProductId);
  const selectedServiceDetails = resolveServiceCatalog(services).find((service) => service.title === selectedService);
  const [requirements, setRequirements] = useState(() =>
    emptyRequirements(initialPurpose === "demo" ? "demo" : "discussion")
  );
  const [requestedFeatures, setRequestedFeatures] = useState(initialFeatures);
  const availableFeatures = new Set([
    ...(selectedProduct?.features || []),
    ...(selectedServiceDetails?.features || []),
  ]);
  const selectedFeatures = requestedFeatures.filter((feature) => availableFeatures.has(feature));
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const effectiveServiceOptions = [
    ...new Set([
      ...services.filter((service) => service.isActive !== false).map((service) => service.title),
      ...(contactInfo.customServices ?? serviceOptions),
      ...(selectedService ? [selectedService] : []),
    ]),
  ];

  const effectiveFaqs = contactInfo.faqs?.filter((f) => f.isActive !== false) ?? faqs;

  const announcement = contactInfo.announcement;

  // Form input states
  const [formName, setFormName] = useState("");
  const [formCompany, setFormCompany] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      setCopiedKey(null);
    }
  };

  return (
    <main id="main-content" className="min-h-screen">
      {/* Dynamic Announcement Banner if enabled */}
      {announcement?.isActive && announcement.text && (
        <aside
          aria-label="Pengumuman Resmi"
          className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white py-2.5 px-4 text-xs font-semibold shadow-xs"
        >
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-center sm:text-left">
            <div className="flex items-center gap-2 mx-auto sm:mx-0">
              <span className="w-2 h-2 rounded-full bg-white animate-ping shrink-0" />
              <span>{announcement.text}</span>
            </div>
            {announcement.linkText && announcement.linkUrl && (
              <a
                href={announcement.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-auto sm:mx-0 inline-flex items-center gap-1 underline hover:text-orange-100 font-bold text-[11px]"
              >
                <span>{announcement.linkText}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </aside>
      )}

      {/* 1. HERO SECTION (Clean, WCAG compliant, No breadcrumbs, No black border line) */}
      <section
        aria-labelledby="contact-hero-heading"
        className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-dark dark:to-slate-950 py-14 md:py-22 overflow-hidden transition-colors"
      >
        <FloatingShapes />
        <GridPattern className="opacity-100" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h1
              id="contact-hero-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-dark dark:text-white tracking-tight leading-[1.2]"
            >
              Konsultasikan Kebutuhan TI dengan <GradientText>Tim Ahli CITS</GradientText>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="mt-5 text-gray-700 dark:text-white/85 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              Kami siap mendampingi kementerian, lembaga tinggi negara, BUMN, dan korporasi dalam merumuskan arsitektur
              sistem digital yang andal, aman, dan berdaya guna jangka panjang.
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
        id="consultation-form"
        aria-labelledby="contact-form-heading"
        className="scroll-mt-20 py-16 md:py-24 bg-white dark:bg-[#1A1A2E] transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="contact-form-heading" className="sr-only">
            Formulir Kontak dan Lokasi Kantor CITS Indonesia
          </h2>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Column: Office Info & Direct Channels (Span 5) */}
            <div className="lg:col-span-5 space-y-6">
              <ScrollReveal>
                <div>
                  <h3 className="mt-3 text-2xl md:text-3xl font-extrabold text-dark dark:text-white">
                    Hubungi Kantor CITS
                  </h3>
                  <p className="mt-2 text-xs md:text-sm text-gray-700 dark:text-white/85 leading-relaxed">
                    Kunjungi kantor operasional kami atau hubungi saluran resmi berikut untuk penjadwalan audiensi dan
                    konsultasi teknis.
                  </p>
                </div>
              </ScrollReveal>

              <div className="space-y-3.5">
                {/* Address Card */}
                <ScrollReveal delay={0.1}>
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#16162c] border border-gray-200 dark:border-white/10 flex items-start gap-4 hover:border-orange-500/40 transition-all shadow-sm">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-800/60 flex items-center justify-center text-orange-700 dark:text-orange-400 shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-dark dark:text-white text-sm">Alamat Kantor Operasional</h4>
                      <p className="mt-1 text-xs md:text-sm text-gray-700 dark:text-white/85 leading-relaxed whitespace-pre-line">
                        {contactInfo?.address ||
                          "Gedung Wisma Mampang, Lantai 5\nJl. Mampang Prapatan No. 1\nJakarta Selatan 12790, DKI Jakarta"}
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
                        <h4 className="font-bold text-dark dark:text-white text-sm">Telepon Kantor</h4>
                        <Button
                          variant="unstyled"
                          size="none"
                          type="button"
                          onClick={() => handleCopy(contactInfo?.phone || "(021) 39719677", "phone")}
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
                        </Button>
                      </div>
                      <a
                        href={`tel:${(contactInfo?.phone || "02139719677").replace(/[^0-9]/g, "")}`}
                        className="mt-1 inline-block text-xs md:text-sm text-orange-700 dark:text-orange-400 font-bold hover:underline"
                      >
                        {contactInfo?.phone || "(021) 39719677"}
                      </a>
                      <span className="block mt-0.5 text-[11px] text-gray-700 dark:text-white/70">
                        {contactInfo?.workingHours || "Senin – Jumat (08.30 – 17.30 WIB)"}
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
                        <h4 className="font-bold text-dark dark:text-white text-sm">Email Korespondensi Resmi</h4>
                        <Button
                          variant="unstyled"
                          size="none"
                          type="button"
                          onClick={() => handleCopy(contactInfo?.email || "info@citsindonesia.co.id", "email")}
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
                        </Button>
                      </div>
                      <a
                        href={`mailto:${contactInfo?.email || "info@citsindonesia.co.id"}`}
                        className="mt-1 inline-block text-xs md:text-sm text-orange-700 dark:text-orange-400 font-bold hover:underline break-all"
                      >
                        {contactInfo?.email || "info@citsindonesia.co.id"}
                      </a>
                      <span className="block mt-0.5 text-[11px] text-gray-700 dark:text-white/70">
                        Untuk penawaran, KAK, dan surat dinas
                      </span>
                    </div>
                  </div>
                </ScrollReveal>

                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-slate-50 p-5 hover:border-orange-400 dark:border-white/10 dark:bg-[#16162c]"
                  >
                    <MessageSquare className="size-5 shrink-0 text-orange-700 dark:text-orange-400" />
                    <span className="min-w-0 text-sm">
                      <span className="block font-semibold">WhatsApp</span>
                      <span className="mt-1 block break-words text-slate-600 dark:text-slate-300">
                        {contactInfo.emergencyPhone}
                      </span>
                    </span>
                  </a>
                )}
                {/* Interactive Google Maps Card */}
                <ScrollReveal delay={0.25}>
                  <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-sm bg-slate-100 dark:bg-slate-900">
                    <div className="p-3 bg-slate-50 dark:bg-[#16162c] border-b border-gray-200 dark:border-white/10 flex items-center justify-between text-xs">
                      <span className="font-semibold text-dark dark:text-white flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-orange-700 dark:text-orange-400" />
                        Peta Lokasi Kantor
                      </span>
                      <a
                        href={mapUrl}
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
                        src={mapEmbedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Lokasi Kantor CITS Indonesia"
                      />
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>

            {/* Right Column: Inquire Form (Span 7) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <ScrollReveal direction="right" className="h-full">
                <SpotlightCard className="h-full" disableSpotlight>
                  <div className={`${formStyles.form} p-5 sm:p-7 md:p-8 flex flex-col justify-between h-full`}>
                    <div>
                      <div className="flex items-start justify-between gap-4 pb-5 mb-6 border-b border-gray-200 dark:border-white/10">
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
                        <FormFeedback tone="success" className="my-8">
                          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mx-auto text-emerald-700 dark:text-emerald-300">
                            <CheckCircle2 className="w-8 h-8" />
                          </div>
                          <h4 className="text-xl font-extrabold text-emerald-900 dark:text-emerald-200">
                            Pesan Berhasil Terkirim!
                          </h4>
                          <p className="text-sm text-emerald-800 dark:text-emerald-300 max-w-md mx-auto leading-relaxed">
                            Terima kasih telah menghubungi CITS Indonesia. Tim konsultan kami akan meninjau pesan Anda
                            dan segera menghubungi Anda kembali dalam 1x24 jam kerja.
                          </p>
                          <Button
                            variant="unstyled"
                            size="none"
                            type="button"
                            onClick={() => setSubmitted(false)}
                            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-orange-800 dark:text-orange-300 hover:underline cursor-pointer"
                          >
                            Kirim Formulir Lain
                          </Button>
                        </FormFeedback>
                      ) : (
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            if (selectedProductId && !selectedProduct) {
                              setSubmitError(
                                "Produk yang dipilih tidak tersedia. Pilih produk lain atau kosongkan pilihan produk."
                              );
                              return;
                            }
                            if (referenceId && !selectedPortfolio) {
                              setSubmitError(
                                "Referensi portofolio sudah tidak tersedia. Hapus referensi atau pilih proyek lain."
                              );
                              return;
                            }
                            setSubmitError("");
                            setIsSubmitting(true);
                            try {
                              await actions.addMessage({
                                name: formName,
                                company: formCompany,
                                email: formEmail,
                                phone: formPhone,
                                serviceRequested:
                                  selectedService || (selectedProduct ? "Konsultasi Produk" : "Umum / Konsultasi TI"),
                                productId: selectedProduct?.id,
                                consultation: {
                                  ...requirements,
                                  requestedFeatures: selectedFeatures,
                                  source: initialSource,
                                  referenceId: referenceId || undefined,
                                },
                                message: formMessage,
                              });
                              setSubmitted(true);
                              setFormName("");
                              setFormCompany("");
                              setFormEmail("");
                              setFormPhone("");
                              setFormMessage("");
                              setSelectedService("");
                              setSelectedProductId("");
                              setRequirements(emptyRequirements());
                              setRequestedFeatures([]);
                              setReferenceId("");
                            } catch (err: any) {
                              setSubmitError(
                                err?.message ||
                                  "Gagal mengirim pesan ke server. Mohon periksa koneksi internet Anda atau hubungi kami langsung via WhatsApp."
                              );
                            } finally {
                              setIsSubmitting(false);
                            }
                          }}
                          className="space-y-4 sm:space-y-5"
                        >
                          {submitError && <FormFeedback tone="error">{submitError}</FormFeedback>}
                          {/* Nama & Instansi */}
                          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                            <div>
                              <FieldLabel htmlFor="contact-nama" fieldSize="md" required>
                                Nama Lengkap
                              </FieldLabel>
                              <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40 pointer-events-none">
                                  <User className="w-4 h-4" />
                                </div>
                                <Input
                                  id="contact-nama"
                                  name="nama"
                                  type="text"
                                  required
                                  value={formName}
                                  onChange={(e) => setFormName(e.target.value)}
                                  withIcon
                                  fieldSize="md"
                                  placeholder="cth. Ir. Budi Santoso"
                                />
                              </div>
                            </div>

                            <div>
                              <FieldLabel htmlFor="contact-instansi" fieldSize="md" required>
                                Instansi / Perusahaan
                              </FieldLabel>
                              <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40 pointer-events-none">
                                  <Building2 className="w-4 h-4" />
                                </div>
                                <Input
                                  id="contact-instansi"
                                  name="instansi"
                                  type="text"
                                  required
                                  value={formCompany}
                                  onChange={(e) => setFormCompany(e.target.value)}
                                  withIcon
                                  fieldSize="md"
                                  placeholder="cth. Kementerian / BUMN / PT"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Email & Telepon */}
                          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                            <div>
                              <FieldLabel htmlFor="contact-email" fieldSize="md" required>
                                Alamat Email
                              </FieldLabel>
                              <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40 pointer-events-none">
                                  <Mail className="w-4 h-4" />
                                </div>
                                <Input
                                  id="contact-email"
                                  name="email"
                                  type="email"
                                  autoComplete="email"
                                  aria-describedby="contact-email-hint"
                                  required
                                  value={formEmail}
                                  onChange={(e) => setFormEmail(e.target.value)}
                                  withIcon
                                  fieldSize="md"
                                  placeholder="nama@perusahaan.com"
                                />
                              </div>
                              <p
                                id="contact-email-hint"
                                className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300"
                              >
                                Gunakan email aktif agar tim CITS dapat menghubungi Anda.
                              </p>
                            </div>

                            <div>
                              <FieldLabel htmlFor="contact-telepon" fieldSize="md" required>
                                Nomor Telepon / WhatsApp
                              </FieldLabel>
                              <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40 pointer-events-none">
                                  <Phone className="w-4 h-4" />
                                </div>
                                <Input
                                  id="contact-telepon"
                                  name="telepon"
                                  type="tel"
                                  required
                                  value={formPhone}
                                  onChange={(e) => setFormPhone(e.target.value)}
                                  withIcon
                                  fieldSize="md"
                                  placeholder="0812-xxxx-xxxx"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Pilar Layanan */}
                          <div>
                            <FieldLabel id="service-select-label" fieldSize="md">
                              Pilar Layanan yang Dibutuhkan
                            </FieldLabel>
                            <CustomSelect
                              labelledBy="service-select-label"
                              placeholder="Pilih layanan yang dibutuhkan (opsional)"
                              options={effectiveServiceOptions}
                              value={selectedService}
                              onChange={(val) => setSelectedService(val)}
                            />
                          </div>

                          <div>
                            <FieldLabel id="product-select-label" fieldSize="md">
                              Produk yang Ingin Dikonsultasikan
                            </FieldLabel>
                            <CustomSelect
                              labelledBy="product-select-label"
                              placeholder="Pilih produk (opsional)"
                              options={[
                                ...(selectedProductId && !selectedProduct
                                  ? [{ value: selectedProductId, label: "Produk tidak tersedia (pilih ulang)" }]
                                  : []),
                                ...activeProducts.map((product) => ({ value: product.id, label: product.name })),
                              ]}
                              value={selectedProductId}
                              onChange={setSelectedProductId}
                            />
                            <p className="mt-2 text-sm text-gray-600 dark:text-white/70">
                              Anda dapat memilih layanan, produk, atau keduanya sesuai kebutuhan.
                            </p>
                          </div>

                          <ConsultationSelection
                            service={selectedServiceDetails}
                            product={selectedProduct}
                            selectedFeatures={selectedFeatures}
                            onFeaturesChange={setRequestedFeatures}
                          />
                          {initialSource !== "contact" && (
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                              Konsultasi dari halaman {CONSULTATION_SOURCES[initialSource]}.
                            </p>
                          )}
                          {referenceId && (
                            <section
                              data-testid="consultation-reference"
                              className="rounded-xl border border-orange-200 dark:border-orange-800/60 bg-orange-50/60 dark:bg-orange-950/20 p-4 space-y-2 [overflow-wrap:anywhere]"
                            >
                              <p className="text-xs font-semibold text-orange-800 dark:text-orange-300">
                                Referensi Proyek untuk Kebutuhan Serupa
                              </p>
                              {selectedPortfolio ? (
                                <>
                                  <h4 className="font-bold text-slate-900 dark:text-white">
                                    {selectedPortfolio.title}
                                  </h4>
                                  <p className="text-sm text-slate-600 dark:text-slate-300">
                                    {selectedPortfolio.client} · {selectedPortfolio.servicePillar}
                                  </p>
                                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                                    {selectedPortfolio.tagline}
                                  </p>
                                </>
                              ) : (
                                <p className="text-sm text-slate-700 dark:text-slate-200">
                                  Referensi tidak tersedia. Anda tetap dapat berkonsultasi setelah menghapus referensi
                                  ini.
                                </p>
                              )}
                              <Button
                                variant="unstyled"
                                size="none"
                                type="button"
                                onClick={() => setReferenceId("")}
                                className="text-xs font-semibold text-orange-800 dark:text-orange-300 underline"
                              >
                                Hapus Referensi Proyek
                              </Button>
                            </section>
                          )}
                          <ConsultationRequirementsFields value={requirements} onChange={setRequirements} />

                          {/* Uraian Pesan */}
                          <div>
                            <FieldLabel htmlFor="contact-pesan" fieldSize="md" required>
                              Detail Masalah & Kebutuhan Anda
                            </FieldLabel>
                            <Textarea
                              id="contact-pesan"
                              name="pesan"
                              required
                              rows={4}
                              value={formMessage}
                              onChange={(e) => setFormMessage(e.target.value)}
                              placeholder="Jelaskan kendala, alur kerja yang perlu dibantu, integrasi yang dibutuhkan, dan pertanyaan yang ingin dibahas dengan tim CITS..."
                              fieldSize="md"
                              className="w-full"
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
                              className="text-sm text-gray-700 dark:text-white/80 leading-normal cursor-pointer select-none"
                            >
                              Saya menyetujui data formulir ini digunakan oleh CITS Indonesia untuk keperluan komunikasi
                              teknis dan penyusunan proposal konsultasi.
                            </label>
                          </div>

                          {/* Submit Button */}
                          <div className="pt-2">
                            <Button
                              type="submit"
                              disabled={isSubmitting}
                              variant="public-primary"
                              size="lg"
                              className="w-full group"
                              busy={isSubmitting}
                              busyLabel="Mengirim..."
                            >
                              {isSubmitting ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  <span>Mengirim Permintaan Konsultasi...</span>
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                  <span>Kirim Permintaan Konsultasi</span>
                                </>
                              )}
                            </Button>
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

      {/* 3. FAQ SECTION — asisten tanya jawab berbasis pertanyaan yang tersedia.
          Layout 5/7 kolom mengikuti section formulir di atasnya agar lebar kartu identik. */}
      <section
        aria-labelledby="faq-heading"
        className="mb-10 md:mb-16 py-16 md:py-24 bg-gray-50 dark:bg-[#151528] transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <div className="lg:col-span-5">
              <ScrollReveal>
                <div>
                  <h2 id="faq-heading" className="text-3xl md:text-4xl font-extrabold text-dark dark:text-white">
                    Informasi & <GradientText>Tanya Jawab</GradientText>
                  </h2>
                  <p className="mt-3 text-gray-700 dark:text-white/85 text-sm md:text-base leading-relaxed">
                    Jawaban atas pertanyaan yang sering diajukan seputar tata kelola kerja sama, proses pengadaan, dan
                    kepatuhan sistem bersama CITS Indonesia.
                  </p>
                  <p className="mt-4 text-xs text-gray-600 dark:text-white/70 leading-relaxed">
                    Pilih salah satu pertanyaan yang tersedia untuk melihat jawaban dari CITS.
                  </p>
                </div>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-7">
              <ScrollReveal direction="right" className="h-full">
                <FaqChat faqs={effectiveFaqs} />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ContactPageWithSelection() {
  const searchParams = useSearchParams();
  return (
    <ContactPageContent
      key={searchParams.toString()}
      initialService={(searchParams.get("service") || "").trim().slice(0, 150)}
      initialProduct={(searchParams.get("product") || "").trim().slice(0, 200)}
      initialPurpose={consultationPurpose(searchParams.get("purpose"))}
      initialSource={consultationSource(searchParams.get("source"))}
      initialReference={(searchParams.get("reference") || "").trim().slice(0, 200)}
      initialFeatures={searchParams
        .getAll("feature")
        .slice(0, 20)
        .map((feature) => feature.trim().slice(0, 500))}
    />
  );
}

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center" aria-busy="true">
          Memuat formulir konsultasi...
        </main>
      }
    >
      <ContactPageWithSelection />
    </Suspense>
  );
}
