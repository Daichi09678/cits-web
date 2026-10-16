import { NextResponse } from "next/server";
import { siteConfig } from "@/config/siteConfig";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    user: {
      id: "admin-1",
      name: "maswahyuganteng",
      email: siteConfig.admin.defaultEmail,
      role: "Super Admin",
      avatar: "/avatars/admin.webp",
    },
  });
}
