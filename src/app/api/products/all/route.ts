import { NextResponse } from "next/server";
import { DbRepo } from "@/lib/db";

export async function GET() {
  try {
    const all = await DbRepo.getAllProducts();
    return NextResponse.json({ success: true, data: all });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
