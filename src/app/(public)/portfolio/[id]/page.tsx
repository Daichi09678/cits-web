import type { Metadata } from "next";
import CaseStudyDetail from "@/components/portfolio/CaseStudyDetail";
import { initialCaseStudies } from "@/data/initialData";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const study = initialCaseStudies.find((item) => item.id === id);
  if (!study) {
    return {
      title: "Studi Kasus — CITS Indonesia",
      description: "Portofolio proyek CITS Indonesia untuk instansi pemerintah dan korporasi.",
    };
  }
  return {
    title: `${study.title} — Portofolio CITS Indonesia`,
    description: study.tagline,
    openGraph: {
      title: study.title,
      description: study.tagline,
      type: "article",
    },
  };
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <CaseStudyDetail id={id} />;
}
