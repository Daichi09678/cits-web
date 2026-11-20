import type { Metadata } from "next";

export const publicPages = {
  "/": {
    title: "CITS Indonesia | Solusi Teknologi Informasi",
    description: "CITS Indonesia merancang, membangun, dan memelihara sistem digital untuk instansi dan perusahaan.",
  },
  "/about": {
    title: "Tentang Kami | CITS Indonesia",
    description: "Kenali profil perusahaan, perjalanan, dan tim CITS Indonesia, mitra rekayasa sistem sejak 2006.",
  },
  "/services": {
    title: "Layanan Teknologi Informasi | CITS Indonesia",
    description:
      "Jelajahi layanan pengembangan perangkat lunak, konsultasi TI, dan pengadaan infrastruktur CITS Indonesia.",
  },
  "/products": {
    title: "Katalog Produk Perangkat Lunak | CITS Indonesia",
    description:
      "Lihat spesifikasi platform perangkat lunak CITS Indonesia dan ajukan demo produk sesuai kebutuhan Anda.",
  },
  "/portfolio": {
    title: "Portofolio dan Studi Kasus | CITS Indonesia",
    description:
      "Pelajari proyek CITS Indonesia, dari integrasi data hingga rekayasa sistem layanan publik dan korporasi.",
  },
  "/contact": {
    title: "Hubungi Kami dan Ajukan Konsultasi | CITS Indonesia",
    description: "Hubungi tim CITS Indonesia untuk membahas kebutuhan proyek, demo produk, atau permintaan penawaran.",
  },
} as const;

export function getPublicSiteOrigin(): string | undefined {
  const configured = process.env.CITS_PUBLIC_SITE_URL?.trim();
  if (!configured) return undefined;
  try {
    const url = new URL(configured);
    if (["http:", "https:"].includes(url.protocol) && !url.username && !url.password) return url.origin;
  } catch {
    // Do not publish localhost or a guessed canonical domain when configuration is missing or invalid.
  }
  return undefined;
}

export function publicMetadata(path: string, title: string, description: string): Metadata {
  const origin = getPublicSiteOrigin();
  const url = origin ? new URL(path, origin).href : undefined;
  return {
    title,
    description,
    alternates: url ? { canonical: url } : undefined,
    openGraph: { title, description, url, siteName: "CITS Indonesia", locale: "id_ID", type: "website" },
  };
}

export function publicPageMetadata(path: keyof typeof publicPages): Metadata {
  const { title, description } = publicPages[path];
  return publicMetadata(path, title, description);
}
