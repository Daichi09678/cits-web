import { defaultServicePresentations, type ServicePresentation } from "@/data/serviceDetails";
import type { ServicePillar } from "@/types/schema";

const SERVICE_ANCHORS = new Map([
  ["pillar-1", "software-house"],
  ["pillar-2", "it-consultant"],
  ["pillar-3", "it-supplier"],
]);

/** Keep existing service links stable even when administrators reorder the catalog. */
export function serviceAnchor(id: string): string {
  return SERVICE_ANCHORS.get(id) || id;
}

/** Both public pages use the editable service catalog and the same detail defaults. */
export function resolveServiceCatalog(services: ServicePillar[]): ServicePresentation[] {
  return services
    .filter((service) => service.isActive !== false)
    .map((service) => {
      const id = serviceAnchor(service.id);
      const fallback = defaultServicePresentations.find((item) => item.id === id);
      return {
        id,
        title: service.title || fallback?.title || "Layanan CITS",
        category: service.title || fallback?.category || "Layanan CITS",
        badge: service.badge || fallback?.badge || "Layanan",
        description: service.desc || fallback?.description || "",
        details: service.details ?? (service.desc !== fallback?.description ? fallback?.description : ""),
        icon: service.icon || fallback?.icon || "Briefcase",
        features: service.features ?? fallback?.features ?? [],
        slaNote: service.sla || fallback?.slaNote || "Dukungan disesuaikan dengan kebutuhan proyek.",
        image: service.image || fallback?.image || "/services/software-house.webp",
        gradient: fallback?.gradient || "from-orange-600 to-amber-500",
        techStack: service.techStack ?? fallback?.techStack ?? [],
        caseStudies: service.caseStudies ?? fallback?.caseStudies ?? [],
        deliverables: service.deliverables ?? fallback?.deliverables ?? [],
      };
    });
}

export function parseServiceCatalog(
  input: unknown
): { ok: true; value: ServicePillar[] } | { ok: false; message: string } {
  const invalid = (message: string) => ({ ok: false as const, message });
  if (!Array.isArray(input) || !input.length || input.length > 50)
    return invalid("Isi katalog dengan 1 sampai 50 pilar layanan.");
  const result: ServicePillar[] = [];
  for (const entry of input) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry))
      return invalid("Format pilar layanan tidak valid.");
    const raw = entry as Record<string, unknown>;
    for (const field of ["id", "title", "badge", "icon", "desc", "sla"] as const) {
      if (typeof raw[field] !== "string" || !raw[field].trim() || raw[field].length > (field === "desc" ? 2000 : 150))
        return invalid("Judul, label, ikon, deskripsi, dan SLA wajib diisi sesuai batas panjangnya.");
    }
    if (raw.isActive !== undefined && typeof raw.isActive !== "boolean") return invalid("Status layanan tidak valid.");
    if (raw.details !== undefined && (typeof raw.details !== "string" || raw.details.length > 8000))
      return invalid("Penjelasan lengkap maksimal 8.000 karakter.");
    for (const field of ["features", "techStack", "caseStudies"] as const) {
      if (
        raw[field] !== undefined &&
        (!Array.isArray(raw[field]) ||
          raw[field].length > 50 ||
          raw[field].some((value: unknown) => typeof value !== "string" || !value.trim() || value.length > 500))
      )
        return invalid("Daftar fitur, teknologi, dan implementasi harus berisi teks, maksimal 50 baris.");
    }
    if (
      raw.deliverables !== undefined &&
      (!Array.isArray(raw.deliverables) ||
        raw.deliverables.length > 20 ||
        raw.deliverables.some((value: unknown) => {
          if (!value || typeof value !== "object") return true;
          const item = value as Record<string, unknown>;
          return (
            typeof item.label !== "string" ||
            !item.label.trim() ||
            item.label.length > 150 ||
            typeof item.description !== "string" ||
            !item.description.trim() ||
            item.description.length > 2000
          );
        }))
    )
      return invalid("Hasil layanan harus memiliki judul dan keterangan, maksimal 20 hasil.");
    if (raw.image !== undefined) {
      if (typeof raw.image !== "string" || raw.image.length > 2.8 * 1024 * 1024)
        return invalid("Foto layanan terlalu besar atau tidak valid.");
      const image = raw.image.trim();
      let valid =
        !image ||
        /^\/(?!\/)[^\s]*$/.test(image) ||
        /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(image);
      if (!valid) {
        try {
          const url = new URL(image);
          valid = url.protocol === "https:" && !url.username && !url.password;
        } catch {
          /* A malformed image address is rejected below. */
        }
      }
      if (!valid) return invalid("Gunakan alamat foto HTTPS, lokasi foto website, atau unggahan JPG, PNG, atau WebP.");
    }
    const service = {
      id: String(raw.id).trim(),
      title: String(raw.title).trim(),
      badge: String(raw.badge).trim(),
      icon: String(raw.icon).trim(),
      desc: String(raw.desc).trim(),
      sla: String(raw.sla).trim(),
      isActive: raw.isActive !== false,
    } as ServicePillar;
    for (const key of ["image", "details", "features", "techStack", "caseStudies", "deliverables"] as const) {
      if (raw[key] !== undefined) Object.assign(service, { [key]: raw[key] });
    }
    result.push(service);
  }
  if (new Set(result.map((item) => item.id)).size !== result.length)
    return invalid("ID pilar layanan tidak boleh sama.");
  return { ok: true, value: result };
}
