import Navbar from "@/components/pages/public/Navbar";
import Footer from "@/components/pages/public/Footer";
import CompanyBrandProvider from "@/components/pages/public/CompanyBrand";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <CompanyBrandProvider>
      <Navbar />
      <div className="flex-1 overflow-x-clip">{children}</div>
      <Footer />
    </CompanyBrandProvider>
  );
}
