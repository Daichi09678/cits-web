import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";
import { TeamRepo } from "@/lib/teamServer";

export async function POST(req: Request) {
  const denied = await requireAdmin(req, "team", "create");
  if (denied) return denied;
  try {
    const members = await TeamRepo.seedExamples();
    if (!members)
      return NextResponse.json(
        { success: false, message: "Data contoh hanya dapat diisi saat daftar tim kosong." },
        { status: 409 }
      );
    return NextResponse.json({ success: true, data: members }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Data contoh belum tersimpan. Silakan coba lagi." },
      { status: 503 }
    );
  }
}
