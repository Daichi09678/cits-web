import { requireAdmin } from "@/lib/apiAuth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ success: false, message: "Berkas tidak ditemukan" }, { status: 400 });
    }
    if (!new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif"]).has(file.type)) {
      return NextResponse.json(
        { success: false, message: "Gunakan gambar PNG, JPEG, WebP, GIF, atau AVIF." },
        { status: 400 }
      );
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: "Ukuran gambar maksimal 5 MB." }, { status: 413 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || "image/png";
    const base64 = `data:${mimeType};base64,${buffer.toString("base64")}`;

    return NextResponse.json({
      success: true,
      data: {
        url: base64,
        filename: file.name,
        size: file.size,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
