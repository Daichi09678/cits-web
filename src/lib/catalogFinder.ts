import { resolveServiceCatalog } from "@/lib/serviceCatalog";
import type { ProductItem, ServicePillar } from "@/types/schema";

export interface FeaturedCatalogItem {
  id: string;
  kind: "Layanan" | "Produk";
  title: string;
  description: string;
  category: string;
  tags: string[];
  features: string[];
  technologies: string[];
  image?: string;
  sla?: string;
  href: string;
  serviceTitle?: string;
  productId?: string;
  searchText: string;
}
export interface CatalogFilters {
  query: string;
  category: string;
  capability: string;
  technology: string;
}
export const EMPTY_CATALOG_FILTERS: CatalogFilters = { query: "", category: "", capability: "", technology: "" };
const normalize = (text: string) =>
  text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
const options = (values: string[]) =>
  [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, "id", { sensitivity: "base" }));

export function buildFeaturedCatalog(services: ServicePillar[], products: ProductItem[]): FeaturedCatalogItem[] {
  const serviceItems = resolveServiceCatalog(
    services.filter((item) => item.isActive !== false && item.showOnHome !== false)
  ).map((item) => ({
    id: `service-${item.id}`,
    kind: "Layanan" as const,
    title: item.title,
    description: item.description,
    category: item.category ?? "",
    tags: item.tags ?? [],
    features: [...new Set(item.features ?? [])],
    technologies: item.techStack ?? [],
    image: item.image,
    sla: item.slaNote,
    href: `/services#${encodeURIComponent(item.id)}`,
    serviceTitle: item.title,
    searchText: normalize(
      [
        item.title,
        item.description,
        item.category,
        item.details,
        item.slaNote,
        ...item.tags,
        ...item.features,
        ...item.techStack,
        ...item.caseStudies,
        ...item.deliverables.flatMap((entry) => [entry.label, entry.description]),
      ].join(" ")
    ),
  }));
  const productItems = products
    .filter((item) => item.isActive && item.showOnHome !== false)
    .map((item) => ({
      id: `product-${item.id}`,
      kind: "Produk" as const,
      title: item.name,
      description: item.description,
      category: item.category ?? "",
      tags: item.tags ?? [],
      features: [...new Set(item.features ?? [])],
      technologies: [],
      image: item.image,
      href: `/products#${encodeURIComponent(item.id)}`,
      productId: item.id,
      searchText: normalize([item.name, item.description, item.category ?? "", ...(item.tags ?? []), ...(item.features ?? [])].join(" ")),
    }));
  return [...serviceItems, ...productItems];
}

/** Derive dependent choices from the current catalog, including when admin edits remove a choice. */
export function filterFeaturedCatalog(items: FeaturedCatalogItem[], input: CatalogFilters) {
  const categories = options(items.map((item) => item.category));
  const category = categories.includes(input.category) ? input.category : "";
  const words = normalize(input.query).split(" ").filter(Boolean);
  const base = items.filter(
    (item) => (!category || item.category === category) && words.every((word) => item.searchText.includes(word))
  );
  const capabilities = options(base.flatMap((item) => item.features));
  const capability = capabilities.includes(input.capability) ? input.capability : "";
  const capable = base.filter((item) => !capability || item.features.includes(capability));
  const technologies = options(capable.flatMap((item) => item.technologies));
  const technology = technologies.includes(input.technology) ? input.technology : "";
  return {
    categories,
    capabilities,
    technologies,
    filters: { query: input.query, category, capability, technology },
    matches: capable.filter((item) => !technology || item.technologies.includes(technology)),
  };
}

export function selectedCatalogFeatures(
  item: FeaturedCatalogItem,
  choices: string[] | undefined,
  capability: string
): string[] {
  const selected = choices ?? (capability ? [capability] : []);
  return [...new Set(selected)].filter((feature) => item.features.includes(feature)).slice(0, 20);
}
