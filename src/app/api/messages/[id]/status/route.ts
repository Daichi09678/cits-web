import { requireAdmin } from "@/lib/apiAuth";
import { NextResponse } from "next/server";
import { DbRepo } from "@/lib/db";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const denied = requireAdmin(req, "contact");
  if (denied) return denied;
  try {
    const { id } = await context.params;

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Format permintaan tidak valid (JSON rusak)." },
        { status: 400 }
      );
    }

    const status = body?.status;
    const dealStage = body?.dealStage;
    const dealNotes = body?.dealNotes;
    if (!status && !dealStage) {
      return NextResponse.json(
        { success: false, message: "Tidak ada perubahan: isi status atau dealStage." },
        { status: 400 }
      );
    }

    // Validate the whole change before writing either field.
    if (status !== undefined && !["unread", "read", "replied"].includes(status)) {
      return NextResponse.json({ success: false, message: "Invalid status" }, { status: 400 });
    }
    if (
      dealStage !== undefined &&
      !["baru", "diskusi", "proses", "kesepakatan", "selesai", "batal"].includes(dealStage)
    ) {
      return NextResponse.json({ success: false, message: "Invalid deal stage" }, { status: 400 });
    }
    if (dealNotes !== undefined && typeof dealNotes !== "string") {
      return NextResponse.json({ success: false, message: "Catatan harus berupa teks." }, { status: 400 });
    }

    const exists = (await DbRepo.getMessages()).some((m) => m.id === id);
    if (!exists) {
      return NextResponse.json({ success: false, message: "Pesan tidak ditemukan." }, { status: 404 });
    }

    if (status) {
      await DbRepo.updateMessageStatus(id, status);
    }

    if (dealStage) {
      await DbRepo.updateMessageStage(id, dealStage, dealNotes);
    }

    return NextResponse.json({
      success: true,
      message: `Status/tahap pesan berhasil diperbarui`,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
