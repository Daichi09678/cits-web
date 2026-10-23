import { readJsonBody } from "@/lib/http";
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
    const parsedBody = await readJsonBody(request);
    if (!parsedBody.ok) return parsedBody.response;
    const body = parsedBody.body;
    const result = await migrateLegacyAccounts(body.accounts);
    return NextResponse.json({ success: true, migrated: result.migrated });
  } catch (error) {
    console.error("Legacy account migration failed:", error);
    return NextResponse.json(
      { success: false, message: "Migrasi akun gagal. Data lama tetap disimpan." },
      { status: 500 }
    );
  }
}
