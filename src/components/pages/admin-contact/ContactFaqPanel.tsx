"use client";
import { adminAction } from "@/components/pages/admin/accentStyles";
import { BackOfficeInput as Input } from "@/components/ui/Input";
import { BackOfficeButton as Button } from "@/components/ui/Button";
import FormFeedback from "@/components/ui/FormFeedback";
import FieldLabel from "@/components/ui/FieldLabel";

import { Save, CheckCircle2, Trash2, X, HelpCircle, Plus, Edit3, Tag, Megaphone } from "lucide-react";
import type { ContactEditorState } from "./useContactEditor";

export default function ContactFaqPanel({ editor }: { editor: ContactEditorState }) {
  const {
    activeTab,
    faqSuccessMsg,
    settingsSaving,
    announcementActive,
    setAnnouncementActive,
    announcementText,
    setAnnouncementText,
    announcementLinkText,
    setAnnouncementLinkText,
    announcementLinkUrl,
    setAnnouncementLinkUrl,
    handleAddServiceOption,
    newServiceText,
    setNewServiceText,
    servicesList,
    handleDeleteServiceOption,
    canEdit,
    canCreate,
    canDelete,
    openAddFaqModal,
    faqsList,
    handleToggleFaqActive,
    openEditFaqModal,
    handleDeleteFaqItem,
    handleSaveFaqSettings,
  } = editor;
  return (
    <>
      {activeTab === "faqs" && (
        <fieldset disabled={settingsSaving} aria-label="Pengaturan FAQ dan layanan" className="mt-6 min-w-0 space-y-6">
          {faqSuccessMsg && (
            <FormFeedback tone="success" className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-semibold">{faqSuccessMsg}</span>
            </FormFeedback>
          )}

          {/* Sub-Section 1: Banner Pengumuman Halaman Kontak */}
          <div className="rounded-xl bg-white dark:bg-[#151528] border border-gray-200 dark:border-white/10 p-6 md:p-8">
            <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/50 flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">
                    Banner Pengumuman Khusus
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Tampilkan bar informasi penting di bagian atas halaman Hubungi Kami
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {announcementActive ? "Aktif" : "Nonaktif"}
                </span>
                <input
                  type="checkbox"
                  disabled={!canEdit}
                  checked={announcementActive}
                  onChange={(e) => setAnnouncementActive(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 accent-orange-600 cursor-pointer"
                />
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <FieldLabel htmlFor="contact-faq-panel-announcement-text" fieldSize="sm">
                  Isi Pesan Pengumuman
                </FieldLabel>
                <Input
                  type="text"
                  disabled={!canEdit}
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="Contoh: Konsultasi tatap muka dapat dijadwalkan via WhatsApp Hotline 24/7."
                  fieldSize="sm"
                  className="w-full"
                  id="contact-faq-panel-announcement-text"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel htmlFor="contact-faq-panel-announcement-link-text" fieldSize="sm">
                    Teks Tautan Aksi (Opsional)
                  </FieldLabel>
                  <Input
                    type="text"
                    disabled={!canEdit}
                    value={announcementLinkText}
                    onChange={(e) => setAnnouncementLinkText(e.target.value)}
                    placeholder="Contoh: Hubungi via WhatsApp"
                    fieldSize="sm"
                    className="w-full"
                    id="contact-faq-panel-announcement-link-text"
                  />
                </div>

                <div>
                  <FieldLabel htmlFor="contact-faq-panel-announcement-link-url" fieldSize="sm">
                    URL Tautan Tujuan (Opsional)
                  </FieldLabel>
                  <Input
                    type="text"
                    disabled={!canEdit}
                    value={announcementLinkUrl}
                    onChange={(e) => setAnnouncementLinkUrl(e.target.value)}
                    placeholder="Contoh: https://wa.me/6281119719677"
                    fieldSize="sm"
                    className="w-full"
                    id="contact-faq-panel-announcement-link-url"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sub-Section 2: Opsi Pilihan Layanan */}
          <div className="rounded-xl bg-white dark:bg-[#151528] border border-gray-200 dark:border-white/10 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-white/5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">
                  Pilihan Jenis Layanan pada Formulir
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Opsi yang dapat dipilih pengunjung saat mengirim permohonan konsultasi
                </p>
              </div>
            </div>

            {/* Add Service Option Form */}
            <form onSubmit={handleAddServiceOption} className="flex gap-2 mb-4">
              <Input
                type="text"
                disabled={!canCreate}
                aria-label="Opsi layanan baru"
                value={newServiceText}
                onChange={(e) => setNewServiceText(e.target.value)}
                placeholder="Ketik opsi layanan baru..."
                fieldSize="sm"
                className="flex-1"
              />
              <Button type="submit" variant="primary" size="md" disabled={!canCreate}>
                <Plus className="w-4 h-4" />
                <span>Tambah</span>
              </Button>
            </form>

            {/* Badges List */}
            <div className="flex flex-wrap gap-2">
              {servicesList.map((srv, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/10 text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10"
                >
                  <span>{srv}</span>
                  <Button
                    variant="unstyled"
                    size="none"
                    type="button"
                    disabled={!canDelete}
                    onClick={() => handleDeleteServiceOption(idx)}
                    className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    title="Hapus opsi ini"
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Sub-Section 3: FAQ Dinamis */}
          <div className="rounded-xl bg-white dark:bg-[#151528] border border-gray-200 dark:border-white/10 p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">Tanya Jawab (FAQ)</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Kelola daftar pertanyaan umum di halaman Hubungi Kami
                  </p>
                </div>
              </div>

              <Button
                variant="unstyled"
                size="none"
                type="button"
                disabled={!canCreate}
                onClick={openAddFaqModal}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl ${adminAction} font-bold text-xs shadow-xs transition-all cursor-pointer`}
              >
                <Plus className="w-4 h-4" />
                <span>Tambah FAQ</span>
              </Button>
            </div>

            {/* FAQ List */}
            <div className="space-y-3">
              {faqsList.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Belum ada FAQ. Klik tombol &quot;Tambah FAQ&quot; untuk membuat pertanyaan baru.
                </div>
              ) : (
                faqsList.map((faq) => (
                  <div
                    key={faq.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      faq.isActive
                        ? "bg-slate-50/70 dark:bg-white/5 border-slate-200/80 dark:border-white/10"
                        : "bg-slate-100/50 dark:bg-black/20 border-dashed border-slate-300 dark:border-white/10 opacity-70"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white">{faq.question}</h4>
                          {!faq.isActive && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              Nonaktif
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{faq.answer}</p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <Button
                          variant="unstyled"
                          size="none"
                          type="button"
                          disabled={!canEdit}
                          onClick={() => handleToggleFaqActive(faq.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                            faq.isActive
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                        >
                          {faq.isActive ? "Aktif" : "Nonaktif"}
                        </Button>

                        <Button
                          variant="unstyled"
                          size="none"
                          type="button"
                          disabled={!canEdit}
                          onClick={() => openEditFaqModal(faq)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20 cursor-pointer"
                          title="Edit FAQ"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="unstyled"
                          size="none"
                          type="button"
                          disabled={!canDelete}
                          onClick={() => handleDeleteFaqItem(faq.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
                          title="Hapus FAQ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Save All Tab 3 Button */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex justify-end">
              <Button
                type="button"
                disabled={!canEdit && !canCreate && !canDelete}
                onClick={handleSaveFaqSettings}
                variant="primary"
                size="md"
                busy={settingsSaving}
                busyLabel="Menyimpan..."
              >
                <Save className="w-4 h-4" />
                <span>Simpan Pengaturan</span>
              </Button>
            </div>
          </div>
        </fieldset>
      )}
    </>
  );
}
