"use client";
import { BackOfficeInput as Input, BackOfficeTextarea as Textarea } from "@/components/ui/Input";
import { BackOfficeButton as Button } from "@/components/ui/Button";
import FieldLabel from "@/components/ui/FieldLabel";
import FormFeedback from "@/components/ui/FormFeedback";

import ServiceDetailsFields, { ServiceImageField } from "@/components/admin/ServiceDetailsFields";
import AdminDialogSurface from "@/components/pages/admin/AdminDialogSurface";
import { X, ChevronDown } from "lucide-react";
import { getPillarIcon, PILLAR_ICON_OPTIONS } from "@/lib/serviceIcons";
import ChipField from "@/components/admin/ChipField";
import ServiceCaseStudyPicker from "@/components/pages/admin-services/ServiceCaseStudyPicker";
import { SERVICE_FEATURE_PRESETS, newlineToList, listToNewline, csvToList, listToCsv } from "./constants";
import type { ServiceManagementEditorState } from "./useServiceManagementEditor";
import ServiceManagementIconPicker from "./ServiceManagementIconPicker";

export default function ServiceManagementDialog({ editor }: { editor: ServiceManagementEditorState }) {
  const {
    modalOpen,
    setModalOpen,
    isSaving,
    editingPillar,
    handleSave,
    saveError,
    formTitle,
    setFormTitle,
    formCategory,
    setFormCategory,
    formDesc,
    setFormDesc,
    formDetails,
    fallbackImage,
    setFormDetails,
    formFeatures,
    setFormFeatures,
    formTags,
    setFormTags,
    tagPresets,
    setIsIconPickerOpen,
    isIconPickerOpen,
    formIcon,
    formBadge,
    setFormBadge,
    formSla,
    setFormSla,
    caseStudies,
    formCaseStudyIds,
    setFormCaseStudyIds,
    formIsActive,
    setFormIsActive,
    formShowOnHome,
    setFormShowOnHome,
  } = editor;
  return (
    <>
      {modalOpen && (
        <AdminDialogSurface
          labelledBy="service-editor-title"
          onClose={() => setModalOpen(false)}
          busy={isSaving}
          widthClassName="w-[min(576px,calc(100vw-32px))]"
        >
          <div className="flex min-h-0 flex-col">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between shrink-0">
              <div>
                <h3 id="service-editor-title" className="font-extrabold text-base text-slate-900 dark:text-white">
                  {editingPillar ? "Edit Informasi Layanan" : "Tambah Layanan Baru"}
                </h3>
                <p className="text-xs text-slate-500">
                  Data yang disimpan akan langsung tampil di halaman Front Office CITS
                </p>
              </div>
              <Button
                type="button"
                aria-label="Tutup editor layanan"
                disabled={isSaving}
                onClick={() => {
                  if (!isSaving) setModalOpen(false);
                }}
                variant="ghost"
                size="icon"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form
              onSubmit={handleSave}
              className="min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs [overflow-wrap:anywhere]"
            >
              {saveError && <FormFeedback tone="error">{saveError}</FormFeedback>}
              <fieldset disabled={isSaving} className="min-w-0 space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Nama Layanan */}
                  <div>
                    <FieldLabel htmlFor="service-title" fieldSize="sm" required>
                      Nama Layanan
                    </FieldLabel>
                    <Input
                      type="text"
                      required
                      maxLength={150}
                      id="service-title"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="cth. Software House"
                      fieldSize="sm"
                      className="w-full"
                    />
                  </div>

                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Kategori
                    <Input
                      type="text"
                      required
                      maxLength={100}
                      id="service-category"
                      list="service-category-options"
                      value={formCategory}
                      onChange={(event) => setFormCategory(event.target.value)}
                      placeholder="cth. Software House"
                      fieldSize="sm"
                      className="mt-1.5 w-full"
                    />
                  </label>
                </div>
                <p className="text-[11px] leading-5 text-slate-500 dark:text-slate-400">
                  Pilih kategori yang ada atau ketik kategori baru. Setelah layanan disimpan, kategori otomatis tersedia
                  di filter.
                </p>

                <div>
                  <FieldLabel htmlFor="service-description" fieldSize="sm" required>
                    Deskripsi Ringkas
                  </FieldLabel>
                  <Textarea
                    rows={3}
                    required
                    id="service-description"
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Jelaskan ruang lingkup dan spesialisasi layanan ini..."
                    fieldSize="sm"
                    className="w-full"
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
                    hint="Pilih label yang ada atau tambahkan label sendiri untuk pencarian dan pengelompokan layanan."
                    value={csvToList(formTags)}
                    onChange={(list) => setFormTags(listToCsv(list))}
                    presets={tagPresets}
                    placeholder="cth: Cloud, Integrasi Sistem, Audit TI"
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
                          ? "bg-orange-50 dark:bg-orange-500/15 border-orange-500 ring-2 ring-orange-500/20 text-accent dark:text-orange-200"
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
                    <FieldLabel htmlFor="service-badge" fieldSize="sm" required>
                      Label Badge
                    </FieldLabel>
                    <Input
                      type="text"
                      required
                      id="service-badge"
                      value={formBadge}
                      onChange={(e) => setFormBadge(e.target.value)}
                      placeholder="cth. Pilar 01"
                      fieldSize="sm"
                      className="w-full"
                    />
                  </div>
                </div>

                {/* PEMILIH IKON TERPADU (Hanya terbuka saat diklik, tanpa scrollbar ganda & tanpa teks terpotong) */}
                <ServiceManagementIconPicker editor={editor} />

                <div>
                  <FieldLabel htmlFor="service-sla" fieldSize="sm" required>
                    Jaminan SLA / Metodologi
                  </FieldLabel>
                  <Input
                    type="text"
                    required
                    id="service-sla"
                    value={formSla}
                    onChange={(e) => setFormSla(e.target.value)}
                    placeholder="Isi standar atau ketentuan dukungan yang berlaku untuk layanan ini"
                    fieldSize="sm"
                    className="w-full"
                  />
                </div>

                <ServiceDetailsFields value={formDetails} onChange={setFormDetails} />
                <ServiceCaseStudyPicker studies={caseStudies} value={formCaseStudyIds} onChange={setFormCaseStudyIds} />

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
                  <Button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    disabled={isSaving}
                    variant="secondary"
                    size="md"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    variant="primary"
                    size="md"
                    busy={isSaving}
                    busyLabel="Menyimpan..."
                  >
                    {isSaving ? "Menyimpan..." : editingPillar ? "Simpan Perubahan" : "Tambahkan ke Katalog"}
                  </Button>
                </div>
              </fieldset>
            </form>
          </div>
        </AdminDialogSurface>
      )}
    </>
  );
}
