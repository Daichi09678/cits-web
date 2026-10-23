import { requireAdmin } from "@/lib/apiAuth";
import { NextResponse } from "next/server";
import { DbRepo } from "@/lib/db";

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const denied = requireAdmin(req, "contact");
  if (denied) return denied;
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
