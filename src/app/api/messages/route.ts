import { NextResponse } from "next/server";
import { DbRepo } from "@/lib/db";
import { getMessageRetentionDays } from "@/config/inbox";
import { sendContactNotificationEmail } from "@/lib/email";
import { readJsonBody } from "@/lib/http";

export async function GET() {
  try {
    const retentionDays = getMessageRetentionDays();

    // Retensi: buang pesan yang sudah melewati batas umur sebelum inbox dibaca.
    // Dibatasi maksimal 1x per jam per proses agar tidak membebani database.
    try {
      const purged = await DbRepo.purgeExpiredMessagesIfDue();
      if (purged > 0) {
        console.log(`Retensi inbox: ${purged} pesan lebih dari ${retentionDays} hari dihapus otomatis.`);
      }
    } catch (e) {
      console.error("Inbox retention error:", e);
    }

    const list = await DbRepo.getMessages();
    return NextResponse.json({ success: true, retentionDays, data: list });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const parsed = await readJsonBody(req);
    if (!parsed.ok) return parsed.response;
    const body = parsed.body;

    if (
      !body ||
      typeof body !== "object" ||
      !body.name ||
      !body.email ||
      !body.phone ||
      !body.company ||
      !body.message
    ) {
      return NextResponse.json(
        { success: false, message: "Semua kolom bertanda bintang wajib diisi." },
        { status: 400 }
      );
    }

    // 1. Simpan pesan ke Cloud Database / Persistent Repo
    const savedMsg = await DbRepo.addMessage({
      id: body.id,
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
      company: body.company.trim(),
      serviceRequested: body.serviceRequested || "General Inquiry",
      message: body.message.trim(),
    });

    // 2. Kirim notifikasi email resmi secara otomatis
    const contactInfo = await DbRepo.getContactInfo();
    sendContactNotificationEmail({
      name: savedMsg.name,
      email: savedMsg.email,
      phone: savedMsg.phone,
      company: savedMsg.company,
      serviceRequested: savedMsg.serviceRequested,
      message: savedMsg.message,
      recipientEmail: contactInfo.email || "info@citsindonesia.co.id",
    }).catch((err) => console.error("Email notification background error:", err));

    return NextResponse.json(
      {
        success: true,
        message: "Pesan Anda berhasil terkirim. Tim CITS akan segera menghubungi Anda.",
        data: savedMsg,
      },
      { status: 201 }
    );
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const parsed = await readJsonBody(req);
    if (!parsed.ok) return parsed.response;
    const body = parsed.body;
    const ids: string[] = Array.isArray(body?.ids) ? body.ids : body?.id ? [body.id] : [];
    if (!ids || ids.length === 0) {
      return NextResponse.json(
        { success: false, message: "Pilih setidaknya satu pesan untuk dihapus." },
        { status: 400 }
      );
    }
    await DbRepo.deleteMessages(ids);
    return NextResponse.json({
      success: true,
      message: `${ids.length} pesan berhasil dihapus.`,
      deletedCount: ids.length,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
