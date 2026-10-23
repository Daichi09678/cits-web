import { NextResponse } from "next/server";
import { unauthorizedResponse, verifyAdminToken } from "@/lib/apiAuth";

export async function GET(req: Request) {
  const session = verifyAdminToken(req);
  if (!session) return unauthorizedResponse();

  return NextResponse.json({
    success: true,
    user: {
      id: session.sub,
      name: session.name,
      email: session.email,
      role: session.role === "superadmin" ? "Super Admin" : "Admin Internal",
      pageAccess: session.pageAccess,
      isInternal: session.role === "internal",
      avatar: "/avatars/admin.webp",
    },
  });
}
