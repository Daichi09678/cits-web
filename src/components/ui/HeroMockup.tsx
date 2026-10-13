"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Zap,
  Building2,
  Ship,
  TrendingUp,
} from "lucide-react";

export default function HeroMockup() {
  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Ambient subtle shadow */}
      <div className="absolute -inset-4 bg-slate-200/50 dark:bg-black/30 rounded-3xl blur-2xl -z-10" />

      {/* Main Container with subtle floating animation */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative rounded-2xl bg-white/95 dark:bg-[#151528] text-slate-800 dark:text-white border border-slate-200/90 dark:border-white/10 shadow-xl shadow-brand/10 dark:shadow-black/40 backdrop-blur-xl overflow-hidden"
      >
        {/* Terminal Header - Dijamin persis 1 baris (single line, no wrapping) */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-100/80 dark:bg-[#121222] border-b border-slate-200 dark:border-white/10 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex gap-1.5 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
            </div>
            <span className="font-mono text-slate-700 dark:text-slate-200 text-xs font-semibold whitespace-nowrap ml-1">
              cits-core // portal-publik
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold whitespace-nowrap">
              Sistem Aktif
            </span>
          </div>
        </div>

        {/* Dashboard Body */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Main Services Console - Fokus Status Layanan Publik CITS */}
          <div className="rounded-xl bg-slate-50/90 dark:bg-[#121222] border border-slate-200/80 dark:border-white/10 p-3.5 sm:p-4 space-y-3">
            {/* Command prompt banner */}
            <div className="flex items-center justify-between text-[11px] sm:text-xs pb-2 border-b border-slate-200 dark:border-white/10 font-mono">
              <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-medium">
                <span className="text-orange-600 dark:text-orange-400 font-bold">$</span>
                <span>cits status --layanan-publik</span>
                <span className="w-1.5 h-3 bg-orange-600 dark:bg-orange-400 animate-pulse inline-block" />
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 text-[10px] sm:text-[11px] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Normal
              </span>
            </div>

            {/* 3 Layanan Unggulan CITS */}
            <div className="space-y-2 text-xs">
              {/* 1. Kemendagri */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-[#1a1a32] border border-slate-200/70 dark:border-white/5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white text-xs truncate">
                      Kemendagri RI <span className="font-normal text-slate-600 dark:text-slate-300">· Layanan Data e-KTP</span>
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2 font-mono flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/60">
                    200 OK
                  </span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">12ms</span>
                </div>
              </div>

              {/* 2. Kemenhub */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-[#1a1a32] border border-slate-200/70 dark:border-white/5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-md bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 flex items-center justify-center shrink-0">
                    <Ship className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white text-xs truncate">
                      Kemenhub RI <span className="font-normal text-slate-600 dark:text-slate-300">· SIMLALA & Pelabuhan</span>
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2 font-mono flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-100 text-orange-900 dark:bg-orange-950/80 dark:text-orange-200 border border-orange-300 dark:border-orange-800/60">
                    SINKRON
                  </span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">Terhubung</span>
                </div>
              </div>

              {/* 3. Kementerian Investasi */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-[#1a1a32] border border-slate-200/70 dark:border-white/5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-md bg-blue-100 dark:bg-cyan-950/60 text-blue-700 dark:text-cyan-400 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white text-xs truncate">
                      Kementerian Investasi <span className="font-normal text-slate-600 dark:text-slate-300">· Satu Data BKPM</span>
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2 font-mono flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800 dark:bg-cyan-950/80 dark:text-cyan-400 border border-blue-200 dark:border-cyan-800/60">
                    STREAM
                  </span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">1.2 GB/s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trust & Compliance Bar - Terintegrasi rapi di dalam card, bebas tabrakan/tertumpuk */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/80 dark:border-white/10 text-[11px]">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <div className="w-5 h-5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold truncate">Standar ISO & Pemerintah</span>
            </div>

            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 justify-end">
              <div className="w-5 h-5 rounded bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 flex items-center justify-center shrink-0">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold truncate">Dukungan Teknis 24/7</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
