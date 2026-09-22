import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import {
  getCatalogShirts,
  isCatalogConfigured,
  saveCatalogShirts,
} from "@/lib/catalog";
import type { ShirtProduct } from "@/lib/shirts";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    items: await getCatalogShirts(),
    configured: isCatalogConfigured(),
  });
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!isCatalogConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as {
    items?: ShirtProduct[];
  } | null;
  if (!Array.isArray(body?.items)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  await saveCatalogShirts(body.items);
  return NextResponse.json({ ok: true, items: body.items });
}
