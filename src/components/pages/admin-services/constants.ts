export const SERVICE_FEATURE_PRESETS = [
  "Analisis & Desain Sistem",
  "Pengembangan Aplikasi Web",
  "Aplikasi Mobile",
  "Integrasi API / Interoperabilitas",
  "Migrasi Data",
  "Pelatihan Pengguna",
  "Pendampingan Go-Live",
  "Pemeliharaan & Dukungan",
  "Audit Keamanan",
  "Dokumentasi Teknis",
];

export const SERVICE_TAG_PRESETS = [
  "Custom Development",
  "Integrasi Sistem",
  "GovTech",
  "SPBE",
  "Cloud",
  "On-Premise",
  "Konsultasi",
  "Managed Service",
];

export const newlineToList = (value: string): string[] =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

export const listToNewline = (list: string[]): string => list.join("\n");

export const csvToList = (value: string): string[] =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const listToCsv = (list: string[]): string => list.join(", ");

export const defaultServiceCategories = ["Software House", "IT Consultant", "IT Supplier", "Layanan CITS"];
