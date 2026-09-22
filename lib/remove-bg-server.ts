import { MAX_IMAGE_BYTES } from "@/lib/constants";

const AI_ENGINE_HOST = "background-removal-ai.p.rapidapi.com";
const AI_ENGINE_URL = `https://${AI_ENGINE_HOST}/remove-background`;

function rembgEndpoint() {
  const raw = process.env.REMBG_API_URL?.trim();
  if (!raw) return "";
  const base = raw.replace(/\/$/, "");
  if (/\/(api\/)?remove$/i.test(base)) return base;
  return `${base}/api/remove`;
}

async function pngFromResponse(response: Response) {
  if (!response.ok) return null;
  const type = response.headers.get("content-type") ?? "";
  if (type.includes("application/json")) {
    const json = (await response.json().catch(() => null)) as {
      image_url?: string;
      url?: string;
      image?: string;
    } | null;
    const url = json?.image_url || json?.url || json?.image;
    if (!url || url.startsWith("data:")) {
      if (url?.startsWith("data:")) {
        const res = await fetch(url);
        return res.ok ? res.arrayBuffer() : null;
      }
      return null;
    }
    const image = await fetch(url);
    return image.ok ? image.arrayBuffer() : null;
  }
  return response.arrayBuffer();
}

async function tryRembg(image: File) {
  const endpoint = rembgEndpoint();
  if (!endpoint) return null;

  const headers: HeadersInit = {};
  const token = process.env.REMBG_API_KEY?.trim();
  if (token) headers.Authorization = `Bearer ${token}`;

  for (const field of ["file", "image"] as const) {
    const payload = new FormData();
    payload.append(field, image, image.name || "design.png");
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: payload,
    });
    const result = await pngFromResponse(response);
    if (result && result.byteLength > 0) return result;
  }
  return null;
}

async function tryAiEngine(image: File) {
  const key = process.env.AI_ENGINE_API_KEY?.trim();
  if (!key) return null;

  const payload = new FormData();
  payload.append("image", image, image.name || "design.png");

  const response = await fetch(AI_ENGINE_URL, {
    method: "POST",
    headers: {
      "x-rapidapi-key": key,
      "x-rapidapi-host": AI_ENGINE_HOST,
    },
    body: payload,
  });
  return pngFromResponse(response);
}

async function tryRemoveBg(image: File) {
  const key = process.env.REMOVE_BG_API_KEY?.trim();
  if (!key) return null;

  const payload = new FormData();
  payload.append("image_file", image);
  payload.append("size", "auto");
  payload.append("format", "png");

  const response = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: { "X-Api-Key": key },
    body: payload,
  });
  return pngFromResponse(response);
}

export function hasCloudBackgroundRemoval() {
  return Boolean(
    rembgEndpoint() ||
      process.env.AI_ENGINE_API_KEY?.trim() ||
      process.env.REMOVE_BG_API_KEY?.trim(),
  );
}

export async function removeBackgroundOnServer(image: File) {
  if (image.size > MAX_IMAGE_BYTES) {
    throw new Error("too_large");
  }

  const providers = [tryRembg, tryAiEngine, tryRemoveBg];
  for (const provider of providers) {
    try {
      const result = await provider(image);
      if (result && result.byteLength > 0) return result;
    } catch {
      // Try the next provider.
    }
  }
  return null;
}
