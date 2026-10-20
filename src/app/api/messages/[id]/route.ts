import { NextResponse } from "next/server";
import { DbRepo } from "@/lib/db";

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const exists = (await DbRepo.getMessages()).some((m) => m.id === id);
    if (!exists) {
      return NextResponse.json({ success: false, message: "Pesan tidak ditemukan." }, { status: 404 });
    }
    await DbRepo.deleteMessage(id);
    return NextResponse.json({ success: true, message: "Pesan berhasil dihapus." });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
