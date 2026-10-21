import { NextResponse } from "next/server";
import { errorResponse, requireSuperadmin } from "@/lib/apiAuth";
import { migrateLegacyAccounts } from "@/lib/internalAccountsServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const denied = requireSuperadmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const result = await migrateLegacyAccounts(body.accounts);
    return NextResponse.json({ success: true, migrated: result.migrated });
  } catch (error) {
    return errorResponse(error, "Gagal memigrasikan akun lama.");
  }
}
