"use client";

import { useState } from "react";
import { consultationHref } from "@/lib/consultation";
import { useModalFocus } from "@/components/ui/useModalFocus";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  ShieldCheck,
  Award,
  ArrowRight,
  CheckCircle2,
  Target,
  Lightbulb,
  Layers,
  ChevronRight,
  X,
  Briefcase,
  Compass,
  LayoutGrid,
  Table as TableIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/animations/ScrollReveal";
import GradientText from "@/components/ui/GradientText";
import GridPattern from "@/components/ui/GridPattern";
import FloatingShapes from "@/components/animations/FloatingShapes";
import SpotlightCard from "@/components/ui/SpotlightCard";
import TestimonialSlider from "@/components/ui/TestimonialSlider";
import { useCitsStore } from "@/stores/citsStore";
import { usePublicPageContent } from "@/lib/publicPageContentClient";
import { pageCollection } from "@/lib/publicPageContent";
import { CaseStudyItem } from "@/types/schema";

export type { CaseStudyItem };

const categoryColors: Record<string, string> = {
  "Kementerian & Lembaga Pusat":
    "bg-red-100 dark:bg-red-950/60 text-red-900 dark:text-red-300 border border-red-200/80 dark:border-red-800/60",
  "BUMN & Energi Strategis":
    "bg-amber-100 dark:bg-amber-950/60 text-amber-950 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60",
  "Transportasi & Maritim":
    "bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60",
  "Satu Data & Geospasial":
    "bg-teal-100 dark:bg-teal-950/60 text-teal-900 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/60",
  "Intelijen Bisnis & Analitik":
    "bg-purple-100 dark:bg-purple-950/60 text-purple-950 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/60",
};

