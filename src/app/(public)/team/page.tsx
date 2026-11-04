import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ManagedTeamDirectory from "@/components/ui/TeamDirectory";

export const metadata: Metadata = {
  title: "Tim Kami | CITS Indonesia",
  description: "Kenali tim profesional di balik solusi teknologi informasi CITS Indonesia.",
};

export default function TeamPage() {
  return (
    <main id="main-content" className="min-h-screen bg-white text-[#0F172A] dark:bg-[#1A1A2E] dark:text-white">
      <section aria-labelledby="team-page-heading" className="py-12 md:py-16">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1
              id="team-page-heading"
              className="text-3xl font-extrabold leading-[1.15] tracking-tight text-dark sm:text-4xl md:text-5xl lg:text-6xl dark:text-white"
            >
              Orang-orang di Balik{" "}
              <span className="block text-orange-600 dark:text-orange-400">Solusi CITS Indonesia</span>
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg dark:text-slate-300">
              Tim profesional dengan beragam keahlian yang berkomitmen menghadirkan solusi teknologi yang tepat, andal,
              dan berdampak.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a
                href="#anggota-tim"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500"
              >
                Kenali Tim Kami <ArrowRight aria-hidden="true" className="size-4" />
              </a>
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-orange-500 hover:text-orange-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 dark:border-white/20 dark:bg-transparent dark:text-white dark:hover:text-orange-400"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ManagedTeamDirectory />

      <section aria-labelledby="team-contact-heading" className="pt-10 pb-12 sm:pt-12 sm:pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 rounded-2xl bg-[#FFF5EF] p-6 sm:p-8 lg:flex-row lg:items-center lg:gap-10 dark:bg-[#26202A]">
            <div className="max-w-2xl">
              <h2 id="team-contact-heading" className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                Mari mulai dari kebutuhan Anda
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
                Diskusikan rencana, tantangan, atau kebutuhan teknologi di organisasi Anda. Tim kami siap memberikan
                solusi yang relevan dan dapat diimplementasikan.
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-start gap-2 sm:flex-row sm:items-center lg:flex-col lg:items-stretch">
              <Link
                href="/contact#consultation-form"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500"
              >
                Konsultasi Sekarang <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
