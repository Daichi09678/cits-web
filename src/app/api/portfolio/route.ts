import { requireAdmin } from "@/lib/apiAuth";
import { NextResponse } from "next/server";
import { DbRepo } from "@/lib/db";
import { badRequest, readJsonBody } from "@/lib/http";

export async function GET() {
  try {
    const list = await DbRepo.getPortfolio();
    return NextResponse.json({ success: true, data: list });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const denied = requireAdmin(req, "portfolio");
  if (denied) return denied;
  try {
    const parsed = await readJsonBody(req);
    if (!parsed.ok) return parsed.response;
    const body = parsed.body;
    if (!Array.isArray(body) || body.length === 0) {
      return badRequest("Data portofolio harus berupa array dan tidak boleh kosong.");
    }
    if (
      body.some(
        (item) =>
          !item || typeof item !== "object" || (item.showOnHome !== undefined && typeof item.showOnHome !== "boolean")
      )
    )
      return badRequest("Status tampil portofolio di beranda tidak valid.");
    const updated = await DbRepo.updatePortfolio(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
