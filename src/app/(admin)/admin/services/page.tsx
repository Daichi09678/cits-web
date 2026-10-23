"use client";

import { useState } from "react";
import ServiceDetailsFields, { type ServiceDetailsForm } from "@/components/admin/ServiceDetailsFields";
import ServicePhoto from "@/components/ui/ServicePhoto";
import { resolveServiceCatalog } from "@/lib/serviceCatalog";
import { useModalFocus } from "@/components/ui/useModalFocus";
import { ShieldCheck, CheckCircle2, Edit, Plus, Trash2, X, Search, ChevronDown } from "lucide-react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { useAdminDialog } from "@/components/admin/AdminDialogProvider";
import { useCitsStore } from "@/stores/citsStore";
import { ServicePillar } from "@/types/schema";
import { getPillarIcon, PILLAR_ICON_OPTIONS, PillarIconOption } from "@/lib/serviceIcons";

export default function AdminServicesPage() {
  const { services, actions } = useCitsStore();
  const dialog = useAdminDialog();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPillar, setEditingPillar] = useState<ServicePillar | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formBadge, setFormBadge] = useState("");
  const [formIcon, setFormIcon] = useState("Code2");
  const [formDesc, setFormDesc] = useState("");
  const [formSla, setFormSla] = useState("");
  const [formFeatures, setFormFeatures] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [formDetails, setFormDetails] = useState<ServiceDetailsForm>({
    image: "",
    details: "",
    techStack: "",
    caseStudies: "",
    deliverables: [],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const modalRef = useModalFocus(modalOpen, () => {
    if (!isSaving) setModalOpen(false);
  });
  const fallbackImage = resolveServiceCatalog([
    {
      ...(editingPillar || { id: "new", title: "", badge: "", icon: "", desc: "", sla: "" }),
      image: undefined,
      isActive: true,
    },
  ])[0].image;
  const lines = (text: string) => [
    ...new Set(
      text
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean)
    ),
  ];

  // Icon Picker Filter State
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [iconCategoryFilter, setIconCategoryFilter] = useState("Semua");
  const [iconSearch, setIconSearch] = useState("");
  const [hoveredIconOption, setHoveredIconOption] = useState<PillarIconOption | null>(null);

  const openEditModal = (pillar: ServicePillar) => {
    setEditingPillar(pillar);
    setFormTitle(pillar.title);
    setFormBadge(pillar.badge);
    setFormIcon(pillar.icon || "Code2");
    setFormDesc(pillar.desc);
    setFormSla(pillar.sla);
    setFormFeatures(pillar.features ? pillar.features.join("\n") : "");
    const resolved = resolveServiceCatalog([{ ...pillar, isActive: true }])[0];
    setFormDetails({
      image: pillar.image || "",
      details: resolved.details || "",
      techStack: resolved.techStack.join("\n"),
      caseStudies: resolved.caseStudies.join("\n"),
      deliverables: resolved.deliverables.map((item) => ({ ...item })),
    });
    setSaveError("");
    setFormIsActive(pillar.isActive !== false);
    setIsIconPickerOpen(false);
    setIconCategoryFilter("Semua");
    setIconSearch("");
    setHoveredIconOption(null);
    setModalOpen(true);
  };

  const openAddModal = () => {
    setEditingPillar(null);
    setFormTitle("");
    setFormBadge(`Pilar 0${services.length + 1}`);
    setFormIcon("Code2");
    setFormDesc("");
    setFormSla("SLA Terjamin & Bergaransi");
    setFormFeatures("Arsitektur Andal\nPengujian Ketat\nDukungan 24/7");
    setFormDetails({ image: "", details: "", techStack: "", caseStudies: "", deliverables: [] });
    setSaveError("");
    setFormIsActive(true);
    setIsIconPickerOpen(false);
    setIconCategoryFilter("Semua");
    setIconSearch("");
    setHoveredIconOption(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError("");
    const next: ServicePillar = {
      ...editingPillar,
      id: editingPillar?.id || "pillar-" + crypto.randomUUID(),
      title: formTitle.trim(),
      badge: formBadge.trim(),
      icon: formIcon,
      desc: formDesc.trim(),
      sla: formSla.trim(),
      features: lines(formFeatures),
      isActive: formIsActive,
      image: formDetails.image.trim() || undefined,
      details: formDetails.details.trim(),
      techStack: lines(formDetails.techStack),
      caseStudies: lines(formDetails.caseStudies),
      deliverables: formDetails.deliverables.map((item) => ({
        label: item.label.trim(),
        description: item.description.trim(),
      })),
    };
    try {
      await actions.saveServices(
        editingPillar ? services.map((item) => (item.id === editingPillar.id ? next : item)) : [...services, next]
      );
      setSavedSuccess(true);
      setModalOpen(false);
      setTimeout(() => setSavedSuccess(false), 3000);
      void dialog.alert({
        title: editingPillar ? "Pilar layanan diperbarui" : "Pilar layanan ditambahkan",
        description: "Foto dan rincian layanan berhasil disimpan.",
        variant: "success",
      });
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Layanan gagal disimpan. Silakan coba kembali.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePillar = async (pillar: ServicePillar) => {
    try {
      await actions.updateService(pillar.id, { isActive: pillar.isActive === false });
    } catch (error) {
      void dialog.alert({
        title: "Status belum tersimpan",
        description: error instanceof Error ? error.message : "Coba kembali.",
        variant: "danger",
      });
    }
  };

  const handleDeletePillar = async (id: string, title: string) => {
    const confirmed = await dialog.confirm({
      title: "Hapus pilar layanan?",
      description: `Pilar layanan "${title}" akan dihapus dari daftar layanan dan tampilan front office.`,
      confirmLabel: "Hapus Layanan",
      variant: "danger",
    });
    if (confirmed) {
      try {
        await actions.saveServices(services.filter((s) => s.id !== id));
      } catch (error) {
        await dialog.alert({
          title: "Layanan belum terhapus",
          description: error instanceof Error ? error.message : "Coba kembali.",
          variant: "danger",
        });
        return;
      }
      await dialog.alert({
        title: "Pilar layanan dihapus",
        description: `"${title}" berhasil dihapus dari daftar layanan.`,
        variant: "success",
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminTopbar
        title="Manajemen Layanan CITS"
        description={`Kelola ${services.length} pilar layanan, target SLA, dan ruang lingkup rekayasa teknologi CITS Indonesia`}
      />
      <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
        {savedSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Pengaturan layanan berhasil disimpan dan disinkronkan ke Front Office!</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Klik tombol Edit pada kartu layanan untuk mengubah judul, deskripsi, atau SLA yang tampil di website.
          </p>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pilar Layanan</span>
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((p) => {
            const Icon = getPillarIcon(p.icon);
            return (
              <div
                key={p.id}
                className="p-6 rounded-3xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 shadow-xs flex flex-col justify-between space-y-4 hover:border-orange-500/50 transition-all"
              >
                <div>
                  <ServicePhoto
                    image={resolveServiceCatalog([{ ...p, isActive: true }])[0].image}
                    name={p.title}
                    className="h-40 rounded-xl mb-4"
                  />
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-bold shadow-md shadow-orange-600/25">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => void handleTogglePillar(p)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                          p.isActive !== false
                            ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30"
                            : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/15 opacity-70"
                        }`}
                        title="Klik untuk mengubah status aktif/non-aktif"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${p.isActive !== false ? "bg-emerald-500" : "bg-slate-400"}`}
                        />
                        <span>{p.isActive !== false ? "Aktif" : "Non-aktif"}</span>
                      </button>
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-500/30">
                        {p.badge}
                      </span>
                    </div>
                  </div>

                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{p.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">{p.desc}</p>

                  {p.features && p.features.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/5 space-y-1">
                      {p.features.map((f, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[150px]">{p.sla}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-orange-600 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors cursor-pointer"
                      title="Edit Layanan"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {services.length > 3 && (
                      <button
                        onClick={() => handleDeletePillar(p.id, p.title)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                        title="Hapus Layanan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Edit / Add Pillar */}
        {modalOpen && (
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-editor-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs animate-in fade-in"
          >
            <div className="w-full min-w-0 max-w-3xl bg-white dark:bg-[#16162D] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[92dvh]">
              <div className="px-6 py-4.5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between shrink-0">
                <div>
                  <h3 id="service-editor-title" className="font-extrabold text-base text-slate-900 dark:text-white">
                    {editingPillar ? "Edit Pilar Layanan CITS" : "Tambah Pilar Layanan Baru"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Kelola gambaran, ruang lingkup, dan hasil layanan untuk pengunjung.
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Tutup editor layanan"
                  onClick={() => {
                    if (!isSaving) setModalOpen(false);
                  }}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={handleSave}
                className="min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs [overflow-wrap:anywhere]"
              >
                {saveError && (
                  <p
                    role="alert"
                    className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-3 text-sm text-red-800 dark:text-red-200"
                  >
                    {saveError}
                  </p>
                )}
                <ServiceDetailsFields
                  value={formDetails}
                  name={formTitle}
                  fallbackImage={fallbackImage}
                  onChange={setFormDetails}
                />
                {/* Baris 1: Ikon Layanan + Nama Layanan + Label Badge */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  {/* Ikon Layanan Trigger Button */}
                  <div className="sm:col-span-4">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Ikon Layanan
                    </label>
                    <button
                      type="button"
                      aria-label="Pilih ikon layanan"
                      onClick={() => setIsIconPickerOpen(!isIconPickerOpen)}
                      className={`w-full h-10 px-3 rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer ${
                        isIconPickerOpen
                          ? "bg-orange-50 dark:bg-orange-500/15 border-orange-500 ring-2 ring-orange-500/20 text-orange-950 dark:text-orange-200"
                          : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-orange-400 dark:hover:border-orange-500/40 text-slate-900 dark:text-white"
                      }`}
                      title="Klik untuk memilih ikon pilar layanan"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-lg bg-orange-500/15 dark:bg-orange-500/25 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                          {(() => {
                            const CurrIcon = getPillarIcon(formIcon);
                            return <CurrIcon className="w-3.5 h-3.5" />;
                          })()}
                        </div>
                        <span className="text-xs font-semibold truncate">
                          {PILLAR_ICON_OPTIONS.find((o) => o.name.toLowerCase() === formIcon.toLowerCase())?.label ||
                            formIcon}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isIconPickerOpen ? "rotate-180 text-orange-600 dark:text-orange-400" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Nama Layanan */}
                  <div className="sm:col-span-5">
                    <label
                      htmlFor="service-title"
                      className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
                    >
                      Nama Layanan
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={150}
                      id="service-title"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="cth. Software House"
                      className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  {/* Label Badge */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="service-badge"
                      className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
                    >
                      Label Badge
                    </label>
                    <input
                      type="text"
                      required
                      id="service-badge"
                      value={formBadge}
                      onChange={(e) => setFormBadge(e.target.value)}
                      placeholder="cth. Pilar 01"
                      className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* PEMILIH IKON TERPADU (Hanya terbuka saat diklik, tanpa scrollbar ganda & tanpa teks terpotong) */}
                {isIconPickerOpen && (
                  <div className="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-[#121226] border border-orange-200/80 dark:border-orange-500/30 space-y-2.5 animate-in fade-in zoom-in-98 duration-150">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                          Pilih Ikon Layanan
                        </span>
                        <span className="text-[10px] text-slate-400">(Klik ikon untuk langsung memilih)</span>
                      </div>

                      <div className="relative w-full sm:w-48">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={iconSearch}
                          onChange={(e) => setIconSearch(e.target.value)}
                          placeholder="Cari ikon..."
                          className="w-full pl-8 pr-7 py-1 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                        {iconSearch && (
                          <button
                            type="button"
                            onClick={() => setIconSearch("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Kategori Ikon (Rapi tanpa horizontal scrollbar) */}
                    <div className="flex flex-wrap items-center gap-1 pt-0.5">
                      {[
                        { id: "Semua", label: "Semua" },
                        { id: "Rekayasa & Software", label: "Software" },
                        { id: "Infrastruktur & Cloud", label: "Cloud & Server" },
                        { id: "Konsultansi & SPBE", label: "Konsultasi" },
                        { id: "Keamanan & Dukungan", label: "Keamanan" },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setIconCategoryFilter(cat.id)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all cursor-pointer ${
                            iconCategoryFilter === cat.id
                              ? "bg-orange-600 text-white font-semibold shadow-xs"
                              : "bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10"
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    {/* Grid Ikon Lucide - Clean Square Buttons tanpa teks terpotong */}
                    <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 p-2 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 max-h-36 overflow-y-auto">
                      {PILLAR_ICON_OPTIONS.filter((opt) => {
                        if (iconCategoryFilter !== "Semua" && opt.category !== iconCategoryFilter) return false;
                        if (
                          iconSearch &&
                          !opt.name.toLowerCase().includes(iconSearch.toLowerCase()) &&
                          !opt.label.toLowerCase().includes(iconSearch.toLowerCase())
                        )
                          return false;
                        return true;
                      }).map((opt) => {
                        const IconComp = opt.icon;
                        const isSelected = formIcon.toLowerCase() === opt.name.toLowerCase();
                        return (
                          <button
                            key={opt.name}
                            type="button"
                            onClick={() => {
                              setFormIcon(opt.name);
                              setIsIconPickerOpen(false);
                            }}
                            onMouseEnter={() => setHoveredIconOption(opt)}
                            onMouseLeave={() => setHoveredIconOption(null)}
                            className={`h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                              isSelected
                                ? "bg-orange-600 text-white shadow-md shadow-orange-600/30 scale-105"
                                : "text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-500/15 hover:text-orange-600 dark:hover:text-orange-400 hover:scale-105"
                            }`}
                            title={`${opt.label} (${opt.name})`}
                          >
                            <IconComp className="w-4 h-4" />
                          </button>
                        );
                      })}
                    </div>

                    {/* Footer Keterangan & Tombol Tutup */}
                    <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500 dark:text-slate-400">
                      <div className="truncate pr-2">
                        {hoveredIconOption ? (
                          <span className="text-slate-900 dark:text-white font-medium">
                            Ikon:{" "}
                            <strong className="text-orange-600 dark:text-orange-400">{hoveredIconOption.label}</strong>{" "}
                            ({hoveredIconOption.name})
                          </span>
                        ) : (
                          <span>Arahkan kursor ke ikon untuk melihat fungsi & nama</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsIconPickerOpen(false)}
                        className="text-[10px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white underline cursor-pointer shrink-0"
                      >
                        Tutup
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="service-description"
                    className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
                  >
                    Deskripsi Ringkas
                  </label>
                  <textarea
                    rows={3}
                    required
                    id="service-description"
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Jelaskan ruang lingkup dan spesialisasi layanan ini..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="service-sla"
                    className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
                  >
                    Jaminan SLA / Metodologi
                  </label>
                  <input
                    type="text"
                    required
                    id="service-sla"
                    value={formSla}
                    onChange={(e) => setFormSla(e.target.value)}
                    placeholder="cth. Target Ketersediaan 99.9% / TOGAF & LKPP"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="service-features"
                    className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
                  >
                    Poin Fitur Unggulan (Satu per Baris)
                  </label>
                  <textarea
                    rows={4}
                    id="service-features"
                    value={formFeatures}
                    onChange={(e) => setFormFeatures(e.target.value)}
                    placeholder="Satu fitur atau ruang lingkup per baris"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-slate-800 dark:text-white">
                      Status Tayang Layanan
                    </span>
                    <span className="block text-[11px] text-slate-500">Tampilkan layanan ini di website utama</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      aria-label="Tampilkan layanan di website"
                      checked={formIsActive}
                      onChange={(e) => setFormIsActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-white/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>

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
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 cursor-pointer"
                  >
                    {isSaving ? "Menyimpan..." : editingPillar ? "Simpan Perubahan" : "Tambahkan Layanan"}
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
