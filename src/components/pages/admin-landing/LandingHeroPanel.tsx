"use client";
import Input, { Textarea } from "@/components/ui/Input";
import FieldLabel from "@/components/ui/FieldLabel";

import { CheckCircle2, Plus, Trash2, Flame, Eye } from "lucide-react";
import type { LandingEditorState } from "./useLandingEditor";
import LandingHeroCtaFields from "./LandingHeroCtaFields";

export default function LandingHeroPanel({ editor }: { editor: LandingEditorState }) {
  const {
    activeTab,
    vis,
    toggleSection,
    formData,
    setFormData,
    addTypewriterWord,
    handleTypewriterChange,
    removeTypewriterWord,
    addTrustBadge,
    handleTrustBadgeChange,
    removeTrustBadge,
  } = editor;
  return (
    <>
      {activeTab === "hero" && (
        <div className="space-y-6 animate-in fade-in">
          {/* Section Active Status Bar */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${vis.hero ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}
              />
              <span className="text-xs font-bold text-slate-800 dark:text-white">
                Status Section Hero: {vis.hero ? "Sedang Aktif Ditampilkan" : "Disembunyikan dari Halaman Depan"}
              </span>
            </div>
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-white/15 bg-white dark:bg-white/10 px-3 py-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={vis.hero}
                onChange={() => toggleSection("hero")}
                aria-label="Tampilkan section ini di beranda"
                className="h-4 w-4 rounded accent-orange-600 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Tampilkan di beranda</span>
            </label>
          </div>

          {/* Live Preview Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-[#121226] text-white border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/10">
              <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-orange-400">
                <Eye className="w-3.5 h-3.5" /> Pratinjau Tampilan Hero
              </span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded">Desktop View</span>
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/60 border border-orange-800/60 text-orange-300 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span>{formData.hero.badgeText || "Badge Teks Kosong"}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {formData.hero.headlinePrefix || "Ciptakan Solusi"}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                  [{formData.hero.typewriterWords[0] || "Animasi Kata"}]
                </span>
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                {formData.hero.subheadline || "Subheadline deskripsi belum diisi."}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <span className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg text-xs font-bold shadow-md">
                  {formData.hero.primaryCtaText || "Tombol Utama"} →
                </span>
                <span className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg text-xs font-semibold">
                  {formData.hero.secondaryCtaText || "Tombol Kedua"}
                </span>
              </div>
            </div>
          </div>

          {/* Form Input Fields */}
          <div className="bg-white dark:bg-[#16162d] p-6 rounded-2xl border border-slate-200/90 dark:border-white/10 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-600" />
              <span>Pengaturan Headline & Deskripsi Hero</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="landing-hero-panel-form-data-hero-badge-text" fieldSize="sm">
                  Badge Teks Atas
                </FieldLabel>
                <Input
                  type="text"
                  value={formData.hero.badgeText}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, badgeText: e.target.value },
                    })
                  }
                  placeholder="e.g. Penyedia Solusi Teknologi Informasi Sejak 2006"
                  fieldSize="sm"
                  className="w-full"
                  id="landing-hero-panel-form-data-hero-badge-text"
                />
              </div>

              <div>
                <FieldLabel htmlFor="landing-hero-panel-form-data-hero-headline-prefix" fieldSize="sm">
                  Awalan Judul Utama (Headline Prefix)
                </FieldLabel>
                <Input
                  type="text"
                  value={formData.hero.headlinePrefix}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, headlinePrefix: e.target.value },
                    })
                  }
                  placeholder="e.g. Ciptakan Solusi"
                  fieldSize="sm"
                  className="w-full"
                  id="landing-hero-panel-form-data-hero-headline-prefix"
                />
              </div>
            </div>

            {/* Typewriter Words Array */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Kata-Kata Animasi Typewriter (Bergantian)
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Kata ini akan berganti-ganti secara otomatis dengan efek animasi ketik di judul utama.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addTypewriterWord}
                  className="px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800/50 hover:bg-orange-100 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Kata</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {formData.hero.typewriterWords.map((word, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <Input
                      type="text"
                      value={word}
                      onChange={(e) => handleTypewriterChange(idx, e.target.value)}
                      placeholder={`Kata ke-${idx + 1}`}
                      fieldSize="sm"
                      className="min-w-0 flex-1"
                    />
                    {formData.hero.typewriterWords.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTypewriterWord(idx)}
                        className="p-2 text-slate-400 hover:text-red-500 cursor-pointer"
                        title="Hapus kata"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Subheadline Textarea */}
            <div>
              <FieldLabel htmlFor="landing-hero-panel-form-data-hero-subheadline" fieldSize="sm">
                Deskripsi Lengkap Hero (Subheadline)
              </FieldLabel>
              <Textarea
                rows={3}
                value={formData.hero.subheadline}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, subheadline: e.target.value },
                  })
                }
                fieldSize="sm"
                className="w-full"
                id="landing-hero-panel-form-data-hero-subheadline"
              />
            </div>

            {/* Action Buttons */}
            <LandingHeroCtaFields editor={editor} />

            {/* Trust Badges */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Poin Kepercayaan (Trust Badges Bawah Hero)
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Ditampilkan dengan ikon centang hijau di bawah tombol hero.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addTrustBadge}
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Poin</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {formData.hero.trustBadges.map((badge, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <Input
                      type="text"
                      value={badge}
                      onChange={(e) => handleTrustBadgeChange(idx, e.target.value)}
                      fieldSize="sm"
                      className="min-w-0 flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeTrustBadge(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Mockup Settings */}
            <div className="p-4 rounded-xl bg-orange-50/60 dark:bg-white/5 border border-orange-200/80 dark:border-white/10 space-y-3 pt-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-orange-900 dark:text-orange-300">
                    Mockup Console Interaktif (Di Sisi Kanan Hero)
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Menampilkan dashboard portal enterprise animasi di sebelah teks judul.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, showMockup: formData.hero.showMockup === false ? true : false },
                    })
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    formData.hero.showMockup !== false
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-300 dark:bg-white/20 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span>{formData.hero.showMockup !== false ? "Mockup Aktif" : "Mockup Disembunyikan"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div>
                  <FieldLabel
                    htmlFor="landing-hero-panel-form-data-hero-mockup-title-cits-enterprise-system-portal"
                    fieldSize="sm"
                  >
                    Judul Header Console
                  </FieldLabel>
                  <Input
                    type="text"
                    value={formData.hero.mockupTitle || "CITS Enterprise System Portal"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, mockupTitle: e.target.value },
                      })
                    }
                    fieldSize="sm"
                    className="w-full"
                    id="landing-hero-panel-form-data-hero-mockup-title-cits-enterprise-system-portal"
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="landing-hero-panel-form-data-hero-mockup-status-sistem-aktif" fieldSize="sm">
                    Status Label Console
                  </FieldLabel>
                  <Input
                    type="text"
                    value={formData.hero.mockupStatus || "Sistem Aktif"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, mockupStatus: e.target.value },
                      })
                    }
                    fieldSize="sm"
                    className="w-full"
                    id="landing-hero-panel-form-data-hero-mockup-status-sistem-aktif"
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
