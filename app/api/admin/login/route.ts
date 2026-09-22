import { NextResponse } from "next/server";
import {
  adminCookieOptions,
  ADMIN_COOKIE,
  expectedAdminToken,
  getAdminPassword,
  hashAdminSecret,
  isAdminConfigured,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as {
    password?: string;
  } | null;
  const password = body?.password?.trim() ?? "";
  if (!password || password !== getAdminPassword()) {
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }

  const token = (await expectedAdminToken()) ?? (await hashAdminSecret(password));
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, token, adminCookieOptions());
  return response;
}
