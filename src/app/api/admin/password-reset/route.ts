import { NextResponse } from "next/server";
import { errorResponse, requireSuperadmin } from "@/lib/apiAuth";
import { isEmailConfigured } from "@/lib/email";
import { getRequestOrigin, normalizeResetEmail, requestPasswordResetForEmail } from "@/lib/passwordReset";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const denied = requireSuperadmin(request);
  if (denied) return denied;

  try {
    if (!isEmailConfigured()) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Layanan email belum dikonfigurasi. Isi SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, dan NOTIFICATION_EMAIL di environment server.",
        },
        { status: 503 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const email = normalizeResetEmail((body as { email?: unknown }).email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: "Format email tidak valid." }, { status: 400 });
    }

    const result = await requestPasswordResetForEmail(email, getRequestOrigin(request));

    if (!result.found) {
      return NextResponse.json(
        { success: false, message: "Email tersebut tidak terdaftar sebagai akun internal atau Superadmin." },
        { status: 404 }
      );
    }

    if (!result.sent) {
      return NextResponse.json(
        {
          success: false,
          message: `Link reset dibuat, tetapi email gagal dikirim${result.reason ? `: ${result.reason}` : "."}`,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Tautan reset kata sandi berhasil dikirim ke ${email}.`,
    });
  } catch (error) {
    return errorResponse(error, "Gagal mengirim tautan reset kata sandi.");
  }
}
