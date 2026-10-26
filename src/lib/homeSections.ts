import type { LandingPageData, SectionVisibility } from "@/types/schema";

export const HOME_EDITOR_PAGES = ["about", "products", "services", "clients", "contact"] as const;
export type HomeEditorPage = (typeof HOME_EDITOR_PAGES)[number];
type ContentKey = "hero" | "productsIntro" | "servicesIntro" | "clientsIntro" | "cta";
type Field = { key: string; label: string; kind?: "textarea" | "list" | "link" };
type Section = { key: ContentKey; visibility: keyof SectionVisibility; title: string; fields: Field[] };

export const HOME_SECTIONS: Record<HomeEditorPage, Section[]> = {
  about: [
    {
      key: "hero",
      visibility: "hero",
      title: "Pembuka Beranda (Hero)",
      fields: [
        { key: "badgeText", label: "Label di atas judul" },
        { key: "headlinePrefix", label: "Judul utama" },
        { key: "typewriterWords", label: "Teks bergantian pada judul", kind: "list" },
        { key: "subheadline", label: "Deskripsi pembuka", kind: "textarea" },
        { key: "primaryCtaText", label: "Teks tombol utama" },
        { key: "primaryCtaLink", label: "Tujuan tombol utama", kind: "link" },
        { key: "secondaryCtaText", label: "Teks tombol kedua" },
        { key: "secondaryCtaLink", label: "Tujuan tombol kedua", kind: "link" },
        { key: "trustBadges", label: "Poin kepercayaan di bawah tombol", kind: "list" },
        { key: "mockupTitle", label: "Judul panel ilustrasi" },
        { key: "mockupStatus", label: "Status panel ilustrasi" },
      ],
    },
  ],
  products: [
    {
      key: "productsIntro",
      visibility: "products",
      title: "Produk Unggulan di Beranda",
      fields: [
        { key: "badge", label: "Label bagian produk" },
        { key: "title", label: "Judul bagian produk" },
        { key: "subtitle", label: "Deskripsi bagian produk", kind: "textarea" },
        { key: "bottomCtaText", label: "Teks tombol semua produk" },
        { key: "bottomCtaLink", label: "Tujuan tombol semua produk", kind: "link" },
      ],
    },
  ],
  services: [
    {
      key: "servicesIntro",
      visibility: "services",
      title: "Layanan Unggulan di Beranda",
      fields: [
        { key: "badge", label: "Label bagian layanan" },
        { key: "title", label: "Judul bagian layanan" },
        { key: "subtitle", label: "Deskripsi bagian layanan", kind: "textarea" },
        { key: "bottomCtaText", label: "Teks tombol semua layanan" },
        { key: "bottomCtaLink", label: "Tujuan tombol semua layanan", kind: "link" },
      ],
    },
  ],
  clients: [
    {
      key: "clientsIntro",
      visibility: "clients",
      title: "Mitra Klien di Beranda",
      fields: [{ key: "title", label: "Judul di atas logo mitra" }],
    },
  ],
  contact: [
    {
      key: "cta",
      visibility: "cta",
      title: "Ajakan Konsultasi di Bagian Bawah Beranda",
      fields: [
        { key: "badge", label: "Label ajakan konsultasi" },
        { key: "title", label: "Judul ajakan konsultasi" },
        { key: "subtitle", label: "Deskripsi ajakan konsultasi", kind: "textarea" },
        { key: "primaryText", label: "Teks tombol utama" },
        { key: "primaryLink", label: "Tujuan tombol utama", kind: "link" },
        { key: "secondaryText", label: "Teks tombol kedua" },
        { key: "secondaryLink", label: "Tujuan tombol kedua", kind: "link" },
      ],
    },
  ],
};

// Pengaturan beranda terpusat di Tentang Kami; pilihan item tetap di form katalog masing-masing.
HOME_SECTIONS.about.push(
  ...HOME_SECTIONS.products,
  ...HOME_SECTIONS.services,
  ...HOME_SECTIONS.clients,
  ...HOME_SECTIONS.contact
);

export type HomeSectionPatch = { [Key in ContentKey]?: Partial<NonNullable<LandingPageData[Key]>> } & {
  highlights?: LandingPageData["highlights"];
  sectionVisibility?: Partial<SectionVisibility>;
};

