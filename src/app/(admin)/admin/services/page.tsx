"use client";

import { useState } from "react";
import ServiceDetailsFields, {
  ServiceImageField,
  type ServiceDetailsForm,
} from "@/components/admin/ServiceDetailsFields";
import ServicePhoto from "@/components/ui/ServicePhoto";
import { resolveServiceCatalog } from "@/lib/serviceCatalog";
import { useModalFocus } from "@/components/ui/useModalFocus";
import { Edit, Plus, Trash2, X, Search, ChevronDown } from "lucide-react";
import { useAdminAuth } from "@/lib/auth";
import { canPerformAction } from "@/lib/internalAccess";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { useAdminDialog } from "@/components/admin/AdminDialogProvider";
import { useCitsStore } from "@/stores/citsStore";
import { ServicePillar } from "@/types/schema";
import { getPillarIcon, PILLAR_ICON_OPTIONS, PillarIconOption } from "@/lib/serviceIcons";
import ChipField from "@/components/admin/ChipField";
import Pagination from "@/components/admin/Pagination";

// Pilihan cepat kapabilitas layanan — cukup dicentang.
const SERVICE_FEATURE_PRESETS = [
  "Analisis & Desain Sistem",
  "Pengembangan Aplikasi Web",
  "Aplikasi Mobile",
  "Integrasi API / Interoperabilitas",
  "Migrasi Data",
  "Pelatihan Pengguna",
  "Pendampingan Go-Live",
  "Pemeliharaan & Dukungan",
  "Audit Keamanan",
  "Dokumentasi Teknis",
];

const SERVICE_TAG_PRESETS = [
  "Custom Development",
  "Integrasi Sistem",
  "GovTech",
  "SPBE",
  "Cloud",
  "On-Premise",
  "Konsultasi",
  "Managed Service",
];

const newlineToList = (value: string): string[] =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
const listToNewline = (list: string[]): string => list.join("\n");
const csvToList = (value: string): string[] =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
const listToCsv = (list: string[]): string => list.join(", ");

