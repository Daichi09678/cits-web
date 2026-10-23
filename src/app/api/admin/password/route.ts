import { readJsonBody } from "@/lib/http";
import { NextResponse } from "next/server";
import { errorResponse, unauthorizedResponse, verifyAdminToken } from "@/lib/apiAuth";
import { siteConfig } from "@/config/siteConfig";
import { authenticateInternalAccount, updateInternalAccountPassword } from "@/lib/internalAccountsServer";
import { setAdminCredential, verifyAdminCredential } from "@/lib/passwordServer";
import { validateNewPassword } from "@/lib/password";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isDefaultSuperadminPassword(password: string): boolean {
  return password === siteConfig.admin.defaultPassword || password === "admin" || password === "admin123";
}

export async function PUT(request: Request) {
  const session = verifyAdminToken(request);
  if (!session) return unauthorizedResponse();

  try {
    const parsedBody = await readJsonBody(request);
    if (!parsedBody.ok) return parsedBody.response;
    const body = parsedBody.body;
    const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
    const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

    if (!currentPassword) {
      return NextResponse.json({ success: false, message: "Kata sandi saat ini wajib diisi." }, { status: 400 });
    }

    const validationError = validateNewPassword(newPassword);
    if (validationError) {
      return NextResponse.json({ success: false, message: validationError }, { status: 400 });
    }

    if (newPassword === currentPassword) {
      return NextResponse.json(
        { success: false, message: "Kata sandi baru harus berbeda dari kata sandi saat ini." },
        { status: 400 }
      );
    }

    if (session.role === "internal") {
      const auth = await authenticateInternalAccount(session.email, currentPassword);
      if (auth.status !== "ok") {
        return NextResponse.json({ success: false, message: "Kata sandi saat ini salah." }, { status: 400 });
      }

      const result = await updateInternalAccountPassword(session.sub, newPassword);
      if (!result.success) {
        return NextResponse.json(
          { success: false, message: result.message || "Gagal menyimpan kata sandi." },
          { status: 400 }
        );
      }

      return NextResponse.json({ success: true, message: "Kata sandi berhasil diperbarui." });
    }

    const credential = await verifyAdminCredential("admin-1", currentPassword);
    const defaultPasswordOk = credential === null && isDefaultSuperadminPassword(currentPassword);
    if (credential !== true && !defaultPasswordOk) {
      return NextResponse.json({ success: false, message: "Kata sandi saat ini salah." }, { status: 400 });
    }

    await setAdminCredential("admin-1", newPassword);
    return NextResponse.json({ success: true, message: "Kata sandi Superadmin berhasil diperbarui." });
  } catch (error) {
    return errorResponse(error, "Gagal memperbarui kata sandi.");
  }
}
