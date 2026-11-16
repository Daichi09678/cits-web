"use client";

import PortfolioWorkspace from "@/components/pages/admin-portfolio/PortfolioWorkspace";
import usePortfolioEditor from "@/components/pages/admin-portfolio/usePortfolioEditor";

export default function AdminPortfolioPage() {
  const editor = usePortfolioEditor();
  return <PortfolioWorkspace editor={editor} />;
}
