import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";
import { badRequest, notFound, readJsonBody } from "@/lib/http";
import { parseTeamMember } from "@/lib/team";
import { TeamRepo } from "@/lib/teamServer";

type Context = { params: Promise<{ id: string }> };

export async function PUT(req: Request, context: Context) {
  const denied = await requireAdmin(req, "team", "edit");
  if (denied) return denied;
  const { id } = await context.params;
  const body = await readJsonBody<unknown>(req);
  if (!body.ok) return body.response;
  const parsed = parseTeamMember(body.body);
  if (!parsed.ok) return badRequest(parsed.message);
  try {
    const member = await TeamRepo.update(id, parsed.value);
    return member ? NextResponse.json({ success: true, data: member }) : notFound("Anggota tim tidak ditemukan.");
  } catch {
    return NextResponse.json(
      { success: false, message: "Perubahan tim belum tersimpan. Silakan coba lagi." },
      { status: 503 }
    );
  }
}

export async function DELETE(req: Request, context: Context) {
  const denied = await requireAdmin(req, "team", "delete");
  if (denied) return denied;
  const { id } = await context.params;
  try {
    return (await TeamRepo.remove(id))
      ? NextResponse.json({ success: true })
      : notFound("Anggota tim tidak ditemukan.");
  } catch {
    return NextResponse.json(
      { success: false, message: "Anggota tim belum terhapus. Silakan coba lagi." },
      { status: 503 }
    );
  }
}
