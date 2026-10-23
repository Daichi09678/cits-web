import { readJsonBody } from "@/lib/http";
import { NextResponse } from "next/server";
import { errorResponse, requireSuperadmin } from "@/lib/apiAuth";
import { migrateLegacyAccounts } from "@/lib/internalAccountsServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const denied = requireSuperadmin(request);
  if (denied) return denied;

  try {
    const parsedBody = await readJsonBody(request);
    if (!parsedBody.ok) return parsedBody.response;
    const body = parsedBody.body;
    const result = await migrateLegacyAccounts(body.accounts);
    return NextResponse.json({ success: true, migrated: result.migrated });
  } catch (error) {
    return errorResponse(error, "Gagal memigrasikan akun lama.");
  }
}
