"use client";

import accentStyles from "@/components/pages/public/PublicAccent.module.css";
import Link from "next/link";
import ServicePhoto from "@/components/ui/ServicePhoto";
import { ArrowRight, CheckCircle2, Cpu } from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { PILLAR_ICON_MAP } from "@/lib/serviceIcons";
import { consultationHref } from "@/lib/consultation";
import type { ServicePresentation } from "@/data/serviceDetails";

export default function HomeServiceCard({ service, wide = false }: { service: ServicePresentation; wide?: boolean }) {
  const Icon = PILLAR_ICON_MAP[service.icon] || Cpu;
  return (
    <SpotlightCard className="h-full">
      <article className={`min-w-0 h-full flex flex-col p-8 ${wide ? "md:p-10" : ""}`} data-home-service={service.id}>
        <div className="mb-6 h-48 sm:h-56 w-full shrink-0 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-900">
          <ServicePhoto image={service.image} name={service.title} className="h-full" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <span className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-600/20">
            <Icon className="w-7 h-7 text-white" aria-hidden="true" />
          </span>
          <span className={`max-w-full break-words rounded-full border px-3 py-1.5 text-xs font-bold ${accentStyles.soft}`}>
            {service.badge}
          </span>
        </div>
        <h3 className="text-2xl font-bold leading-snug break-words text-dark dark:text-white">{service.title}</h3>
        <div className="mt-3 flex flex-wrap gap-1.5" aria-label={`Kategori ${service.category}`}>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-200">
            {service.category}
          </span>
          {service.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${accentStyles.soft}`}
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-3 text-sm leading-relaxed break-words text-gray-700 dark:text-white/85">
          {service.description}
        </p>
        <ul
          className={`mt-6 text-sm text-gray-700 dark:text-white/85 ${wide ? "grid sm:grid-cols-2 gap-3" : "space-y-3"}`}
        >
          {service.features.map((feature) => (
            <li key={feature} className="min-w-0 flex items-start gap-2">
              <CheckCircle2
                className={`mt-0.5 size-4 shrink-0 ${accentStyles.accent}`}
                aria-hidden="true"
              />
              <span className="min-w-0 break-words">{feature}</span>
            </li>
          ))}
        </ul>
        {service.deliverables.length > 0 && (
          <section
            className="mt-6 border-t border-slate-200 dark:border-white/10 pt-5"
            aria-label={`Hasil layanan ${service.title}`}
          >
            <h4 className="text-sm font-bold text-dark dark:text-white">Hasil yang Anda Terima</h4>
            <dl className="mt-3 space-y-3">
              {service.deliverables.slice(0, wide ? 3 : 1).map((item) => (
                <div key={item.label} className="min-w-0 [overflow-wrap:anywhere]">
                  <dt className={`text-xs font-semibold ${accentStyles.text}`}>{item.label}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-gray-700 dark:text-white/85">{item.description}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
        <p className="mt-6 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-3 text-xs leading-relaxed text-gray-700 dark:text-white/80">
          <span className="mb-1 block font-semibold text-dark dark:text-white">Dukungan & Standar Layanan</span>
          {service.slaNote}
        </p>
        <div className="mt-auto pt-6 flex flex-wrap items-center gap-3">
          <Link
            href={`/services#${service.id}`}
            className={`inline-flex items-center gap-1.5 text-sm font-semibold hover:underline ${accentStyles.text}`}
          >
            Pelajari Selengkapnya <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </Link>
          <Link
            href={consultationHref({ service: service.title, source: "home" })}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${accentStyles.action}`}
          >
            Konsultasi Layanan <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </Link>
        </div>
      </article>
    </SpotlightCard>
  );
}
