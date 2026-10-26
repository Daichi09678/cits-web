"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Building2 } from "lucide-react";
import Link from "next/link";
import type { CaseStudyItem } from "@/types/schema";

interface HeroMockupProps {
  title?: string;
  status?: string;
  projects?: CaseStudyItem[];
}

export default function HeroMockup({ title, status, projects = [] }: HeroMockupProps) {
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
        {/* Console Header - Bersih & Profesional */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-100/80 dark:bg-[#121222] border-b border-slate-200 dark:border-white/10 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex gap-1.5 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
            </div>
            <span className="text-slate-800 dark:text-white text-xs font-bold whitespace-nowrap ml-1">
              {title ?? "CITS Enterprise System Portal"}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold whitespace-nowrap">
              {status ?? "Sistem Aktif"}
            </span>
          </div>
        </div>

        {/* Dashboard Body */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Main Services Console - Fokus Status Layanan Publik CITS */}
          <div className="rounded-xl bg-slate-50/90 dark:bg-[#121222] border border-slate-200/80 dark:border-white/10 p-3.5 sm:p-4 space-y-3">
            {/* Header Status Layanan */}
            <div className="flex items-center justify-between text-[11px] sm:text-xs pb-2 border-b border-slate-200 dark:border-white/10">
              <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <span>Monitoring Layanan Terpadu Instansi</span>
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 text-[10px] sm:text-[11px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Normal
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {projects
                .filter((project) => project.isActive !== false && project.showOnHome !== false)
                .slice(0, 3)
                .map((project) => (
                  <Link
                    key={project.id}
                    href="/portfolio"
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-200/70 bg-white p-2.5 transition hover:border-orange-400 dark:border-white/5 dark:bg-[#1a1a32]"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                          {project.clientShort || project.client}
                        </p>
                        <p className="truncate text-[11px] text-slate-600 dark:text-slate-300">{project.title}</p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        {project.measurableImpact.highlightValue}
                      </p>
                      <p className="max-w-28 truncate text-[10px] text-slate-500 dark:text-slate-400">
                        {project.measurableImpact.highlightLabel}
                      </p>
                    </div>
                  </Link>
                ))}
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
