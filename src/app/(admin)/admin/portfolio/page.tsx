"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Sparkles,
  X,
  Upload,
  Building2,
  Award,
  Layers,
  Clock,
  TrendingUp,
} from "lucide-react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import PublicPageContentEditor from "@/components/admin/PublicPageContentEditor";
import { useAdminDialog } from "@/components/admin/AdminDialogProvider";
import { useCitsStore } from "@/stores/citsStore";
import { CaseStudyItem } from "@/types/schema";

const SECTOR_OPTIONS = [
  "Kementerian & Lembaga Pusat",
  "BUMN & Energi Strategis",
  "Transportasi & Maritim",
  "Satu Data & Geospasial",
  "Intelijen Bisnis & Analitik",
];

const PRESET_LOGOS = [
  { name: "Kementerian Dalam Negeri RI", logo: "/clients/kemendagri.svg" },
  { name: "Kementerian Perhubungan RI", logo: "/clients/kemenhub.webp" },
  { name: "Kementerian Investasi / BKPM", logo: "/clients/bkpm.webp" },
  { name: "Kementerian Kominfo RI", logo: "/clients/kominfo.webp" },
  { name: "PT Indonesia Power", logo: "/clients/indonesia-power.webp" },
  { name: "BPPT / BRIN", logo: "/clients/brin.webp" },
  { name: "Kementerian ATR/BPN", logo: "/clients/atr-bpn.webp" },
  { name: "Mahkamah Agung RI", logo: "/clients/makamah-agung.webp" },
  { name: "Kementerian ESDM", logo: "/clients/esdm.webp" },
  { name: "Kementerian Ketenagakerjaan RI", logo: "/clients/kemnaker.webp" },
  { name: "Kementerian Kesehatan RI", logo: "/clients/kemenkes.webp" },
  { name: "Kementerian Perdagangan RI", logo: "/clients/perdagangan.webp" },
];

