/** Shareable consultation links preserve the selected service and catalog product. */
import type { ConsultationPurpose, ConsultationRequest, ConsultationSource } from "@/types/schema";

export const CONSULTATION_PURPOSES: Record<ConsultationPurpose, string> = {
  discussion: "Konsultasi Kebutuhan",
  demo: "Konsultasi & Demo Produk",
  quotation: "Permintaan Penawaran",
  customization: "Pengembangan / Penyesuaian Sistem",
  support: "Dukungan / Pemeliharaan",
};

export const CONSULTATION_SOURCES: Record<ConsultationSource, string> = {
  home: "Beranda",
  products: "Produk",
  services: "Layanan",
  portfolio: "Portofolio",
  about: "Tentang Kami",
  contact: "Hubungi Kami",
};

export function consultationSource(value: string | null | undefined): ConsultationSource {
  return value && Object.hasOwn(CONSULTATION_SOURCES, value) ? (value as ConsultationSource) : "contact";
}

export function consultationHref(input: {
  service?: string;
  productId?: string;
  purpose?: ConsultationPurpose;
  features?: string[];
  source?: ConsultationSource;
  referenceId?: string;
}): string {
  const query = new URLSearchParams();
  if (input.service) query.set("service", input.service);
  if (input.productId) query.set("product", input.productId);
  if (input.purpose) query.set("purpose", input.purpose);
  if (input.source) query.set("source", input.source);
  if (input.referenceId) query.set("reference", input.referenceId);
  input.features?.slice(0, 20).forEach((feature) => query.append("feature", feature));
  return `/contact${query.size ? `?${query}` : ""}#consultation-form`;
}

export function consultationPurpose(value: string | null | undefined): ConsultationPurpose {
  return value && Object.hasOwn(CONSULTATION_PURPOSES, value) ? (value as ConsultationPurpose) : "discussion";
}

/** Validate visitor-provided requirements separately from catalog snapshots. */
export function parseConsultationRequest(
  input: unknown
): { ok: true; value: ConsultationRequest } | { ok: false; message: string } {
  if (input === undefined) return { ok: true, value: { purpose: "discussion", requestedFeatures: [] } };
  if (!input || typeof input !== "object" || Array.isArray(input))
    return { ok: false, message: "Detail konsultasi tidak valid." };
  const raw = input as Record<string, unknown>;
  if (raw.source !== undefined && (typeof raw.source !== "string" || !Object.hasOwn(CONSULTATION_SOURCES, raw.source)))
    return { ok: false, message: "Asal konsultasi tidak valid." };
  if (raw.referenceId !== undefined && (typeof raw.referenceId !== "string" || raw.referenceId.length > 200))
    return { ok: false, message: "Referensi portofolio tidak valid." };
  if (
    raw.purpose !== undefined &&
    (typeof raw.purpose !== "string" || !Object.hasOwn(CONSULTATION_PURPOSES, raw.purpose))
  )
    return { ok: false, message: "Tujuan konsultasi tidak valid." };
  const value: ConsultationRequest = { purpose: consultationPurpose(raw.purpose as string | undefined) };
  if (raw.source !== undefined) value.source = raw.source as ConsultationSource;
  if (typeof raw.referenceId === "string" && raw.referenceId.trim()) value.referenceId = raw.referenceId.trim();
  for (const key of ["expectedOutcome", "currentSystem", "timeline", "usageEstimate"] as const) {
    if (
      raw[key] !== undefined &&
      (typeof raw[key] !== "string" ||
        (raw[key] as string).length > (key === "expectedOutcome" || key === "currentSystem" ? 2000 : 200))
    )
      return { ok: false, message: "Rincian kebutuhan terlalu panjang atau formatnya tidak valid." };
    value[key] = typeof raw[key] === "string" ? raw[key].trim() : "";
  }
  if (
    raw.requestedFeatures !== undefined &&
    (!Array.isArray(raw.requestedFeatures) ||
      raw.requestedFeatures.length > 20 ||
      raw.requestedFeatures.some((item) => typeof item !== "string" || item.length > 500))
  )
    return { ok: false, message: "Pilihan fitur tidak valid." };
  value.requestedFeatures = [
    ...new Set(((raw.requestedFeatures as string[] | undefined) || []).map((item) => item.trim()).filter(Boolean)),
  ];
  return { ok: true, value };
}

export function consultationSummary(input: {
  serviceRequested?: string;
  productRequested?: string;
  consultation?: { portfolio?: { title: string } };
}): string {
  return (
    [input.serviceRequested, input.productRequested, input.consultation?.portfolio?.title]
      .filter(Boolean)
      .join(" | ") || "Konsultasi Umum"
  );
}
