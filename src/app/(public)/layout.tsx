import Navbar from "@/components/pages/public/Navbar";
import Footer from "@/components/pages/public/Footer";
import CompanyBrandProvider from "@/components/pages/public/CompanyBrand";
import { publicPageMetadata } from "@/config/publicMetadata";
import RouteTransition from "@/components/ui/RouteTransition";
import styles from "@/components/pages/public/PublicAccent.module.css";

export const metadata = publicPageMetadata("/");

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <CompanyBrandProvider>
      <div className={`${styles.surface} flex flex-1 flex-col`}>
        <a href="#public-content" className="skip-link">
          Lewati ke konten utama
        </a>
        <Navbar />
        <RouteTransition id="public-content" tabIndex={-1} className="flex-1 scroll-mt-24 overflow-x-clip">
          {children}
        </RouteTransition>
        <Footer />
      </div>
    </CompanyBrandProvider>
  );
}
