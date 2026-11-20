import { PDFDocument, PageSizes, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import type { AboutData, CaseStudyItem, ContactInfo, ServicePillar } from "@/types/schema";

type ProfileData = {
  about: Pick<AboutData, "story">;
  contact: Pick<ContactInfo, "email" | "phone" | "address">;
  services: readonly ServicePillar[];
  studies: readonly CaseStudyItem[];
  origin?: string;
};

const featuredIds = ["ktp-el", "simlala", "satu-data-bkpm"];
const [width, height] = PageSizes.A4;
const margin = 48;
const navy = rgb(0.06, 0.09, 0.16);
const orange = rgb(0.73, 0.24, 0.06);
const slate = rgb(0.24, 0.3, 0.38);

function summarize(value: string, limit: number) {
  const text = value.replace(/\s+/g, " ").trim();
  return text.length <= limit ? text : `${text.slice(0, limit).replace(/\s+\S*$/, "")}…`;
}

function linesFor(value: string, font: PDFFont, size: number): string[] {
  const chars = new Set(font.getCharacterSet());
  const text = Array.from(value.replace(/\s+/g, " ").trim(), (char) =>
    chars.has(char.codePointAt(0)!) ? char : " "
  ).join("");
  const lines: string[] = [];
  let line = "";
  const fits = (candidate: string) => font.widthOfTextAtSize(candidate, size) <= width - 2 * margin;

  for (let word of text.split(/ +/).filter(Boolean)) {
    if (line && !fits(`${line} ${word}`)) {
      lines.push(line);
      line = "";
    }
    while (!fits(word)) {
      let end = 1;
      while (end < word.length && fits(word.slice(0, end + 1))) end++;
      lines.push(word.slice(0, end));
      word = word.slice(end);
    }
    line = line ? `${line} ${word}` : word;
  }
  if (line) lines.push(line);
  return lines;
}

export async function createCompanyProfilePdf({ about, contact, services, studies, origin }: ProfileData) {
  const pdf = await PDFDocument.create();
  pdf.setTitle("Profil Perusahaan CITS Indonesia");
  pdf.setAuthor("PT Cipta Integrasi Teknologi Solusi");
  pdf.setLanguage("id-ID");
  const [regular, bold] = await Promise.all([
    pdf.embedFont(StandardFonts.Helvetica),
    pdf.embedFont(StandardFonts.HelveticaBold),
  ]);
  let page = pdf.addPage(PageSizes.A4);
  let y = height - 66;

  function paragraph(text: string, font = regular, size = 11, color = slate) {
    for (const line of linesFor(text, font, size)) {
      if (y < 68) {
        page = pdf.addPage(PageSizes.A4);
        y = height - margin;
      }
      page.drawText(line, { x: margin, y, font, size, color });
      y -= size * 1.38;
    }
  }

  function section(title: string) {
    if (y < 110) {
      page = pdf.addPage(PageSizes.A4);
      y = height - margin;
    }
    y -= 18;
    paragraph(title, bold, 14, orange);
    y -= 3;
  }

  page.drawRectangle({ x: 0, y: height - 12, width, height: 12, color: orange });
  paragraph("PROFIL PERUSAHAAN", bold, 11, orange);
  paragraph("CITS Indonesia", bold, 32, navy);
  paragraph("PT Cipta Integrasi Teknologi Solusi", bold, 12, navy);
  y -= 13;
  paragraph(summarize(about.story, 700));

  const publicServices = services.filter((service) => service.isActive !== false && service.title.trim()).slice(0, 3);
  if (publicServices.length) {
    section("Layanan utama");
    for (const service of publicServices) {
      paragraph(summarize(service.title, 115), bold, 11, navy);
      paragraph(summarize(service.desc, 150));
      y -= 3;
    }
  }

  const published = studies.filter((study) => study.isActive !== false);
  const featured = featuredIds.flatMap((id) => published.filter((study) => study.id === id));
  const picks = [
    ...featured,
    ...published.filter((study) => !featuredIds.includes(study.id) && study.isFlagship),
  ].slice(0, 3);
  if (picks.length) {
    section("Proyek pilihan");
    for (const study of picks) {
      paragraph(summarize(study.title, 145), bold, 11, navy);
      paragraph(summarize(study.client, 100));
      y -= 3;
    }
  }

  section("Kontak CITS");
  if (contact.email) paragraph(`Email: ${summarize(contact.email, 160)}`);
  if (contact.phone) paragraph(`Telepon: ${summarize(contact.phone, 100)}`);
  if (contact.address) paragraph(summarize(contact.address, 240));
  if (origin) paragraph(`Situs: ${origin}`);

  const pages = pdf.getPages();
  for (const [index, sheet] of pages.entries()) {
    sheet.drawLine({ start: { x: margin, y: 45 }, end: { x: width - margin, y: 45 }, color: orange, thickness: 1 });
    sheet.drawText(`CITS Indonesia  |  ${index + 1}/${pages.length}`, {
      x: margin,
      y: 28,
      size: 9,
      font: regular,
      color: slate,
    });
  }
  return pdf.save();
}
