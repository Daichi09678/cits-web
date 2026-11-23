import { getPublicSiteOrigin } from "@/config/publicMetadata";
import { createCompanyProfilePdf } from "@/lib/companyProfilePdf";
import { DbRepo } from "@/lib/db";

export async function GET() {
  try {
    const [about, contact, services, studies] = await Promise.all([
      DbRepo.getAboutData(),
      DbRepo.getContactInfo(),
      DbRepo.getServices(),
      DbRepo.getPortfolio(),
    ]);
    const pdf = await createCompanyProfilePdf({ about, contact, services, studies, origin: getPublicSiteOrigin() });
    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="profil-perusahaan-cits.pdf"',
        "Cache-Control": "public, max-age=60, s-maxage=300",
      },
    });
  } catch (error) {
    console.error("Unable to generate public company profile", error);
    return new Response("Profil perusahaan belum dapat diunduh. Silakan coba kembali.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  }
}
