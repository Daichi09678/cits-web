import { NextResponse } from "next/server";
import { DbRepo } from "@/lib/db";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const updated = await DbRepo.updateClient(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, message: "Mitra tidak ditemukan." }, { status: 404 });
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
    await DbRepo.deleteClient(id);
    return NextResponse.json({ success: true, message: "Mitra berhasil dihapus." });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