export default function PortfolioPage() {
  const { content } = usePublicPageContent("portfolio");
  const impactMetrics = pageCollection<{ value: string; label: string; description: string }>(content, "impactMetrics");
  const testimonials = pageCollection<{ quote: string; name: string; company: string }>(content, "testimonials");
  const { caseStudies: storeCaseStudies } = useCitsStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua Studi Kasus");
  const [activeModalStudy, setActiveModalStudy] = useState<CaseStudyItem | null>(null);
  const modalRef = useModalFocus(!!activeModalStudy, () => setActiveModalStudy(null));
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const activeStudies = storeCaseStudies.filter((item) => item.isActive !== false);
  const categories = ["Semua Studi Kasus", ...new Set(activeStudies.map((item) => item.sector))];

  const flagshipProjects = activeStudies.filter((item) => item.isFlagship);

  const filteredProjects =
    selectedCategory === "Semua Studi Kasus"
      ? activeStudies
      : activeStudies.filter((p) => p.sector === selectedCategory);

  return (
    <main id="main-content" className="min-h-screen">
      {/* 1. HERO SECTION */}
      {content.visibility["portfolio-hero-heading"] !== false && (
        <section
          aria-labelledby="portfolio-hero-heading"
          className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-[#1A1A2E] dark:to-slate-950 py-16 md:py-24 overflow-hidden transition-colors"
        >
          <FloatingShapes />
          <GridPattern className="opacity-90" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-900 dark:text-orange-300 border border-orange-200/80 dark:border-orange-800/60 text-xs font-bold tracking-wide uppercase shadow-sm mb-5">
                <Briefcase className="w-3.5 h-3.5 text-orange-700 dark:text-orange-400" />
                <span>{content.texts["portfolio_hero_text_1"]}</span>
              </div>

              <h1
                id="portfolio-hero-heading"
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-dark dark:text-white tracking-tight leading-[1.15]"
              >
                {content.texts["portfolio_hero_text_2"]} <br />
                <GradientText>{content.texts["portfolio_hero_text_3"]}</GradientText>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="mt-5 text-gray-700 dark:text-white/85 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
                {content.texts["portfolio_hero_text_4"]}
              </p>
            </ScrollReveal>

            {/* Quick Credential Highlights */}
            <ScrollReveal delay={0.2}>
              <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs">
                <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/10 text-gray-800 dark:text-white font-semibold border border-gray-200 dark:border-white/15 shadow-sm">
                  <Building2 className="w-4 h-4 text-orange-700 dark:text-orange-400" />
                  {content.texts["portfolio_hero_text_5"]}
                </span>
                <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/10 text-gray-800 dark:text-white font-semibold border border-gray-200 dark:border-white/15 shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  {content.texts["portfolio_hero_text_6"]}
                </span>
                <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/10 text-gray-800 dark:text-white font-semibold border border-gray-200 dark:border-white/15 shadow-sm">
                  <Award className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                  {content.texts["portfolio_hero_text_7"]}
                </span>
              </div>
            </ScrollReveal>

            {/* Contextual Clarity Banner (Distinction between Portfolio Case Studies & Products) */}
            <ScrollReveal delay={0.25}>
              <div className="mt-10 max-w-4xl mx-auto p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-[#16162c]/90 border border-orange-200/80 dark:border-orange-900/40 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-800/60 flex items-center justify-center text-orange-700 dark:text-orange-400 shrink-0 mt-0.5">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-dark dark:text-white">
                      {content.texts["portfolio_hero_text_8"]}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-white/75 mt-0.5">
                      {content.texts["portfolio_hero_text_9"]}{" "}
                      <strong className="text-dark dark:text-white">{content.texts["portfolio_hero_text_10"]}</strong>
                      {content.texts["portfolio_hero_text_11"]}
                    </p>
                  </div>
                </div>
                <Link
                  href={content.texts["portfolio_hero_href_12"]}
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-orange-600 hover:text-white text-gray-800 dark:text-white text-xs font-bold border border-gray-200 dark:border-white/15 transition-all shadow-sm"
                >
                  {content.texts["portfolio_hero_text_13"]}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* 2. FLAGSHIP STRATEGIC PROJECTS SHOWCASE */}
      {content.visibility["flagship-heading"] !== false && (
        <section
          aria-labelledby="flagship-heading"
          className="py-12 md:py-20 bg-slate-50/70 dark:bg-[#151528] border-y border-gray-200/70 dark:border-white/10 transition-colors"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                <div>
                  <span className="inline-block text-xs font-bold text-orange-900 dark:text-orange-300 bg-orange-100 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-800/60 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                    {content.texts["flagship_text_1"]}
                  </span>
                  <h2
                    id="flagship-heading"
                    className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-dark dark:text-white"
                  >
                    {content.texts["flagship_text_2"]} <GradientText>{content.texts["flagship_text_3"]}</GradientText>
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-white/75 max-w-md">
                  {content.texts["flagship_text_4"]}
                </p>
              </div>
            </ScrollReveal>

            <div className="grid lg:grid-cols-2 gap-8 items-stretch">
              {flagshipProjects.map((project, idx) => (
                <ScrollReveal key={project.id} delay={idx * 0.15} className="h-full">
                  <SpotlightCard className="h-full">
                    <article className="p-7 sm:p-9 flex flex-col justify-between h-full bg-white dark:bg-[#16162c] space-y-6">
                      <div>
                        {/* Top Meta Bar */}
                        <div className="flex items-center justify-between gap-3 border-b border-gray-150 dark:border-white/10 pb-5">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-xl bg-slate-50 dark:bg-white/10 border border-gray-200 dark:border-white/15 p-2 flex items-center justify-center shrink-0">
                              <Image
                                src={project.clientLogo}
                                alt={project.client}
                                width={44}
                                height={44}
                                unoptimized
                                className="object-contain max-h-9 w-auto"
                              />
                            </div>
                            <div>
                              <span className="block text-xs font-bold text-orange-800 dark:text-orange-400">
                                {project.clientShort}
                              </span>
                              <span className="block text-[11px] text-gray-500 dark:text-white/60 font-medium">
                                {project.categoryTag}
                              </span>
                            </div>
                          </div>

                          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/70 text-orange-900 dark:text-orange-300 border border-orange-200/80 dark:border-orange-800/60 uppercase tracking-wider">
                            {content.texts["flagship_text_5"]}
                          </span>
                        </div>

                        {/* Title & Tagline */}
                        <div className="mt-5">
                          <div className="h-14 sm:h-16 flex items-start overflow-hidden">
                            <h3 className="text-xl sm:text-2xl font-extrabold text-dark dark:text-white tracking-tight line-clamp-2 leading-snug">
                              {project.title}
                            </h3>
                          </div>
                          <div className="h-12 flex items-start mt-2 overflow-hidden">
                            <p className="text-xs sm:text-sm text-gray-700 dark:text-white/85 leading-relaxed font-medium line-clamp-2">
                              {project.tagline}
                            </p>
                          </div>
                        </div>

                        {/* Challenge vs Solution Bento */}
                        <div className="mt-6 grid sm:grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#121222] border border-gray-200 dark:border-white/10 h-28 flex flex-col justify-center">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-400 mb-1.5 shrink-0">
                              <Target className="w-3.5 h-3.5 shrink-0" />
                              <span>{content.texts["flagship_text_6"]}</span>
                            </div>
                            <p className="text-[11px] sm:text-xs text-gray-700 dark:text-white/80 leading-relaxed line-clamp-3">
                              {project.challenge}
                            </p>
                          </div>

                          <div className="p-4 rounded-xl bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200/70 dark:border-orange-900/40 h-28 flex flex-col justify-center">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-800 dark:text-orange-400 mb-1.5 shrink-0">
                              <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                              <span>{content.texts["flagship_text_7"]}</span>
                            </div>
                            <p className="text-[11px] sm:text-xs text-gray-800 dark:text-white/85 leading-relaxed line-clamp-3">
                              {project.solution}
                            </p>
                          </div>
                        </div>

                        {/* Measurable KPI Banner */}
                        <div className="mt-5 p-4 rounded-xl bg-slate-100/90 dark:bg-[#1A1A32] border border-gray-200 dark:border-white/10 h-20 flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <span className="block text-2xl sm:text-3xl font-black text-orange-600 dark:text-orange-400 leading-none">
                              {project.measurableImpact.highlightValue}
                            </span>
                            <span className="block text-[11px] font-bold text-dark dark:text-white mt-1 truncate">
                              {project.measurableImpact.highlightLabel}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-600 dark:text-white/70 max-w-[200px] text-right hidden sm:block line-clamp-2">
                            {project.measurableImpact.detail}
                          </p>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                        <Link
                          href={`/portfolio/${encodeURIComponent(project.id)}`}
                          className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-700 hover:bg-orange-800 text-white text-xs font-bold transition-all shadow-md shadow-orange-600/20 cursor-pointer"
                        >
                          {content.texts["flagship_text_8"]}
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={content.texts["flagship_href_9"]}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-gray-800 dark:text-white text-xs font-semibold border border-gray-200 dark:border-white/15 transition-all"
                        >
                          {content.texts["flagship_text_10"]}
                        </Link>
                      </div>
                    </article>
                  </SpotlightCard>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. CASE STUDIES DIRECTORY SECTION WITH FILTER */}
      {content.visibility["case-studies-list-heading"] !== false && (
        <section
          aria-labelledby="case-studies-list-heading"
          className="py-16 md:py-24 bg-white dark:bg-[#1A1A2E] transition-colors"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center max-w-3xl mx-auto mb-10">
                <span className="inline-block text-xs font-bold text-orange-900 dark:text-orange-300 bg-orange-100 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-800/60 px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                  {content.texts["case_studies_list_text_1"]}
                </span>
                <h2
                  id="case-studies-list-heading"
                  className="text-3xl md:text-4xl font-extrabold text-dark dark:text-white"
                >
                  {content.texts["case_studies_list_text_2"]}{" "}
                  <GradientText>{content.texts["case_studies_list_text_3"]}</GradientText>
                </h2>
                <p className="mt-3 text-gray-700 dark:text-white/85 text-sm md:text-base leading-relaxed">
                  {content.texts["case_studies_list_text_4"]}
                </p>
              </div>
            </ScrollReveal>

            {/* Interactive Category Filter Pills */}
            <ScrollReveal delay={0.15}>
              <div
                className="flex flex-wrap justify-center gap-2 mb-12"
                role="tablist"
                aria-label="Filter Sektor Portofolio"
              >
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
                        isActive
                          ? "bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-md shadow-orange-600/25 scale-105"
                          : "bg-slate-50 dark:bg-[#16162c] text-gray-800 dark:text-white border border-gray-200 dark:border-white/15 hover:border-orange-500/40 hover:text-orange-700 dark:hover:text-orange-400"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </ScrollReveal>

            {/* View Mode & Count Bar */}
            <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
              <p className="text-xs text-gray-600 dark:text-white/70">
                {content.texts["case_studies_list_text_5"]}{" "}
                <strong className="text-dark dark:text-white font-bold">{filteredProjects.length}</strong>{" "}
                {content.texts["case_studies_list_text_6"]}
              </p>
              <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-white/10 border border-gray-200 dark:border-white/15 text-xs font-semibold">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-[#16162c] text-orange-700 dark:text-orange-400 shadow-sm font-bold"
                      : "text-gray-600 dark:text-white/70 hover:text-dark dark:hover:text-white"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>{content.texts["case_studies_list_text_7"]}</span>
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === "table"
                      ? "bg-white dark:bg-[#16162c] text-orange-700 dark:text-orange-400 shadow-sm font-bold"
                      : "text-gray-600 dark:text-white/70 hover:text-dark dark:hover:text-white"
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>{content.texts["case_studies_list_text_8"]}</span>
                </button>
              </div>
            </div>

            {viewMode === "grid" ? (
              /* Bento Case Study Cards Grid (100% Symmetrical) */
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7 items-stretch">
                {filteredProjects.map((project, i) => (
                  <ScrollReveal key={project.id} delay={(i % 3) * 0.08} className="h-full min-w-0">
                    <div id={project.id} className="h-full scroll-mt-28">
                      <SpotlightCard className="h-full flex flex-col">
                        <article className="p-6 sm:p-7 flex flex-col justify-between h-full bg-white dark:bg-[#16162c]">
                          <div>
                            {/* Header: Client Logo & Sector Badge (Fixed h-12) */}
                            <div className="flex items-center justify-between gap-3 mb-4 h-12">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="relative w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/10 border border-gray-200 dark:border-white/15 p-1.5 flex items-center justify-center shrink-0">
                                  <Image
                                    src={project.clientLogo}
                                    alt={project.client}
                                    width={36}
                                    height={36}
                                    unoptimized
                                    className="object-contain max-h-7 w-auto"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <span className="block text-xs font-bold text-dark dark:text-white leading-tight truncate">
                                    {project.clientShort}
                                  </span>
                                  <span className="block text-[10px] text-gray-500 dark:text-white/60 truncate">
                                    {project.period}
                                  </span>
                                </div>
                              </div>

                              <span
                                className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider min-w-0 break-words ${
                                  categoryColors[project.sector] ||
                                  "bg-slate-100 dark:bg-white/10 text-gray-800 dark:text-white"
                                }`}
                              >
                                {project.categoryTag}
                              </span>
                            </div>

                            {/* Title (Normalized h-14) */}
                            <div className="h-14 flex items-start overflow-hidden">
                              <h3 className="text-base sm:text-lg font-extrabold text-dark dark:text-white tracking-tight line-clamp-2 leading-snug">
                                {project.title}
                              </h3>
                            </div>

                            {/* Service Pillar Badge (Normalized h-6) */}
                            <div className="h-6 flex items-center gap-1.5 text-[11px] font-semibold text-orange-800 dark:text-orange-400 mt-2 overflow-hidden">
                              <Layers className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{project.servicePillar}</span>
                            </div>

                            {/* Brief Tagline / Overview (Normalized h-10) */}
                            <div className="h-10 flex items-start mt-2 overflow-hidden">
                              <p className="text-xs text-gray-700 dark:text-white/80 leading-relaxed line-clamp-2">
                                {project.tagline}
                              </p>
                            </div>

                            {/* Mini Challenge vs Solution Snippets (Symmetrical h-[4.75rem] each) */}
                            <div className="mt-4 space-y-2 text-xs">
                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#121222] border border-gray-200/80 dark:border-white/10 h-[4.75rem] flex flex-col justify-center">
                                <span className="block text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wide shrink-0">
                                  {content.texts["case_studies_list_text_9"]}
                                </span>
                                <span className="block mt-0.5 text-[11px] text-gray-700 dark:text-white/85 line-clamp-2 leading-relaxed">
                                  {project.challenge}
                                </span>
                              </div>

                              <div className="p-2.5 rounded-xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-900/30 h-[4.75rem] flex flex-col justify-center">
                                <span className="block text-[10px] font-bold text-orange-800 dark:text-orange-400 uppercase tracking-wide shrink-0">
                                  {content.texts["case_studies_list_text_10"]}
                                </span>
                                <span className="block mt-0.5 text-[11px] text-gray-800 dark:text-white/90 line-clamp-2 leading-relaxed">
                                  {project.solution}
                                </span>
                              </div>
                            </div>

                            {/* Impact Highlight Badge (Normalized h-16) */}
                            <div className="mt-4 p-3 rounded-xl bg-slate-100/90 dark:bg-[#141426] border border-gray-200 dark:border-white/10 h-16 flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <span className="block text-xl font-extrabold text-orange-600 dark:text-orange-400 truncate leading-tight">
                                  {project.measurableImpact.highlightValue}
                                </span>
                                <span className="block text-[10px] font-bold text-dark dark:text-white truncate">
                                  {project.measurableImpact.highlightLabel}
                                </span>
                              </div>
                              <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60 shrink-0 whitespace-nowrap">
                                {content.texts["case_studies_list_text_11"]}
                              </span>
                            </div>

                            {/* Tech Stack Pills (Normalized h-10) */}
                            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-white/10 min-h-10 flex items-center">
                              <div className="flex flex-wrap items-center gap-1 w-full min-w-0">
                                {project.techStack.slice(0, 3).map((t) => (
                                  <span
                                    key={t}
                                    className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-gray-800 dark:text-white border border-gray-200 dark:border-white/15 shrink-0"
                                  >
                                    {t}
                                  </span>
                                ))}
                                {project.techStack.length > 3 && (
                                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-gray-600 dark:text-white/70 shrink-0">
                                    +{project.techStack.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="mt-5 pt-1">
                            <button
                              onClick={() => setActiveModalStudy(project)}
                              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white text-xs font-bold transition-all shadow-md shadow-orange-600/20 hover:shadow-orange-600/30 cursor-pointer"
                            >
                              <span>{content.texts["case_studies_list_text_12"]}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </article>
                      </SpotlightCard>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              /* Enterprise Table View (Tabel Rekapitulasi Portofolio) */
              <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-white/15 shadow-sm bg-white dark:bg-[#16162c]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-[#121222] border-b border-gray-200 dark:border-white/10 text-dark dark:text-white font-bold uppercase tracking-wider text-[11px]">
                      <th scope="col" className="py-4 px-5">
                        {content.texts["case_studies_list_text_13"]}
                      </th>
                      <th scope="col" className="py-4 px-5">
                        {content.texts["case_studies_list_text_14"]}
                      </th>
                      <th scope="col" className="py-4 px-5 hidden md:table-cell">
                        {content.texts["case_studies_list_text_15"]}
                      </th>
                      <th scope="col" className="py-4 px-5">
                        {content.texts["case_studies_list_text_16"]}
                      </th>
                      <th scope="col" className="py-4 px-5 text-right">
                        {content.texts["case_studies_list_text_17"]}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150 dark:divide-white/10 text-gray-700 dark:text-white/85">
                    {filteredProjects.map((project) => (
                      <tr key={project.id} className="hover:bg-slate-50/70 dark:hover:bg-white/5 transition-colors">
                        {/* Client */}
                        <td className="py-4 px-5 align-top">
                          <div className="flex items-center gap-3">
                            <div className="relative w-9 h-9 rounded-lg bg-slate-50 dark:bg-white/10 border border-gray-200 dark:border-white/15 p-1.5 flex items-center justify-center shrink-0">
                              <Image
                                src={project.clientLogo}
                                alt={project.client}
                                width={32}
                                height={32}
                                unoptimized
                                className="object-contain max-h-6 w-auto"
                              />
                            </div>
                            <div>
                              <span className="font-bold text-dark dark:text-white block leading-tight">
                                {project.clientShort}
                              </span>
                              <span className="text-[10px] text-gray-500 dark:text-white/60 block mt-0.5">
                                {project.period}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Title & Sector */}
                        <td className="py-4 px-5 align-top max-w-xs">
                          <span className="font-bold text-dark dark:text-white block leading-snug text-xs sm:text-sm">
                            {project.title}
                          </span>
                          <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                categoryColors[project.sector] ||
                                "bg-slate-100 dark:bg-white/10 text-gray-800 dark:text-white"
                              }`}
                            >
                              {project.categoryTag}
                            </span>
                            <span className="text-[10px] text-orange-800 dark:text-orange-400 font-semibold">
                              {project.servicePillar}
                            </span>
                          </div>
                        </td>

                        {/* Challenge & Solution */}
                        <td className="py-4 px-5 align-top hidden md:table-cell max-w-sm">
                          <p className="text-[11px] text-gray-700 dark:text-white/80 line-clamp-2">
                            <strong className="text-rose-700 dark:text-rose-400">
                              {content.texts["case_studies_list_text_18"]}
                            </strong>{" "}
                            {project.challenge}
                          </p>
                          <p className="mt-1 text-[11px] text-gray-800 dark:text-white/90 line-clamp-2">
                            <strong className="text-orange-700 dark:text-orange-400">
                              {content.texts["case_studies_list_text_19"]}
                            </strong>{" "}
                            {project.solution}
                          </p>
                        </td>

                        {/* KPI */}
                        <td className="py-4 px-5 align-top whitespace-nowrap">
                          <span className="font-extrabold text-orange-600 dark:text-orange-400 block text-base leading-tight">
                            {project.measurableImpact.highlightValue}
                          </span>
                          <span className="text-[10px] text-dark dark:text-white font-medium block">
                            {project.measurableImpact.highlightLabel}
                          </span>
                        </td>

                        <td className="py-4 px-5 align-top text-right whitespace-nowrap">
                          <button
                            onClick={() => setActiveModalStudy(project)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-700 hover:bg-orange-800 text-white text-xs font-bold transition-all shadow-sm shadow-orange-600/20 cursor-pointer"
                          >
                            <span>{content.texts["case_studies_list_text_20"]}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4. IMPACT METRICS SECTION */}
      {content.visibility["metrics-heading"] !== false && (
        <section
          aria-labelledby="metrics-heading"
          className="py-16 md:py-24 bg-gray-50 dark:bg-[#151528] transition-colors"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="inline-block text-xs font-bold text-orange-900 dark:text-orange-300 bg-orange-100 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-800/60 px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                  {content.texts["metrics_text_1"]}
                </span>
                <h2 id="metrics-heading" className="text-3xl md:text-4xl font-extrabold text-dark dark:text-white">
                  {content.texts["metrics_text_2"]} <GradientText>{content.texts["metrics_text_3"]}</GradientText>
                </h2>
                <p className="mt-4 text-gray-700 dark:text-white/85 text-base leading-relaxed">
                  {content.texts["metrics_text_4"]}
                </p>
              </div>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {impactMetrics.map((item, idx) => (
                <ScrollReveal key={item.label} delay={idx * 0.1} className="h-full">
                  <div className="p-6 rounded-2xl bg-white dark:bg-[#16162c] border border-gray-200 dark:border-white/10 hover:border-orange-500/40 transition-all shadow-sm h-full flex flex-col justify-between">
                    <div>
                      <span className="block text-3xl md:text-4xl font-extrabold text-orange-700 dark:text-orange-400">
                        {item.value}
                      </span>
                      <h3 className="mt-2 font-bold text-dark dark:text-white text-base">{item.label}</h3>
                      <p className="mt-2 text-xs md:text-sm text-gray-700 dark:text-white/80 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-3 border-t border-gray-150 dark:border-white/10 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{content.texts["metrics_text_5"]}</span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. TESTIMONIALS SLIDER SECTION */}
      {content.visibility["testimonials-heading"] !== false && (
        <section
          aria-labelledby="testimonials-heading"
          className="py-16 md:py-24 bg-white dark:bg-[#1A1A2E] transition-colors"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center max-w-3xl mx-auto mb-14">
                <span className="inline-block text-xs font-bold text-orange-900 dark:text-orange-300 bg-orange-100 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-800/60 px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                  {content.texts["testimonials_text_1"]}
                </span>
                <h2 id="testimonials-heading" className="text-3xl md:text-4xl font-extrabold text-dark dark:text-white">
                  {content.texts["testimonials_text_2"]}{" "}
                  <GradientText>{content.texts["testimonials_text_3"]}</GradientText>
                </h2>
                <p className="mt-4 text-gray-700 dark:text-white/85 text-base leading-relaxed">
                  {content.texts["testimonials_text_4"]}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              {testimonials.length > 0 && <TestimonialSlider testimonials={testimonials} />}
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* 6. CALL TO ACTION SECTION */}
      {content.visibility["portfolio-cta-heading"] !== false && (
        <section
          aria-labelledby="portfolio-cta-heading"
          className="py-16 md:py-24 bg-gray-50 dark:bg-[#151528] transition-colors"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <div className="p-8 md:p-14 rounded-3xl bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-50 dark:from-[#151528] dark:via-[#1E1710] dark:to-[#151528] border border-orange-200/60 dark:border-orange-900/30 shadow-lg">
                <span className="inline-block text-xs font-bold text-orange-900 dark:text-orange-300 bg-orange-100 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-800/60 px-3.5 py-1 rounded-full uppercase tracking-wider mb-4">
                  {content.texts["portfolio_cta_text_1"]}
                </span>
                <h2
                  id="portfolio-cta-heading"
                  className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-dark dark:text-white tracking-tight"
                >
                  {content.texts["portfolio_cta_text_2"]}
                </h2>
                <p className="mt-4 text-gray-700 dark:text-white/85 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                  {content.texts["portfolio_cta_text_3"]}
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Link
                    href={content.texts["portfolio_cta_href_4"]}
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold rounded-xl transition-all shadow-md shadow-orange-600/20 hover:shadow-lg hover:shadow-orange-600/30 text-sm"
                  >
                    {content.texts["portfolio_cta_text_5"]}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href={content.texts["portfolio_cta_href_6"]}
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-100 dark:bg-white/10 text-gray-800 dark:text-white hover:bg-slate-200 dark:hover:bg-white/15 font-semibold rounded-xl border border-gray-200 dark:border-white/15 transition-all text-sm"
                  >
                    {content.texts["portfolio_cta_text_7"]}
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* 7. INTERACTIVE CASE STUDY DEEP-DIVE MODAL */}
      <AnimatePresence>
        {activeModalStudy && (
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-case-study-title"
            onClick={(event) => {
              if (event.target === event.currentTarget) setActiveModalStudy(null);
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#16162c] border border-gray-200 dark:border-white/15 shadow-2xl p-6 sm:p-9 text-dark dark:text-white"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalStudy(null)}
                aria-label="Tutup jendela studi kasus"
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-white/10 text-gray-600 dark:text-white/80 hover:bg-orange-600 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-4 pr-10">
                <div className="relative w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/10 border border-gray-200 dark:border-white/15 p-2 flex items-center justify-center shrink-0">
                  <Image
                    src={activeModalStudy.clientLogo}
                    alt={activeModalStudy.client}
                    width={52}
                    height={52}
                    unoptimized
                    className="object-contain max-h-10 w-auto"
                  />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-orange-800 dark:text-orange-400">
                      {activeModalStudy.client}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-gray-700 dark:text-white/80 border border-gray-200 dark:border-white/10">
                      {activeModalStudy.period}
                    </span>
                  </div>
                  <h3
                    id="modal-case-study-title"
                    className="mt-1 text-xl sm:text-2xl font-extrabold text-dark dark:text-white leading-tight"
                  >
                    {activeModalStudy.title}
                  </h3>
                </div>
              </div>

              {/* Tagline Box */}
              <div className="mt-5 p-4 rounded-xl bg-orange-50/70 dark:bg-orange-950/30 border border-orange-200/70 dark:border-orange-900/40">
                <p className="text-xs sm:text-sm font-semibold text-orange-950 dark:text-orange-200 leading-relaxed">
                  {activeModalStudy.tagline}
                </p>
              </div>

              {/* Two Column: Challenge & Solution */}
              <div className="mt-6 grid sm:grid-cols-2 gap-5">
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#121222] border border-gray-200 dark:border-white/10">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-700 dark:text-rose-400 mb-2">
                    <Target className="w-4 h-4 shrink-0" />
                    <span>Tantangan & Problem Statement</span>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-white/85 leading-relaxed">
                    {activeModalStudy.challenge}
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#121222] border border-gray-200 dark:border-white/10">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-2">
                    <Lightbulb className="w-4 h-4 shrink-0" />
                    <span>Rekayasa Solusi CITS</span>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-white/85 leading-relaxed">
                    {activeModalStudy.solution}
                  </p>
                </div>
              </div>

              {/* Measurable Impact Highlight */}
              <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border border-orange-300/60 dark:border-orange-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="block text-xs font-bold text-orange-900 dark:text-orange-300 uppercase tracking-wider">
                    Capaian Kinerja & Dampak Terukur:
                  </span>
                  <span className="block text-2xl sm:text-3xl font-black text-orange-700 dark:text-orange-400 mt-1">
                    {activeModalStudy.measurableImpact.highlightValue}
                  </span>
                  <span className="block text-xs font-bold text-dark dark:text-white">
                    {activeModalStudy.measurableImpact.highlightLabel}
                  </span>
                </div>
                <p className="text-xs text-gray-700 dark:text-white/85 max-w-sm sm:text-right leading-relaxed">
                  {activeModalStudy.measurableImpact.detail}
                </p>
              </div>

              {/* Scope of Work / Deliverables */}
              <div className="mt-6">
                <span className="block text-xs font-bold text-dark dark:text-white uppercase tracking-wider mb-2.5">
                  Lingkup Penugasan & Deliverables:
                </span>
                <div className="grid sm:grid-cols-2 gap-2">
                  {activeModalStudy.scopeOfWork.map((scope) => (
                    <div
                      key={scope}
                      className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-[#121222] border border-gray-200/80 dark:border-white/10 text-xs text-gray-800 dark:text-white/90"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{scope}</span>
                    </div>
                  ))}
                </div>
              </div>

              {activeModalStudy.deliverables?.length > 0 && (
                <div className="mt-6">
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-dark dark:text-white">
                    Hasil Pekerjaan yang Diserahkan
                  </h4>
                  <ul className="space-y-2 text-xs text-gray-700 dark:text-white/85">
                    {activeModalStudy.deliverables.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tech Stack Pills */}
              <div className="mt-6 pt-5 border-t border-gray-150 dark:border-white/10">
                <span className="block text-xs font-bold text-dark dark:text-white uppercase tracking-wider mb-2">
                  Tumpukan Teknologi & Arsitektur:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeModalStudy.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/10 text-gray-800 dark:text-white text-xs font-medium border border-gray-200 dark:border-white/15"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-gray-600 dark:text-white/70">
                  Pilar Layanan: <strong className="text-dark dark:text-white">{activeModalStudy.servicePillar}</strong>
                </span>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/portfolio/${encodeURIComponent(activeModalStudy.id)}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-gray-700 dark:text-white text-xs font-semibold transition-all"
                  >
                    Buka Halaman Detail
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => setActiveModalStudy(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-gray-700 dark:text-white text-xs font-semibold transition-all cursor-pointer"
                  >
                    Tutup
                  </button>
                  <Link
                    href={consultationHref({ source: "portfolio", referenceId: activeModalStudy.id })}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-orange-700 hover:bg-orange-800 text-white text-xs font-bold transition-all shadow-md shadow-orange-600/20"
                  >
                    Konsultasikan Proyek Serupa
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
