import { get, put } from "@vercel/blob";
import type { ShirtProduct } from "@/lib/shirts";

export type InspirationItem = {
  id: string;
  title: string;
  note?: string;
  description?: string;
  imageUrl: string;
  images?: string[];
  coverIndex?: number;
};

const SHIRTS_PATH = "sparktee/catalog-shirts.json";
const INSPIRATION_PATH = "sparktee/catalog-inspiration.json";

function blobReady() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function readJson<T>(pathname: string, fallback: T): Promise<T> {
  if (!blobReady()) return fallback;
  try {
    const result = await get(pathname, {
      access: "public",
      useCache: false,
    });
    if (!result || result.statusCode !== 200 || !result.stream) return fallback;
    const text = await new Response(result.stream).text();
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(pathname: string, data: unknown) {
  if (!blobReady()) {
    throw new Error("not_configured");
  }
  await put(pathname, JSON.stringify(data), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function getCatalogShirts() {
  return readJson<ShirtProduct[]>(SHIRTS_PATH, []);
}

export async function saveCatalogShirts(shirts: ShirtProduct[]) {
  await writeJson(SHIRTS_PATH, shirts);
}

export async function getCatalogInspiration() {
  return readJson<InspirationItem[]>(INSPIRATION_PATH, []);
}

export async function saveCatalogInspiration(items: InspirationItem[]) {
  await writeJson(INSPIRATION_PATH, items);
}

export function isCatalogConfigured() {
  return blobReady();
}
