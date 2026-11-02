import { requireAdmin } from "@/lib/apiAuth";
import { NextResponse } from "next/server";
import { DbRepo } from "@/lib/db";
import { badRequest, readJsonBody } from "@/lib/http";
import { collectionPermissionActions } from "@/lib/internalAccess";

export async function GET() {
  try {
    const list = await DbRepo.getPortfolio();
    return NextResponse.json({ success: true, data: list });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const denied = await requireAdmin(req, "portfolio", "view");
  if (denied) return denied;
  try {
    const parsed = await readJsonBody(req);
    if (!parsed.ok) return parsed.response;
    const body = parsed.body;
    if (!Array.isArray(body)) {
      return badRequest("Data portofolio harus berupa array.");
    }
    if (
      body.some(
        (item) =>
          !item || typeof item !== "object" || (item.showOnHome !== undefined && typeof item.showOnHome !== "boolean")
      )
    )
      return badRequest("Status tampil portofolio di beranda tidak valid.");
    if (
      body.some((item) => typeof item.id !== "string" || !item.id.trim()) ||
      new Set(body.map((item) => item.id)).size !== body.length
    )
      return badRequest("ID portofolio tidak valid atau duplikat.");
    const current = await DbRepo.getPortfolio();
    for (const action of collectionPermissionActions(current, body)) {
      const blocked = await requireAdmin(req, "portfolio", action);
      if (blocked) return blocked;
    }
    const updated = await DbRepo.updatePortfolio(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
