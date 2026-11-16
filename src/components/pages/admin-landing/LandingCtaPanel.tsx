"use client";
import Input, { Textarea } from "@/components/ui/Input";
import FieldLabel from "@/components/ui/FieldLabel";

import { Sparkles } from "lucide-react";
import type { LandingEditorState } from "./useLandingEditor";

export default function LandingCtaPanel({ editor }: { editor: LandingEditorState }) {
  const { activeTab, vis, toggleSection, formData, setFormData } = editor;
  return (
    <>
      {activeTab === "cta" && (
        <div className="bg-white dark:bg-[#16162d] p-6 rounded-2xl border border-slate-200/90 dark:border-white/10 shadow-xs space-y-6 animate-in fade-in">
          {/* Section Active Status Bar */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${vis.cta ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}
              />
              <span className="text-xs font-bold text-slate-800 dark:text-white">
                Status Section Banner CTA: {vis.cta ? "Sedang Aktif Ditampilkan" : "Disembunyikan dari Halaman Depan"}
              </span>
            </div>
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-white/15 bg-white dark:bg-white/10 px-3 py-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={vis.cta}
                onChange={() => toggleSection("cta")}
                aria-label="Tampilkan section ini di beranda"
                className="h-4 w-4 rounded accent-orange-600 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Tampilkan di beranda</span>
            </label>
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
              <FieldLabel htmlFor="landing-cta-panel-form-data-cta-badge" fieldSize="sm">
                Badge Banner
              </FieldLabel>
              <Input
                type="text"
                value={formData.cta.badge}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cta: { ...formData.cta, badge: e.target.value },
                  })
                }
                placeholder="e.g. Mitra Transformasi Digital Terpercaya"
                fieldSize="sm"
                className="w-full"
                id="landing-cta-panel-form-data-cta-badge"
              />
            </div>

            <div>
              <FieldLabel htmlFor="landing-cta-panel-form-data-cta-title" fieldSize="sm">
                Judul Utama CTA
              </FieldLabel>
              <Input
                type="text"
                value={formData.cta.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cta: { ...formData.cta, title: e.target.value },
                  })
                }
                fieldSize="sm"
                className="w-full"
                id="landing-cta-panel-form-data-cta-title"
              />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="landing-cta-panel-form-data-cta-subtitle" fieldSize="sm">
              Deskripsi Ajakan Konsultasi
            </FieldLabel>
            <Textarea
              rows={2}
              value={formData.cta.subtitle}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  cta: { ...formData.cta, subtitle: e.target.value },
                })
              }
              fieldSize="sm"
              className="w-full"
              id="landing-cta-panel-form-data-cta-subtitle"
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-white/10">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
              <span className="block font-bold text-xs text-orange-600 dark:text-orange-400">Tombol Utama CTA</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <FieldLabel htmlFor="landing-cta-panel-form-data-cta-primary-text" fieldSize="sm">
                    Teks Tombol
                  </FieldLabel>
                  <Input
                    type="text"
                    value={formData.cta.primaryText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cta: { ...formData.cta, primaryText: e.target.value },
                      })
                    }
                    fieldSize="sm"
                    className="w-full"
                    id="landing-cta-panel-form-data-cta-primary-text"
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="landing-cta-panel-form-data-cta-primary-link" fieldSize="sm">
                    Link Tujuan
                  </FieldLabel>
                  <Input
                    type="text"
                    value={formData.cta.primaryLink}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cta: { ...formData.cta, primaryLink: e.target.value },
                      })
                    }
                    fieldSize="sm"
                    className="w-full"
                    id="landing-cta-panel-form-data-cta-primary-link"
                  />
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
              <span className="block font-bold text-xs text-slate-700 dark:text-slate-300">Tombol Sekunder CTA</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <FieldLabel htmlFor="landing-cta-panel-form-data-cta-secondary-text" fieldSize="sm">
                    Teks Tombol
                  </FieldLabel>
                  <Input
                    type="text"
                    value={formData.cta.secondaryText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cta: { ...formData.cta, secondaryText: e.target.value },
                      })
                    }
                    fieldSize="sm"
                    className="w-full"
                    id="landing-cta-panel-form-data-cta-secondary-text"
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="landing-cta-panel-form-data-cta-secondary-link" fieldSize="sm">
                    Link Tujuan
                  </FieldLabel>
                  <Input
                    type="text"
                    value={formData.cta.secondaryLink}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cta: { ...formData.cta, secondaryLink: e.target.value },
                      })
                    }
                    fieldSize="sm"
                    className="w-full"
                    id="landing-cta-panel-form-data-cta-secondary-link"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
