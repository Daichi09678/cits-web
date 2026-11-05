import Link from "next/link";
import type { CaseStudyItem } from "@/types/schema";

export default function ServiceCaseStudyLinks({ ids, studies }: { ids: string[]; studies: CaseStudyItem[] }) {
  const selected = new Set(ids);
  const related = studies.filter((study) => selected.has(study.id) && study.isActive !== false);
  const linkClass =
    "inline-flex min-h-11 items-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-white/15 dark:text-white dark:hover:bg-white/5";
  if (related.length === 0)
    return <p className="py-2 text-xs text-slate-500 dark:text-slate-400">Studi kasus terkait belum dipublikasikan.</p>;
  if (related.length === 1)
    return (
      <Link href={`/portfolio/${encodeURIComponent(related[0].id)}`} className={linkClass}>
        Lihat Studi Kasus
      </Link>
    );
  return (
    <details className="w-full rounded-xl border border-slate-200 p-4 dark:border-white/15">
      <summary className="cursor-pointer text-sm font-semibold text-slate-800 dark:text-white">
        Lihat Studi Kasus ({related.length})
      </summary>
      <ul className="mt-3 space-y-2">
        {related.map((study) => (
          <li key={study.id}>
            <Link href={`/portfolio/${encodeURIComponent(study.id)}`} className={linkClass}>
              {study.title}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}
