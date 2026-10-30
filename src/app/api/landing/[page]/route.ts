import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";
import { DbRepo } from "@/lib/db";
import { badRequest, readJsonBody } from "@/lib/http";
import { isHomeEditorPage, parseHomeSectionPatch } from "@/lib/homeSections";

export async function PATCH(request: Request, context: { params: Promise<{ page: string }> }) {
  const authDenied = await requireAdmin(request);
  if (authDenied) return authDenied;
  const { page } = await context.params;
  if (!isHomeEditorPage(page)) return badRequest("Bagian beranda tidak ditemukan.");
  const denied = await requireAdmin(request, page);
  if (denied) return denied;
  const parsed = await readJsonBody<unknown>(request);
  if (!parsed.ok) return parsed.response;
  let patch;
  try {
    patch = parseHomeSectionPatch(page, parsed.body);
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Isi beranda tidak valid.");
  }
  try {
    const data = await DbRepo.patchLandingData(patch);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Isi beranda gagal disimpan." },
      { status: 500 }
    );
  }
}
