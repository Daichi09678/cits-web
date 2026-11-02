import { requireAdmin } from "@/lib/apiAuth";
import { NextResponse } from "next/server";
import { DbRepo } from "@/lib/db";
import { badRequest, readJsonBody } from "@/lib/http";
import { parseServiceCatalog } from "@/lib/serviceCatalog";
import { collectionPermissionActions } from "@/lib/internalAccess";

export async function GET() {
  try {
    const list = await DbRepo.getServices();
    return NextResponse.json({ success: true, data: list });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const denied = await requireAdmin(req, "services", "view");
  if (denied) return denied;
  try {
    const parsed = await readJsonBody(req);
    if (!parsed.ok) return parsed.response;
    const catalog = parseServiceCatalog(parsed.body);
    if (!catalog.ok) return badRequest(catalog.message);
    const current = parseServiceCatalog(await DbRepo.getServices());
    if (!current.ok) return badRequest("Katalog layanan tersimpan tidak valid.");
    for (const action of collectionPermissionActions(current.value, catalog.value)) {
      const blocked = await requireAdmin(req, "services", action);
      if (blocked) return blocked;
    }
    // Persist the image and all editable service details in the existing JSONB catalog.
    const updated = await DbRepo.updateServices(catalog.value);
    return NextResponse.json({ success: true, data: updated });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
