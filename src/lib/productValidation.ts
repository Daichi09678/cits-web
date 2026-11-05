import type { ProductItem } from "@/types/schema";

export function parseProductPatch(input: unknown): Partial<ProductItem> {
  const fail = (message: string): never => {
    throw new Error(message);
  };
  if (!input || typeof input !== "object" || Array.isArray(input)) return fail("Data produk tidak valid.");
  const raw = input as Record<string, unknown>;
  const result: Partial<ProductItem> = {};
  for (const [field, limit] of [
    ["name", 150],
    ["category", 100],
    ["description", 8000],
    ["details", 12000],
    ["icon", 80],
  ] as const) {
    if (raw[field] === undefined) continue;
    if (
      typeof raw[field] !== "string" ||
      raw[field].length > limit ||
      (["name", "category", "description"].includes(field) && !raw[field].trim())
    )
      return fail(`Isian ${field} produk tidak valid (maksimal ${limit} karakter).`);
    result[field] = raw[field].trim();
  }
  for (const field of ["features", "tags"] as const) {
    if (raw[field] === undefined) continue;
    const values = raw[field];
    if (
      !Array.isArray(values) ||
      values.length > 50 ||
      values.some((value) => typeof value !== "string" || !value.trim() || value.length > 500)
    )
      return fail("Fitur dan tag harus berupa daftar teks, maksimal 50 item.");
    result[field] = [...new Set((values as string[]).map((value) => value.trim()))];
  }
  for (const field of ["isActive", "showOnHome"] as const) {
    if (raw[field] === undefined) continue;
    if (typeof raw[field] !== "boolean") return fail("Status produk tidak valid.");
    result[field] = raw[field];
  }
  if (raw.image !== undefined) {
    if (typeof raw.image !== "string" || raw.image.length > 4.3 * 1024 * 1024)
      return fail("Gambar produk tidak valid atau terlalu besar.");
    result.image = raw.image;
  }
  if (raw.specifications !== undefined) {
    if (!Array.isArray(raw.specifications) || raw.specifications.length > 50)
      return fail("Spesifikasi maksimal 50 baris.");
    result.specifications = raw.specifications.map((row: unknown) => {
      if (!row || typeof row !== "object" || Array.isArray(row)) return fail("Format spesifikasi tidak valid.");
      const entry = row as Record<string, unknown>;
      if (
        typeof entry.name !== "string" ||
        !entry.name.trim() ||
        entry.name.length > 120 ||
        typeof entry.value !== "string" ||
        !entry.value.trim() ||
        entry.value.length > 2000
      )
        return fail("Isi nama dan nilai spesifikasi (maksimal 120 dan 2.000 karakter).");
      return { name: entry.name.trim(), value: entry.value.trim() };
    });
    const names = result.specifications.map((row) => row.name.toLocaleLowerCase("id"));
    if (new Set(names).size !== names.length) return fail("Nama spesifikasi tidak boleh duplikat.");
  }
  return result;
}
