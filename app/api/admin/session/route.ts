import { NextResponse } from "next/server";
import { isAdminConfigured, isAdminRequest } from "@/lib/admin-auth";
import { isCatalogConfigured } from "@/lib/catalog";

export async function GET(request: Request) {
  return NextResponse.json({
    configured: isAdminConfigured(),
    ok: await isAdminRequest(request),
    catalog: isCatalogConfigured(),
  });
}
