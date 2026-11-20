import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import CaseStudyDetail from "@/components/portfolio/CaseStudyDetail";
import { publicMetadata } from "@/config/publicMetadata";
import { DbRepo } from "@/lib/db";

type PageProps = { params: Promise<{ id: string }> };
const getPublishedStudies = cache(async () =>
  (await DbRepo.getPortfolio()).filter((study) => study.isActive !== false)
);

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const study = (await getPublishedStudies()).find((item) => item.id === id);
  if (!study) notFound();
  return publicMetadata(`/portfolio/${encodeURIComponent(id)}`, `${study.title} | CITS Indonesia`, study.tagline);
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const caseStudies = await getPublishedStudies();
  if (!caseStudies.some((item) => item.id === id)) notFound();
  return <CaseStudyDetail id={id} caseStudies={caseStudies} matchPortfolioTheme={id === "ktp-el"} />;
}
