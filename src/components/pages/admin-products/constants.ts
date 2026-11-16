export const FEATURE_PRESETS = [
  "Laporan Real-Time",
  "Dashboard Analitik",
  "REST API",
  "Multi-User",
  "Role & Hak Akses",
  "Audit Log",
  "Enkripsi Data",
  "Single Sign-On (SSO)",
  "Notifikasi Email",
  "Tanda Tangan Digital",
  "Impor / Ekspor Excel",
  "Mobile Friendly",
  "Backup Otomatis",
];

export const TAG_PRESETS = [
  "SPBE",
  "GovTech",
  "ISO 27001",
  "SaaS",
  "On-Premise",
  "Cloud",
  "Open Source",
  "Custom Development",
];

export const csvToList = (value: string): string[] =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const listToCsv = (list: string[]): string => list.join(", ");

export const defaultCategories = ["Enterprise", "Government", "Mobile", "Web", "Communication"];
