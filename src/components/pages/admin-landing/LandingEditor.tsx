"use client";
import Button from "@/components/ui/Button";
import FormFeedback from "@/components/ui/FormFeedback";

import Link from "next/link";
import {
  LayoutTemplate,
  Save,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Flame,
  BarChart3,
  Layers,
  Eye,
  RotateCcw,
  Package,
  Building2,
} from "lucide-react";
import AdminTopbar from "@/components/pages/admin/AdminTopbar";
import type { LandingEditorState } from "./useLandingEditor";
import LandingHeroPanel from "./LandingHeroPanel";
import LandingStatsPanel from "./LandingStatsPanel";
import LandingServicesPanel from "./LandingServicesPanel";
import LandingProductsPanel from "./LandingProductsPanel";
import LandingClientsPanel from "./LandingClientsPanel";
import LandingCtaPanel from "./LandingCtaPanel";

export default function LandingEditor({ editor }: { editor: LandingEditorState }) {
  const { handleReset, handleSave, isSaving, savedSuccess, vis, setActiveTab, activeTab, saveError } = editor;
  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminTopbar
        title="Manajemen Landing Page (Halaman Utama)"
        description="Aktifkan/nonaktifkan konten section, atur teks hero, console mockup, statistik capaian, pilar layanan, etalase produk, dan banner CTA secara lengkap dan realtime."
      />

      <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Top Header Card */}
        <div className="bg-white dark:bg-[#16162d] p-6 rounded-2xl border border-slate-200/90 dark:border-white/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-600/10 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
              <LayoutTemplate className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Kontrol Halaman Utama Web (Landing Page)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Semua teks, kartu layanan, produk, dan visibilitas section tersinkron langsung ke beranda pengunjung.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-slate-400" />
              <span>Lihat Halaman Utama</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </Link>

            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Kembalikan ke Teks Bawaan"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <Button
              onClick={() => handleSave()}
              disabled={isSaving}
              variant="primary"
              size="md"
              busy={isSaving}
              busyLabel="Menyimpan..."
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Menyimpan..." : "Simpan Perubahan"}</span>
            </Button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {savedSuccess && (
          <FormFeedback tone="success" className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-semibold">Konten Beranda berhasil disimpan.</span>
            </div>
            <Link
              href="/"
              target="_blank"
              className="text-[11px] underline font-bold hover:text-emerald-950 dark:hover:text-emerald-100 flex items-center gap-1"
            >
              Cek Halaman Depan <ExternalLink className="w-3 h-3" />
            </Link>
          </FormFeedback>
        )}
        {saveError && <FormFeedback>{saveError}</FormFeedback>}

        {/* MASTER SECTION VISIBILITY SWITCHBOARD */}
        <div className="bg-white dark:bg-[#16162d] p-5 rounded-2xl border border-slate-200/90 dark:border-white/10 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Kontrol Visibilitas Section Beranda (Aktifkan / Nonaktifkan)
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Klik tombol untuk menyembunyikan atau menampilkan section di web utama
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
            {[
              { id: "hero", label: "Hero & Headline", active: vis.hero },
              { id: "highlights", label: "Angka Capaian", active: vis.highlights },
              { id: "services", label: "Pilar Layanan", active: vis.services },
              { id: "products", label: "Produk Unggulan", active: vis.products },
              { id: "clients", label: "Mitra & Klien", active: vis.clients },
              { id: "cta", label: "Banner Ajakan", active: vis.cta },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveTab((s.id === "highlights" ? "stats" : s.id) as typeof activeTab)}
                title={`Buka pengaturan section ${s.label}`}
                className={`p-3 rounded-xl border flex flex-col items-center justify-between gap-2 text-center transition-all cursor-pointer ${
                  s.active
                    ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-300 shadow-xs"
                    : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 opacity-70"
                }`}
              >
                <span className="text-[11px] font-bold">{s.label}</span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    s.active
                      ? "bg-emerald-200/70 dark:bg-emerald-900/50 text-emerald-950 dark:text-emerald-200"
                      : "bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      s.active ? "bg-emerald-600 dark:bg-emerald-400 animate-pulse" : "bg-slate-400"
                    }`}
                  />
                  <span>{s.active ? "Aktif" : "Sembunyi"}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-white/10 gap-2 overflow-x-auto pb-px">
          {[
            { id: "hero", label: "Hero & Headline", icon: Flame, isVisible: vis.hero },
            { id: "stats", label: "Angka Capaian", icon: BarChart3, isVisible: vis.highlights },
            { id: "services", label: "Pilar Layanan (Bento Grid)", icon: Layers, isVisible: vis.services },
            { id: "products", label: "Produk Unggulan", icon: Package, isVisible: vis.products },
            { id: "clients", label: "Mitra & Klien", icon: Building2, isVisible: vis.clients },
            { id: "cta", label: "Banner Ajakan (CTA)", icon: Sparkles, isVisible: vis.cta },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "border-orange-600 text-orange-600 dark:text-orange-400"
                    : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-orange-600 dark:text-orange-400" : ""}`} />
                <span>{tab.label}</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    tab.isVisible ? "bg-emerald-500" : "bg-slate-300 dark:bg-white/20"
                  }`}
                  title={tab.isVisible ? "Section Aktif" : "Section Disembunyikan"}
                />
              </button>
            );
          })}
        </div>

        {/* Form Content */}
        <form onSubmit={handleSave} className="space-y-6">
          <fieldset disabled={isSaving} aria-label="Konten Beranda" className="space-y-6">
            {/* TAB 1: HERO SECTION */}
            <LandingHeroPanel editor={editor} />

            {/* TAB 2: STATS / HIGHLIGHTS */}
            <LandingStatsPanel editor={editor} />

            {/* TAB 3: SERVICES INTRO & BENTO GRID CARDS */}
            <LandingServicesPanel editor={editor} />

            {/* TAB 4: PRODUCTS INTRO & BENTO GRID CARDS */}
            <LandingProductsPanel editor={editor} />

            <LandingClientsPanel editor={editor} />

            {/* TAB 6: CTA BANNER */}
            <LandingCtaPanel editor={editor} />
          </fieldset>
        </form>
      </div>
    </div>
  );
}
