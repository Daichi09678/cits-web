import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";
import { DbRepo } from "@/lib/db";
import { badRequest, readJsonBody } from "@/lib/http";
import { isPublicContentPage, parsePublicPageContent, resolvePublicPageContent } from "@/lib/publicPageContent";

type Context = { params: Promise<{ page: string }> };
export async function GET(_request: Request, context: Context) {
  const { page } = await context.params;
  if (!isPublicContentPage(page)) return badRequest("Halaman tidak ditemukan.");
  try {
    return NextResponse.json({
      success: true,
      data: resolvePublicPageContent(page, await DbRepo.getPublicPageContent(page)),
    });
  } catch {
    return NextResponse.json({ success: false, message: "Konten halaman belum dapat dimuat." }, { status: 500 });
  }
}
export async function PUT(request: Request, context: Context) {
  const authDenied = requireAdmin(request);
  if (authDenied) return authDenied;
  const { page } = await context.params;
  if (!isPublicContentPage(page)) return badRequest("Halaman tidak ditemukan.");
  const denied = requireAdmin(request, page);
  if (denied) return denied;
  const parsed = await readJsonBody<unknown>(request);
  if (!parsed.ok) return parsed.response;
  let data;
  try {
    data = parsePublicPageContent(page, parsed.body);
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Konten tidak valid.");
  }
  try {
    return NextResponse.json({ success: true, data: await DbRepo.updatePublicPageContent(page, data) });
  } catch {
    return NextResponse.json(
      { success: false, message: "Konten halaman gagal disimpan. Silakan coba kembali." },
      { status: 500 }
    );
  }
}
