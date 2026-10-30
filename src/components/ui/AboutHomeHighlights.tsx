"use client";

import Link from "next/link";
import { ArrowRight, Home, Sparkles } from "lucide-react";
import { pageDefinition, type PublicPageContent } from "@/lib/publicPageContent";

/**
 * Ringkasan section Tentang Kami yang dipilih admin untuk tampil di beranda.
 * Hanya section dengan `homeVisibility = true` (dan masih ditampilkan di
 * halaman Tentang Kami) yang dirender, mengikuti urutan section tersimpan.
 */
export default function AboutHomeHighlights({ content }: { content: PublicPageContent }) {
  const definition = pageDefinition("about");
  const order = content.order?.length ? content.order : definition.sections.map((section) => section.key);
  const enabled = order
    .map((key) => definition.sections.find((section) => section.key === key))
    .filter(
      (section): section is (typeof definition.sections)[number] =>
        Boolean(section) &&
        content.homeVisibility?.[section!.key] === true &&
        content.visibility[section!.key] !== false
    );

  if (!enabled.length) return null;

  return (
    <section
      id="tentang-kami"
      aria-labelledby="about-home-heading"
      className="relative border-t border-[#E2E8F0] bg-white py-16 transition-colors sm:py-20 dark:border-white/10 dark:bg-[#1A1A2E]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-[#FFF1E9] px-3 py-1 text-[11px] font-semibold tracking-wide text-[#C2410C] uppercase dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-300">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Tentang CITS
          </span>
          <h2
            id="about-home-heading"
            className="mt-3 text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl lg:text-4xl dark:text-white"
          >
            Mengenal CITS Indonesia
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#64748B] sm:text-base dark:text-slate-300">
            Ringkasan profil, nilai, dan perjalanan perusahaan yang dipilih langsung oleh tim kami.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {enabled.map((section) => {
            const snippets = section.fields
              .filter((field) => field.kind === "text")
              .map((field) => content.texts[field.key] ?? "")
              .filter((value) => value.trim().length > 30)
              .slice(0, 2);
            return (
              <article
                key={section.key}
                className="flex h-full flex-col rounded-xl border border-[#E2E8F0] bg-white p-5 transition hover:border-orange-300 dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-orange-500/40"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-[#FFF1E9] text-[#FF4D00] dark:bg-orange-500/10 dark:text-orange-300">
                  <Home className="size-4" aria-hidden="true" />
                </span>
                <h3 className="mt-3 text-sm font-bold text-[#0F172A] dark:text-white">{section.title}</h3>
                {snippets.map((text, index) => (
                  <p
                    key={index}
                    className="mt-2 line-clamp-4 text-xs leading-relaxed text-[#64748B] dark:text-slate-300"
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
