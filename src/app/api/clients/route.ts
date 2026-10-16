import { NextResponse } from "next/server";
import { DbRepo } from "@/lib/db";
import { ClientPartner } from "@/database/schema";

export async function GET() {
  try {
    const list = await DbRepo.getClients();
    return NextResponse.json({ success: true, data: list });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newClient: ClientPartner = {
      ...body,
      id: body.id || "client-" + Date.now(),
      isActive: body.isActive !== false,
    };
    const saved = await DbRepo.createClient(newClient);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
