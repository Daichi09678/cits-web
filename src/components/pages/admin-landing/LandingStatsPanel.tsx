"use client";

import Link from "next/link";
import { BarChart3, Edit3 } from "lucide-react";
import type { LandingEditorState } from "./useLandingEditor";

export default function LandingStatsPanel({ editor }: { editor: LandingEditorState }) {
  const { activeTab, vis, toggleSection, aboutData } = editor;
  return (
    <>
      {activeTab === "stats" && (
        <div className="bg-white dark:bg-[#16162d] p-6 rounded-2xl border border-slate-200/90 dark:border-white/10 shadow-xs space-y-6 animate-in fade-in">
          {/* Section Active Status Bar */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${vis.highlights ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}
              />
              <span className="text-xs font-bold text-slate-800 dark:text-white">
                Status Section Angka Capaian:{" "}
                {vis.highlights ? "Sedang Aktif Ditampilkan" : "Disembunyikan dari Halaman Depan"}
              </span>
            </div>
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-white/15 bg-white dark:bg-white/10 px-3 py-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={vis.highlights}
                onChange={() => toggleSection("highlights")}
                aria-label="Tampilkan section ini di beranda"
                className="h-4 w-4 rounded accent-orange-600 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Tampilkan di beranda</span>
            </label>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-orange-600" />
                <span>Statistik Perusahaan</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Beranda mengikuti Statistik Pencapaian di Tentang Kami agar angka selalu konsisten.
              </p>
            </div>
            <Link
              href="/admin/about"
              className="px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-accent dark:text-orange-300 border border-orange-200 dark:border-orange-800/50 hover:bg-orange-100 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Kelola di Tentang Kami</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {aboutData.stats.map((stat, idx) => (
              <div key={idx} className="space-y-2 rounded-2xl border border-slate-200 p-4 dark:border-white/10">
                <p className="text-lg font-black text-orange-600 dark:text-orange-400">{stat.value}</p>
                <p className="text-xs font-semibold text-slate-800 dark:text-white">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
