import { readJsonBody } from "@/lib/http";
import { NextResponse } from "next/server";
import { errorResponse, requireAdmin, unauthorizedResponse, verifyAdminToken } from "@/lib/apiAuth";
import { DEFAULT_AVATAR, normalizeProfileInput, type AdminProfile } from "@/lib/profile";
import { getAdminProfile, saveAdminProfile, type StoredAdminProfile } from "@/lib/profileServer";
import { setInternalAccountName } from "@/lib/internalAccountsServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function roleLabel(role: "superadmin" | "internal"): string {
  return role === "superadmin" ? "Super Admin" : "Admin Internal";
}

function toProfileResponse(
  profile: StoredAdminProfile,
  session: { email: string; role: "superadmin" | "internal" }
): AdminProfile {
  return {
    userId: profile.userId,
    displayName: profile.displayName,
    email: session.email,
    role: roleLabel(session.role),
    jobTitle: profile.jobTitle,
    phone: profile.phone,
    birthDate: profile.birthDate,
    location: profile.location,
    bio: profile.bio,
    website: profile.website,
    avatarUrl: profile.avatarUrl,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
}

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const session = verifyAdminToken(request);
  if (!session) return unauthorizedResponse();

  try {
    const profile = await getAdminProfile(session.sub, {
      displayName: session.name || session.email,
      avatarUrl: DEFAULT_AVATAR,
    });
    return NextResponse.json({ success: true, data: toProfileResponse(profile, session) });
  } catch (error) {
    return errorResponse(error, "Gagal memuat profil.");
  }
}

export async function PUT(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const session = verifyAdminToken(request);
  if (!session) return unauthorizedResponse();

  try {
    const parsedBody = await readJsonBody(request);
    if (!parsedBody.ok) return parsedBody.response;
    const body = parsedBody.body;
    const parsed = normalizeProfileInput(body);
    if (!parsed.ok) {
      return NextResponse.json({ success: false, message: parsed.message }, { status: 400 });
    }

    const profile = await saveAdminProfile(session.sub, parsed.value);

    if (session.role === "internal") {
      await setInternalAccountName(session.sub, profile.displayName);
    }

    return NextResponse.json({ success: true, data: toProfileResponse(profile, session) });
  } catch (error) {
    return errorResponse(error, "Gagal menyimpan profil.");
  }
}
