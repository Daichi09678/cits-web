import { NextResponse } from "next/server";
import { DbRepo } from "@/lib/db";
import { ProductItem } from "@/database/schema";

export async function GET() {
  try {
    const active = await DbRepo.getActiveProducts();
    return NextResponse.json({ success: true, data: active });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newProduct: ProductItem = {
      ...body,
      id: body.id || "prod-" + Date.now(),
      isActive: body.isActive !== false,
      updatedAt: new Date().toISOString(),
    };

    const saved = await DbRepo.createProduct(newProduct);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
