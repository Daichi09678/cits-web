"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutTemplate,
  Save,
  CheckCircle2,
  Sparkles,
  Plus,
  Trash2,
  ExternalLink,
  Flame,
  BarChart3,
  Layers,
  Eye,
  RotateCcw,
  Package,
  Building2,
  Shield,
  Upload,
  Search,
  Edit3,
  X,
  Check,
} from "lucide-react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { useCitsStore } from "@/stores/citsStore";
import { LandingPageData, SectionVisibility, ClientPartner } from "@/types/schema";
import { initialLandingPageData, defaultSectionVisibility } from "@/data/initialData";
import { useAdminDialog } from "@/components/admin/AdminDialogProvider";
import { DEFAULT_FOCUS_EXPLANATION, resolveFocusItems } from "@/lib/focusContent";

export default function AdminLandingPage() {
  const { landingData, clients, actions } = useCitsStore();
  const dialog = useAdminDialog();

  // Client Management States inside Landing Page
  const [clientSearch, setClientSearch] = useState("");
  const [clientFilter, setClientFilter] = useState<string>("Semua");
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientPartner | null>(null);
  const [clientFormName, setClientFormName] = useState("");
  const [clientFormCategory, setClientFormCategory] = useState<ClientPartner["category"]>("Kementerian");
  const [clientFormLogo, setClientFormLogo] = useState("/clients/kemenhub.webp");
  const [clientFormIsActive, setClientFormIsActive] = useState(true);
  const [clientSuccessMsg, setClientSuccessMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const PRESET_CLIENT_LOGOS = [
    { name: "Kementerian Perhubungan RI", logo: "/clients/kemenhub.webp" },
    { name: "Kementerian ESDM", logo: "/clients/esdm.webp" },
    { name: "Kementerian Ketenagakerjaan RI", logo: "/clients/kemnaker.webp" },
    { name: "Kementerian Investasi / BKPM", logo: "/clients/bkpm.webp" },
    { name: "Kementerian Kesehatan RI", logo: "/clients/kemenkes.webp" },
    { name: "Kementerian Dalam Negeri RI", logo: "/clients/kemendagri.svg" },
    { name: "Kementerian Kominfo RI", logo: "/clients/kominfo.webp" },
    { name: "Kementerian Perdagangan RI", logo: "/clients/perdagangan.webp" },
    { name: "Kementerian Koperasi dan UKM RI", logo: "/clients/kemenkop.webp" },
    { name: "Kementerian ATR/BPN", logo: "/clients/atr-bpn.webp" },
    { name: "PT Indonesia Power", logo: "/clients/indonesia-power.webp" },
    { name: "Mahkamah Agung RI", logo: "/clients/makamah-agung.webp" },
    { name: "BPPT", logo: "/clients/bppt.webp" },
    { name: "BRIN", logo: "/clients/brin.webp" },
  ];

  const openAddClientModal = () => {
    setEditingClient(null);
    setClientFormName("");
    setClientFormCategory("Kementerian");
    setClientFormLogo("/clients/kemenhub.webp");
    setClientFormIsActive(true);
    setClientModalOpen(true);
  };

  const openEditClientModal = (c: ClientPartner) => {
    setEditingClient(c);
    setClientFormName(c.name);
    setClientFormCategory(c.category);
    setClientFormLogo(c.logo);
    setClientFormIsActive(c.isActive);
    setClientModalOpen(true);
  };

  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientFormName.trim()) return;

    if (editingClient) {
      actions.updateClient(editingClient.id, {
        name: clientFormName.trim(),
        category: clientFormCategory,
        logo: clientFormLogo.trim(),
        isActive: clientFormIsActive,
      });
      setClientSuccessMsg(`Perubahan data "${clientFormName}" berhasil disimpan!`);
    } else {
      actions.addClient({
        name: clientFormName.trim(),
        category: clientFormCategory,
        logo: clientFormLogo.trim(),
        isActive: clientFormIsActive,
      });
      setClientSuccessMsg(`Mitra "${clientFormName}" berhasil ditambahkan!`);
    }

    setClientModalOpen(false);
    setTimeout(() => setClientSuccessMsg(""), 3500);
    void dialog.alert({
      title: editingClient ? "Mitra diperbarui" : "Mitra ditambahkan",
      description: editingClient
        ? `Perubahan mitra "${clientFormName}" berhasil disimpan.`
        : `Mitra "${clientFormName}" berhasil ditambahkan ke Beranda.`,
      variant: "success",
    });
  };

  const handleDeleteClient = async (c: ClientPartner) => {
    const confirmed = await dialog.confirm({
      title: "Hapus mitra dari Beranda?",
      description: `Mitra "${c.name}" akan dihapus dari bagian mitra di halaman Beranda.`,
      confirmLabel: "Hapus Mitra",
      variant: "danger",
    });
    if (confirmed) {
      actions.deleteClient(c.id);
      setClientSuccessMsg(`Mitra "${c.name}" berhasil dihapus.`);
      setTimeout(() => setClientSuccessMsg(""), 3500);
      await dialog.alert({
        title: "Mitra dihapus",
        description: `"${c.name}" berhasil dihapus dari Beranda.`,
        variant: "success",
      });
    }
  };

  const handleToggleClientActive = (c: ClientPartner) => {
    actions.updateClient(c.id, { isActive: !c.isActive });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setClientFormLogo(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const [activeTab, setActiveTab] = useState<"hero" | "stats" | "services" | "products" | "clients" | "cta">("hero");
  const [formData, setFormData] = useState<LandingPageData>(() => {
    const base = landingData || initialLandingPageData;
    return {
      ...initialLandingPageData,
      ...base,
      sectionVisibility: {
        ...defaultSectionVisibility,
        ...(base.sectionVisibility || {}),
      },
      hero: { ...initialLandingPageData.hero, ...(base.hero || {}) },
      highlights: base.highlights || initialLandingPageData.highlights,
      servicesIntro: { ...initialLandingPageData.servicesIntro, ...(base.servicesIntro || {}) },
      productsIntro: { ...initialLandingPageData.productsIntro, ...(base.productsIntro || {}) },
      clientsIntro: { ...initialLandingPageData.clientsIntro, ...(base.clientsIntro || {}) },
      cta: { ...initialLandingPageData.cta, ...(base.cta || {}) },
    };
  });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // Snapshot data terakhir yang sudah disinkronkan ke form (perbandingan isi).
  const lastSyncedLandingRef = useRef<string>("");

  // Sync state saat store terisi / berubah.
  // PENTING: store mengirim objek baru setiap event "cits-data-updated"
  // (termasuk polling inbox tiap 3 detik). Tanpa perbandingan isi, effect ini
  // me-reset form terus-menerus dan menghapus edit yang belum disimpan.
  useEffect(() => {
    if (!landingData) return;
    const incoming = JSON.stringify(landingData);
    if (incoming === lastSyncedLandingRef.current) return;
    lastSyncedLandingRef.current = incoming;
    setFormData({
      ...initialLandingPageData,
      ...landingData,
      sectionVisibility: {
        ...defaultSectionVisibility,
        ...(landingData.sectionVisibility || {}),
      },
      hero: { ...initialLandingPageData.hero, ...(landingData.hero || {}) },
      highlights: landingData.highlights || initialLandingPageData.highlights,
      servicesIntro: { ...initialLandingPageData.servicesIntro, ...(landingData.servicesIntro || {}) },
      productsIntro: { ...initialLandingPageData.productsIntro, ...(landingData.productsIntro || {}) },
      clientsIntro: { ...initialLandingPageData.clientsIntro, ...(landingData.clientsIntro || {}) },
      cta: { ...initialLandingPageData.cta, ...(landingData.cta || {}) },
    });
  }, [landingData]);

  // Section Visibility Toggle Handler
  const toggleSection = (section: keyof SectionVisibility) => {
    const currentVis = formData.sectionVisibility || defaultSectionVisibility;
    setFormData({
      ...formData,
      sectionVisibility: {
        ...currentVis,
        [section]: !currentVis[section],
      },
    });
  };

  // Handlers for Typewriter Words.
  // Semua memakai functional update agar klik beruntun tidak memakai state basi
  // (dua klik cepat sebelumnya hanya menambah satu item).
  const handleTypewriterChange = (index: number, val: string) => {
    setFormData((prev) => {
      const words = [...prev.hero.typewriterWords];
      words[index] = val;
      return { ...prev, hero: { ...prev.hero, typewriterWords: words } };
    });
  };

  const addTypewriterWord = () => {
    setFormData((prev) => ({
      ...prev,
      hero: { ...prev.hero, typewriterWords: [...prev.hero.typewriterWords, "Solusi Unggulan Baru"] },
    }));
  };

  const removeTypewriterWord = (index: number) => {
    setFormData((prev) => {
      if (prev.hero.typewriterWords.length <= 1) return prev;
      return {
        ...prev,
        hero: { ...prev.hero, typewriterWords: prev.hero.typewriterWords.filter((_, i) => i !== index) },
      };
    });
  };

  // Handlers for Trust Badges
  const handleTrustBadgeChange = (index: number, val: string) => {
    setFormData((prev) => {
      const badges = [...prev.hero.trustBadges];
      badges[index] = val;
      return { ...prev, hero: { ...prev.hero, trustBadges: badges } };
    });
  };

  const addTrustBadge = () => {
    setFormData((prev) => ({
      ...prev,
      hero: { ...prev.hero, trustBadges: [...prev.hero.trustBadges, "Poin Kepercayaan Baru"] },
    }));
  };

  const removeTrustBadge = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      hero: { ...prev.hero, trustBadges: prev.hero.trustBadges.filter((_, i) => i !== index) },
    }));
  };

  // Handlers for Highlights / Stats
  const handleStatChange = (index: number, field: "label" | "value" | "isActive", val: any) => {
    const updated = [...formData.highlights];
    updated[index] = { ...updated[index], [field]: val };
    setFormData({ ...formData, highlights: updated });
  };

  const addStatItem = () => {
    setFormData((prev) => ({
      ...prev,
      highlights: [...prev.highlights, { label: "Indikator Baru", value: "100+", isActive: true }],
    }));
  };

  const removeStatItem = (index: number) => {
    setFormData((prev) => {
      if (prev.highlights.length <= 1) return prev;
      return { ...prev, highlights: prev.highlights.filter((_, i) => i !== index) };
    });
  };

  // Service Card 4 FOCUS helpers
  const handleCard4FocusChange = (idx: number, field: "letter" | "word" | "desc" | "detail", val: string) => {
    const current = resolveFocusItems(formData.servicesIntro.cardFocus?.focusItems);
    const updated = [...current];
    updated[idx] = { ...updated[idx], [field]: val };
    setFormData({
      ...formData,
      servicesIntro: {
        ...formData.servicesIntro,
        cardFocus: {
          ...formData.servicesIntro.cardFocus,
          focusItems: updated,
        },
      },
    });
  };

  // Save changes
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      actions.saveLandingData(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
      void dialog.alert({
        title: "Beranda berhasil disimpan",
        description: "Seluruh perubahan konten landing page sudah disinkronkan ke front office.",
        variant: "success",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default
  const handleReset = async () => {
    const confirmed = await dialog.confirm({
      title: "Reset konten Beranda?",
      description:
        "Seluruh konten landing page akan dikembalikan ke pengaturan awal bawaan CITS. Perubahan yang belum disimpan akan hilang.",
      confirmLabel: "Ya, Reset Beranda",
      variant: "warning",
    });
    if (confirmed) {
      setFormData(initialLandingPageData);
      actions.saveLandingData(initialLandingPageData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      await dialog.alert({
        title: "Beranda direset",
        description: "Konten landing page berhasil dikembalikan ke pengaturan awal.",
        variant: "success",
      });
    }
  };

  const vis = formData.sectionVisibility || defaultSectionVisibility;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminTopbar
        title="Manajemen Landing Page (Halaman Utama)"
        description="Aktifkan/nonaktifkan konten section, atur teks hero, console mockup, statistik capaian, pilar layanan, etalase produk, dan banner CTA secara lengkap dan realtime."
      />

      <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Top Header Card */}
        <div className="bg-white dark:bg-[#16162d] p-6 rounded-2xl border border-slate-200/90 dark:border-white/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-600/10 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
              <LayoutTemplate className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Kontrol Halaman Utama Web (Landing Page)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Semua teks, kartu layanan, produk, dan visibilitas section tersinkron langsung ke beranda pengunjung.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-slate-400" />
              <span>Lihat Halaman Utama</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </Link>

            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Kembalikan ke Teks Bawaan"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={() => handleSave()}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-orange-600/20 transition-all cursor-pointer disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Menyimpan..." : "Simpan Perubahan"}</span>
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-semibold">
                Perubahan konten landing page berhasil disimpan ke Database PostgreSQL & Redis Cache!
              </span>
            </div>
            <Link
              href="/"
              target="_blank"
              className="text-[11px] underline font-bold hover:text-emerald-950 dark:hover:text-emerald-100 flex items-center gap-1"
            >
              Cek Halaman Depan <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        )}

        {/* MASTER SECTION VISIBILITY SWITCHBOARD */}
        <div className="bg-white dark:bg-[#16162d] p-5 rounded-2xl border border-slate-200/90 dark:border-white/10 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Kontrol Visibilitas Section Beranda (Aktifkan / Nonaktifkan)
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Klik tombol untuk menyembunyikan atau menampilkan section di web utama
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
            {[
              { id: "hero", label: "Hero & Headline", active: vis.hero },
              { id: "highlights", label: "Angka Capaian", active: vis.highlights },
              { id: "services", label: "Pilar Layanan", active: vis.services },
              { id: "products", label: "Produk Unggulan", active: vis.products },
              { id: "clients", label: "Mitra & Klien", active: vis.clients },
              { id: "cta", label: "Banner Ajakan", active: vis.cta },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleSection(s.id as keyof SectionVisibility)}
                className={`p-3 rounded-xl border flex flex-col items-center justify-between gap-2 text-center transition-all cursor-pointer ${
                  s.active
                    ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-300 shadow-xs"
                    : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 opacity-70"
                }`}
              >
                <span className="text-[11px] font-bold">{s.label}</span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    s.active
                      ? "bg-emerald-200/70 dark:bg-emerald-900/50 text-emerald-950 dark:text-emerald-200"
                      : "bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      s.active ? "bg-emerald-600 dark:bg-emerald-400 animate-pulse" : "bg-slate-400"
                    }`}
                  />
                  <span>{s.active ? "Aktif" : "Sembunyi"}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-white/10 gap-2 overflow-x-auto pb-px">
          {[
            { id: "hero", label: "Hero & Headline", icon: Flame, isVisible: vis.hero },
            { id: "stats", label: "Angka Capaian", icon: BarChart3, isVisible: vis.highlights },
            { id: "services", label: "Pilar Layanan (Bento Grid)", icon: Layers, isVisible: vis.services },
            { id: "products", label: "Produk Unggulan", icon: Package, isVisible: vis.products },
            { id: "clients", label: "Mitra & Klien", icon: Building2, isVisible: vis.clients },
            { id: "cta", label: "Banner Ajakan (CTA)", icon: Sparkles, isVisible: vis.cta },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "border-orange-600 text-orange-600 dark:text-orange-400"
                    : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-orange-600 dark:text-orange-400" : ""}`} />
                <span>{tab.label}</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    tab.isVisible ? "bg-emerald-500" : "bg-slate-300 dark:bg-white/20"
                  }`}
                  title={tab.isVisible ? "Section Aktif" : "Section Disembunyikan"}
                />
              </button>
            );
          })}
        </div>

        {/* Form Content */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* TAB 1: HERO SECTION */}
          {activeTab === "hero" && (
            <div className="space-y-6 animate-in fade-in">
              {/* Section Active Status Bar */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${vis.hero ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-white">
                    Status Section Hero: {vis.hero ? "Sedang Aktif Ditampilkan" : "Disembunyikan dari Halaman Depan"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleSection("hero")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    vis.hero
                      ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-300"
                  }`}
                >
                  {vis.hero ? "Nonaktifkan Section Ini" : "Aktifkan Section Ini"}
                </button>
              </div>

              {/* Live Preview Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-[#121226] text-white border border-white/10 shadow-xl space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/10">
                  <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-orange-400">
                    <Eye className="w-3.5 h-3.5" /> Pratinjau Tampilan Hero
                  </span>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded">Desktop View</span>
                </div>

                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/60 border border-orange-800/60 text-orange-300 text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    <span>{formData.hero.badgeText || "Badge Teks Kosong"}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    {formData.hero.headlinePrefix || "Ciptakan Solusi"}{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                      [{formData.hero.typewriterWords[0] || "Animasi Kata"}]
                    </span>
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    {formData.hero.subheadline || "Subheadline deskripsi belum diisi."}
                  </p>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <span className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg text-xs font-bold shadow-md">
                      {formData.hero.primaryCtaText || "Tombol Utama"} →
                    </span>
                    <span className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg text-xs font-semibold">
                      {formData.hero.secondaryCtaText || "Tombol Kedua"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="bg-white dark:bg-[#16162d] p-6 rounded-2xl border border-slate-200/90 dark:border-white/10 shadow-xs space-y-5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-600" />
                  <span>Pengaturan Headline & Deskripsi Hero</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      Badge Teks Atas
                    </label>
                    <input
                      type="text"
                      value={formData.hero.badgeText}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, badgeText: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                      placeholder="e.g. Penyedia Solusi Teknologi Informasi Sejak 2006"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      Awalan Judul Utama (Headline Prefix)
                    </label>
                    <input
                      type="text"
                      value={formData.hero.headlinePrefix}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, headlinePrefix: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-bold"
                      placeholder="e.g. Ciptakan Solusi"
                    />
                  </div>
                </div>

                {/* Typewriter Words Array */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                        Kata-Kata Animasi Typewriter (Bergantian)
                      </label>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Kata ini akan berganti-ganti secara otomatis dengan efek animasi ketik di judul utama.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addTypewriterWord}
                      className="px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800/50 hover:bg-orange-100 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Kata</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {formData.hero.typewriterWords.map((word, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-[10px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={word}
                          onChange={(e) => handleTypewriterChange(idx, e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-semibold"
                          placeholder={`Kata ke-${idx + 1}`}
                        />
                        {formData.hero.typewriterWords.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTypewriterWord(idx)}
                            className="p-2 text-slate-400 hover:text-red-500 cursor-pointer"
                            title="Hapus kata"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subheadline Textarea */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                    Deskripsi Lengkap Hero (Subheadline)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.hero.subheadline}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, subheadline: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 leading-relaxed"
                  />
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-white/10">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
                    <span className="block font-bold text-xs text-orange-600 dark:text-orange-400">
                      Tombol Utama (Primary CTA)
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1">Teks Tombol</label>
                        <input
                          type="text"
                          value={formData.hero.primaryCtaText}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              hero: { ...formData.hero, primaryCtaText: e.target.value },
                            })
                          }
                          className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1">Link Tujuan</label>
                        <input
                          type="text"
                          value={formData.hero.primaryCtaLink}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              hero: { ...formData.hero, primaryCtaLink: e.target.value },
                            })
                          }
                          className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
                    <span className="block font-bold text-xs text-slate-700 dark:text-slate-300">
                      Tombol Sekunder (Secondary CTA)
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1">Teks Tombol</label>
                        <input
                          type="text"
                          value={formData.hero.secondaryCtaText}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              hero: { ...formData.hero, secondaryCtaText: e.target.value },
                            })
                          }
                          className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1">Link Tujuan</label>
                        <input
                          type="text"
                          value={formData.hero.secondaryCtaLink}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              hero: { ...formData.hero, secondaryCtaLink: e.target.value },
                            })
                          }
                          className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                        Poin Kepercayaan (Trust Badges Bawah Hero)
                      </label>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Ditampilkan dengan ikon centang hijau di bawah tombol hero.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addTrustBadge}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Poin</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {formData.hero.trustBadges.map((badge, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <input
                          type="text"
                          value={badge}
                          onChange={(e) => handleTrustBadgeChange(idx, e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeTrustBadge(idx)}
                          className="p-1.5 text-slate-400 hover:text-red-500 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive Mockup Settings */}
                <div className="p-4 rounded-xl bg-orange-50/60 dark:bg-white/5 border border-orange-200/80 dark:border-white/10 space-y-3 pt-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-orange-900 dark:text-orange-300">
                        Mockup Console Interaktif (Di Sisi Kanan Hero)
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Menampilkan dashboard portal enterprise animasi di sebelah teks judul.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, showMockup: formData.hero.showMockup === false ? true : false },
                        })
                      }
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        formData.hero.showMockup !== false
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-300 dark:bg-white/20 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <span>{formData.hero.showMockup !== false ? "Mockup Aktif" : "Mockup Disembunyikan"}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Judul Header Console
                      </label>
                      <input
                        type="text"
                        value={formData.hero.mockupTitle || "CITS Enterprise System Portal"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hero: { ...formData.hero, mockupTitle: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Status Label Console
                      </label>
                      <input
                        type="text"
                        value={formData.hero.mockupStatus || "Sistem Aktif"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hero: { ...formData.hero, mockupStatus: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STATS / HIGHLIGHTS */}
          {activeTab === "stats" && (
            <div className="bg-white dark:bg-[#16162d] p-6 rounded-2xl border border-slate-200/90 dark:border-white/10 shadow-xs space-y-6 animate-in fade-in">
              {/* Section Active Status Bar */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${vis.highlights ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-white">
                    Status Section Angka Capaian:{" "}
                    {vis.highlights ? "Sedang Aktif Ditampilkan" : "Disembunyikan dari Halaman Depan"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleSection("highlights")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    vis.highlights
                      ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-300"
                  }`}
                >
                  {vis.highlights ? "Nonaktifkan Section Ini" : "Aktifkan Section Ini"}
                </button>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-orange-600" />
                    <span>Statistik Angka Capaian (Counter Section)</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Setiap counter angka bisa diaktifkan/dinonaktifkan secara individual atau ditambah baru.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addStatItem}
                  className="px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800/50 hover:bg-orange-100 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Statistik</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {formData.highlights.map((stat, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all space-y-3 relative group ${
                      stat.isActive !== false
                        ? "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10"
                        : "bg-slate-100/60 dark:bg-white/5 border-dashed border-slate-300 dark:border-white/10 opacity-70"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleStatChange(idx, "isActive", stat.isActive === false ? true : false)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                          stat.isActive !== false
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : "bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-400"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${stat.isActive !== false ? "bg-emerald-500" : "bg-slate-400"}`}
                        />
                        <span>{stat.isActive !== false ? "Aktif" : "Non-aktif"}</span>
                      </button>

                      {formData.highlights.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStatItem(idx)}
                          className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                          title="Hapus counter ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                        Angka / Nilai (Counter)
                      </label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => handleStatChange(idx, "value", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 text-lg font-black text-orange-600 dark:text-orange-400 focus:outline-none"
                        placeholder="e.g. 19+"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">Label Keterangan</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 text-xs text-slate-800 dark:text-white font-semibold focus:outline-none"
                        placeholder="e.g. Tahun Berpengalaman"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SERVICES INTRO & BENTO GRID CARDS */}
          {activeTab === "services" && (
            <div className="bg-white dark:bg-[#16162d] p-6 rounded-2xl border border-slate-200/90 dark:border-white/10 shadow-xs space-y-6 animate-in fade-in">
              {/* Section Active Status Bar */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${vis.services ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-white">
                    Status Section Pilar Layanan:{" "}
                    {vis.services ? "Sedang Aktif Ditampilkan" : "Disembunyikan dari Halaman Depan"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleSection("services")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    vis.services
                      ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-300"
                  }`}
                >
                  {vis.services ? "Nonaktifkan Section Ini" : "Aktifkan Section Ini"}
                </button>
              </div>

              {/* Section Header */}
              <div className="space-y-4 pb-4 border-b border-slate-100 dark:border-white/10">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-orange-600" />
                  <span>Teks Pengantar Section Layanan</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      Badge Teks Layanan
                    </label>
                    <input
                      type="text"
                      value={formData.servicesIntro.badge}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          servicesIntro: { ...formData.servicesIntro, badge: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                      placeholder="e.g. Pilar Layanan Utama"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      Judul Utama Section
                    </label>
                    <input
                      type="text"
                      value={formData.servicesIntro.title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          servicesIntro: { ...formData.servicesIntro, title: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-bold"
                      placeholder="e.g. Layanan Unggulan Kami"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                    Subjudul / Deskripsi Pendukung
                  </label>
                  <textarea
                    rows={2}
                    value={formData.servicesIntro.subtitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        servicesIntro: { ...formData.servicesIntro, subtitle: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 leading-relaxed"
                  />
                </div>
              </div>

              {/* 4 BENTO CARDS OF SERVICES */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                    <span>Data Layanan & Prinsip Kerja Beranda</span>
                  </h4>
                  <Link
                    href="/admin/services"
                    className="text-orange-600 dark:text-orange-400 font-bold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    Kelola 3 Pilar di Halaman /services <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 rounded-2xl border border-orange-200 dark:border-orange-500/20 bg-orange-50/60 dark:bg-orange-500/10 p-5">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Layanan Beranda Mengikuti Katalog Layanan
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                      Judul, deskripsi, fitur, ikon, dan SLA pada tiga kartu beranda mengambil data yang sama dengan
                      halaman Layanan. Pengaturan prinsip kerja FOCUS tetap tersedia di bawah.
                    </p>
                    <Link
                      href="/admin/services"
                      className="mt-4 inline-flex rounded-xl bg-orange-700 px-4 py-2.5 text-xs font-bold text-white"
                    >
                      Kelola Data Layanan
                    </Link>
                  </div>
                  {/* Card 4: Prinsip Kerja FOCUS */}
                  <div className="md:col-span-2 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
                      <Shield className="w-4 h-4" /> Kartu 4: Prinsip FOCUS & SLA (Span 2)
                    </span>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">Badge</label>
                      <input
                        type="text"
                        value={formData.servicesIntro.cardFocus?.badge || "Budaya Kerja & Standar SLA"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            servicesIntro: {
                              ...formData.servicesIntro,
                              cardFocus: {
                                ...formData.servicesIntro.cardFocus,
                                badge: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">Judul Kartu</label>
                      <input
                        type="text"
                        value={formData.servicesIntro.cardFocus?.title || "Prinsip Kerja FOCUS"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            servicesIntro: {
                              ...formData.servicesIntro,
                              cardFocus: {
                                ...formData.servicesIntro.cardFocus,
                                title: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">Deskripsi</label>
                      <textarea
                        rows={2}
                        value={
                          formData.servicesIntro.cardFocus?.desc ||
                          "Setiap tahapan kolaborasi kami berakar pada 5 pilar keunggulan operasional:"
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            servicesIntro: {
                              ...formData.servicesIntro,
                              cardFocus: {
                                ...formData.servicesIntro.cardFocus,
                                desc: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div data-focus-editor>
                      <label
                        htmlFor="focus-explanation"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Penjelasan Lengkap FOCUS
                      </label>
                      <textarea
                        id="focus-explanation"
                        rows={3}
                        maxLength={2000}
                        value={formData.servicesIntro.cardFocus?.explanation ?? DEFAULT_FOCUS_EXPLANATION}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            servicesIntro: {
                              ...formData.servicesIntro,
                              cardFocus: { ...formData.servicesIntro.cardFocus, explanation: event.target.value },
                            },
                          })
                        }
                        className="mt-1.5 w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-[#121222] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">Teks Footer Kartu</label>
                      <input
                        type="text"
                        value={
                          formData.servicesIntro.cardFocus?.footerText ||
                          "Terpercaya menangani sistem kementerian sejak 2006"
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            servicesIntro: {
                              ...formData.servicesIntro,
                              cardFocus: {
                                ...formData.servicesIntro.cardFocus,
                                footerText: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1">Teks Link</label>
                        <input
                          type="text"
                          value={formData.servicesIntro.cardFocus?.linkText || "Kenali CITS Lebih Dekat"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              servicesIntro: {
                                ...formData.servicesIntro,
                                cardFocus: {
                                  ...formData.servicesIntro.cardFocus,
                                  linkText: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1">URL Link</label>
                        <input
                          type="text"
                          value={formData.servicesIntro.cardFocus?.linkUrl || "/about"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              servicesIntro: {
                                ...formData.servicesIntro,
                                cardFocus: {
                                  ...formData.servicesIntro.cardFocus,
                                  linkUrl: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* 5 FOCUS Items Editor */}
                    <div className="pt-2 border-t border-slate-200/70 dark:border-white/10 space-y-2">
                      <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        5 Pilar Prinsip Kerja FOCUS (F - O - C - U - S)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {resolveFocusItems(formData.servicesIntro.cardFocus?.focusItems).map((fItem, fIdx) => (
                          <div
                            key={fIdx}
                            className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1.5"
                          >
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                maxLength={2}
                                value={fItem.letter}
                                onChange={(e) => handleCard4FocusChange(fIdx, "letter", e.target.value)}
                                className="w-7 text-center py-0.5 rounded font-black text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 border border-orange-200 text-xs focus:outline-none"
                              />
                              <input
                                type="text"
                                value={fItem.word}
                                onChange={(e) => handleCard4FocusChange(fIdx, "word", e.target.value)}
                                placeholder="Kata"
                                className="min-w-0 flex-1 px-1.5 py-0.5 rounded border border-slate-300 dark:border-white/15 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                              />
                            </div>
                            <input
                              type="text"
                              value={fItem.desc}
                              onChange={(e) => handleCard4FocusChange(fIdx, "desc", e.target.value)}
                              placeholder="Deskripsi"
                              className="w-full px-1.5 py-0.5 rounded border border-slate-300 dark:border-white/15 text-[10px] text-slate-600 dark:text-slate-300 focus:outline-none"
                            />
                            <div data-focus-editor>
                              <label
                                htmlFor={`focus-detail-${fIdx}`}
                                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                              >
                                Penjelasan Prinsip {fItem.word}
                              </label>
                              <textarea
                                id={`focus-detail-${fIdx}`}
                                rows={4}
                                maxLength={1000}
                                value={fItem.detail || ""}
                                onChange={(event) => handleCard4FocusChange(fIdx, "detail", event.target.value)}
                                className="mt-1.5 w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-[#121222] text-sm font-normal text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA Services */}
                <div className="p-4 rounded-xl bg-orange-50/50 dark:bg-white/5 border border-orange-200/80 dark:border-white/10 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Teks Tombol Bawah Layanan
                    </label>
                    <input
                      type="text"
                      value={formData.servicesIntro.bottomCtaText || "Lihat Alur Kerja & Spesifikasi Lengkap Layanan"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          servicesIntro: { ...formData.servicesIntro, bottomCtaText: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      URL Tombol Bawah Layanan
                    </label>
                    <input
                      type="text"
                      value={formData.servicesIntro.bottomCtaLink || "/services"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          servicesIntro: { ...formData.servicesIntro, bottomCtaLink: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRODUCTS INTRO & BENTO GRID CARDS */}
          {activeTab === "products" && (
            <div className="bg-white dark:bg-[#16162d] p-6 rounded-2xl border border-slate-200/90 dark:border-white/10 shadow-xs space-y-6 animate-in fade-in">
              {/* Section Active Status Bar */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${vis.products ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-white">
                    Status Section Produk Unggulan:{" "}
                    {vis.products ? "Sedang Aktif Ditampilkan" : "Disembunyikan dari Halaman Depan"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleSection("products")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    vis.products
                      ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-300"
                  }`}
                >
                  {vis.products ? "Nonaktifkan Section Ini" : "Aktifkan Section Ini"}
                </button>
              </div>

              {/* Section Header */}
              <div className="space-y-4 pb-4 border-b border-slate-100 dark:border-white/10">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-orange-600" />
                  <span>Teks Pengantar Section Produk Unggulan</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      Badge Teks Produk
                    </label>
                    <input
                      type="text"
                      value={formData.productsIntro?.badge || "Solusi Skala Nasional"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          productsIntro: {
                            badge: e.target.value,
                            title: formData.productsIntro?.title || "Produk Unggulan CITS",
                            subtitle:
                              formData.productsIntro?.subtitle ||
                              "Platform kesistemanan yang telah teruji melayani jutaan transaksi data di berbagai kementerian dan institusi nasional.",
                            ...formData.productsIntro,
                          },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                      placeholder="e.g. Solusi Skala Nasional"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      Judul Utama Section
                    </label>
                    <input
                      type="text"
                      value={formData.productsIntro?.title || "Produk Unggulan CITS"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          productsIntro: {
                            badge: formData.productsIntro?.badge || "Solusi Skala Nasional",
                            title: e.target.value,
                            subtitle:
                              formData.productsIntro?.subtitle ||
                              "Platform kesistemanan yang telah teruji melayani jutaan transaksi data di berbagai kementerian dan institusi nasional.",
                            ...formData.productsIntro,
                          },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-bold"
                      placeholder="e.g. Produk Unggulan CITS"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                    Subjudul / Deskripsi Pendukung
                  </label>
                  <textarea
                    rows={2}
                    value={
                      formData.productsIntro?.subtitle ||
                      "Platform kesistemanan yang telah teruji melayani jutaan transaksi data di berbagai kementerian dan institusi nasional."
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        productsIntro: {
                          badge: formData.productsIntro?.badge || "Solusi Skala Nasional",
                          title: formData.productsIntro?.title || "Produk Unggulan CITS",
                          subtitle: e.target.value,
                          ...formData.productsIntro,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 leading-relaxed"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-orange-200 dark:border-orange-500/20 bg-orange-50/60 dark:bg-orange-500/10 p-5">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Lima Produk Unggulan dari Katalog</h4>
                <p className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  Beranda otomatis menampilkan lima produk aktif pertama dari halaman Produk. Foto, nama, deskripsi, dan
                  fitur mengikuti katalog yang sama. Pengunjung dapat membuka seluruh katalog melalui tombol Lihat Semua
                  Produk.
                </p>
                <Link
                  href="/admin/products"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-700 hover:bg-orange-800 px-4 py-2.5 text-xs font-bold text-white"
                >
                  Kelola Foto & Konten Produk <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}

          {activeTab === "clients" && (
            <div className="bg-white dark:bg-[#16162d] p-6 rounded-2xl border border-slate-200/90 dark:border-white/10 shadow-xs space-y-6 animate-in fade-in">
              {/* Section Active Status Bar */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${vis.clients ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-white">
                    Status Section Mitra & Klien (Marquee):{" "}
                    {vis.clients ? "Sedang Aktif Ditampilkan" : "Disembunyikan dari Halaman Depan"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleSection("clients")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    vis.clients
                      ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-300"
                  }`}
                >
                  {vis.clients ? "Nonaktifkan Section Ini" : "Aktifkan Section Ini"}
                </button>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-orange-600" />
                  <span>Pengaturan Bagian Mitra & Klien (Marquee Logo)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Teks pengantar di atas barisan logo instansi kementerian dan BUMN yang berjalan otomatis di beranda.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Judul Bagian Marquee Klien
                </label>
                <input
                  type="text"
                  value={formData.clientsIntro?.title || "Dipercaya oleh Kementerian, BUMN, dan Lembaga Nasional"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      clientsIntro: {
                        title: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-semibold"
                  placeholder="e.g. Dipercaya oleh Kementerian, BUMN, dan Lembaga Nasional"
                />
              </div>

              {/* Success Notification for Client Actions */}
              {clientSuccessMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{clientSuccessMsg}</span>
                </div>
              )}

              {/* Title Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Judul Bagian Marquee Klien
                </label>
                <input
                  type="text"
                  value={formData.clientsIntro?.title || "Dipercaya oleh Kementerian, BUMN, dan Lembaga Nasional"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      clientsIntro: {
                        title: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-semibold"
                  placeholder="e.g. Dipercaya oleh Kementerian, BUMN, dan Lembaga Nasional"
                />
              </div>

              {/* Header & Controls for Ministries / Clients List */}
              <div className="pt-4 border-t border-slate-100 dark:border-white/10 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-orange-600" />
                      <span>Daftar Kementerian, BUMN & Mitra ({clients.length} Terdaftar)</span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Kelola nama kementerian, foto logo, dan visibilitasnya yang tampil langsung di barisan beranda.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={openAddClientModal}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Kementerian / Mitra</span>
                  </button>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
                  <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      placeholder="Cari kementerian / instansi..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white dark:bg-[#16162d] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    {["Semua", "Kementerian", "BUMN", "Lembaga", "Swasta"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setClientFilter(cat)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          clientFilter === cat
                            ? "bg-orange-600 text-white shadow-xs"
                            : "bg-white dark:bg-[#16162d] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-orange-400"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid of Ministries / Clients */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
                  {clients
                    .filter((c) => {
                      const matchSearch =
                        c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
                        c.category.toLowerCase().includes(clientSearch.toLowerCase());
                      const matchFilter = clientFilter === "Semua" || c.category === clientFilter;
                      return matchSearch && matchFilter;
                    })
                    .map((c) => (
                      <div
                        key={c.id}
                        className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                          c.isActive
                            ? "bg-white dark:bg-[#16162d] border-slate-200/90 dark:border-white/10 hover:border-orange-500/40"
                            : "bg-slate-50/60 dark:bg-white/5 border-slate-200/50 dark:border-white/5 opacity-60"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-lg bg-slate-50 dark:bg-white/10 border border-slate-200/70 dark:border-white/10 p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
                            <Image
                              src={c.logo}
                              alt={c.name}
                              width={44}
                              height={44}
                              unoptimized
                              className="max-h-full max-w-full object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (target && c.logo.endsWith(".webp")) {
                                  target.src = c.logo.replace(/\.webp$/, ".png");
                                }
                              }}
                            />
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate" title={c.name}>
                              {c.name}
                            </h5>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                                {c.category}
                              </span>
                              <span
                                className={`text-[10px] font-medium ${
                                  c.isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"
                                }`}
                              >
                                {c.isActive ? "Aktif di Beranda" : "Disembunyikan"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleToggleClientActive(c)}
                            title={c.isActive ? "Sembunyikan dari beranda" : "Tampilkan di beranda"}
                            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                              c.isActive
                                ? "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                                : "text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
                            }`}
                          >
                            {c.isActive ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditClientModal(c)}
                            title="Edit kementerian / foto"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/40 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteClient(c)}
                            title="Hapus kementerian"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Modal Add / Edit Ministry & Client */}
              {clientModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
                  <div className="w-full max-w-lg bg-white dark:bg-[#16162D] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
                      <div>
                        <h3 className="font-extrabold text-sm md:text-base text-slate-900 dark:text-white">
                          {editingClient ? "Edit Kementerian & Foto Logo" : "Tambah Kementerian / Mitra Baru"}
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          Logo dan nama akan langsung sinkron ke deretan kementerian di beranda depan
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setClientModalOpen(false)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveClient} className="p-6 overflow-y-auto space-y-4 text-xs">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                          Nama Kementerian / Instansi <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={clientFormName}
                          onChange={(e) => setClientFormName(e.target.value)}
                          placeholder="cth. Kementerian Perhubungan RI"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold"
                        />
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                          Kategori Institusi
                        </label>
                        <select
                          value={clientFormCategory}
                          onChange={(e) => setClientFormCategory(e.target.value as any)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                        >
                          <option
                            value="Kementerian"
                            className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                          >
                            Kementerian
                          </option>
                          <option value="BUMN" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                            BUMN
                          </option>
                          <option value="Lembaga" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                            Lembaga Tinggi Negara
                          </option>
                          <option value="Swasta" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                            Korporasi Swasta
                          </option>
                        </select>
                      </div>

                      {/* Selected Logo Preview & Upload */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          Foto / Logo Kementerian
                        </label>

                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl bg-white dark:bg-[#1A1A2E] border border-slate-200/80 dark:border-white/10 p-2 flex items-center justify-center shrink-0 shadow-xs">
                            {clientFormLogo ? (
                              <Image
                                src={clientFormLogo}
                                alt="Preview"
                                width={60}
                                height={60}
                                unoptimized
                                className="max-h-full max-w-full object-contain"
                              />
                            ) : (
                              <Building2 className="w-8 h-8 text-slate-400" />
                            )}
                          </div>
                          <div className="flex-1 space-y-2">
                            <input
                              type="file"
                              ref={fileInputRef}
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800/50 hover:bg-orange-100 font-bold text-[11px] cursor-pointer transition-colors"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>Unggah Foto dari Komputer</span>
                            </button>
                            <input
                              type="text"
                              value={clientFormLogo}
                              onChange={(e) => setClientFormLogo(e.target.value)}
                              placeholder="/clients/kemenhub.webp atau URL gambar"
                              className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#1A1A2E] border border-slate-200 dark:border-white/10 text-[11px] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Preset Logos Selector */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                          Atau Pilih Cepat dari Logo Kementerian Siap Pakai:
                        </label>
                        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 max-h-36 overflow-y-auto p-2 rounded-xl bg-slate-50/70 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
                          {PRESET_CLIENT_LOGOS.map((p) => {
                            const isSelected = clientFormLogo === p.logo;
                            return (
                              <button
                                key={p.logo}
                                type="button"
                                onClick={() => {
                                  setClientFormLogo(p.logo);
                                  if (!clientFormName || clientFormName === "Kementerian Perhubungan RI") {
                                    setClientFormName(p.name);
                                  }
                                }}
                                title={p.name}
                                className={`h-12 rounded-lg p-1 border flex items-center justify-center transition-all cursor-pointer relative ${
                                  isSelected
                                    ? "bg-orange-50 dark:bg-orange-950/60 border-orange-500 ring-2 ring-orange-500/30"
                                    : "bg-white dark:bg-[#1A1A2E] border-slate-200 dark:border-white/10 hover:border-orange-400"
                                }`}
                              >
                                <Image
                                  src={p.logo}
                                  alt={p.name}
                                  width={36}
                                  height={36}
                                  unoptimized
                                  className="max-h-full max-w-full object-contain"
                                />
                                {isSelected && (
                                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-orange-600 text-white flex items-center justify-center text-[9px]">
                                    ✓
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Active Toggle */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="clientActiveCheck"
                          checked={clientFormIsActive}
                          onChange={(e) => setClientFormIsActive(e.target.checked)}
                          className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                        />
                        <label
                          htmlFor="clientActiveCheck"
                          className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                        >
                          Tampilkan kementerian ini di beranda depan
                        </label>
                      </div>

                      {/* Modal Footer Buttons */}
                      <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-2.5">
                        <button
                          type="button"
                          onClick={() => setClientModalOpen(false)}
                          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 cursor-pointer transition-all"
                        >
                          {editingClient ? "Simpan Perubahan" : "Tambahkan Mitra"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: CTA BANNER */}
          {activeTab === "cta" && (
            <div className="bg-white dark:bg-[#16162d] p-6 rounded-2xl border border-slate-200/90 dark:border-white/10 shadow-xs space-y-6 animate-in fade-in">
              {/* Section Active Status Bar */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${vis.cta ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-white">
                    Status Section Banner CTA:{" "}
                    {vis.cta ? "Sedang Aktif Ditampilkan" : "Disembunyikan dari Halaman Depan"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleSection("cta")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    vis.cta
                      ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-300"
                  }`}
                >
                  {vis.cta ? "Nonaktifkan Section Ini" : "Aktifkan Section Ini"}
                </button>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-600" />
                  <span>Banner Ajakan Bertindak (CTA Banner Bawah)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Bagian penutup di halaman utama untuk mengonversi pengunjung menjadi klien konsultasi.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                    Badge Banner
                  </label>
                  <input
                    type="text"
                    value={formData.cta.badge}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cta: { ...formData.cta, badge: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                    placeholder="e.g. Mitra Transformasi Digital Terpercaya"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                    Judul Utama CTA
                  </label>
                  <input
                    type="text"
                    value={formData.cta.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cta: { ...formData.cta, title: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Deskripsi Ajakan Konsultasi
                </label>
                <textarea
                  rows={2}
                  value={formData.cta.subtitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cta: { ...formData.cta, subtitle: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-white/10">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
                  <span className="block font-bold text-xs text-orange-600 dark:text-orange-400">Tombol Utama CTA</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">Teks Tombol</label>
                      <input
                        type="text"
                        value={formData.cta.primaryText}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            cta: { ...formData.cta, primaryText: e.target.value },
                          })
                        }
                        className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">Link Tujuan</label>
                      <input
                        type="text"
                        value={formData.cta.primaryLink}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            cta: { ...formData.cta, primaryLink: e.target.value },
                          })
                        }
                        className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
                  <span className="block font-bold text-xs text-slate-700 dark:text-slate-300">
                    Tombol Sekunder CTA
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">Teks Tombol</label>
                      <input
                        type="text"
                        value={formData.cta.secondaryText}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            cta: { ...formData.cta, secondaryText: e.target.value },
                          })
                        }
                        className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">Link Tujuan</label>
                      <input
                        type="text"
                        value={formData.cta.secondaryLink}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            cta: { ...formData.cta, secondaryLink: e.target.value },
                          })
                        }
                        className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
