import { NextResponse } from "next/server";
import { DbRepo } from "@/lib/db";
import { getMessageRetentionDays } from "@/config/inbox";
import { requireAdmin } from "@/lib/apiAuth";

export const dynamic = "force-dynamic";

/**
 * Endpoint pembersihan manual / untuk cron eksternal.
 *
 * Pemanggil wajib memakai CRON_SECRET atau sesi admin dengan izin kontak.
 */
async function runPurge(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    const denied = requireAdmin(req, "contact");
    if (denied) return denied;
  }

  const retentionDays = getMessageRetentionDays();
  try {
    const deleted = await DbRepo.purgeExpiredMessages(retentionDays);
    return NextResponse.json({
      success: true,
      retentionDays,
      deleted,
      message:
        deleted > 0
          ? `${deleted} pesan lebih dari ${retentionDays} hari dihapus.`
          : `Tidak ada pesan lebih dari ${retentionDays} hari.`,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

// Vercel Cron memanggil endpoint dengan method GET.
export async function GET(req: Request) {
  return runPurge(req);
}

export async function POST(req: Request) {
  return runPurge(req);
}
