import { requireAdmin } from "@/lib/apiAuth";
import { NextResponse } from "next/server";
import { DbRepo } from "@/lib/db";
import { badRequest, missingStringFields, readJsonBody } from "@/lib/http";
import { collectionPermissionActions, type PermissionAction } from "@/lib/internalAccess";
import type { ContactFaqItem, ContactInfo } from "@/types/schema";

function validFaqs(value: unknown): value is ContactFaqItem[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        item &&
        typeof item.id === "string" &&
        item.id.trim() &&
        typeof item.question === "string" &&
        typeof item.answer === "string" &&
        typeof item.isActive === "boolean"
    ) &&
    new Set(value.map((item) => item.id)).size === value.length
  );
}

function faqSnapshot(faqs: ContactFaqItem[]) {
  return JSON.stringify(faqs.map(({ id, question, answer, isActive }) => [id, question, answer, isActive]));
}

function contactActions(current: ContactInfo, next: ContactInfo): Set<PermissionAction> {
  const actions = new Set<PermissionAction>();
  const oldFaqs = current.faqs ?? [];
  const newFaqs = next.faqs ?? oldFaqs;
  if (faqSnapshot(oldFaqs) !== faqSnapshot(newFaqs)) {
    for (const action of collectionPermissionActions(oldFaqs, newFaqs)) actions.add(action);
  }
  const oldServices = new Set(current.customServices ?? []);
  const newServices = new Set(next.customServices ?? oldServices);
  if ([...newServices].some((item) => !oldServices.has(item))) actions.add("create");
  if ([...oldServices].some((item) => !newServices.has(item))) actions.add("delete");
  const announcement = (item: ContactInfo["announcement"]) => [
    item?.isActive ?? false,
    item?.text ?? "",
    item?.linkText ?? "",
    item?.linkUrl ?? "",
    item?.type ?? "info",
  ];
  const info = (item: ContactInfo) => [
    item.address,
    item.phone,
    item.email,
    item.workingHours,
    item.mapsUrl || "",
    item.emergencyPhone || "",
    ...announcement(item.announcement),
  ];
  if (!actions.size || JSON.stringify(info(current)) !== JSON.stringify(info(next))) actions.add("edit");
  return actions;
}

export async function GET() {
  try {
    const info = await DbRepo.getContactInfo();
    return NextResponse.json({ success: true, data: info });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const denied = await requireAdmin(req, "contact", "view");
  if (denied) return denied;
  try {
    const parsed = await readJsonBody(req);
    if (!parsed.ok) return parsed.response;
    const body = parsed.body;
    const missing = missingStringFields(body, ["address", "phone", "email"]);
    if (missing.length > 0) {
      return badRequest(`Data kontak tidak lengkap: ${missing.join(", ")}.`);
    }
    if (typeof body.workingHours !== "string") return badRequest("Jam operasional tidak valid.");
    if (
      (body.faqs !== undefined && !validFaqs(body.faqs)) ||
      (body.customServices !== undefined &&
        (!Array.isArray(body.customServices) || body.customServices.some((item: unknown) => typeof item !== "string")))
    )
      return badRequest("FAQ atau daftar pilihan layanan tidak valid.");
    const current = await DbRepo.getContactInfo();
    const next = { ...current, ...body } as ContactInfo;
    for (const action of contactActions(current, next)) {
      const blocked = await requireAdmin(req, "contact", action);
      if (blocked) return blocked;
    }
    const updated = await DbRepo.updateContactInfo(next);
    return NextResponse.json({
      success: true,
      message: "Informasi kontak kantor berhasil diperbarui.",
      data: updated,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
