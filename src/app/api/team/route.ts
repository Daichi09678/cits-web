import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";
import { badRequest, readJsonBody } from "@/lib/http";
import { parseTeamMember } from "@/lib/team";
import { TeamRepo } from "@/lib/teamServer";

export async function GET(req: Request) {
  const admin = new URL(req.url).searchParams.get("admin") === "1";
  if (admin) {
    const denied = await requireAdmin(req, "team", "view");
    if (denied) return denied;
  }
  try {
    const members = await TeamRepo.list();
    return NextResponse.json(
      {
        success: true,
        data: admin
          ? members
          : members.filter((member) => member.isActive !== false && member.showOnHomepage !== false),
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Data tim belum dapat dimuat. Silakan coba lagi." },
      { status: 503 }
    );
  }
}

export async function POST(req: Request) {
  const denied = await requireAdmin(req, "team", "create");
  if (denied) return denied;
  const body = await readJsonBody<unknown>(req);
  if (!body.ok) return body.response;
  const parsed = parseTeamMember(body.body);
  if (!parsed.ok) return badRequest(parsed.message);
  try {
    const member = await TeamRepo.create(parsed.value);
    return NextResponse.json({ success: true, data: member }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Anggota tim belum tersimpan. Silakan coba lagi." },
      { status: 503 }
    );
  }
}
