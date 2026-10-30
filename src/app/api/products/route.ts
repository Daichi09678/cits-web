import { requireAdmin } from "@/lib/apiAuth";
import { NextResponse } from "next/server";
import { DbRepo } from "@/lib/db";
import { ProductItem } from "@/types/schema";
import { badRequest, missingStringFields, readJsonBody } from "@/lib/http";

export async function GET(req: Request) {
  try {
    // ?all=true dipakai back office untuk melihat produk non-aktif juga.
    const all = new URL(req.url).searchParams.get("all") === "true";
    if (all) {
      const denied = await requireAdmin(req, "products", "view");
      if (denied) return denied;
    }
    const products = all ? await DbRepo.getAllProducts() : await DbRepo.getActiveProducts();
    return NextResponse.json({ success: true, data: products });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const denied = await requireAdmin(req, "products");
  if (denied) return denied;
  try {
    const parsed = await readJsonBody(req);
    if (!parsed.ok) return parsed.response;
    const body = parsed.body;
    const missing = missingStringFields(body, ["name", "category", "description"]);
    if (missing.length > 0) {
      return badRequest(`Data produk tidak lengkap: ${missing.join(", ")}.`);
    }
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
