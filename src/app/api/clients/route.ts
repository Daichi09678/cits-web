import { requireAdmin } from "@/lib/apiAuth";
import { NextResponse } from "next/server";
import { DbRepo } from "@/lib/db";
import { ClientPartner } from "@/types/schema";
import { badRequest, missingStringFields, readJsonBody } from "@/lib/http";

export async function GET() {
  try {
    const list = await DbRepo.getClients();
    return NextResponse.json({ success: true, data: list });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const denied = requireAdmin(req, "clients");
  if (denied) return denied;
  try {
    const parsed = await readJsonBody(req);
    if (!parsed.ok) return parsed.response;
    const body = parsed.body;
    const missing = missingStringFields(body, ["name", "category"]);
    if (missing.length > 0) {
      return badRequest(`Data mitra tidak lengkap: ${missing.join(", ")}.`);
    }
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
