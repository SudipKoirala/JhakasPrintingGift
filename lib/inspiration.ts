import type { ShirtColorId } from "@/lib/constants";
import type { SamplePrintName } from "@/components/brand/sample-prints";
import type { InspirationItem } from "@/lib/catalog";

export type SampleInspiration = {
  id: string;
  title: string;
  note: string;
  sample: SamplePrintName;
  color: ShirtColorId;
};

export const SAMPLE_INSPIRATION: SampleInspiration[] = [
  {
    id: "sample-sun",
    title: "Sunny day",
    note: "Cheerful mascot energy",
    sample: "sun",
    color: "white",
  },
  {
    id: "sample-mountain",
    title: "Trail club",
    note: "Weekend hike graphic",
    sample: "mountain",
    color: "black",
  },
  {
    id: "sample-spark",
    title: "Bolt club",
    note: "Bold and simple",
    sample: "spark",
    color: "white",
  },
  {
    id: "sample-wave",
    title: "Night wave",
    note: "Late-night playlist vibes",
    sample: "wave",
    color: "black",
  },
  {
    id: "sample-heart",
    title: "Soft heart",
    note: "Gift-ready and warm",
    sample: "heart",
    color: "white",
  },
  {
    id: "sample-cup",
    title: "Coffee run",
    note: "Everyday illustration",
    sample: "cup",
    color: "black",
  },
];

export const MAX_INSPIRATION_PHOTOS = 6;

export function inspirationPhotos(item: InspirationItem): string[] {
  if (item.images?.length) return item.images.filter(Boolean);
  return item.imageUrl ? [item.imageUrl] : [];
}

export function inspirationCover(item: InspirationItem): string {
  const photos = inspirationPhotos(item);
  const index = Math.min(
    Math.max(item.coverIndex ?? 0, 0),
    Math.max(photos.length - 1, 0),
  );
  return photos[index] ?? item.imageUrl ?? "";
}

export function inspirationDescription(item: {
  description?: string;
  note?: string;
}) {
  return item.description?.trim() || item.note?.trim() || "";
}

const STORAGE_KEY = "sparktee-admin-inspiration-v1";

export function loadLocalInspiration(): InspirationItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as InspirationItem[]) : [];
  } catch {
    return [];
  }
}

export function saveLocalInspiration(items: InspirationItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function mergeInspiration(
  remote: InspirationItem[],
  local: InspirationItem[] = [],
) {
  const seen = new Set<string>();
  return [...remote, ...local].filter((item) => {
    if (!item.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}
