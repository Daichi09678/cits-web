import { readJsonBody } from "@/lib/http";
import { NextResponse } from "next/server";
import { isEmailConfigured } from "@/lib/email";
import { getRequestOrigin, normalizeResetEmail, requestPasswordResetForEmail } from "@/lib/passwordReset";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const attempts = new Map<string, number[]>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function isRateLimited(email: string): boolean {
  const now = Date.now();
  const recent = (attempts.get(email) || []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  attempts.set(email, recent);
  return recent.length > MAX_ATTEMPTS;
}

export async function POST(request: Request) {
  try {
    if (!isEmailConfigured()) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Layanan email belum dikonfigurasi. Hubungi Superadmin untuk mengisi SMTP_HOST, SMTP_USER, dan SMTP_PASS.",
        },
        { status: 503 }
      );
    }

    const parsedBody = await readJsonBody(request);
    if (!parsedBody.ok) return parsedBody.response;
    const body = parsedBody.body;
    const email = normalizeResetEmail((body as { email?: unknown }).email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: "Format email tidak valid." }, { status: 400 });
    }

    if (isRateLimited(email)) {
      return NextResponse.json(
        { success: false, message: "Terlalu banyak permintaan. Coba lagi dalam beberapa menit." },
        { status: 429 }
      );
    }

    await requestPasswordResetForEmail(email, getRequestOrigin(request));

    // Selalu respons sama agar tidak membocorkan apakah email terdaftar.
    return NextResponse.json({
      success: true,
      message: "Jika email tersebut terdaftar, tautan reset kata sandi sudah dikirim. Periksa inbox dan folder spam.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, message: "Permintaan reset kata sandi gagal diproses. Coba lagi." },
      { status: 500 }
    );
  }
}
