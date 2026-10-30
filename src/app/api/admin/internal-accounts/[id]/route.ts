import { readJsonBody } from "@/lib/http";
import { NextResponse } from "next/server";
import { errorResponse, requireSuperadmin } from "@/lib/apiAuth";
import { deleteInternalAccount, updateInternalAccount } from "@/lib/internalAccountsServer";
import { normalizePermissions, type PageKey } from "@/lib/internalAccess";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
  const denied = requireSuperadmin(request);
  if (denied) return denied;

  try {
    const { id } = await context.params;
    const parsedBody = await readJsonBody(request);
    if (!parsedBody.ok) return parsedBody.response;
    const body = parsedBody.body;
    const result = await updateInternalAccount(id, {
      name: typeof body.name === "string" ? body.name : "",
      email: typeof body.email === "string" ? body.email : "",
      password: typeof body.password === "string" ? body.password : undefined,
      pageAccess: Array.isArray(body.pageAccess) ? (body.pageAccess as PageKey[]) : [],
      permissions: normalizePermissions(
        body.permissions,
        Array.isArray(body.pageAccess) ? (body.pageAccess as PageKey[]) : []
      ),
      isActive: body.isActive !== false,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result.account });
  } catch (error) {
    return errorResponse(error, "Gagal memperbarui akun internal.");
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const denied = requireSuperadmin(request);
  if (denied) return denied;

  try {
    const { id } = await context.params;
    const result = await deleteInternalAccount(id);
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error, "Gagal menghapus akun internal.");
  }
}
