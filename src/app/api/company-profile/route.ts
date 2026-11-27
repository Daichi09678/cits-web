import { PDFDocument } from "pdf-lib";
import { getPublicSiteOrigin } from "@/config/publicMetadata";
import { requireAdmin } from "@/lib/apiAuth";
import { createCompanyProfilePdf } from "@/lib/companyProfilePdf";
import { DbRepo } from "@/lib/db";

export async function GET() {
  try {
    let pdf: Uint8Array | null = await DbRepo.getCompanyProfilePdf();
    if (!pdf) {
      const [about, contact, services, studies] = await Promise.all([
        DbRepo.getAboutData(),
        DbRepo.getContactInfo(),
        DbRepo.getServices(),
        DbRepo.getPortfolio(),
      ]);
      pdf = await createCompanyProfilePdf({ about, contact, services, studies, origin: getPublicSiteOrigin() });
    }
    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="profil-perusahaan-cits.pdf"',
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
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
export async function PUT(request: Request) {
  const denied = await requireAdmin(request, "about", "edit");
  if (denied) return denied;

  const maxBytes = 4 * 1024 * 1024;
  const tooLarge = () => Response.json({ message: "Ukuran PDF maksimal 4 MB." }, { status: 413 });
  if (Number(request.headers.get("content-length")) > maxBytes) return tooLarge();
  if (request.headers.get("content-type") !== "application/pdf")
    return Response.json({ message: "Pilih file PDF." }, { status: 415 });

  let bytes: Buffer;
  try {
    bytes = Buffer.from(await request.arrayBuffer());
    if (bytes.length > maxBytes) return tooLarge();
    if (bytes.subarray(0, 5).toString() !== "%PDF-" || !(await PDFDocument.load(bytes)).getPageCount())
      throw new Error("PDF tidak valid");
  } catch {
    return Response.json({ message: "PDF tidak valid atau tidak bisa dibuka." }, { status: 400 });
  }

  try {
    await DbRepo.saveCompanyProfilePdf(bytes);
    return Response.json({ success: true });
  } catch (error) {
    console.error("Unable to save company profile PDF", error);
    return Response.json({ message: "PDF belum tersimpan. Silakan coba lagi." }, { status: 503 });
  }
}
