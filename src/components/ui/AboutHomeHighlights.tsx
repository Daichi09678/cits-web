"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { pageCollection, pageDefinition, type PublicPageContent } from "@/lib/publicPageContent";
import type { AboutData } from "@/types/schema";

/**
 * Ringkasan section Tentang Kami yang dipilih admin untuk tampil di beranda.
 * Hanya section dengan `homeVisibility = true` (dan masih ditampilkan di
 * halaman Tentang Kami) yang dirender, mengikuti urutan section tersimpan.
 */
export default function AboutHomeHighlights({
  content,
  aboutData,
}: {
  content: PublicPageContent;
  aboutData?: AboutData;
}) {
  const definition = pageDefinition("about");
  const joinText = (parts: string[], separator = ": ") =>
    parts
      .map((part) => part?.trim())
      .filter(Boolean)
      .join(separator);
  const summary = (key: string): string[] => {
    switch (key) {
      case "about-hero-heading":
        return aboutData?.story?.trim() ? [aboutData.story] : [];
      case "vision-mission-heading":
        return [aboutData?.vision, ...(aboutData?.mission ?? []).slice(0, 1)].filter((text): text is string =>
          Boolean(text?.trim())
        );
      case "values-heading":
        return pageCollection<{ word: string; description: string }>(content, "values")
          .slice(0, 2)
          .map((item) => joinText([item.word, item.description]))
          .filter(Boolean);
      case "milestones-heading":
        return pageCollection<{ year: string; title: string; description: string }>(content, "milestones")
          .slice(-2)
          .map((item) => joinText([item.year, joinText([item.title, item.description], ". ")]))
          .filter(Boolean);
      case "awards-heading":
        return pageCollection<{ title: string; issuer: string }>(content, "awards")
          .slice(0, 2)
          .map((item) => joinText([item.title, item.issuer], ". "))
          .filter(Boolean);
      case "governance-heading":
        return pageCollection<{ title: string; description: string }>(content, "governancePillars")
          .slice(0, 2)
          .map((item) => joinText([item.title, item.description]))
          .filter(Boolean);
      case "about-cta-heading":
        return content.texts["about_cta_text_3"]?.trim() ? [content.texts["about_cta_text_3"]] : [];
      default:
        return [];
    }
  };
  const order = content.order?.length ? content.order : definition.sections.map((section) => section.key);
  const enabled = order
    .map((key) => definition.sections.find((section) => section.key === key))
    .filter(
      (section): section is (typeof definition.sections)[number] =>
        Boolean(section) &&
        content.homeVisibility?.[section!.key] === true &&
        content.visibility[section!.key] !== false
    )
    .map((section) => ({ ...section, snippets: summary(section.key) }))
    .filter((section) => section.snippets.length > 0);

  if (!enabled.length) return null;

  return (
    <section
      id="tentang-kami"
      aria-labelledby="about-home-heading"
      className="relative border-t border-[#E2E8F0] bg-white py-16 transition-colors sm:py-20 dark:border-white/10 dark:bg-[#1A1A2E]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="about-home-heading"
            className="text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl lg:text-4xl dark:text-white"
          >
            Mengenal CITS Indonesia
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#64748B] sm:text-base dark:text-slate-300">
            Profil, nilai kerja, dan perjalanan CITS Indonesia.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {enabled.map((section) => {
            return (
              <article
                key={section.key}
                className="flex h-full flex-col rounded-xl border border-[#E2E8F0] bg-white p-5 transition hover:border-orange-300 dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-orange-500/40"
              >
                <h3 className="text-base font-bold text-[#0F172A] dark:text-white">{section.title}</h3>
                {section.snippets.map((text, index) => (
                  <p
                    key={index}
                    className="mt-3 line-clamp-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
                  >
                    {text}
                  </p>
                ))}
              </article>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/about"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-semibold text-[#0F172A] transition hover:border-orange-300 hover:text-orange-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:text-orange-300"
          >
            Selengkapnya tentang kami
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
