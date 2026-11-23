import type { MetadataRoute } from "next";
import { getPublicSiteOrigin, publicPages } from "@/config/publicMetadata";
import { DbRepo } from "@/lib/db";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = getPublicSiteOrigin();
  if (!origin) return [];

  const paths = Object.keys(publicPages);
  try {
    const studies = await DbRepo.getPortfolio();
    paths.push(
      ...studies.filter((study) => study.isActive !== false).map(({ id }) => `/portfolio/${encodeURIComponent(id)}`)
    );
  } catch (error) {
    console.error("Unable to include case studies in sitemap", error);
  }
  return paths.map((path) => ({ url: new URL(path, origin).href }));
}
