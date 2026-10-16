import { NextResponse } from "next/server";
import { DbRepo } from "@/lib/db";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const prod = await DbRepo.getProductById(id);
    if (!prod) {
      return NextResponse.json({ success: false, message: "Produk tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: prod });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const updated = await DbRepo.updateProduct(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, message: "Produk tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await DbRepo.deleteProduct(id);
    return NextResponse.json({ success: true, message: "Produk berhasil dihapus." });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
