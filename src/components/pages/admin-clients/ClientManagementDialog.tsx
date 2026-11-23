"use client";
import { adminAccent } from "@/components/pages/admin/accentStyles";
import { BackOfficeInput as Input } from "@/components/ui/Input";
import { BackOfficeButton as Button } from "@/components/ui/Button";
import { BackOfficeSelect as Select } from "@/components/ui/Select";
import FieldLabel from "@/components/ui/FieldLabel";
import FormFeedback from "@/components/ui/FormFeedback";

import Image from "next/image";
import { X, Building2, Upload } from "lucide-react";
import AdminDialogSurface from "@/components/pages/admin/AdminDialogSurface";
import { ClientPartner } from "@/types/schema";
import type { ClientManagementEditorState } from "./useClientManagementEditor";

export default function ClientManagementDialog({ editor }: { editor: ClientManagementEditorState }) {
  const {
    modalOpen,
    setModalOpen,
    saving,
    readingLogo,
    editingClient,
    handleSave,
    mutationError,
    formName,
    setFormName,
    formCategory,
    setFormCategory,
    formLogo,
    fileInputRef,
    handleLogoUpload,
    setFormLogo,
    PRESET_CLIENT_LOGOS,
    formIsActive,
    setFormIsActive,
    formShowOnHome,
    setFormShowOnHome,
  } = editor;
  return (
    <>
      {modalOpen && (
        <AdminDialogSurface
          labelledBy="client-editor-title"
          onClose={() => setModalOpen(false)}
          busy={saving || readingLogo}
          widthClassName="w-[min(512px,calc(100vw-32px))]"
        >
          <div className="flex min-h-0 flex-col">
            <div className="shrink-0 px-6 py-5 border-b border-slate-100 dark:border-white/10 flex items-start justify-between gap-4">
              <div className="min-w-0 space-y-1.5">
                <h3 id="client-editor-title" className="font-extrabold text-base text-slate-900 dark:text-white">
                  {editingClient ? "Edit Mitra Institusi" : "Tambah Mitra Baru"}
                </h3>
                <p className="text-xs leading-relaxed text-slate-500">
                  Logo akan langsung tampil di slider mitra beranda dan portofolio
                </p>
              </div>
              <Button
                type="button"
                aria-label="Tutup editor mitra"
                disabled={saving || readingLogo}
                onClick={() => {
                  if (!saving && !readingLogo) setModalOpen(false);
                }}
                variant="ghost"
                size="icon"
                className="shrink-0"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleSave} className="min-h-0 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
              {mutationError && <FormFeedback tone="error">{mutationError}</FormFeedback>}
              <fieldset disabled={saving || readingLogo} className="min-w-0 space-y-6">
                <div>
                  <FieldLabel htmlFor="client-management-dialog-form-name" fieldSize="sm" required>
                    Nama Kementerian / Institusi
                  </FieldLabel>
                  <Input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="cth. Kementerian Perhubungan RI"
                    fieldSize="sm"
                    className="w-full"
                    id="client-management-dialog-form-name"
                  />
                </div>

                <div>
                  <FieldLabel htmlFor="client-management-dialog-form-category" fieldSize="sm">
                    Kategori Institusi
                  </FieldLabel>
                  <Select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ClientPartner["category"])}
                    selectSize="sm"
                    className="w-full"
                    id="client-management-dialog-form-category"
                  >
                    <option value="Kementerian" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
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
                  </Select>
                </div>

                {/* Logo Preview, File Upload, & Path */}
                <div>
                  <FieldLabel
                    htmlFor="client-management-dialog-form-logo-starts-with-data-form-logo"
                    fieldSize="sm"
                    required
                  >
                    Foto / Logo Kementerian & Mitra
                  </FieldLabel>

                  <div className="min-w-0 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-wrap items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-white dark:bg-[#1A1A2E] border border-slate-200/80 dark:border-white/10 p-2 flex items-center justify-center shrink-0 shadow-xs">
                      {formLogo ? (
                        <Image
                          src={formLogo}
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
                    <div className="min-w-0 flex-1 basis-44 space-y-3">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex max-w-full items-center gap-2 px-3 py-2 rounded-lg bg-orange-50 dark:bg-orange-950/50 text-accent dark:text-orange-300 border border-orange-200 dark:border-orange-800/50 hover:bg-orange-100 font-bold text-[11px] leading-relaxed cursor-pointer transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Unggah Foto dari Komputer</span>
                      </button>
                      <Input
                        type="text"
                        value={formLogo.startsWith("data:") ? "" : formLogo}
                        required={!formLogo.startsWith("data:")}
                        onChange={(e) => setFormLogo(e.target.value)}
                        placeholder="/clients/kemenhub.webp atau URL gambar"
                        fieldSize="sm"
                        className="w-full"
                        id="client-management-dialog-form-logo-starts-with-data-form-logo"
                      />
                    </div>
                  </div>
                </div>

                {/* Preset Logos Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Atau Pilih Cepat dari Logo Tersedia:
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 max-h-36 overflow-y-auto p-2 rounded-xl bg-slate-50/70 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
                    {PRESET_CLIENT_LOGOS.map((p) => {
                      const isSelected = formLogo === p.logo;
                      return (
                        <button
                          key={p.logo}
                          type="button"
                          onClick={() => {
                            setFormLogo(p.logo);
                            if (!formName || formName === "Kementerian Perhubungan RI") {
                              setFormName(p.name);
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
                            <span className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full ${adminAccent} flex items-center justify-center text-[9px]`}>
                              ✓
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Checkbox */}
                <div className="flex items-start gap-3 pt-1 leading-relaxed">
                  <input
                    type="checkbox"
                    id="clientActiveCheckModal"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="mt-0.5 w-4 h-4 shrink-0 accent-orange-600 rounded cursor-pointer"
                  />
                  <label
                    htmlFor="clientActiveCheckModal"
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Tampilkan mitra ini di slider beranda & portofolio
                  </label>
                </div>

                <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-orange-200/80 bg-orange-50/50 p-3.5 dark:border-orange-500/20 dark:bg-orange-500/10">
                  <span className="min-w-0 space-y-1.5 leading-relaxed">
                    <span className="block text-xs font-bold text-slate-900 dark:text-white">
                      Tampilkan di Beranda Utama
                    </span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-300">
                      Centang agar logo mitra tampil pada deretan mitra di beranda.
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
                  <Button
                    type="button"
                    onClick={() => {
                      if (!saving && !readingLogo) setModalOpen(false);
                    }}
                    variant="secondary"
                    size="md"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    busy={saving || readingLogo}
                    busyLabel={readingLogo ? "Membaca logo..." : "Menyimpan..."}
                  >
                    {saving
                      ? "Menyimpan..."
                      : readingLogo
                        ? "Membaca logo..."
                        : editingClient
                          ? "Simpan Perubahan"
                          : "Tambahkan Mitra"}
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