export function isHomeEditorPage(value: string): value is HomeEditorPage {
  return HOME_EDITOR_PAGES.some((page) => page === value);
}

function validLink(value: string) {
  if (/^\/(?![\/\\])[^\s\\]*$/.test(value) || /^#[^\s]*$/.test(value)) return true;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

/** Accept only the homepage fields owned by the requested admin page. */
export function parseHomeSectionPatch(page: HomeEditorPage, input: unknown): HomeSectionPatch {
  const fail = (): never => {
    throw new Error("Isi beranda tidak valid atau berisi bagian milik halaman lain.");
  };
  if (!input || typeof input !== "object" || Array.isArray(input)) return fail();
  const raw = input as Record<string, unknown>;
  const sections = HOME_SECTIONS[page];
  const allowed = new Set<string>([
    ...sections.map((section) => section.key),
    "sectionVisibility",
    ...(page === "about" ? ["highlights"] : []),
  ]);
  if (!Object.keys(raw).length || Object.keys(raw).some((key) => !allowed.has(key))) return fail();
  for (const section of sections) {
    if (raw[section.key] === undefined) continue;
    const content = raw[section.key];
    if (!content || typeof content !== "object" || Array.isArray(content)) return fail();
    for (const [key, value] of Object.entries(content)) {
      if (page === "about" && key === "showMockup") {
        if (typeof value !== "boolean") return fail();
        continue;
      }
      const field = section.fields.find((entry) => entry.key === key);
      if (!field) return fail();
      if (field.kind === "list") {
        if (
          !Array.isArray(value) ||
          value.length > 30 ||
          value.some((entry) => typeof entry !== "string" || !entry.trim() || entry.length > 300)
        )
          return fail();
      } else if (
        typeof value !== "string" ||
        value.length > (field.kind === "textarea" ? 4000 : 500) ||
        (field.kind === "link" && !validLink(value))
      )
        return fail();
    }
  }
  if (
    raw.highlights !== undefined &&
    (!Array.isArray(raw.highlights) ||
      raw.highlights.length > 12 ||
      raw.highlights.some((entry) => {
        if (!entry || typeof entry !== "object" || Array.isArray(entry)) return true;
        const item = entry as Record<string, unknown>;
        return (
          Object.keys(item).some((key) => !["label", "value", "isActive"].includes(key)) ||
          typeof item.label !== "string" ||
          item.label.length > 150 ||
          typeof item.value !== "string" ||
          item.value.length > 50 ||
          (item.isActive !== undefined && typeof item.isActive !== "boolean")
        );
      }))
  )
    return fail();
  if (raw.sectionVisibility !== undefined) {
    if (!raw.sectionVisibility || typeof raw.sectionVisibility !== "object" || Array.isArray(raw.sectionVisibility))
      return fail();
    const keys = [...sections.map((section) => section.visibility), ...(page === "about" ? ["highlights"] : [])];
    if (
      Object.entries(raw.sectionVisibility).some(
        ([key, value]) => !keys.includes(key as keyof SectionVisibility) || typeof value !== "boolean"
      )
    )
      return fail();
  }
  return raw as HomeSectionPatch;
}

export function homeSectionPatch(page: HomeEditorPage, data: LandingPageData): HomeSectionPatch {
  const patch: Record<string, unknown> = {};
  const visibility: Partial<SectionVisibility> = {};
  for (const section of HOME_SECTIONS[page]) {
    const source = data[section.key] as unknown as Record<string, unknown>;
    patch[section.key] = Object.fromEntries(
      section.fields
        .filter((field) => source?.[field.key] !== undefined)
        .map((field) => [
          field.key,
          field.kind === "list" && Array.isArray(source[field.key])
            ? (source[field.key] as string[]).map((item) => item.trim()).filter(Boolean)
            : source[field.key],
        ])
    );
    visibility[section.visibility] = data.sectionVisibility?.[section.visibility] !== false;
  }
  if (page === "about") {
    (patch.hero as Record<string, unknown>).showMockup = data.hero.showMockup !== false;
    patch.highlights = data.highlights;
    visibility.highlights = data.sectionVisibility?.highlights !== false;
  }
  return { ...patch, sectionVisibility: visibility };
}
