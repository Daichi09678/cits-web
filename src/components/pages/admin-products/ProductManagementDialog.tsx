"use client";
import { BackOfficeInput as Input, BackOfficeTextarea as Textarea } from "@/components/ui/Input";
import { BackOfficeButton as Button } from "@/components/ui/Button";
import FieldLabel from "@/components/ui/FieldLabel";
import FormFeedback from "@/components/ui/FormFeedback";

import { Trash2, CheckCircle2, Image as ImageIcon, Upload } from "lucide-react";
import AdminModal from "@/components/pages/admin/AdminModal";
import ChipField from "@/components/admin/ChipField";
import ProductSpecificationFields from "@/components/pages/admin-products/ProductSpecificationFields";
import { FEATURE_PRESETS, TAG_PRESETS, csvToList, listToCsv } from "./constants";
import type { ProductManagementEditorState } from "./useProductManagementEditor";

export default function ProductManagementDialog({ editor }: { editor: ProductManagementEditorState }) {
  const {
    modalOpen,
    saving,
    readingImage,
    handleCloseModal,
    editingProduct,
    handleSave,
    mutationError,
    formName,
    setFormName,
    formCategory,
    setFormCategory,
    categories,
    formDescription,
    setFormDescription,
    formDetails,
    formSpecifications,
    setFormDetails,
    setFormSpecifications,
    formImage,
    handleRemoveImage,
    fileInputRef,
    handleImageFileChange,
    setFormImage,
    formFeatures,
    setFormFeatures,
    formTags,
    setFormTags,
    formIsActive,
    setFormIsActive,
    formShowOnHome,
    setFormShowOnHome,
    setPreviewProduct,
    draftProduct,
  } = editor;
  return (
    <AdminModal
      open={modalOpen}
      busy={saving || readingImage}
      onClose={handleCloseModal}
      title={editingProduct ? "Edit Informasi Produk" : "Tambah Produk Baru"}
      description="Data yang disimpan akan langsung tampil di halaman Front Office CITS"
      size="xl"
    >
      {/* Modal Form */}
      <form onSubmit={handleSave} className="space-y-4">
        {mutationError && <FormFeedback tone="error">{mutationError}</FormFeedback>}
        <fieldset disabled={saving || readingImage} className="min-w-0 space-y-6">
          <div className="grid sm:grid-cols-2 gap-x-5 gap-y-4">
            <div className="min-w-0">
              <FieldLabel htmlFor="product-management-dialog-form-name" fieldSize="sm" required>
                Nama Produk
              </FieldLabel>
              <Input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Contoh: Portal Satu Data"
                fieldSize="sm"
                className="w-full"
                id="product-management-dialog-form-name"
              />
            </div>

            <div className="min-w-0">
              <FieldLabel htmlFor="product-management-dialog-form-category" fieldSize="sm" required>
                Kategori
              </FieldLabel>
              <Input
                value={formCategory}
                required
                maxLength={100}
                list="product-category-options"
                onChange={(e) => setFormCategory(e.target.value)}
                fieldSize="sm"
                className="w-full"
                id="product-management-dialog-form-category"
              />
              <datalist id="product-category-options">
                {[...new Set([...categories, "General"])].map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
              <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">
                Pilih kategori atau tulis kategori baru. Kategori tersimpan akan tersedia sebagai filter.
              </p>
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="product-management-dialog-form-description" fieldSize="sm" required>
              Deskripsi Lengkap
            </FieldLabel>
            <Textarea
              rows={3}
              required
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Jelaskan fungsi, keunggulan, dan manfaat produk untuk instansi..."
              fieldSize="sm"
              className="w-full"
              id="product-management-dialog-form-description"
            ></Textarea>
          </div>

          {/* Foto / Gambar Produk */}
          <ProductSpecificationFields
            details={formDetails}
            specifications={formSpecifications}
            onDetails={setFormDetails}
            onSpecifications={setFormSpecifications}
          />
          <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <ImageIcon className="w-4 h-4 shrink-0 text-orange-600 dark:text-orange-400" />
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Foto / Gambar Produk
                </label>
              </div>
              {formImage && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Hapus Foto
                </button>
              )}
            </div>

            {/* Preview jika sudah ada foto */}
            {formImage ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121224] p-3 flex items-center gap-3.5 shadow-2xs">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/20 shrink-0">
                  <img src={formImage} alt="Preview Foto Produk" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Foto Produk Berhasil Dipilih</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono">
                    {formImage.startsWith("data:") ? "Foto diunggah dari perangkat lokal (Base64)" : formImage}
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-[11px] font-bold text-slate-700 dark:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Upload className="w-3 h-3" />
                    Ganti Foto
                  </button>
                </div>
              </div>
            ) : (
              /* Dropzone unggah file */
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-5 rounded-xl border-2 border-dashed border-slate-300 dark:border-white/15 hover:border-orange-500/60 dark:hover:border-orange-500/60 bg-white dark:bg-[#151528] transition-all text-center cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Klik untuk Pilih / Unggah Foto Produk
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Mendukung format PNG, JPG, atau WebP (Maksimal 3 MB)
                </p>
              </div>
            )}

            {/* Input File Tersembunyi */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/jpg"
              onChange={handleImageFileChange}
              className="hidden"
            />

            {/* Opsi alternatif: Input URL / Path */}
            <div className="pt-1">
              <span className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                Atau masukkan Path / URL Gambar:
              </span>
              <Input
                type="text"
                value={formImage.startsWith("data:") ? "" : formImage}
                onChange={(e) => setFormImage(e.target.value)}
                placeholder="cth: /services/software-house.webp atau https://..."
                fieldSize="sm"
                className="w-full"
              />
            </div>
          </div>

          <div>
            <ChipField
              label="Fitur & Kapabilitas Produk"
              hint="Centang kapabilitas yang tersedia, atau tulis sendiri lalu tekan Enter."
              value={csvToList(formFeatures)}
              onChange={(list) => setFormFeatures(listToCsv(list))}
              presets={FEATURE_PRESETS}
              placeholder="cth: Laporan Real-Time, REST API"
            />
          </div>

          <div>
            <ChipField
              label="Tag / Kata Kunci"
              hint="Dipakai untuk pencarian dan pengelompokan produk."
              value={csvToList(formTags)}
              onChange={(list) => setFormTags(listToCsv(list))}
              presets={TAG_PRESETS}
              placeholder="cth: SPBE, GovTech, ISO 27001"
              accent="emerald"
            />
          </div>

          {/* Status Aktif / Non-Aktif Checkbox */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-start justify-between gap-4">
            <div className="min-w-0 space-y-1.5 leading-relaxed">
              <span className="block text-xs font-bold text-slate-900 dark:text-white">
                Tampilkan di Website Front Office
              </span>
              <span className="block text-[11px] text-slate-500">
                Jika tidak dicentang, produk akan berstatus Non-Aktif (disembunyikan)
              </span>
            </div>
            <input
              type="checkbox"
              checked={formIsActive}
              onChange={(e) => setFormIsActive(e.target.checked)}
              className="mt-0.5 w-5 h-5 shrink-0 accent-orange-600 rounded cursor-pointer"
            />
          </div>

          <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-orange-200/80 bg-orange-50/50 p-3.5 dark:border-orange-500/20 dark:bg-orange-500/10">
            <span className="min-w-0 space-y-1.5 leading-relaxed">
              <span className="block text-xs font-bold text-slate-900 dark:text-white">Tampilkan di Beranda Utama</span>
              <span className="block text-[11px] text-slate-500 dark:text-slate-300">
                Centang agar produk muncul pada section produk unggulan di halaman utama.
              </span>
            </span>
            <input
              type="checkbox"
              checked={formShowOnHome}
              onChange={(e) => setFormShowOnHome(e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-orange-600"
            />
          </label>

          {/* Modal Buttons */}
          <div className="pt-5 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 dark:border-white/10">
            <Button type="button" onClick={() => setPreviewProduct(draftProduct)} variant="secondary" size="md">
              Pratinjau Detail
            </Button>
            <Button type="button" onClick={handleCloseModal} variant="secondary" size="md">
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              busy={saving || readingImage}
              busyLabel={readingImage ? "Membaca foto..." : "Menyimpan..."}
            >
              {saving
                ? "Menyimpan..."
                : readingImage
                  ? "Membaca foto..."
                  : editingProduct
                    ? "Simpan Perubahan"
                    : "Tambahkan ke Katalog"}
            </Button>
          </div>
        </fieldset>
      </form>
    </AdminModal>
  );
}
