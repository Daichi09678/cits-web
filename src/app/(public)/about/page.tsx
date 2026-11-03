"use client";

import { useState } from "react";
import Link from "next/link";
import { useCitsStore } from "@/stores/citsStore";
import { usePublicPageContent } from "@/lib/publicPageContentClient";
import { pageCollection } from "@/lib/publicPageContent";

interface ValueItem { letter: string; word: string; description: string; }
interface MilestoneItem { year: string; title: string; description: string; }
interface AwardItem { id: string; title: string; issuer: string; category: "all" | "kementerian" | "bumn" | "egov"; description: string; }
interface GovernancePillar { title: string; description: string; items: string[]; }

const container = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";
const heading = "text-2xl font-bold tracking-tight sm:text-3xl";
const body = "text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300";

export default function AboutPage() {
  const { content } = usePublicPageContent("about");
  const { aboutData } = useCitsStore();
  const values = pageCollection<ValueItem>(content, "values");
  const milestones = pageCollection<MilestoneItem>(content, "milestones");
  const awards = pageCollection<AwardItem>(content, "awards");
  const governance = pageCollection<GovernancePillar>(content, "governancePillars");
  const [awardFilter, setAwardFilter] = useState<AwardItem["category"]>("all");
  const filteredAwards = awardFilter === "all" ? awards : awards.filter((item) => item.category === awardFilter);
  const sectionOrder = (key: string) => {
    const index = (content.order ?? []).indexOf(key);
    return index === -1 ? 99 : index;
  };

  return (
    <main id="main-content" className="flex min-h-screen flex-col bg-white text-slate-900 dark:bg-[#111827] dark:text-slate-100">
      {content.visibility["about-hero-heading"] !== false && (
        <section aria-labelledby="about-hero-heading" style={{ order: sectionOrder("about-hero-heading") }} className="border-b border-slate-200 py-14 sm:py-20 dark:border-white/10">
          <div className={container}>
            <div className="max-w-4xl">
              <h1 id="about-hero-heading" className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">{aboutData.title}</h1>
              <p className="mt-6 whitespace-pre-line text-base leading-loose text-slate-600 sm:text-lg dark:text-slate-300">{aboutData.story}</p>
              <Link href={content.texts["about_hero_href_11"] || "/contact"} className="mt-7 inline-flex min-h-11 items-center rounded-lg bg-orange-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-800">{content.texts["about_hero_text_12"] || "Diskusikan kebutuhan TI"}</Link>
            </div>
          </div>
        </section>
      )}
      {content.visibility["vision-mission-heading"] !== false && (
        <section aria-labelledby="vision-mission-heading" style={{ order: sectionOrder("vision-mission-heading") }} className="py-12 sm:py-16">
          <div className={container}>
            <h2 id="vision-mission-heading" className={heading}>{content.texts["vision_mission_text_2"]} {content.texts["vision_mission_text_3"]}</h2>
            <div className="mt-8 grid gap-10 lg:grid-cols-[2fr_3fr] lg:gap-16">
              <div><h3 className="text-lg font-semibold">{content.texts["vision_mission_text_6"]}</h3><p className="mt-4 text-xl font-medium leading-relaxed text-orange-900 dark:text-orange-200">{aboutData.vision}</p></div>
              <div>
                <h3 className="text-lg font-semibold">{content.texts["vision_mission_text_13"]}</h3>
                <ol className="mt-4 list-decimal space-y-4 pl-5 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">{aboutData.mission.map((mission, index) => <li key={index} className="pl-2">{mission}</li>)}</ol>
              </div>
            </div>
          </div>
        </section>
      )}
      {content.visibility["values-heading"] !== false && values.length > 0 && (
        <section aria-labelledby="values-heading" style={{ order: sectionOrder("values-heading") }} className="bg-slate-50 py-12 sm:py-16 dark:bg-[#0f172a]">
          <div className={container + " grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-16"}>
            <div><h2 id="values-heading" className={heading}>{content.texts["values_text_2"]} {content.texts["values_text_3"]}</h2><p className={"mt-4 " + body}>{content.texts["values_text_4"]}</p></div>
            <dl className="divide-y divide-slate-200 dark:divide-white/10">
              {values.map((value) => (
                <div key={value.letter} className="grid grid-cols-[2rem_1fr] gap-x-4 py-5 first:pt-0">
                  <dt className="text-2xl font-bold text-orange-800 dark:text-orange-300">{value.letter}</dt>
                  <dd><h3 className="text-base font-semibold">{value.word}</h3><p className={"mt-2 " + body}>{value.description}</p></dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}
      {content.visibility["milestones-heading"] !== false && milestones.length > 0 && (
        <section aria-labelledby="milestones-heading" style={{ order: sectionOrder("milestones-heading") }} className="py-12 sm:py-16">
          <div className={container}>
            <h2 id="milestones-heading" className={heading}>{content.texts["milestones_text_2"]} {content.texts["milestones_text_3"]}</h2>
            <p className={"mt-4 max-w-3xl " + body}>{content.texts["milestones_text_4"]}</p>
            <ol className="mt-8 divide-y divide-slate-200 border-t border-slate-200 dark:divide-white/10 dark:border-white/10">
              {milestones.map((milestone, index) => (
                <li key={milestone.year + index} className="grid gap-3 py-6 sm:grid-cols-[7rem_1fr] sm:gap-8">
                  <p className="text-lg font-semibold text-orange-800 dark:text-orange-300">{milestone.year}</p>
                  <div className="max-w-3xl"><h3 className="text-base font-semibold sm:text-lg">{milestone.title}</h3><p className={"mt-2 " + body}>{milestone.description}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}
      {content.visibility["awards-heading"] !== false && awards.length > 0 && (
        <section aria-labelledby="awards-heading" style={{ order: sectionOrder("awards-heading") }} className="border-y border-slate-200 py-12 sm:py-16 dark:border-white/10">
          <div className={container}>
            <h2 id="awards-heading" className={heading}>{content.texts["awards_text_2"]} {content.texts["awards_text_3"]}</h2>
            <p className={"mt-4 max-w-3xl " + body}>{content.texts["awards_text_4"]}</p>
            <div role="group" aria-label="Filter kategori penghargaan" className="mt-7 flex flex-wrap gap-2">
              {([{ key: "all", label: "Semua" }, { key: "kementerian", label: "Kementerian & Lembaga" }, { key: "bumn", label: "BUMN & Pelayanan Publik" }, { key: "egov", label: "Tata Kelola & e-Gov" }] as const).map((filter) => (
                <button key={filter.key} type="button" aria-pressed={awardFilter === filter.key} onClick={() => setAwardFilter(filter.key)} className={"rounded-lg border px-4 py-2 text-sm transition-colors " + (awardFilter === filter.key ? "border-orange-700 bg-orange-700 font-semibold text-white" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10")}>{filter.label}</button>
              ))}
            </div>
            <ul className="mt-8 grid gap-x-12 gap-y-6 md:grid-cols-2">
              {filteredAwards.map((award) => (
                <li key={award.id} className="border-t border-slate-200 py-5 dark:border-white/10"><h3 className="text-base font-semibold">{award.title}</h3><p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">{award.issuer}</p><p className={"mt-3 " + body}>{award.description}</p></li>
              ))}
            </ul>
            {!filteredAwards.length && <p role="status" className={"mt-8 " + body}>Belum ada penghargaan dalam kategori ini.</p>}
          </div>
        </section>
      )}
      {content.visibility["governance-heading"] !== false && governance.length > 0 && (
        <section id="legalitas-governance" aria-labelledby="governance-heading" style={{ order: sectionOrder("governance-heading") }} className="py-12 sm:py-16">
          <div className={container}>
            <h2 id="governance-heading" className={heading}>{content.texts["governance_text_2"]} {content.texts["governance_text_3"]}</h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2 lg:gap-x-16">
              {governance.map((pillar) => (
                <section key={pillar.title} className="border-t border-slate-200 pt-5 dark:border-white/10"><h3 className="text-lg font-semibold">{pillar.title}</h3><p className={"mt-3 " + body}>{pillar.description}</p><ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{pillar.items.map((item) => <li key={item}>{item}</li>)}</ul></section>
              ))}
            </div>
          </div>
        </section>
      )}
      {content.visibility["about-cta-heading"] !== false && (
        <section aria-labelledby="about-cta-heading" style={{ order: sectionOrder("about-cta-heading") }} className="bg-slate-50 py-12 sm:py-16 dark:bg-[#0f172a]">
          <div className={container + " flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center"}>
            <div className="max-w-2xl"><h2 id="about-cta-heading" className={heading}>{content.texts["about_cta_text_2"]}</h2><p className={"mt-3 " + body}>{content.texts["about_cta_text_3"]}</p></div>
            <Link href={content.texts["about_cta_href_4"] || "/contact"} className="inline-flex min-h-11 shrink-0 items-center rounded-lg bg-orange-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-800">{content.texts["about_cta_text_5"] || "Hubungi tim CITS"}</Link>
          </div>
        </section>
      )}
    </main>
  );
}
