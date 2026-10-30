"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  Cpu,
  ExternalLink,
  FileText,
  Layers,
  Lightbulb,
  ShieldCheck,
  Target,
} from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { caseStudyEvidence } from "@/data/caseStudyFacts";
import { consultationHref } from "@/lib/consultation";
import { useCitsStore } from "@/stores/citsStore";

export default function CaseStudyDetail({ id }: { id: string }) {
  const { caseStudies } = useCitsStore();
  const study = caseStudies.find((item) => item.id === id);

  if (!study) {
    return (
      <main id="main-content" className="min-h-screen bg-white py-24 dark:bg-[#1A1A2E]">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300">
            <Briefcase className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Studi kasus tidak ditemukan</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Studi kasus dengan alamat <span className="font-semibold">{id}</span> tidak tersedia atau sudah tidak
            dipublikasikan.
          </p>
          <Link
            href="/portfolio"
            className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-xl bg-orange-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Portofolio
          </Link>
        </div>
      </main>
    );
  }

  const evidence = caseStudyEvidence[study.id];
  const related = caseStudies
    .filter((item) => item.id !== study.id && item.isActive !== false)
    .slice(0, 3);

  return (
    <main
      id="main-content"
      className="min-h-screen bg-white text-slate-900 transition-colors dark:bg-[#1A1A2E] dark:text-white"
    >
      {/* Header studi kasus */}
      <section className="relative overflow-hidden border-b border-slate-200/70 bg-gradient-to-b from-slate-50 via-white to-white py-14 sm:py-16 dark:border-white/10 dark:from-[#151528] dark:via-[#1A1A2E] dark:to-[#1A1A2E]">
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Link href="/" className="transition hover:text-orange-700 dark:hover:text-orange-300">
              Beranda
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/portfolio" className="transition hover:text-orange-700 dark:hover:text-orange-300">
              Portofolio
            </Link>
            <span aria-hidden="true">/</span>
            <span className="max-w-[16rem] truncate font-semibold text-slate-700 dark:text-slate-200">
              {study.clientShort || study.client}
            </span>
          </nav>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-orange-800 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-300">
              <Briefcase className="h-3.5 w-3.5" />
              {study.sector}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              <CalendarDays className="h-3.5 w-3.5" />
              {study.period}
            </span>
            {study.isFlagship && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                <BadgeCheck className="h-3.5 w-3.5" />
                Proyek Unggulan
              </span>
            )}
          </div>

          <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
            {study.title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
            {study.tagline}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 dark:border-white/10 dark:bg-white/5">
              {study.clientLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={study.clientLogo} alt="" className="h-8 w-8 shrink-0 object-contain" />
              ) : (
                <Building2 className="h-6 w-6 shrink-0 text-orange-700 dark:text-orange-300" />
              )}
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Klien
                </p>
                <p className="truncate text-xs font-bold text-slate-800 sm:text-sm dark:text-slate-100">
                  {study.client}
                </p>
              </div>
            </div>
            <Link
              href={consultationHref({ source: "portfolio", referenceId: study.id })}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-orange-700 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-600/20 transition hover:bg-orange-800"
            >
              Konsultasi Kebutuhan Serupa
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-700 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:text-orange-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Semua Portofolio
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        {/* Dampak terukur */}
        <ScrollReveal>
          <section aria-labelledby="impact-heading" className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8 dark:border-white/10 dark:bg-white/[0.03]">
            <h2 id="impact-heading" className="text-xs font-bold uppercase tracking-widest text-orange-800 dark:text-orange-300">
              Dampak Terukur
            </h2>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-3xl font-black leading-none text-orange-600 sm:text-5xl dark:text-orange-400">
                  {study.measurableImpact.highlightValue}
                </p>
                <p className="mt-2 text-sm font-bold text-slate-800 dark:text-slate-100">
                  {study.measurableImpact.highlightLabel}
                </p>
              </div>
              <p className="max-w-md text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
                {study.measurableImpact.detail}
              </p>
            </div>
            <p className="mt-5 border-t border-slate-200/80 pt-3 text-[11px] leading-relaxed text-slate-500 dark:border-white/10 dark:text-slate-400">
              Metrik dampak merupakan dokumentasi pelaksanaan proyek CITS. Fakta pendukung pada bagian berikut dikutip
              dari publikasi resmi instansi terkait dan dapat diverifikasi melalui tautan sumber.
            </p>
          </section>
        </ScrollReveal>

        {/* Tentang sistem */}
        {evidence && (
          <ScrollReveal>
            <section aria-labelledby="overview-heading" className="mt-12">
              <h2 id="overview-heading" className="text-xl font-extrabold tracking-tight sm:text-2xl">
                Tentang Sistem
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
                {evidence.overview}
              </p>
            </section>
          </ScrollReveal>
        )}

        {/* Fakta terverifikasi */}
        {evidence && (
          <ScrollReveal>
            <section aria-labelledby="facts-heading" className="mt-12">
              <div className="flex flex-wrap items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h2 id="facts-heading" className="text-xl font-extrabold tracking-tight sm:text-2xl">
                  Fakta Terverifikasi
                </h2>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Angka di bawah dikutip langsung dari sumber resmi, bukan estimasi pemasaran.
              </p>
              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                {evidence.facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-orange-300 dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-orange-500/40"
                  >
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {fact.label}
                    </dt>
                    <dd className="mt-1.5 text-lg font-extrabold text-slate-900 dark:text-white">{fact.value}</dd>
                    <dd className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{fact.detail}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </ScrollReveal>
        )}

        {/* Tantangan & solusi */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <ScrollReveal>
            <section aria-labelledby="challenge-heading" className="h-full rounded-3xl border border-rose-200/70 bg-rose-50/50 p-6 dark:border-rose-500/20 dark:bg-rose-500/5">
              <h2 id="challenge-heading" className="flex items-center gap-2 text-sm font-bold text-rose-800 dark:text-rose-300">
                <Target className="h-4 w-4" />
                Tantangan
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{study.challenge}</p>
            </section>
          </ScrollReveal>
          <ScrollReveal delay={0.05}>
            <section aria-labelledby="solution-heading" className="h-full rounded-3xl border border-emerald-200/70 bg-emerald-50/50 p-6 dark:border-emerald-500/20 dark:bg-emerald-500/5">
              <h2 id="solution-heading" className="flex items-center gap-2 text-sm font-bold text-emerald-800 dark:text-emerald-300">
                <Lightbulb className="h-4 w-4" />
                Solusi CITS
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{study.solution}</p>
            </section>
          </ScrollReveal>
        </div>

        {/* Lingkup, teknologi, luaran */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <ScrollReveal>
            <section aria-labelledby="scope-heading" className="h-full rounded-2xl border border-slate-200 p-5 dark:border-white/10">
              <h2 id="scope-heading" className="flex items-center gap-2 text-sm font-bold">
                <Layers className="h-4 w-4 text-orange-700 dark:text-orange-300" />
                Lingkup Pekerjaan
              </h2>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {study.scopeOfWork.map((scope) => (
                  <li key={scope} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span>{scope}</span>
                  </li>
                ))}
              </ul>
            </section>
          </ScrollReveal>
          <ScrollReveal delay={0.05}>
            <section aria-labelledby="tech-heading" className="h-full rounded-2xl border border-slate-200 p-5 dark:border-white/10">
              <h2 id="tech-heading" className="flex items-center gap-2 text-sm font-bold">
                <Cpu className="h-4 w-4 text-orange-700 dark:text-orange-300" />
                Teknologi
              </h2>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {study.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <section aria-labelledby="deliverables-heading" className="h-full rounded-2xl border border-slate-200 p-5 dark:border-white/10">
              <h2 id="deliverables-heading" className="flex items-center gap-2 text-sm font-bold">
                <FileText className="h-4 w-4 text-orange-700 dark:text-orange-300" />
                Luaran
              </h2>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {study.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </ScrollReveal>
        </div>

        {/* Sumber resmi */}
        {evidence && (
          <ScrollReveal>
            <section aria-labelledby="sources-heading" className="mt-12 rounded-3xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8 dark:border-white/10 dark:bg-white/[0.03]">
              <h2 id="sources-heading" className="text-sm font-bold uppercase tracking-widest text-slate-700 dark:text-slate-200">
                Sumber &amp; Referensi
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Seluruh fakta di atas dapat dicek pada publikasi berikut.
              </p>
              <ul className="mt-4 space-y-2">
                {evidence.sources.map((source) => (
                  <li key={source.url}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-3 rounded-xl border border-transparent bg-white p-3 transition hover:border-orange-300 dark:bg-white/5 dark:hover:border-orange-500/40"
                    >
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-bold text-slate-800 group-hover:text-orange-800 dark:text-slate-100 dark:group-hover:text-orange-300">
                          {source.label}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-slate-500 dark:text-slate-400">
                          {source.publisher}
                          {source.date ? ` · ${source.date}` : ""}
                        </span>
                      </span>
                      <ArrowUpRight className="mt-1 h-3.5 w-3.5 shrink-0 text-slate-400 transition group-hover:text-orange-700 dark:group-hover:text-orange-300" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </ScrollReveal>
        )}

        {/* CTA */}
        <ScrollReveal>
          <section className="mt-12 rounded-3xl bg-slate-900 p-7 text-white sm:p-9 dark:bg-[#121222]">
            <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">
              Punya kebutuhan serupa di instansi Anda?
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
              Diskusikan ruang lingkup, integrasi, dan target layanan bersama tim CITS. Kami bantu petakan solusi yang
              sesuai dengan regulasi dan arsitektur TI instansi Anda.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={consultationHref({ source: "portfolio", referenceId: study.id })}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-700"
              >
                Mulai Konsultasi
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-orange-400 hover:text-orange-200"
              >
                Lihat Portofolio Lain
              </Link>
            </div>
          </section>
        </ScrollReveal>

        {/* Studi kasus lain */}
        {related.length > 0 && (
          <section aria-labelledby="related-heading" className="mt-12">
            <h2 id="related-heading" className="text-lg font-extrabold tracking-tight">
              Studi Kasus Lainnya
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/portfolio/${encodeURIComponent(item.id)}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-orange-500/40"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-orange-800 dark:text-orange-300">
                    {item.clientShort || item.client}
                  </p>
                  <p className="mt-1.5 line-clamp-2 text-sm font-bold text-slate-900 dark:text-white">{item.title}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 group-hover:text-orange-700 dark:text-slate-400 dark:group-hover:text-orange-300">
                    Buka detail
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
