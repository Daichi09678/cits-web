import { requireAdmin } from "@/lib/apiAuth";
import { NextResponse } from "next/server";
import { DbRepo } from "@/lib/db";
import { badRequest, missingStringFields, readJsonBody } from "@/lib/http";

export async function GET() {
  try {
    const info = await DbRepo.getContactInfo();
    return NextResponse.json({ success: true, data: info });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const denied = await requireAdmin(req, "contact");
  if (denied) return denied;
  try {
    const parsed = await readJsonBody(req);
    if (!parsed.ok) return parsed.response;
    const body = parsed.body;
    const missing = missingStringFields(body, ["address", "phone", "email"]);
    if (missing.length > 0) {
      return badRequest(`Data kontak tidak lengkap: ${missing.join(", ")}.`);
    }
    const updated = await DbRepo.updateContactInfo(body);
    return NextResponse.json({
      success: true,
      message: "Informasi kontak kantor berhasil diperbarui.",
      data: updated,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
