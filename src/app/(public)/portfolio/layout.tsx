import { publicPageMetadata } from "@/config/publicMetadata";

export const metadata = publicPageMetadata("/portfolio");

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
