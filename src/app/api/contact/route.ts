import { NextResponse } from "next/server";
import { DbRepo } from "@/lib/db";

export async function GET() {
  try {
    const info = await DbRepo.getContactInfo();
    return NextResponse.json({ success: true, data: info });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const updated = await DbRepo.updateContactInfo(body);
    return NextResponse.json({
      success: true,
      message: "Informasi kontak kantor berhasil diperbarui.",
      data: updated,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
