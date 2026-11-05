import { requireAdmin } from "@/lib/apiAuth";
import { NextResponse } from "next/server";
import { DbRepo } from "@/lib/db";
import { badRequest, readJsonBody } from "@/lib/http";
import { parseProductPatch } from "@/lib/productValidation";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const prod = await DbRepo.getProductById(id);
    if (!prod || (!prod.isActive && (await requireAdmin(req, "products", "view")))) {
      return NextResponse.json({ success: false, message: "Produk tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: prod });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(req, "products");
  if (denied) return denied;
  try {
    const { id } = await context.params;
    const parsed = await readJsonBody(req);
    if (!parsed.ok) return parsed.response;
    const body = parsed.body;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return badRequest("Data produk tidak valid.");
    }
    let fields;
    try {
      fields = parseProductPatch(body);
    } catch (error) {
      return badRequest(error instanceof Error ? error.message : "Data produk tidak valid.");
    }
    const updated = await DbRepo.updateProduct(id, fields);
    if (!updated) {
      return NextResponse.json({ success: false, message: "Produk tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(req, "products");
  if (denied) return denied;
  try {
    const { id } = await context.params;
    await DbRepo.deleteProduct(id);
    return NextResponse.json({ success: true, message: "Produk berhasil dihapus." });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
