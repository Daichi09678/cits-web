import { NextResponse } from "next/server";
import { siteConfig } from "@/config/siteConfig";
import { authenticateInternalAccount } from "@/lib/internalAccountsServer";
import { issueAdminToken } from "@/lib/apiAuth";
import { getAdminProfile } from "@/lib/profileServer";
import { DEFAULT_AVATAR } from "@/lib/profile";
import { matchesBootstrapAdminPassword, verifyAdminCredential } from "@/lib/passwordServer";
import { badRequest, missingStringFields, readJsonBody } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const parsed = await readJsonBody(req);
    if (!parsed.ok) return parsed.response;
    const body = parsed.body;
    if (missingStringFields(body, ["email", "password"]).length > 0) {
      return badRequest("Email dan kata sandi wajib diisi.");
    }
    const email = body.email.trim().toLowerCase();
    const password = body.password;

    // 1. Akun staf internal (disimpan di database) dicek lebih dulu.
    let internalAuth: Awaited<ReturnType<typeof authenticateInternalAccount>> | null = null;
    try {
      internalAuth = await authenticateInternalAccount(email, password);
    } catch (error) {
      console.error("Internal account auth error:", error);
    }

    if (internalAuth?.status === "ok") {
      const profile = await getAdminProfile(internalAuth.account.id, {
        displayName: internalAuth.account.name,
        avatarUrl: DEFAULT_AVATAR,
      });
      const displayName = profile.displayName || internalAuth.account.name;

      return NextResponse.json({
        success: true,
        token: issueAdminToken({
          sub: internalAuth.account.id,
          email: internalAuth.account.email,
          name: displayName,
          role: "internal",
          pageAccess: internalAuth.account.pageAccess,
          permissions: internalAuth.account.permissions,
        }),
        user: {
          id: internalAuth.account.id,
          name: displayName,
          email: internalAuth.account.email,
          role: "Admin Internal",
          avatar: profile.avatarUrl,
          jobTitle: profile.jobTitle || "Admin Internal",
          pageAccess: internalAuth.account.pageAccess,
          permissions: internalAuth.account.permissions,
          isInternal: true,
        },
      });
    }

    if (internalAuth?.status === "inactive") {
      return NextResponse.json(
        { success: false, message: "Akun internal ini sedang dinonaktifkan. Hubungi Superadmin." },
        { status: 403 }
      );
    }

    if (internalAuth?.status === "invalid-password") {
      return NextResponse.json({ success: false, message: "Kata sandi akun internal salah." }, { status: 401 });
    }

    // 2. Akun Superadmin bawaan.
    const isOfficialEmail =
      email === siteConfig.admin.defaultUsername ||
      email === siteConfig.admin.defaultEmail ||
      email === "admin@cits.id";

    if (!isOfficialEmail) {
      return NextResponse.json(
        { success: false, message: "Email atau username tidak terdaftar sebagai administrator resmi CITS." },
        { status: 401 }
      );
    }

    const storedCredential = await verifyAdminCredential("admin-1", password);
    const defaultPasswordOk = storedCredential === null && matchesBootstrapAdminPassword(password);

    if (storedCredential !== true && !defaultPasswordOk) {
      return NextResponse.json(
        { success: false, message: "Kata sandi salah. Silakan periksa kembali kredensial Anda." },
        { status: 401 }
      );
    }

    const profile = await getAdminProfile("admin-1", {
      displayName: siteConfig.admin.defaultUsername,
      avatarUrl: DEFAULT_AVATAR,
    });
    const displayName = profile.displayName || siteConfig.admin.defaultUsername;

    const token = issueAdminToken({
      sub: "admin-1",
      email: siteConfig.admin.defaultEmail,
      name: displayName,
      role: "superadmin",
    });
    const user = {
      id: "admin-1",
      name: displayName,
      email: siteConfig.admin.defaultEmail,
      role: "Super Admin",
      avatar: profile.avatarUrl,
      jobTitle: profile.jobTitle || "Superadmin",
    };

    return NextResponse.json({
      success: true,
      token,
      user,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
