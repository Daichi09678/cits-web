import { NextResponse } from "next/server";
import { DbRepo } from "@/lib/db";
import { getMessageRetentionDays } from "@/config/inbox";

export const dynamic = "force-dynamic";

/**
 * Endpoint pembersihan manual / untuk cron eksternal.
 *
 * Default (tanpa CRON_SECRET): boleh dipanggil siapa saja, karena hanya
 * menghapus pesan yang memang sudah melewati batas retensi.
 * Jika CRON_SECRET di-set, pemanggil wajib mengirim
 *   Authorization: Bearer <CRON_SECRET>
 */
async function runPurge(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization") || "";
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
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
