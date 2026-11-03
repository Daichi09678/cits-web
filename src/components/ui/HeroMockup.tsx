"use client";

import { motion } from "framer-motion";
import { Building2, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { CaseStudyItem } from "@/types/schema";

interface HeroMockupProps {
  title?: string;
  description?: string;
  projects?: CaseStudyItem[];
}

export default function HeroMockup({ title, description, projects = [] }: HeroMockupProps) {
  const featured = projects.filter((project) => project.isActive !== false && project.showOnHome !== false).slice(0, 3);
  const panelTitle = title?.trim() && title !== "CITS Enterprise System Portal" ? title : "Pilihan Proyek CITS";

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-sm dark:border-white/10 dark:bg-[#151528] dark:text-white"
      >
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 dark:border-white/10 dark:bg-[#121222]">
          <h2 className="text-base font-bold leading-snug">{panelTitle}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {description?.trim() || "Kenali kebutuhan dan solusi yang dikerjakan CITS melalui portofolio berikut."}
          </p>
        </div>
        <div className="p-4 sm:p-5">
          {featured.length ? (
            <ul className="space-y-3">
              {featured.map((project) => (
                <li key={project.id}>
                  <Link
                    href={`/portfolio/${encodeURIComponent(project.id)}`}
                    aria-label={`Lihat detail studi kasus ${project.clientShort || project.client}`}
                    className="group flex min-h-11 items-start gap-3 rounded-xl border border-slate-200 p-3.5 transition-colors hover:border-orange-400 hover:bg-orange-50/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 dark:border-white/10 dark:hover:bg-white/5"
                  >
                    <Building2
                      className="mt-0.5 h-5 w-5 shrink-0 text-slate-500 dark:text-slate-300"
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1 [overflow-wrap:anywhere]">
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {project.clientShort || project.client}
                      </p>
                      <h3 className="mt-1 text-sm font-semibold leading-relaxed">{project.title}</h3>
                      {project.servicePillar?.trim() && (
                        <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300">{project.servicePillar}</p>
                      )}
                    </div>
                    <ArrowUpRight
                      className="mt-0.5 h-4 w-4 shrink-0 text-orange-800 dark:text-orange-300"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Pilihan proyek untuk beranda belum tersedia. Anda dapat melihat proyek yang dipublikasikan pada halaman
              portofolio.
            </p>
          )}
          <Link
            href="/portfolio"
            className="mt-4 flex min-h-11 items-center justify-between gap-3 border-t border-slate-200 pt-4 text-sm font-semibold text-orange-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 dark:border-white/10 dark:text-orange-300"
          >
            Lihat portofolio CITS
            <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
