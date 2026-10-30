import { publicPageDefinitions } from "@/data/publicPageContent";

export type PublicContentPage = "about" | "portfolio";
export type ContentRecord = Record<string, string | string[]>;
export interface PublicPageContent {
  texts: Record<string, string>;
  visibility: Record<string, boolean>;
  /** Urutan section yang dipakai halaman publik. */
  order: string[];
  /** Section yang juga ditampilkan sebagai ringkasan di beranda. */
  homeVisibility: Record<string, boolean>;
  collections: Record<string, ContentRecord[]>;
}
export interface PublicPageDefinition {
  title: string;
  sections: { key: string; title: string; fields: { key: string; label: string; kind: string }[] }[];
  texts: Record<string, string>;
  collections: Record<string, { title: string; section: string; items: ContentRecord[] }>;
}

export function isPublicContentPage(page: string): page is PublicContentPage {
  return page === "about" || page === "portfolio";
}
export function pageDefinition(page: PublicContentPage): PublicPageDefinition {
  return publicPageDefinitions[page];
}
export function sectionKeys(page: PublicContentPage): string[] {
  return pageDefinition(page).sections.map((section) => section.key);
}
export function resolvePublicPageContent(
  page: PublicContentPage,
  saved?: Partial<PublicPageContent> | null
): PublicPageContent {
  const definition = pageDefinition(page);
  const keys = definition.sections.map((section) => section.key);
  const savedOrder = Array.isArray(saved?.order)
    ? saved.order.filter((key): key is string => typeof key === "string" && keys.includes(key))
    : [];
  return {
    texts: { ...definition.texts, ...saved?.texts },
    visibility: {
      ...Object.fromEntries(keys.map((key) => [key, true])),
      ...saved?.visibility,
    },
    order: [...new Set([...savedOrder, ...keys])],
    homeVisibility: {
      ...Object.fromEntries(keys.map((key) => [key, false])),
      ...saved?.homeVisibility,
    },
    collections: {
      ...Object.fromEntries(Object.entries(definition.collections).map(([key, collection]) => [key, collection.items])),
      ...saved?.collections,
    },
  };
}
export function pageCollection<T>(data: PublicPageContent, key: string): T[] {
  return (data.collections[key] || []) as T[];
}
export function validContentAddress(value: string, image = false): boolean {
  if (/^\/(?![/\\])[^\s\\]*$/.test(value)) return true;
  if (!image && /^#[^\s]*$/.test(value)) return true;
  if (image && /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(value)) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}
function record(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
export function parsePublicPageContent(page: PublicContentPage, input: unknown): PublicPageContent {
  const fail = (): never => {
    throw new Error("Konten halaman tidak valid. Periksa teks, alamat tautan, dan daftar isian.");
  };
  if (
    !record(input) ||
    Object.keys(input).some(
      (key) => !["texts", "visibility", "collections", "order", "homeVisibility"].includes(key)
    ) ||
    !record(input.texts) ||
    !record(input.visibility) ||
    !record(input.collections)
  )
    return fail();
  const definition = pageDefinition(page);
  const keys = definition.sections.map((section) => section.key);
  const fields = definition.sections.flatMap((section) => section.fields);
  for (const [key, value] of Object.entries(input.texts)) {
    const field = fields.find((entry) => entry.key === key);
    if (!field || typeof value !== "string" || value.length > (field.kind === "image" ? 2.8 * 1024 * 1024 : 8000))
      return fail();
    if (["link", "image"].includes(field.kind) && !validContentAddress(value, field.kind === "image")) return fail();
  }
  for (const [key, value] of Object.entries(input.visibility))
    if (!keys.includes(key) || typeof value !== "boolean") return fail();

  if (input.order !== undefined) {
    if (!Array.isArray(input.order) || input.order.length !== keys.length) return fail();
    const seen = new Set<string>();
    for (const key of input.order) {
      if (typeof key !== "string" || !keys.includes(key) || seen.has(key)) return fail();
      seen.add(key);
    }
  }
  if (input.homeVisibility !== undefined) {
    if (!record(input.homeVisibility)) return fail();
    for (const [key, value] of Object.entries(input.homeVisibility))
      if (!keys.includes(key) || typeof value !== "boolean") return fail();
  }

  for (const [key, value] of Object.entries(input.collections)) {
    if (!Object.hasOwn(definition.collections, key) || !Array.isArray(value) || value.length > 100) return fail();
    const shape = definition.collections[key].items[0];
    const ids = new Set<string>();
    for (const item of value) {
      if (!record(item) || Object.keys(item).some((field) => !Object.hasOwn(shape, field))) return fail();
      for (const [field, initial] of Object.entries(shape)) {
        const entry = item[field];
        if (Array.isArray(initial)) {
          if (
            !Array.isArray(entry) ||
            entry.length > 50 ||
            entry.some((line) => typeof line !== "string" || !line.trim() || line.length > 2000)
          )
            return fail();
        } else if (typeof entry !== "string" || entry.length > 8000) return fail();
      }
      if (key === "awards" && !["kementerian", "bumn", "egov"].includes(String(item.category))) return fail();
      if (
        key === "governancePillars" &&
        !["Building2", "FileCheck", "ShieldCheck", "Users"].includes(String(item.icon))
      )
        return fail();
      if (typeof item.id === "string") {
        if (!item.id || ids.has(item.id)) return fail();
        ids.add(item.id);
      }
    }
  }
  return resolvePublicPageContent(page, input as unknown as PublicPageContent);
}
