import { cookies } from "next/headers";

export const ADMIN_COOKIE = "sparktee-admin";

export async function hashAdminSecret(value: string) {
  const data = new TextEncoder().encode(`sparktee-admin:${value}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD?.trim() || "";
}

export function isAdminConfigured() {
  return Boolean(getAdminPassword());
}

export async function expectedAdminToken() {
  const password = getAdminPassword();
  if (!password) return null;
  return hashAdminSecret(password);
}

export async function isAdminRequest(request?: Request) {
  const expected = await expectedAdminToken();
  if (!expected) return false;

  const fromHeader = request?.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_COOKIE}=`))
    ?.slice(ADMIN_COOKIE.length + 1);

  if (fromHeader) {
    try {
      return decodeURIComponent(fromHeader) === expected;
    } catch {
      return fromHeader === expected;
    }
  }

  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === expected;
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  };
}
