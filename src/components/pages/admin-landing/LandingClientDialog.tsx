"use client";
import { adminAccent } from "@/components/pages/admin/accentStyles";
import { BackOfficeInput as Input } from "@/components/ui/Input";
import { BackOfficeButton as Button } from "@/components/ui/Button";
import { BackOfficeSelect as Select } from "@/components/ui/Select";
import FieldLabel from "@/components/ui/FieldLabel";
import FormFeedback from "@/components/ui/FormFeedback";

import { createPortal } from "react-dom";
import Image from "next/image";
import { Building2, Upload, X } from "lucide-react";
import AdminDialogSurface from "@/components/pages/admin/AdminDialogSurface";
import type { LandingEditorState } from "./useLandingEditor";

export default function LandingClientDialog({ editor }: { editor: LandingEditorState }) {
  const {
    clientModalOpen,
    editingClient,
    canEditClients,
    canCreateClients,
    setClientModalOpen,
    clientMutation,
    handleSaveClient,
    clientError,
    clientFormName,
    setClientFormName,
    clientFormCategory,
    setClientFormCategory,
    clientFormLogo,
    fileInputRef,
    handleLogoUpload,
    setClientFormLogo,
    PRESET_CLIENT_LOGOS,
    clientFormIsActive,
    setClientFormIsActive,
  } = editor;
  return (
    <>
      {clientModalOpen &&
        (editingClient ? canEditClients : canCreateClients) &&
        createPortal(
          <AdminDialogSurface
            labelledBy="landing-client-title"
            onClose={() => setClientModalOpen(false)}
            busy={clientMutation !== null}
            widthClassName="w-[min(512px,calc(100vw-32px))]"
          >
            <div className="flex min-h-0 flex-col">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
                <div>
                  <h3
                    id="landing-client-title"
                    className="font-extrabold text-sm md:text-base text-slate-900 dark:text-white"
                  >
                    {editingClient ? "Edit Kementerian & Foto Logo" : "Tambah Kementerian / Mitra Baru"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Logo dan nama akan langsung sinkron ke deretan kementerian di beranda depan
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => setClientModalOpen(false)}
                  disabled={clientMutation !== null}
                  aria-label="Tutup form mitra"
                  variant="ghost"
                  size="icon"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <form onSubmit={handleSaveClient} className="p-6 overflow-y-auto space-y-4 text-xs">
                {clientError && <FormFeedback tone="error">{clientError}</FormFeedback>}
                <fieldset disabled={clientMutation !== null} className="space-y-4">
                  {/* Name */}
                  <div>
                    <FieldLabel htmlFor="landing-client-dialog-client-form-name" fieldSize="sm" required>
                      Nama Kementerian / Instansi
                    </FieldLabel>
                    <Input
                      type="text"
                      required
                      value={clientFormName}
                      onChange={(e) => setClientFormName(e.target.value)}
                      placeholder="cth. Kementerian Perhubungan RI"
                      fieldSize="sm"
                      className="w-full"
                      id="landing-client-dialog-client-form-name"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <FieldLabel htmlFor="landing-client-dialog-client-form-category" fieldSize="sm">
                      Kategori Institusi
                    </FieldLabel>
                    <Select
                      value={clientFormCategory}
                      onChange={(e) => setClientFormCategory(e.target.value as typeof clientFormCategory)}
                      selectSize="sm"
                      className="w-full"
                      id="landing-client-dialog-client-form-category"
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

                  {/* Selected Logo Preview & Upload */}
                  <div>
                    <FieldLabel htmlFor="landing-client-dialog-client-form-logo" fieldSize="sm">
                      Foto / Logo Kementerian
                    </FieldLabel>

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
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/50 text-accent dark:text-orange-300 border border-orange-200 dark:border-orange-800/50 hover:bg-orange-100 font-bold text-[11px] cursor-pointer transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Unggah Foto dari Komputer</span>
                        </button>
                        <Input
                          type="text"
                          value={clientFormLogo}
                          onChange={(e) => setClientFormLogo(e.target.value)}
                          placeholder="/clients/kemenhub.webp atau URL gambar"
                          fieldSize="sm"
                          className="w-full"
                          id="landing-client-dialog-client-form-logo"
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
                              <span className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full ${adminAccent} flex items-center justify-center text-[9px]`}>
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
                    <Button type="button" onClick={() => setClientModalOpen(false)} variant="secondary" size="md">
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      disabled={clientMutation !== null}
                      variant="primary"
                      size="md"
                      busy={clientMutation === "save"}
                      busyLabel="Menyimpan..."
                    >
                      {clientMutation === "save"
                        ? "Menyimpan..."
                        : editingClient
                          ? "Simpan Perubahan"
                          : "Tambahkan Mitra"}
                    </Button>
                  </div>
                </fieldset>
              </form>
            </div>
          </AdminDialogSurface>,
          document.body
        )}
    </>
  );
}
