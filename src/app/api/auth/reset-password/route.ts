import { readJsonBody } from "@/lib/http";
import { NextResponse } from "next/server";
import { consumePasswordResetToken, setAdminCredential } from "@/lib/passwordServer";
import { updateInternalAccountPassword } from "@/lib/internalAccountsServer";
import { validateNewPassword } from "@/lib/password";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const parsedBody = await readJsonBody(request);
    if (!parsedBody.ok) return parsedBody.response;
    const body = parsedBody.body;
    const token = typeof (body as { token?: unknown }).token === "string" ? (body as { token: string }).token : "";
    const newPassword =
      typeof (body as { newPassword?: unknown }).newPassword === "string"
        ? (body as { newPassword: string }).newPassword
        : "";

    if (!token) {
      return NextResponse.json({ success: false, message: "Tautan reset tidak valid." }, { status: 400 });
    }

    const validationError = validateNewPassword(newPassword);
    if (validationError) {
      return NextResponse.json({ success: false, message: validationError }, { status: 400 });
    }

    const reset = await consumePasswordResetToken(token);
    if (!reset) {
      return NextResponse.json(
        { success: false, message: "Tautan reset sudah kedaluwarsa atau sudah pernah digunakan." },
        { status: 400 }
      );
    }

    if (reset.role === "internal") {
      const result = await updateInternalAccountPassword(reset.userId, newPassword);
      if (!result.success) {
        return NextResponse.json(
          { success: false, message: result.message || "Akun internal tidak ditemukan." },
          { status: 400 }
        );
      }
    } else {
      await setAdminCredential("admin-1", newPassword);
    }

    return NextResponse.json({
      success: true,
      message: "Kata sandi berhasil diperbarui. Silakan masuk dengan kata sandi baru.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { success: false, message: "Kata sandi gagal diperbarui. Coba minta tautan baru." },
      { status: 500 }
    );
  }
}
