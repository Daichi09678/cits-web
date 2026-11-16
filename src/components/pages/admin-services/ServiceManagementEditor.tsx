"use client";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import FieldLabel from "@/components/ui/FieldLabel";
import FormFeedback from "@/components/ui/FormFeedback";

import ServicePhoto from "@/components/ui/ServicePhoto";
import { Edit, Plus, Trash2, X, Search, LoaderCircle } from "lucide-react";
import AdminTopbar from "@/components/pages/admin/AdminTopbar";
import Pagination from "@/components/admin/Pagination";
import { defaultServiceCategories } from "./constants";
import type { ServiceManagementEditorState } from "./useServiceManagementEditor";
import ServiceManagementDialog from "./ServiceManagementDialog";

export default function ServiceManagementEditor({ editor }: { editor: ServiceManagementEditorState }) {
  const {
    services,
    search,
    setSearch,
    setPage,
    categories,
    categoryFilter,
    setCategoryFilter,
    canEdit,
    categorySaving,
    deletingId,
    deleteCategory,
    categoryEditorOpen,
    setCategoryEditorOpen,
    hasFilters,
    resetFilters,
    canCreate,
    openAddModal,
    saveCategory,
    categoryName,
    setCategoryName,
    catalog,
    categoryServiceIds,
    setCategoryServiceIds,
    categoryError,
    filteredServices,
    paginatedServices,
    openEditModal,
    canDelete,
    handleDeletePillar,
    currentPage,
    pageSize,
  } = editor;
  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminTopbar
        title="Manajemen Layanan CITS"
        description={`Kelola ${services.length} pilar layanan, target SLA, dan ruang lingkup rekayasa teknologi CITS Indonesia`}
      />
      <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Top Controls & Action Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 shadow-xs space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search & Filter */}
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
              <div className="relative w-full sm:min-w-[240px] flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  aria-label="Cari layanan"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Cari nama atau deskripsi layanan..."
                  fieldSize="sm"
                  className="w-full"
                  withIcon
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
                {[null, ...categories].map((cat) => (
                  <div
                    key={cat === null ? "all" : `category:${cat}`}
                    className="inline-flex shrink-0 items-center gap-0.5"
                  >
                    <button
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
                      {cat === null ? "Semua" : cat}
                    </button>
                    {canEdit && cat !== null && !defaultServiceCategories.includes(cat) && (
                      <button
                        type="button"
                        disabled={categorySaving || deletingId !== null}
                        aria-label={`Hapus kategori ${cat}`}
                        title={`Hapus kategori ${cat}`}
                        onClick={() => deleteCategory(cat)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-40 dark:hover:bg-red-500/10"
                      >
                        <X className="size-3" />
                      </button>
                    )}
                  </div>
                ))}
                {canEdit && (
                  <button
                    type="button"
                    disabled={categorySaving}
                    aria-expanded={categoryEditorOpen}
                    aria-controls="service-category-editor"
                    onClick={() => setCategoryEditorOpen((open) => !open)}
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:border-orange-300 hover:text-orange-600 dark:border-white/10 dark:text-slate-300"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Tambah kategori
                  </button>
                )}
                {hasFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-slate-500 hover:text-orange-600"
                  >
                    <X className="h-3.5 w-3.5" />
                    Reset filter
                  </button>
                )}
              </div>
            </div>

            {/* Add Service Button */}
            <button
              disabled={!canCreate || categorySaving}
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/25 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Layanan Baru</span>
            </button>
          </div>

          {categoryEditorOpen && canEdit && (
            <form
              id="service-category-editor"
              onSubmit={saveCategory}
              className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5"
            >
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Tambah kategori filter</h2>
              <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                Buat kategori dan pilih layanan yang masuk di dalamnya. Kategori akan muncul sebagai filter setelah
                disimpan.
              </p>
              <FieldLabel htmlFor="new-service-category" fieldSize="sm" required>
                Nama kategori
              </FieldLabel>
              <Input
                id="new-service-category"
                required
                maxLength={100}
                disabled={categorySaving}
                list="service-category-options"
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
                placeholder="Contoh: Infrastruktur TI"
                fieldSize="sm"
                className="w-full"
              />
              <fieldset disabled={categorySaving} className="space-y-2">
                <legend className="mb-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                  Terapkan ke layanan
                </legend>
                <div className="max-h-48 space-y-2 overflow-y-auto">
                  {catalog.map((service) => (
                    <label
                      key={service.id}
                      className="flex cursor-pointer items-center gap-2 text-xs text-slate-700 dark:text-slate-300"
                    >
                      <input
                        type="checkbox"
                        checked={categoryServiceIds.includes(service.id)}
                        onChange={(event) =>
                          setCategoryServiceIds((ids) =>
                            event.target.checked ? [...ids, service.id] : ids.filter((id) => id !== service.id)
                          )
                        }
                        className="h-4 w-4 accent-orange-600"
                      />
                      <span className="min-w-0 break-words">
                        {service.title} <span className="text-slate-500">· {service.category}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              {categoryError && <FormFeedback tone="error">{categoryError}</FormFeedback>}
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  disabled={categorySaving}
                  onClick={() => setCategoryEditorOpen(false)}
                  variant="secondary"
                  size="md"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={categorySaving || categoryServiceIds.length === 0}
                  variant="primary"
                  size="md"
                >
                  {categorySaving ? "Menyimpan..." : "Simpan kategori"}
                </Button>
              </div>
            </form>
          )}
          <datalist id="service-category-options">
            {[...new Set([...categories, "Pengembangan Aplikasi", "Konsultasi TI", "Infrastruktur TI"])].map(
              (category) => (
                <option key={category} value={category} />
              )
            )}
          </datalist>
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
                      Tidak ada layanan yang cocok dengan pencarian dan filter Anda.
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
                            disabled={!canEdit || categorySaving || deletingId !== null}
                            onClick={() => openEditModal(prod.source)}
                            title="Edit Layanan"
                            aria-label={`Edit layanan ${prod.title}`}
                            className="p-2 rounded-xl text-slate-600 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            disabled={!canDelete || categorySaving || deletingId !== null}
                            onClick={() => handleDeletePillar(prod.id, prod.title)}
                            title="Hapus Layanan"
                            aria-label={`Hapus layanan ${prod.title}`}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          >
                            {deletingId === prod.id ? (
                              <LoaderCircle className="w-4 h-4 animate-spin" aria-label="Menghapus layanan" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
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
        <ServiceManagementDialog editor={editor} />
      </div>
    </div>
  );
}
