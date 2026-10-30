import { requireAdmin } from "@/lib/apiAuth";
import { NextResponse } from "next/server";
import { DbRepo } from "@/lib/db";
import { badRequest, readJsonBody } from "@/lib/http";

export async function GET() {
  try {
    const data = await DbRepo.getLandingData();
    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const denied = await requireAdmin(req, "landing");
  if (denied) return denied;
  try {
    const parsed = await readJsonBody(req);
    if (!parsed.ok) return parsed.response;
    const body = parsed.body;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return badRequest("Data landing page tidak valid.");
    }
    if (!body.hero || typeof body.hero !== "object" || !body.cta || typeof body.cta !== "object") {
      return badRequest("Data landing page tidak lengkap: hero dan cta wajib diisi.");
    }
    const updated = await DbRepo.updateLandingData(body);
    return NextResponse.json({
      success: true,
      message: "Pengaturan halaman utama berhasil disimpan.",
      data: updated,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
