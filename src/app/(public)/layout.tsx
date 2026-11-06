import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CompanyBrandProvider from "@/components/layout/CompanyBrand";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <CompanyBrandProvider>
      <Navbar />
      <div className="flex-1 overflow-x-clip">{children}</div>
      <Footer />
    </CompanyBrandProvider>
  );
}
