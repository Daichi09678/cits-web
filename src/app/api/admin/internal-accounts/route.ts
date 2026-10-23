import { readJsonBody } from "@/lib/http";
import { NextResponse } from "next/server";
import { siteConfig } from "@/config/siteConfig";
import { errorResponse, requireSuperadmin } from "@/lib/apiAuth";
import { bulkSetPageAccess, createInternalAccount, listInternalAccounts } from "@/lib/internalAccountsServer";
import { getAdminProfile } from "@/lib/profileServer";
import type { PageKey } from "@/lib/internalAccess";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function superadminInfo() {
  const profile = await getAdminProfile("admin-1", { displayName: "maswahyuganteng" });
  return {
    id: "admin-1",
    name: profile.displayName || "maswahyuganteng",
    email: siteConfig.admin.defaultEmail,
    role: "Super Admin",
  };
}

export async function GET(request: Request) {
  const denied = requireSuperadmin(request);
  if (denied) return denied;

  try {
    const accounts = await listInternalAccounts();
    return NextResponse.json({ success: true, data: accounts, superadmin: await superadminInfo() });
  } catch (error) {
    return errorResponse(error, "Gagal memuat akun internal.");
  }
}

export async function POST(request: Request) {
  const denied = requireSuperadmin(request);
  if (denied) return denied;

  try {
    const parsedBody = await readJsonBody(request);
    if (!parsedBody.ok) return parsedBody.response;
    const body = parsedBody.body;
    const result = await createInternalAccount({
      name: typeof body.name === "string" ? body.name : "",
      email: typeof body.email === "string" ? body.email : "",
      password: typeof body.password === "string" ? body.password : undefined,
      pageAccess: Array.isArray(body.pageAccess) ? (body.pageAccess as PageKey[]) : [],
      isActive: body.isActive !== false,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result.account }, { status: 201 });
  } catch (error) {
    return errorResponse(error, "Gagal membuat akun internal.");
  }
}

export async function PATCH(request: Request) {
  const denied = requireSuperadmin(request);
  if (denied) return denied;

  try {
    const parsedBody = await readJsonBody(request);
    if (!parsedBody.ok) return parsedBody.response;
    const body = parsedBody.body;
    const updates = Array.isArray(body.updates)
      ? body.updates
          .filter((item: unknown): item is { id: string; pageAccess: PageKey[] } => {
            if (!item || typeof item !== "object") return false;
            const update = item as { id?: unknown; pageAccess?: unknown };
            return typeof update.id === "string" && Array.isArray(update.pageAccess);
          })
          .map((item: { id: string; pageAccess: PageKey[] }) => ({
            id: item.id,
            pageAccess: item.pageAccess,
          }))
      : [];

    const accounts = await bulkSetPageAccess(updates);
    return NextResponse.json({ success: true, data: accounts });
  } catch (error) {
    return errorResponse(error, "Gagal menyimpan matriks hak akses.");
  }
}