export default function AdminPortfolioPage() {
  const { caseStudies, actions } = useCitsStore();
  const dialog = useAdminDialog();

  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "flagship">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudy, setEditingStudy] = useState<CaseStudyItem | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formClient, setFormClient] = useState("");
  const [formClientShort, setFormClientShort] = useState("");
  const [formClientLogo, setFormClientLogo] = useState("/clients/kemendagri.svg");
  const [formSector, setFormSector] = useState(SECTOR_OPTIONS[0]);
  const [formCategoryTag, setFormCategoryTag] = useState("");
  const [formPeriod, setFormPeriod] = useState("2024 - Sekarang");
  const [formServicePillar, setFormServicePillar] = useState("Software House & Enterprise System");
  const [formIsFlagship, setFormIsFlagship] = useState(false);
  const [formTagline, setFormTagline] = useState("");
  const [formChallenge, setFormChallenge] = useState("");
  const [formSolution, setFormSolution] = useState("");
  const [formKpiValue, setFormKpiValue] = useState("99.9%");
  const [formKpiLabel, setFormKpiLabel] = useState("SLA Ketersediaan");
  const [formKpiDetail, setFormKpiDetail] = useState("");
  const [formScopeOfWork, setFormScopeOfWork] = useState("");
  const [formTechStack, setFormTechStack] = useState("");
  const [formDeliverables, setFormDeliverables] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);
  const [formShowOnHome, setFormShowOnHome] = useState(true);

  // Handle Logo Upload from Local File
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      void dialog.alert({
        title: "Ukuran file terlalu besar",
        description: "Ukuran file logo maksimal 3 MB. Silakan pilih file yang lebih kecil.",
        variant: "warning",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormClientLogo(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const openAddModal = () => {
    setEditingStudy(null);
    setFormTitle("");
    setFormClient("");
    setFormClientShort("");
    setFormClientLogo("/clients/kemendagri.svg");
    setFormSector(SECTOR_OPTIONS[0]);
    setFormCategoryTag("Digitalisasi Layanan Publik");
    setFormPeriod("2024 - Sekarang");
    setFormServicePillar("Software House & Rekayasa Arsitektur");
    setFormIsFlagship(false);
    setFormTagline("");
    setFormChallenge("");
    setFormSolution("");
    setFormKpiValue("100%");
    setFormKpiLabel("Keberhasilan Implementasi");
    setFormKpiDetail("Operasional stabil dan lulus audit SPBE.");
    setFormScopeOfWork("Analisis Kebutuhan Sistem, Rekayasa Arsitektur, Pengujian Keamanan, Pelatihan Pengguna");
    setFormTechStack("Next.js, TypeScript, PostgreSQL, REST API");
    setFormDeliverables("Aplikasi Web Enterprise, Dokumentasi SAD, Manual Book Pengguna");
    setFormIsActive(true);
    setFormShowOnHome(true);
    setModalOpen(true);
  };

  const openEditModal = (study: CaseStudyItem) => {
    setEditingStudy(study);
    setFormTitle(study.title);
    setFormClient(study.client);
    setFormClientShort(study.clientShort);
    setFormClientLogo(study.clientLogo);
    setFormSector(study.sector);
    setFormCategoryTag(study.categoryTag);
    setFormPeriod(study.period);
    setFormServicePillar(study.servicePillar);
    setFormIsFlagship(!!study.isFlagship);
    setFormTagline(study.tagline);
    setFormChallenge(study.challenge);
    setFormSolution(study.solution);
    setFormKpiValue(study.measurableImpact?.highlightValue || "");
    setFormKpiLabel(study.measurableImpact?.highlightLabel || "");
    setFormKpiDetail(study.measurableImpact?.detail || "");
    setFormScopeOfWork(study.scopeOfWork ? study.scopeOfWork.join(", ") : "");
    setFormTechStack(study.techStack ? study.techStack.join(", ") : "");
    setFormDeliverables(study.deliverables ? study.deliverables.join(", ") : "");
    setFormIsActive(study.isActive !== false);
    setFormShowOnHome(study.showOnHome !== false);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const parseList = (str: string) =>
      str
        .split(/,|\n/)
        .map((s) => s.trim())
        .filter(Boolean);

    const studyPayload: Omit<CaseStudyItem, "id"> = {
      title: formTitle,
      client: formClient,
      clientShort: formClientShort || formClient,
      clientLogo: formClientLogo,
      sector: formSector,
      categoryTag: formCategoryTag || formSector,
      period: formPeriod,
      servicePillar: formServicePillar,
      isFlagship: formIsFlagship,
      tagline: formTagline,
      challenge: formChallenge,
      solution: formSolution,
      measurableImpact: {
        highlightValue: formKpiValue,
        highlightLabel: formKpiLabel,
        detail: formKpiDetail,
      },
      scopeOfWork: parseList(formScopeOfWork),
      techStack: parseList(formTechStack),
      deliverables: parseList(formDeliverables),
      isActive: formIsActive,
      showOnHome: formShowOnHome,
    };

    if (editingStudy) {
      actions.updateCaseStudy(editingStudy.id, studyPayload);
    } else {
      actions.addCaseStudy(studyPayload);
    }

    setSavedSuccess(true);
    setModalOpen(false);
    setTimeout(() => setSavedSuccess(false), 3000);
    void dialog.alert({
      title: editingStudy ? "Studi kasus diperbarui" : "Studi kasus ditambahkan",
      description: editingStudy
        ? `Perubahan studi kasus "${formTitle}" berhasil disimpan.`
        : `Studi kasus "${formTitle}" berhasil ditambahkan ke portofolio.`,
      variant: "success",
    });
  };

  const handleDelete = async (id: string, title: string) => {
    const confirmed = await dialog.confirm({
      title: "Hapus studi kasus?",
      description: `Studi kasus "${title}" akan dihapus permanen dari portofolio dan tampilan front office.`,
      confirmLabel: "Hapus Studi Kasus",
      variant: "danger",
    });
    if (confirmed) {
      actions.deleteCaseStudy(id);
      await dialog.alert({
        title: "Studi kasus dihapus",
        description: `"${title}" berhasil dihapus dari portofolio.`,
        variant: "success",
      });
    }
  };

  const handleToggleStatus = (id: string) => {
    actions.toggleCaseStudyStatus(id);
  };

  const activeCount = caseStudies.filter((c) => c.isActive !== false).length;
  const flagshipCount = caseStudies.filter((c) => c.isFlagship && c.isActive !== false).length;
  const sectorsCount = new Set(caseStudies.map((c) => c.sector)).size;

  const filteredStudies = caseStudies.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.client.toLowerCase().includes(search.toLowerCase()) ||
      c.clientShort.toLowerCase().includes(search.toLowerCase()) ||
      c.sector.toLowerCase().includes(search.toLowerCase());

    const matchesSector = sectorFilter === "All" || c.sector === sectorFilter;

    let matchesStatus = true;
    if (statusFilter === "active") matchesStatus = c.isActive !== false;
    if (statusFilter === "inactive") matchesStatus = c.isActive === false;
    if (statusFilter === "flagship") matchesStatus = !!c.isFlagship;

    return matchesSearch && matchesSector && matchesStatus;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminTopbar
        title="Manajemen Portofolio & Studi Kasus"
        description="Kelola seluruh rekam jejak kemitraan instansi, capaian proyek nasional, dan rincian arsitektur sistem Front Office"
      />

      <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
        <PublicPageContentEditor page="portfolio" />
        {savedSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Data portofolio berhasil disimpan dan langsung disinkronkan ke halaman /portfolio!</span>
          </div>
        )}

        {/* Top KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Penugasan</p>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{caseStudies.length}</h4>
              <p className="text-[10px] text-slate-400">Portofolio terdaftar</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Aktif di Front Office</p>
              <h4 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{activeCount}</h4>
              <p className="text-[10px] text-slate-400">Tampil di halaman /portfolio</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Proyek Unggulan</p>
              <h4 className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-0.5">{flagshipCount}</h4>
              <p className="text-[10px] text-slate-400">Flagship Banner Atas</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sektor Klien</p>
              <h4 className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-0.5">{sectorsCount}</h4>
              <p className="text-[10px] text-slate-400">Kategori instansi</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Top Controls & Filter */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama kementerian, proyek, atau sektor..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                Semua Sektor Penugasan
              </option>
              {SECTOR_OPTIONS.map((sec) => (
                <option key={sec} value={sec} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {sec}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                Semua Status
              </option>
              <option value="active" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                Hanya Aktif
              </option>
              <option value="inactive" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                Non-aktif (Draft)
              </option>
              <option value="flagship" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                Hanya Flagship
              </option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/portfolio"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lihat Halaman Portofolio</span>
            </a>

            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Studi Kasus</span>
            </button>
          </div>
        </div>

        {/* Case Studies Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStudies.map((study) => (
            <div
              key={study.id}
              className={`p-5 rounded-2xl bg-white dark:bg-[#151528] border transition-all flex flex-col justify-between shadow-xs ${
                study.isActive !== false
                  ? "border-slate-200/90 dark:border-white/10"
                  : "border-slate-200 dark:border-white/5 opacity-60 bg-slate-50/50 dark:bg-white/[0.02]"
              }`}
            >
              <div>
                {/* Header: Logo & Status Badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/10 border border-slate-200 dark:border-white/10 p-1.5 flex items-center justify-center shrink-0">
                      {study.clientLogo ? (
                        <Image
                          src={study.clientLogo}
                          alt={study.client}
                          width={32}
                          height={32}
                          unoptimized
                          className="max-h-7 max-w-full object-contain"
                        />
                      ) : (
                        <Building2 className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="block text-xs font-bold text-slate-900 dark:text-white truncate">
                        {study.clientShort || study.client}
                      </span>
                      <span className="block text-[10px] text-slate-500 truncate">{study.period}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {study.isFlagship && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300">
                        Flagship
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        study.isActive !== false
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-400"
                      }`}
                    >
                      {study.isActive !== false ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug">
                  {study.title}
                </h3>

                <span className="inline-block mt-1.5 text-[10px] font-bold text-orange-600 dark:text-orange-400">
                  {study.sector}
                </span>

                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {study.tagline || study.solution}
                </p>

                {/* KPI Highlight Snippet */}
                {study.measurableImpact?.highlightValue && (
                  <div className="mt-3 p-2.5 rounded-xl bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-900/40 flex items-center justify-between">
                    <div>
                      <span className="block font-black text-sm text-orange-600 dark:text-orange-400 leading-tight">
                        {study.measurableImpact.highlightValue}
                      </span>
                      <span className="block text-[10px] text-slate-600 dark:text-slate-300 font-medium truncate">
                        {study.measurableImpact.highlightLabel}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/50 shrink-0">
                      Teruji
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(study.id)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    study.isActive !== false
                      ? "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
                      : "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                  }`}
                >
                  {study.isActive !== false ? "Nonaktifkan" : "Aktifkan"}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEditModal(study)}
                    className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/40 transition-colors cursor-pointer"
                    title="Edit Studi Kasus"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(study.id, study.title)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Hapus Studi Kasus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredStudies.length === 0 && (
            <div className="col-span-full p-12 text-center rounded-2xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 text-slate-400 space-y-2">
              <Briefcase className="w-8 h-8 mx-auto text-slate-400" />
              <p className="text-xs font-semibold">Tidak ada studi kasus yang cocok dengan kriteria pencarian.</p>
            </div>
          )}
        </div>

        {/* Modal Add / Edit Case Study */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
            <div className="w-full max-w-2xl bg-white dark:bg-[#16162D] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden my-8 max-h-[90vh] flex flex-col">
              <div className="px-6 py-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {editingStudy ? "Edit Studi Kasus Portofolio" : "Tambah Studi Kasus Baru"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Data akan langsung tersinkronkan ke tampilan kartu dan modal pada /portfolio
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Judul Penugasan / Proyek
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="cth. Pemeliharaan & Rekayasa Arsitektur KTP Elektronik Nasional"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Client Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Nama Instansi Klien Lengkap
                    </label>
                    <input
                      type="text"
                      required
                      value={formClient}
                      onChange={(e) => setFormClient(e.target.value)}
                      placeholder="cth. Kementerian Dalam Negeri RI (Ditjen Dukcapil)"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Nama Singkat Klien
                    </label>
                    <input
                      type="text"
                      required
                      value={formClientShort}
                      onChange={(e) => setFormClientShort(e.target.value)}
                      placeholder="cth. Kemendagri RI"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Logo Uploader & Preset */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Logo Instansi Klien
                  </label>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#1A1A2E] border border-slate-200 dark:border-white/10 p-1.5 flex items-center justify-center shrink-0">
                      {formClientLogo ? (
                        <Image
                          src={formClientLogo}
                          alt="Logo Preview"
                          width={40}
                          height={40}
                          unoptimized
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <Building2 className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1.5">
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
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 font-bold text-[11px] cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Unggah Logo dari Komputer</span>
                      </button>
                      <input
                        type="text"
                        value={formClientLogo}
                        onChange={(e) => setFormClientLogo(e.target.value)}
                        placeholder="/clients/kemendagri.svg atau URL"
                        className="w-full px-2.5 py-1 rounded bg-white dark:bg-[#1A1A2E] border border-slate-200 dark:border-white/10 text-[11px] text-slate-900 dark:text-white focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Preset quick picker */}
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {PRESET_LOGOS.slice(0, 8).map((p) => (
                      <button
                        key={p.logo}
                        type="button"
                        onClick={() => {
                          setFormClientLogo(p.logo);
                          if (!formClientShort) setFormClientShort(p.name);
                        }}
                        className="px-2 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-orange-100 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        {p.name.replace("Kementerian ", "Kemen. ")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sektor & Periode */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Sektor Penugasan
                    </label>
                    <select
                      value={formSector}
                      onChange={(e) => setFormSector(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                    >
                      {SECTOR_OPTIONS.map((sec) => (
                        <option
                          key={sec}
                          value={sec}
                          className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                          {sec}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Kategori Spesifik
                    </label>
                    <input
                      type="text"
                      value={formCategoryTag}
                      onChange={(e) => setFormCategoryTag(e.target.value)}
                      placeholder="cth. Kependudukan & Identitas Digital"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Periode Penugasan
                    </label>
                    <input
                      type="text"
                      value={formPeriod}
                      onChange={(e) => setFormPeriod(e.target.value)}
                      placeholder="cth. Multi-Tahun (Operasional Aktif)"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Pilar & Flagship */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Pilar Layanan CITS
                    </label>
                    <input
                      type="text"
                      value={formServicePillar}
                      onChange={(e) => setFormServicePillar(e.target.value)}
                      placeholder="cth. Software House & Pemeliharaan Mission-Critical"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="pt-4 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="formIsFlagship"
                      checked={formIsFlagship}
                      onChange={(e) => setFormIsFlagship(e.target.checked)}
                      className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                    />
                    <label
                      htmlFor="formIsFlagship"
                      className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      Jadikan Studi Kasus Unggulan (Flagship)
                    </label>
                  </div>
                </div>

                {/* Tagline / Ringkasan */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Ringkasan Singkat / Tagline
                  </label>
                  <textarea
                    rows={2}
                    value={formTagline}
                    onChange={(e) => setFormTagline(e.target.value)}
                    placeholder="Kalimat pengantar dampak sistem bagi publik atau kementerian..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                {/* Tantangan & Solusi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Tantangan Inti Klien
                    </label>
                    <textarea
                      rows={3}
                      value={formChallenge}
                      onChange={(e) => setFormChallenge(e.target.value)}
                      placeholder="Kendala teknis, beban transaksi data, atau regulasi yang dihadapi..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Solusi Rekayasa CITS
                    </label>
                    <textarea
                      rows={3}
                      value={formSolution}
                      onChange={(e) => setFormSolution(e.target.value)}
                      placeholder="Solusi arsitektur, API, database, atau pengadaan yang diimplementasikan..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Capaian Utama KPI */}
                <div className="p-3 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-900/40 space-y-2">
                  <label className="block text-xs font-bold text-orange-900 dark:text-orange-300 uppercase tracking-wider">
                    Capaian Terukur (KPI Highlight Badge)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Nilai (cth. 100+ Juta / 99.98%)"
                      value={formKpiValue}
                      onChange={(e) => setFormKpiValue(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#1A1A2E] border border-orange-200 dark:border-orange-800/50 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Label (cth. Transaksi Verifikasi / Tahun)"
                      value={formKpiLabel}
                      onChange={(e) => setFormKpiLabel(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#1A1A2E] border border-orange-200 dark:border-orange-800/50 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Detail dampak (cth. Menjamin latensi verifikasi < 1.5 detik)"
                    value={formKpiDetail}
                    onChange={(e) => setFormKpiDetail(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#1A1A2E] border border-orange-200 dark:border-orange-800/50 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                {/* Tech Stack & Scope */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Teknologi yang Digunakan (Pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      value={formTechStack}
                      onChange={(e) => setFormTechStack(e.target.value)}
                      placeholder="cth. Next.js, Oracle RAC, REST API, Docker"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Deliverables / Hasil Kerja (Pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      value={formDeliverables}
                      onChange={(e) => setFormDeliverables(e.target.value)}
                      placeholder="cth. API Gateway, Dasbor Eksekutif, SLA 24/7"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Active Checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="formIsActiveCheck"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                  />
                  <label
                    htmlFor="formIsActiveCheck"
                    className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Tampilkan studi kasus ini di Front Office (/portfolio)
                  </label>
                </div>

                {/* Footer Buttons */}
                <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-orange-200/80 bg-orange-50/50 p-3.5 dark:border-orange-500/20 dark:bg-orange-500/10">
                  <span>
                    <span className="block text-xs font-bold text-slate-900 dark:text-white">
                      Tampilkan di Beranda Utama
                    </span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-300">
                      Centang agar proyek masuk ke panel ilustrasi pembuka beranda. Maksimal 3 proyek terpilih
                      ditampilkan.
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={formShowOnHome}
                    onChange={(event) => setFormShowOnHome(event.target.checked)}
                    className="mt-0.5 h-5 w-5 shrink-0 accent-orange-600"
                  />
                </label>

                <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 cursor-pointer transition-all"
                  >
                    {editingStudy ? "Simpan Perubahan" : "Tambahkan Studi Kasus"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
