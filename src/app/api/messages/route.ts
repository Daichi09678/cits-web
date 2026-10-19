import { NextResponse } from "next/server";
import { DbRepo } from "@/lib/db";
import { sendContactNotificationEmail } from "@/lib/email";

export async function GET() {
  try {
    const list = await DbRepo.getMessages();
    return NextResponse.json({ success: true, data: list });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name || !body.email || !body.phone || !body.company || !body.message) {
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
