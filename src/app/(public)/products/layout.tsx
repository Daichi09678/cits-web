import { publicPageMetadata } from "@/config/publicMetadata";

export const metadata = publicPageMetadata("/products");

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
