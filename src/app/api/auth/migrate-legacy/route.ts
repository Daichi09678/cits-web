import { NextResponse } from "next/server";
import { migrateLegacyAccounts } from "@/lib/internalAccountsServer";
import { requireSuperadmin } from "@/lib/apiAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Migrasi sekali jalan untuk akun yang dulu tersimpan di localStorage.
 * Hanya Superadmin yang sudah login boleh memicu migrasi ini.
 */
export async function POST(request: Request) {
  const denied = requireSuperadmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const result = await migrateLegacyAccounts(body.accounts);
    return NextResponse.json({ success: true, migrated: result.migrated });
  } catch {
    return NextResponse.json({ success: true, migrated: 0 });
  }
}
