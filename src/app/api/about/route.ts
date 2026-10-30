import { requireAdmin } from "@/lib/apiAuth";
import { NextResponse } from "next/server";
import { DbRepo } from "@/lib/db";
import { readJsonBody } from "@/lib/http";

export async function GET() {
  try {
    const data = await DbRepo.getAboutData();
    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const denied = await requireAdmin(req, "about");
  if (denied) return denied;
  try {
    const parsed = await readJsonBody(req);
    if (!parsed.ok) return parsed.response;
    const body = parsed.body;

    // Tolak payload tidak lengkap: mencegah "sukses palsu" saat insert gagal
    // (kolom title/subtitle/story/vision bersifat NOT NULL di database).
    const required = ["title", "subtitle", "story", "vision"];
    const missing = required.filter((key) => typeof body?.[key] !== "string" || !body[key].trim());
    if (!body || typeof body !== "object" || missing.length > 0) {
      return NextResponse.json(
        { success: false, message: `Data profil tidak lengkap: ${missing.join(", ") || "body kosong"}.` },
        { status: 400 }
      );
    }
    if (body.mission !== undefined && !Array.isArray(body.mission)) {
      return NextResponse.json({ success: false, message: "Field mission harus berupa array." }, { status: 400 });
    }

    const updated = await DbRepo.updateAboutData(body);
    return NextResponse.json({
      success: true,
      message: "Profil perusahaan berhasil diperbarui.",
      data: updated,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
