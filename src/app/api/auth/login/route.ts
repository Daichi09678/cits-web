import { NextResponse } from "next/server";
import { siteConfig } from "@/config/siteConfig";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body.email || "").trim().toLowerCase();
    const password = (body.password || "").trim();

    const isOfficialEmail =
      email === "maswahyuganteng@cits.id" ||
      email === "maswahyuganteng" ||
      email === siteConfig.admin.defaultEmail.toLowerCase() ||
      email === "admin@cits.id";

    const isOfficialPass =
      password === siteConfig.admin.defaultPassword || password === "admin" || password === "admin123";

    if (!isOfficialEmail) {
      return NextResponse.json(
        { success: false, message: "Email atau username tidak terdaftar sebagai administrator resmi CITS." },
        { status: 401 }
      );
    }

    if (!isOfficialPass) {
      return NextResponse.json(
        { success: false, message: "Kata sandi salah. Silakan periksa kembali kredensial Anda." },
        { status: 401 }
      );
    }

    const token = `cits_admin_jwt_${Date.now()}`;
    const user = {
      id: "admin-1",
      name: "maswahyuganteng",
      email: siteConfig.admin.defaultEmail,
      role: "Super Admin",
      avatar: "/avatars/admin.webp",
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
