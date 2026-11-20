import type { CaseStudyEvidence } from "@/data/caseStudyFacts";

export default function CaseStudySummary({
  challenge,
  solution,
  result,
}: {
  challenge: string;
  solution: string;
  result: CaseStudyEvidence["publicResult"];
}) {
  return (
    <section aria-labelledby="case-summary-heading" className="mb-10">
      <h2 id="case-summary-heading" className="text-2xl font-extrabold tracking-tight">
        Ringkasan Studi Kasus
      </h2>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-slate-200 p-5 dark:border-white/15">
          <h3 className="text-sm font-bold">Tantangan</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{challenge}</p>
        </article>
        <article className="rounded-xl border border-slate-200 p-5 dark:border-white/15">
          <h3 className="text-sm font-bold">Solusi CITS</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{solution}</p>
        </article>
        <article className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-500/30 dark:bg-emerald-950/25">
          <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">Hasil yang terdokumentasi publik</h3>
          <p className="mt-3 font-semibold">{result.title}</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{result.detail}</p>
          <a
            href={result.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-11 items-center rounded text-sm font-semibold text-emerald-800 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 dark:text-emerald-300"
          >
            Sumber: {result.source.publisher}
          </a>
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            Sumber ini menjelaskan hasil layanan instansi; metrik dan kontribusi CITS disajikan terpisah.
          </p>
        </article>
      </div>
    </section>
  );
}
