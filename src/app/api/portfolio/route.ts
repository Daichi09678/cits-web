import { NextResponse } from "next/server";
import { DbRepo } from "@/lib/db";

export async function GET() {
  try {
    const list = await DbRepo.getPortfolio();
    return NextResponse.json({ success: true, data: list });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const updated = await DbRepo.updatePortfolio(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
