import type { MetadataRoute } from "next";
import { getPublicSiteOrigin } from "@/config/publicMetadata";

export default function robots(): MetadataRoute.Robots {
  const origin = getPublicSiteOrigin();
  return {
    rules: origin ? { userAgent: "*", allow: "/", disallow: "/api/" } : { userAgent: "*", disallow: "/" },
    sitemap: origin ? `${origin}/sitemap.xml` : undefined,
  };
}
