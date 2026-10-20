import { NextResponse } from "next/server";

type ParsedBody<T> = { ok: true; body: T } | { ok: false; response: NextResponse };

/**
 * Membaca body JSON secara aman.
 *
 * Body yang rusak/kosong harus dijawab 400 (bukan 500), karena itu kesalahan
 * pemanggil — bukan kesalahan server.
 */
export async function readJsonBody<T = any>(req: Request): Promise<ParsedBody<T>> {
  try {
    return { ok: true, body: (await req.json()) as T };
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, message: "Format permintaan tidak valid (JSON rusak)." },
        { status: 400 }
      ),
    };
  }
}

/** Respons 400 standar. */
export function badRequest(message: string) {
  return NextResponse.json({ success: false, message }, { status: 400 });
}

/** Respons 404 standar. */
export function notFound(message = "Data tidak ditemukan.") {
  return NextResponse.json({ success: false, message }, { status: 404 });
}

/** Validasi daftar field string wajib; mengembalikan nama field yang kosong. */
export function missingStringFields(body: any, fields: string[]): string[] {
  if (!body || typeof body !== "object" || Array.isArray(body)) return fields;
  return fields.filter((key) => typeof body[key] !== "string" || !body[key].trim());
}
