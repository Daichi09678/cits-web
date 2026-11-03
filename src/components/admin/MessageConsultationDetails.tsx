import { CONSULTATION_PURPOSES, CONSULTATION_SOURCES } from "@/lib/consultation";
import type { ContactMessage } from "@/types/schema";
import { FileText, Info } from "lucide-react";

export default function MessageConsultationDetails({ message }: { message: ContactMessage }) {
  const details = message.consultation;
  const requirements = [
    ["Hasil yang Diharapkan", details?.expectedOutcome],
    ["Sistem / Cara Kerja Saat Ini", details?.currentSystem],
    ["Target Waktu", details?.timeline],
    ["Perkiraan Penggunaan", details?.usageEstimate],
  ];
  return (
    <section
      className="min-w-0 space-y-5 text-[13px] sm:space-y-6 [overflow-wrap:anywhere]"
      aria-label="Detail kebutuhan konsultasi"
    >
      <div className="space-y-3 rounded-lg border border-gray-200 bg-[#FFF1E8]/60 p-4 dark:border-white/10 dark:bg-orange-500/5">
        <h3 className="flex items-center gap-2 text-[15px] font-semibold text-gray-900 dark:text-white">
          <FileText className="h-[18px] w-[18px] text-[#F45100]" />
          Kebutuhan Pengunjung
        </h3>
        <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-slate-500 dark:text-slate-400">Layanan yang Dikonsultasikan</dt>
            <dd className="mt-0.5 font-medium text-gray-900 dark:text-white">
              {details?.service?.title || message.serviceRequested || "Konsultasi Umum"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 dark:text-slate-400">Produk yang Dikonsultasikan</dt>
            <dd className="mt-0.5 font-medium text-gray-900 dark:text-white">
              {details?.product?.name || message.productRequested || "Tidak memilih produk"}
            </dd>
          </div>
          {details?.source && (
            <div>
              <dt className="text-xs text-slate-500 dark:text-slate-400">Asal Konsultasi</dt>
              <dd className="mt-0.5 text-gray-900 dark:text-white">{CONSULTATION_SOURCES[details.source]}</dd>
            </div>
          )}
          {details?.purpose && (
            <div>
              <dt className="text-xs text-slate-500 dark:text-slate-400">Tujuan Konsultasi</dt>
              <dd className="mt-0.5 text-gray-900 dark:text-white">{CONSULTATION_PURPOSES[details.purpose]}</dd>
            </div>
          )}
        </dl>
        {details?.portfolio && (
          <div className="pt-3 border-t border-gray-200 dark:border-white/10">
            <p className="text-xs text-slate-600 dark:text-slate-300">Referensi Proyek untuk Kebutuhan Serupa</p>
            <p className="mt-1 font-medium text-gray-900 dark:text-white">{details.portfolio.title}</p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              {details.portfolio.client} · {details.portfolio.servicePillar}
            </p>
          </div>
        )}
        {!!details?.requestedFeatures?.length && (
          <div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">Fitur yang Ingin Dibahas</p>
            <ul className="list-disc pl-5 space-y-1 text-[13px] text-slate-800 dark:text-slate-100">
              {details.requestedFeatures.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <section aria-label="Detail tambahan">
        <h3 className="mb-3 flex items-center gap-2 text-[15px] font-semibold text-gray-900 dark:text-white">
          <Info className="h-[18px] w-[18px] text-slate-500" />
          Detail Tambahan
        </h3>
        <dl className="grid sm:grid-cols-2 gap-3">
          {requirements.map(([label, value]) => (
            <div
              key={label}
              className="rounded-lg border border-gray-200 bg-[#F8F9FB] px-3 py-2 dark:border-white/10 dark:bg-white/5"
            >
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</dt>
              <dd
                className={`mt-0.5 whitespace-pre-wrap leading-5 ${value?.trim() ? "text-gray-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}
              >
                {value?.trim() ? value : "Belum disampaikan oleh pengunjung"}
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-3 rounded-lg border border-gray-200 bg-[#F8F9FB] px-3 py-2 dark:border-white/10 dark:bg-white/5">
          <h4 className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            Detail Masalah & Kebutuhan dari Pengunjung
          </h4>
          <p
            className={`whitespace-pre-wrap leading-5 ${message.message?.trim() ? "text-gray-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}
          >
            {message.message?.trim() ? message.message : "Belum disampaikan oleh pengunjung"}
          </p>
        </div>
      </section>
      {(details?.service || details?.product || details?.portfolio) && (
        <details className="border-t border-gray-200 pt-4 text-slate-700 dark:border-white/10 dark:text-slate-200">
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
