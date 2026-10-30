import { NextResponse } from "next/server";
import { unauthorizedResponse, resolveAdminSession } from "@/lib/apiAuth";

export async function GET(req: Request) {
  let session;
  try {
    session = await resolveAdminSession(req);
  } catch {
    return NextResponse.json({ success: false, message: "Pemeriksaan sesi tidak tersedia." }, { status: 503 });
  }
  if (!session) return unauthorizedResponse();

  return NextResponse.json({
    success: true,
    user: {
      id: session.sub,
      name: session.name,
      email: session.email,
      role: session.role === "superadmin" ? "Super Admin" : "Admin Internal",
      pageAccess: session.pageAccess,
      permissions: session.permissions,
      isInternal: session.role === "internal",
      avatar: "/avatars/admin.webp",
    },
  });
}
