export type ShirtPrint = {
  image: string;
  x: number;
  y: number;
  scale: number;
};

export type ShirtProduct = {
  id: string;
  name: string;
  hex: string;
  featured?: boolean;
  frontTexture?: string;
  backTexture?: string;
  frontPrint?: ShirtPrint;
  backPrint?: ShirtPrint;
};

export const DEFAULT_SHIRTS: ShirtProduct[] = [
  { id: "white", name: "White", hex: "#FFFFFF" },
  { id: "black", name: "Black", hex: "#1A1716" },
  { id: "navy", name: "Navy", hex: "#1E3A5F" },
  { id: "red", name: "Red", hex: "#C23B2E" },
  { id: "forest", name: "Forest", hex: "#2F5D3A" },
  { id: "sage", name: "Sage", hex: "#7F9F7A" },
  { id: "mustard", name: "Mustard", hex: "#D4A017" },
  { id: "sky", name: "Sky", hex: "#4F86B5" },
  { id: "blush", name: "Blush", hex: "#E3A8AE" },
  { id: "charcoal", name: "Charcoal", hex: "#3F3A37" },
  { id: "sand", name: "Sand", hex: "#C4B39A" },
  { id: "purple", name: "Purple", hex: "#5C4B7A" },
];

const STORAGE_KEY = "sparktee-admin-shirts-v1";

export function loadAdminShirts(): ShirtProduct[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ShirtProduct[]) : [];
  } catch {
    return [];
  }
}

export function saveAdminShirts(shirts: ShirtProduct[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shirts));
  } catch {
    const compact = shirts.slice(0, 3);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(compact));
  }
}

export function featuredLook(shirts: ShirtProduct[]): ShirtProduct | null {
  return (
    shirts.find((shirt) => shirt.featured && shirt.frontPrint?.image) ??
    shirts.find((shirt) => shirt.frontPrint?.image) ??
    null
  );
}

export function allShirts(extra: ShirtProduct[] = []): ShirtProduct[] {
  const seen = new Set<string>();
  return [...DEFAULT_SHIRTS, ...extra].filter((shirt) => {
    if (seen.has(shirt.id)) return false;
    seen.add(shirt.id);
    return true;
  });
}

function toHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((value) =>
      Math.max(0, Math.min(255, Math.round(value)))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

export function sampleShirtColor(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 96;
      canvas.height = 96;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve("#8a8a8a");
        return;
      }
      ctx.drawImage(image, 0, 0, 96, 96);
      const pixels = ctx.getImageData(0, 0, 96, 96).data;
      let r = 0;
      let g = 0;
      let b = 0;
      let count = 0;
      for (let y = 20; y < 76; y += 1) {
        for (let x = 24; x < 72; x += 1) {
          const i = (y * 96 + x) * 4;
          if (pixels[i + 3] < 140) continue;
          r += pixels[i];
          g += pixels[i + 1];
          b += pixels[i + 2];
          count += 1;
        }
      }
      if (!count) {
        resolve("#8a8a8a");
        return;
      }
      resolve(toHex(r / count, g / count, b / count));
    };
    image.onerror = () => resolve("#8a8a8a");
    image.src = dataUrl;
  });
}
