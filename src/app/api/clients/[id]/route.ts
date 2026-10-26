import { requireAdmin } from "@/lib/apiAuth";
import { NextResponse } from "next/server";
import { DbRepo } from "@/lib/db";
import { badRequest, readJsonBody } from "@/lib/http";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const denied = requireAdmin(req, "clients");
  if (denied) return denied;
  try {
    const { id } = await context.params;
    const parsed = await readJsonBody(req);
    if (!parsed.ok) return parsed.response;
    const body = parsed.body;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return badRequest("Data mitra tidak valid.");
    }
    if (body.showOnHome !== undefined && typeof body.showOnHome !== "boolean")
      return badRequest("Status tampil di beranda tidak valid.");
    const updated = await DbRepo.updateClient(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, message: "Mitra tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const denied = requireAdmin(req, "clients");
  if (denied) return denied;
  try {
    const { id } = await context.params;
    await DbRepo.deleteClient(id);
    return NextResponse.json({ success: true, message: "Mitra berhasil dihapus." });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
