import type { ProductItem, ServicePillar } from "@/types/schema";

export function normalizeCatalogQuery(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("id")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

/** Every word must occur in the saved content, even when words are in different fields. */
export function matchesCatalogQuery(query: string, fields: (string | undefined)[]): boolean {
  const words = normalizeCatalogQuery(fields.filter(Boolean).join(" ")).split(" ");
  return normalizeCatalogQuery(query)
    .split(" ")
    .filter(Boolean)
    .every((word) => words.some((entry) => entry.startsWith(word)));
}

export const productSearchFields = (product: ProductItem): string[] => [
  product.name,
  product.category,
  product.description,
  product.details || "",
  ...product.features,
  ...product.tags,
  ...(product.specifications || []).flatMap((row) => [row.name, row.value]),
];

export const serviceSearchFields = (service: ServicePillar): string[] => [
  service.title,
  service.category || "",
  service.desc,
  service.details || "",
  service.sla,
  ...(service.features || []),
  ...(service.tags || []),
  ...(service.techStack || []),
  ...(service.caseStudies || []),
  ...(service.deliverables || []).flatMap((row) => [row.label, row.description]),
];

export interface ProductFilters {
  query: string;
  category: string;
}
export const emptyProductFilters: ProductFilters = { query: "", category: "" };

export function filterProducts(products: ProductItem[], filters: ProductFilters): ProductItem[] {
  return products.filter(
    (product) =>
      matchesCatalogQuery(filters.query, productSearchFields(product)) &&
      (!filters.category || product.category === filters.category)
  );
}
