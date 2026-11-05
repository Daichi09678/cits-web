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
      technologies: item.tags ?? [],
      image: item.image,
      href: `/products#${encodeURIComponent(item.id)}`,
      productId: item.id,
      searchText: normalize(
        [item.name, item.description, item.category ?? "", ...(item.tags ?? []), ...(item.features ?? [])].join(" ")
      ),
    }));
  return [...serviceItems, ...productItems];
}

/** Derive dependent choices from the current catalog, including when admin edits remove a choice. */
export function filterFeaturedCatalog(items: FeaturedCatalogItem[], input: CatalogFilters) {
  const query = normalize(input.query);
  const words = query.split(" ").filter(Boolean);
  const searched = items.filter((item) => words.every((word) => item.searchText.includes(word)));
  // Validate against the saved catalog, not the query results: an incompatible
  // search must show zero matches instead of silently removing the user's filters.
  const category = items.some((item) => item.category === input.category) ? input.category : "";
  const categorized = items.filter((item) => !category || item.category === category);
  const capability = categorized.some((item) => item.features.includes(input.capability)) ? input.capability : "";
  const capable = categorized.filter((item) => !capability || item.features.includes(capability));
  const technology = capable.some((item) => item.technologies.includes(input.technology)) ? input.technology : "";
  const base = searched.filter((item) => !category || item.category === category);
  const categories = options([...searched.map((item) => item.category), category]);
  const capabilities = options([...base.flatMap((item) => item.features), capability]);
  const technologies = options([
    ...base.filter((item) => !capability || item.features.includes(capability)).flatMap((item) => item.technologies),
    technology,
  ]);
  const matches = base.filter(
    (item) =>
      (!capability || item.features.includes(capability)) && (!technology || item.technologies.includes(technology))
  );
  // Prefer a matching product/service name over incidental matches in long descriptions.
  const relevance = (item: FeaturedCatalogItem) => {
    const title = normalize(item.title);
    if (title === query) return 3;
    if (title.includes(query)) return 2;
    return words.every((word) => title.includes(word)) ? 1 : 0;
  };
  if (query) matches.sort((a, b) => relevance(b) - relevance(a));
  return {
    categories,
    capabilities,
    technologies,
    filters: { query: input.query, category, capability, technology },
    matches,
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
