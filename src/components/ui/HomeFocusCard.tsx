import Link from "next/link";
import { ArrowUpRight, Shield } from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { DEFAULT_FOCUS_EXPLANATION, resolveFocusItems } from "@/lib/focusContent";
import type { LandingServicesIntro } from "@/types/schema";

export default function HomeFocusCard({ content }: { content?: LandingServicesIntro["cardFocus"] }) {
  const items = resolveFocusItems(content?.focusItems);
  const explanation = content?.explanation ?? DEFAULT_FOCUS_EXPLANATION;
  return (
    <SpotlightCard className="h-full">
      <article
        data-home-focus
        className="min-w-0 p-8 md:p-10 flex flex-col h-full bg-white dark:bg-[#16162c] text-dark dark:text-white [overflow-wrap:anywhere]"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <span className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-600/20">
            <Shield className="w-7 h-7 text-white" aria-hidden="true" />
          </span>
          <span className="max-w-full text-xs font-bold text-orange-900 dark:text-orange-300 bg-orange-100 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-800/60 px-3 py-1.5 rounded-full uppercase tracking-wider">
            {content?.badge || "Budaya Kerja & Standar SLA"}
          </span>
        </div>
        <h3 className="text-2xl font-bold leading-snug">{content?.title || "Prinsip Kerja FOCUS"}</h3>
        <p className="mt-3 text-sm md:text-base leading-relaxed text-gray-700 dark:text-white/85">
          {content?.desc || "Setiap tahapan kolaborasi kami berakar pada 5 pilar keunggulan operasional:"}
        </p>
        {explanation && <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-white/85">{explanation}</p>}
        <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((item, index) => (
            <li
              key={item.letter + index}
              className={`min-w-0 rounded-xl bg-orange-50/70 dark:bg-[#121222] border border-orange-200/70 dark:border-white/10 p-4 ${items.length % 2 && index === items.length - 1 ? "sm:col-span-2" : ""}`}
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-950/60 text-xl font-black text-orange-800 dark:text-orange-300">
                  {item.letter}
                </span>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold">{item.word}</h4>
                  <p className="mt-0.5 text-xs font-semibold text-orange-800 dark:text-orange-300">{item.desc}</p>
                </div>
              </div>
              {item.detail && (
                <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-white/85">{item.detail}</p>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 dark:border-white/10 pt-5">
            <p className="text-xs leading-relaxed text-gray-700 dark:text-white/80">
              {content?.footerText || "Terpercaya menangani sistem kementerian sejak 2006"}
            </p>
            <Link
              href={content?.linkUrl || "/about"}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-800 dark:text-orange-300 hover:underline"
            >
              {content?.linkText || "Kenali CITS Lebih Dekat"}
              <ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </article>
    </SpotlightCard>
  );
}
