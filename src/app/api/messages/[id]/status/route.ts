import { NextResponse } from "next/server";
import { DbRepo } from "@/lib/db";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const status = body.status;

    if (!["unread", "read", "replied"].includes(status)) {
      return NextResponse.json({ success: false, message: "Invalid status" }, { status: 400 });
    }

    await DbRepo.updateMessageStatus(id, status);
    return NextResponse.json({
      success: true,
      message: `Status pesan berhasil diperbarui menjadi ${status}`,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
