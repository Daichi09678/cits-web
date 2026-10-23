import { CONSULTATION_PURPOSES, CONSULTATION_SOURCES } from "@/lib/consultation";
import type { ContactMessage } from "@/types/schema";

export default function MessageConsultationDetails({ message }: { message: ContactMessage }) {
  const details = message.consultation;
  const requirements = [
    ["Hasil yang Diharapkan", details?.expectedOutcome],
    ["Sistem / Cara Kerja Saat Ini", details?.currentSystem],
    ["Target Waktu", details?.timeline],
    ["Perkiraan Penggunaan", details?.usageEstimate],
  ];
  return (
    <section className="space-y-4 min-w-0 [overflow-wrap:anywhere]" aria-label="Detail kebutuhan konsultasi">
      <div className="rounded-xl border border-orange-200 dark:border-orange-800/60 bg-orange-50 dark:bg-orange-950/20 p-4 space-y-3">
        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Kebutuhan Pengunjung</h4>
        {details?.purpose && (
          <p className="font-semibold text-orange-800 dark:text-orange-300">{CONSULTATION_PURPOSES[details.purpose]}</p>
        )}
        {details?.source && (
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Asal Konsultasi: {CONSULTATION_SOURCES[details.source]}
          </p>
        )}
        <dl className="grid sm:grid-cols-2 gap-3">
          <div>
            <dt className="text-xs text-slate-600 dark:text-slate-300">Layanan yang Dikonsultasikan</dt>
            <dd className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
              {details?.service?.title || message.serviceRequested || "Konsultasi Umum"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-600 dark:text-slate-300">Produk yang Dikonsultasikan</dt>
            <dd className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
              {details?.product?.name || message.productRequested || "Tidak memilih produk"}
            </dd>
          </div>
        </dl>
        {details?.portfolio && (
          <div className="pt-3 border-t border-orange-200 dark:border-orange-800/60">
            <p className="text-xs text-slate-600 dark:text-slate-300">Referensi Proyek untuk Kebutuhan Serupa</p>
            <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{details.portfolio.title}</p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              {details.portfolio.client} · {details.portfolio.servicePillar}
            </p>
          </div>
        )}
        {!!details?.requestedFeatures?.length && (
          <div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">Fitur yang Ingin Dibahas</p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-800 dark:text-slate-100">
              {details.requestedFeatures.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <dl className="grid sm:grid-cols-2 gap-3">
        {requirements.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-slate-200 dark:border-white/10 p-3">
            <dt className="text-xs font-bold text-slate-600 dark:text-slate-300">{label}</dt>
            <dd className="mt-1 text-sm whitespace-pre-wrap text-slate-900 dark:text-white">
              {value || "Belum disampaikan oleh pengunjung"}
            </dd>
          </div>
        ))}
      </dl>
      <div>
        <h4 className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
          Detail Masalah & Kebutuhan dari Pengunjung
        </h4>
        <p className="rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 text-sm leading-relaxed whitespace-pre-wrap text-slate-900 dark:text-white">
          {message.message}
        </p>
      </div>
      {(details?.service || details?.product || details?.portfolio) && (
        <details className="rounded-xl border border-slate-200 dark:border-white/10 p-3 text-slate-700 dark:text-slate-200">
          <summary className="cursor-pointer font-semibold">Rincian Katalog Saat Pesan Dikirim</summary>
          <div className="mt-3 space-y-4">
            {details.service && (
              <div>
                <h5 className="font-bold">{details.service.title}</h5>
                <p className="mt-1 leading-relaxed">{details.service.description}</p>
                {details.service.details && (
                  <p className="mt-2 leading-relaxed whitespace-pre-line">{details.service.details}</p>
                )}
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  {details.service.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <p className="mt-2">Dukungan: {details.service.sla}</p>
                {!!details.service.techStack?.length && (
                  <p className="mt-2">Teknologi / Standar: {details.service.techStack.join(", ")}</p>
                )}
                {!!details.service.deliverables?.length && (
                  <dl className="mt-3 space-y-2">
                    {details.service.deliverables.map((item) => (
                      <div key={item.label}>
                        <dt className="font-semibold">{item.label}</dt>
                        <dd className="mt-1 leading-relaxed">{item.description}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            )}
            {details.product && (
              <div>
                <h5 className="font-bold">{details.product.name}</h5>
                <p className="mt-1 leading-relaxed">{details.product.description}</p>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  {details.product.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                {!!details.product.tags.length && (
                  <p className="mt-2">Kapabilitas: {details.product.tags.join(", ")}</p>
                )}
              </div>
            )}
            {details.portfolio && (
              <div>
                <h5 className="font-bold">{details.portfolio.title}</h5>
                <p className="mt-2 leading-relaxed">
                  <strong>Tantangan proyek referensi:</strong> {details.portfolio.challenge}
                </p>
                <p className="mt-2 leading-relaxed">
                  <strong>Solusi pada proyek referensi:</strong> {details.portfolio.solution}
                </p>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  {details.portfolio.scopeOfWork.map((scope) => (
                    <li key={scope}>{scope}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </details>
      )}
    </section>
  );
}
