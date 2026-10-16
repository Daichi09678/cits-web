import { NextResponse } from "next/server";
import { DbRepo } from "@/lib/db";

export async function GET() {
  try {
    const data = await DbRepo.getLandingData();
    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const updated = await DbRepo.updateLandingData(body);
    return NextResponse.json({
      success: true,
      message: "Pengaturan halaman utama berhasil disimpan.",
      data: updated,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
