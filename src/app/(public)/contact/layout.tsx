import { publicPageMetadata } from "@/config/publicMetadata";

export const metadata = publicPageMetadata("/contact");

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
