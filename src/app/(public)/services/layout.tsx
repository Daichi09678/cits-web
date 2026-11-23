import { publicPageMetadata } from "@/config/publicMetadata";

export const metadata = publicPageMetadata("/services");

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
