"use client";
import { BackOfficeInput as Input, BackOfficeTextarea as Textarea } from "@/components/ui/Input";
import FieldLabel from "@/components/ui/FieldLabel";

import Link from "next/link";
import { Sparkles, ExternalLink, Layers } from "lucide-react";
import type { LandingEditorState } from "./useLandingEditor";
import LandingFocusFields from "./LandingFocusFields";

export default function LandingServicesPanel({ editor }: { editor: LandingEditorState }) {
  const { activeTab, vis, toggleSection, formData, setFormData } = editor;
  return (
    <>
      {activeTab === "services" && (
        <div className="bg-white dark:bg-[#16162d] p-6 rounded-2xl border border-slate-200/90 dark:border-white/10 shadow-xs space-y-6 animate-in fade-in">
          {/* Section Active Status Bar */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${vis.services ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}
              />
              <span className="text-xs font-bold text-slate-800 dark:text-white">
                Status Section Pilar Layanan:{" "}
                {vis.services ? "Sedang Aktif Ditampilkan" : "Disembunyikan dari Halaman Depan"}
              </span>
            </div>
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-white/15 bg-white dark:bg-white/10 px-3 py-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={vis.services}
                onChange={() => toggleSection("services")}
                aria-label="Tampilkan section ini di beranda"
                className="h-4 w-4 rounded accent-orange-600 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Tampilkan di beranda</span>
            </label>
          </div>

          {/* Section Header */}
          <div className="space-y-4 pb-4 border-b border-slate-100 dark:border-white/10">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-600" />
              <span>Teks Pengantar Section Layanan</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="landing-services-panel-form-data-services-intro-badge" fieldSize="sm">
                  Badge Teks Layanan
                </FieldLabel>
                <Input
                  type="text"
                  value={formData.servicesIntro.badge}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      servicesIntro: { ...formData.servicesIntro, badge: e.target.value },
                    })
                  }
                  placeholder="e.g. Pilar Layanan Utama"
                  fieldSize="sm"
                  className="w-full"
                  id="landing-services-panel-form-data-services-intro-badge"
                />
              </div>

              <div>
                <FieldLabel htmlFor="landing-services-panel-form-data-services-intro-title" fieldSize="sm">
                  Judul Utama Section
                </FieldLabel>
                <Input
                  type="text"
                  value={formData.servicesIntro.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      servicesIntro: { ...formData.servicesIntro, title: e.target.value },
                    })
                  }
                  placeholder="e.g. Layanan Unggulan Kami"
                  fieldSize="sm"
                  className="w-full"
                  id="landing-services-panel-form-data-services-intro-title"
                />
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="landing-services-panel-form-data-services-intro-subtitle" fieldSize="sm">
                Subjudul / Deskripsi Pendukung
              </FieldLabel>
              <Textarea
                rows={2}
                value={formData.servicesIntro.subtitle}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    servicesIntro: { ...formData.servicesIntro, subtitle: e.target.value },
                  })
                }
                fieldSize="sm"
                className="w-full"
                id="landing-services-panel-form-data-services-intro-subtitle"
              />
            </div>
          </div>

          {/* 4 BENTO CARDS OF SERVICES */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>Data Layanan & Prinsip Kerja Beranda</span>
              </h4>
              <Link
                href="/admin/services"
                className="text-orange-600 dark:text-orange-400 font-bold hover:underline flex items-center gap-1 text-[11px]"
              >
                Kelola 3 Pilar di Halaman /services <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            <LandingFocusFields editor={editor} />

            {/* Bottom CTA Services */}
            <div className="p-4 rounded-xl bg-orange-50/50 dark:bg-white/5 border border-orange-200/80 dark:border-white/10 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <FieldLabel
                  htmlFor="landing-services-panel-form-data-services-intro-bottom-cta-text-lihat-alur-kerja-spesifikasi-lengkap-layanan"
                  fieldSize="sm"
                >
                  Teks Tombol Bawah Layanan
                </FieldLabel>
                <Input
                  type="text"
                  value={formData.servicesIntro.bottomCtaText || "Lihat Alur Kerja & Spesifikasi Lengkap Layanan"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      servicesIntro: { ...formData.servicesIntro, bottomCtaText: e.target.value },
                    })
                  }
                  fieldSize="sm"
                  className="w-full"
                  id="landing-services-panel-form-data-services-intro-bottom-cta-text-lihat-alur-kerja-spesifikasi-lengkap-layanan"
                />
              </div>
              <div>
                <FieldLabel
                  htmlFor="landing-services-panel-form-data-services-intro-bottom-cta-link-services"
                  fieldSize="sm"
                >
                  URL Tombol Bawah Layanan
                </FieldLabel>
                <Input
                  type="text"
                  value={formData.servicesIntro.bottomCtaLink || "/services"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      servicesIntro: { ...formData.servicesIntro, bottomCtaLink: e.target.value },
                    })
                  }
                  fieldSize="sm"
                  className="w-full"
                  id="landing-services-panel-form-data-services-intro-bottom-cta-link-services"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
