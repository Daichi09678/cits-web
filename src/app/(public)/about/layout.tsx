import { publicPageMetadata } from "@/config/publicMetadata";

export const metadata = publicPageMetadata("/about");

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