export default function AdminServicesPage() {
  const { session } = useAdminAuth();
  const canEdit = canPerformAction(session?.user, "services", "edit");
  const { services, actions } = useCitsStore();
  const dialog = useAdminDialog();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPillar, setEditingPillar] = useState<ServicePillar | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Software House");
  const [formBadge, setFormBadge] = useState("");
  const [formIcon, setFormIcon] = useState("Code2");
  const [formDesc, setFormDesc] = useState("");
  const [formSla, setFormSla] = useState("");
  const [formFeatures, setFormFeatures] = useState("");
  const [formTags, setFormTags] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);
  const [formShowOnHome, setFormShowOnHome] = useState(true);
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
    const resolved = resolveServiceCatalog([{ ...pillar, isActive: true }])[0];
    setFormFeatures(resolved.features.join("\n"));
    setFormCategory(pillar.category || resolved.category || "Layanan CITS");
    setFormTags((pillar.tags || resolved.tags || []).join(", "));
    setFormDetails({
      image: pillar.image || "",
      details: resolved.details || "",
      techStack: resolved.techStack.join("\n"),
      caseStudies: resolved.caseStudies.join("\n"),
      deliverables: resolved.deliverables.map((item) => ({ ...item })),
    });
    setSaveError("");
    setFormIsActive(pillar.isActive !== false);
    setFormShowOnHome(pillar.showOnHome !== false);
    setIsIconPickerOpen(false);
    setIconCategoryFilter("Semua");
    setIconSearch("");
    setHoveredIconOption(null);
    setModalOpen(true);
  };

  const openAddModal = () => {
    setEditingPillar(null);
    setFormTitle("");
    setFormCategory("Software House");
    setFormBadge(`Pilar 0${services.length + 1}`);
    setFormIcon("Code2");
    setFormDesc("");
    setFormSla("SLA Terjamin & Bergaransi");
    setFormFeatures("Arsitektur Andal\nPengujian Ketat\nDukungan 24/7");
    setFormTags("Software House, Custom Development, Integrasi Sistem");
    setFormDetails({ image: "", details: "", techStack: "", caseStudies: "", deliverables: [] });
    setSaveError("");
    setFormIsActive(true);
    setFormShowOnHome(true);
    setIsIconPickerOpen(false);
    setIconCategoryFilter("Semua");
    setIconSearch("");
    setHoveredIconOption(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    setSaveError("");
    const next: ServicePillar = {
      ...editingPillar,
      id: editingPillar?.id || "pillar-" + crypto.randomUUID(),
      category: formCategory.trim(),
      title: formTitle.trim(),
      badge: formBadge.trim(),
      icon: formIcon,
      desc: formDesc.trim(),
      sla: formSla.trim(),
      features: lines(formFeatures),
      tags: formTags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      isActive: formIsActive,
      showOnHome: formShowOnHome,
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
      setModalOpen(false);
      void dialog.alert({
        title: editingPillar ? "Layanan diperbarui" : "Layanan ditambahkan",
        description: "Foto dan rincian layanan berhasil disimpan.",
        variant: "success",
      });
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Layanan gagal disimpan. Silakan coba kembali.");
    } finally {
      setIsSaving(false);
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

  const catalog = services.map((service) => {
    const resolved = resolveServiceCatalog([{ ...service, isActive: true }])[0];
    return {
      ...service,
      category: resolved.category,
      features: resolved.features,
      image: resolved.image,
      source: service,
    };
  });
  const categories = ["All", ...new Set(catalog.map((service) => service.category))];
  const query = search.trim().toLowerCase();
  const filteredServices = catalog.filter(
    (service) =>
      [service.title, service.desc, ...(service.tags || [])].some((value) => value.toLowerCase().includes(query)) &&
      (categoryFilter === "All" || service.category === categoryFilter)
  );
  const pageSize = 8;
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filteredServices.length / pageSize)));
  const paginatedServices = filteredServices.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminTopbar
        title="Manajemen Layanan CITS"
        description={`Kelola ${services.length} pilar layanan, target SLA, dan ruang lingkup rekayasa teknologi CITS Indonesia`}
      />
      <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Top Controls & Action Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
            <div className="relative w-full sm:min-w-[240px] flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                aria-label="Cari layanan"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Cari nama atau deskripsi layanan..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat}
                  aria-pressed={categoryFilter === cat}
                  onClick={() => {
                    setCategoryFilter(cat);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                    categoryFilter === cat
                      ? "bg-orange-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Add Service Button */}
          <button
            disabled={!canEdit}
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/25 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Layanan Baru</span>
          </button>
        </div>

        {/* Table Data Container */}
        <div className="rounded-3xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-white/5 border-b border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-4 px-5">Nama Layanan & Deskripsi</th>
                  <th className="py-4 px-4">Kategori</th>
                  <th className="py-4 px-4">Fitur Utama</th>
                  <th className="py-4 px-4 text-center">Status di Web</th>
                  <th className="py-4 px-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500">
                      Tidak ada layanan yang cocok dengan pencarian Anda.
                    </td>
                  </tr>
                ) : (
                  paginatedServices.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50/60 dark:hover:bg-white/5 transition-colors">
                      {/* Service Name & Description */}
                      <td className="py-4 px-5 max-w-sm">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shrink-0 shadow-2xs">
                            <ServicePhoto image={prod.image} name={prod.title} className="h-full" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-extrabold text-slate-900 dark:text-white text-sm mb-0.5 truncate">
                              {prod.title}
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                              {prod.desc}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 shrink-0">
                        <span className="inline-block px-2.5 py-1 rounded-md bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-200/80 dark:border-orange-500/30 font-bold text-[11px]">
                          {prod.category}
                        </span>
                      </td>

                      {/* Features Tags */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {prod.features.slice(0, 3).map((feat, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300"
                            >
                              {feat}
                            </span>
                          ))}
                          {prod.features.length > 3 && (
                            <span className="text-[10px] px-1.5 py-0.5 text-slate-400 font-semibold">
                              +{prod.features.length - 3} lainnya
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status Toggle Switch */}
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
                            prod.isActive !== false
                              ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30"
                              : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/15 opacity-70"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${prod.isActive !== false ? "bg-emerald-500" : "bg-slate-400"}`}
                          ></span>
                          <span>{prod.isActive !== false ? "Aktif" : "Non-Aktif"}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            disabled={!canEdit}
                            onClick={() => openEditModal(prod.source)}
                            title="Edit Layanan"
                            aria-label={`Edit layanan ${prod.title}`}
                            className="p-2 rounded-xl text-slate-600 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {services.length > 3 && (
                            <button
                              disabled={!canEdit}
                              onClick={() => handleDeletePillar(prod.id, prod.title)}
                              title="Hapus Layanan"
                              aria-label={`Hapus layanan ${prod.title}`}
                              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Pagination page={currentPage} pageSize={pageSize} total={filteredServices.length} onPageChange={setPage} />
        </div>

        {/* Modal Edit / Add Pillar */}
        {modalOpen && (
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-editor-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
          >
            <div className="w-full min-w-0 max-w-xl bg-white dark:bg-[#16162D] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between shrink-0">
                <div>
                  <h3 id="service-editor-title" className="font-extrabold text-base text-slate-900 dark:text-white">
                    {editingPillar ? "Edit Informasi Layanan" : "Tambah Layanan Baru"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Data yang disimpan akan langsung tampil di halaman Front Office CITS
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
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Nama Layanan */}
                  <div>
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

                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Kategori
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={formCategory}
                      onChange={(event) => setFormCategory(event.target.value)}
                      placeholder="cth. Software House"
                      className="mt-1.5 w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-normal text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </label>
                </div>

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

                <ServiceImageField
                  image={formDetails.image}
                  name={formTitle}
                  fallbackImage={fallbackImage}
                  onChange={(image) => setFormDetails((current) => ({ ...current, image }))}
                />
                <div>
                  <ChipField
                    label="Fitur & Kapabilitas Layanan"
                    hint="Centang poin yang termasuk dalam layanan ini, atau tulis sendiri."
                    value={newlineToList(formFeatures)}
                    onChange={(list) => setFormFeatures(listToNewline(list))}
                    presets={SERVICE_FEATURE_PRESETS}
                    placeholder="cth: Integrasi API / Interoperabilitas"
                  />
                </div>

                <div>
                  <ChipField
                    label="Tags / Label"
                    hint="Untuk pencarian dan pengelompokan layanan."
                    value={csvToList(formTags)}
                    onChange={(list) => setFormTags(listToCsv(list))}
                    presets={SERVICE_TAG_PRESETS}
                    placeholder="cth: Custom Development, Integrasi Sistem"
                    accent="emerald"
                  />
                </div>

                {/* Baris 1: Ikon Layanan + Nama Layanan + Label Badge */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                  {/* Ikon Layanan Trigger Button */}
                  <div>
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

                  {/* Label Badge */}
                  <div>
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

                <ServiceDetailsFields value={formDetails} onChange={setFormDetails} />

                <label className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-4 cursor-pointer">
                  <span>
                    <span className="block text-xs font-bold text-slate-900 dark:text-white">
                      Tampilkan di Website Front Office
                    </span>
                    <span className="block text-[11px] text-slate-500">
                      Jika tidak dicentang, layanan akan berstatus Non-Aktif (disembunyikan)
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(event) => setFormIsActive(event.target.checked)}
                    className="w-5 h-5 accent-orange-600 rounded cursor-pointer shrink-0"
                  />
                </label>

                <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-orange-200/80 bg-orange-50/50 p-3.5 dark:border-orange-500/20 dark:bg-orange-500/10">
                  <span>
                    <span className="block text-xs font-bold text-slate-900 dark:text-white">
                      Tampilkan di Beranda Utama
                    </span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-300">
                      Centang agar layanan masuk ke section layanan unggulan di halaman utama.
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={formShowOnHome}
                    onChange={(event) => setFormShowOnHome(event.target.checked)}
                    className="mt-0.5 h-5 w-5 cursor-pointer accent-orange-600"
                  />
                </label>

                <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    disabled={isSaving}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/25 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSaving ? "Menyimpan..." : editingPillar ? "Simpan Perubahan" : "Tambahkan ke Katalog"}
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
