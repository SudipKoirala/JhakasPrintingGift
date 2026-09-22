export type ExtractedPrint = {
  image: string;
  x: number;
  y: number;
  scale: number;
  hex: string;
};

type Box = { x: number; y: number; w: number; h: number; count?: number };
type RGB = { r: number; g: number; b: number };
type Fabric = RGB & { spread: number };

const DEFAULT_PRINT = { x: 0, y: 0.14, scale: 1.2 };

function toHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((value) =>
      Math.max(0, Math.min(255, Math.round(value)))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

function luma(r: number, g: number, b: number) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("image"));
    image.src = src;
  });
}

function median(values: number[]) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function fabricDistance(r: number, g: number, b: number, fabric: RGB) {
  const dr = r - fabric.r;
  const dg = g - fabric.g;
  const db = b - fabric.b;
  const y = 0.299 * dr + 0.587 * dg + 0.114 * db;
  const chroma = Math.hypot(dr - y, dg - y, db - y);
  return Math.hypot(y * 0.85, chroma * 1.4);
}

function torsoBox(shirt: Box): Box {
  return {
    x: Math.round(shirt.x + shirt.w * 0.14),
    y: Math.round(shirt.y + shirt.h * 0.12),
    w: Math.round(shirt.w * 0.72),
    h: Math.round(shirt.h * 0.64),
  };
}

function opaqueBounds(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  minAlpha = 24,
): Box | null {
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let count = 0;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * 4 + 3] < minAlpha) continue;
      count += 1;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
  if (!count) return null;
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1, count };
}

function maskBounds(mask: Uint8Array, width: number, area: Box): Box | null {
  let minX = width;
  let minY = area.y + area.h;
  let maxX = 0;
  let maxY = 0;
  let count = 0;
  for (let y = area.y; y < area.y + area.h; y += 1) {
    for (let x = area.x; x < area.x + area.w; x += 1) {
      if (!mask[y * width + x]) continue;
      count += 1;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
  if (!count) return null;
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1, count };
}

function sampleFabric(
  data: Uint8ClampedArray,
  width: number,
  shirt: Box,
): Fabric | null {
  const r: number[] = [];
  const g: number[] = [];
  const b: number[] = [];

  function take(x: number, y: number) {
    const i = (y * width + x) * 4;
    if (data[i + 3] < 140) return;
    r.push(data[i]);
    g.push(data[i + 1]);
    b.push(data[i + 2]);
  }

  const bands = [
    [0.04, 0.2, 0.08, 0.24],
    [0.8, 0.96, 0.08, 0.24],
    [0.05, 0.2, 0.76, 0.93],
    [0.8, 0.95, 0.76, 0.93],
    [0.05, 0.16, 0.4, 0.58],
    [0.84, 0.95, 0.4, 0.58],
  ] as const;

  for (const [fx0, fx1, fy0, fy1] of bands) {
    const x0 = Math.round(shirt.x + shirt.w * fx0);
    const x1 = Math.round(shirt.x + shirt.w * fx1);
    const y0 = Math.round(shirt.y + shirt.h * fy0);
    const y1 = Math.round(shirt.y + shirt.h * fy1);
    for (let y = y0; y < y1; y += 2) {
      for (let x = x0; x < x1; x += 2) take(x, y);
    }
  }

  if (r.length < 24) return null;
  const fabric = { r: median(r), g: median(g), b: median(b), spread: 0 };
  const spreads: number[] = [];
  for (let i = 0; i < r.length; i += 1) {
    spreads.push(fabricDistance(r[i], g[i], b[i], fabric));
  }
  fabric.spread = Math.max(10, median(spreads) + 6);
  return fabric;
}

function localContrast(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  x: number,
  y: number,
) {
  const i = (y * width + x) * 4;
  const center = luma(data[i], data[i + 1], data[i + 2]);
  let sum = 0;
  let n = 0;
  for (let dy = -2; dy <= 2; dy += 1) {
    for (let dx = -2; dx <= 2; dx += 1) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const k = (ny * width + nx) * 4;
      if (data[k + 3] < 40) continue;
      sum += luma(data[k], data[k + 1], data[k + 2]);
      n += 1;
    }
  }
  if (!n) return 0;
  return Math.abs(center - sum / n);
}

function dilate(mask: Uint8Array, width: number, height: number, area: Box, radius: number) {
  const next = new Uint8Array(mask);
  for (let y = area.y; y < area.y + area.h; y += 1) {
    for (let x = area.x; x < area.x + area.w; x += 1) {
      if (!mask[y * width + x]) continue;
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          next[ny * width + nx] = 1;
        }
      }
    }
  }
  return next;
}

function designScore(box: Box, body: Box) {
  const area = (box.count ?? box.w * box.h) / (body.w * body.h);
  const widthFit = box.w / body.w;
  const heightFit = box.h / body.h;
  if (widthFit > 0.96 && heightFit > 0.9) return 0;
  if (widthFit < 0.08 || heightFit < 0.06) return 0;
  if (area < 0.01 || area > 0.62) return 0;
  const size = Math.min(widthFit * 1.2, 1) * Math.min(heightFit * 1.3, 1);
  return size * (1 - Math.abs(area - 0.18));
}

function findDesignBox(
  scores: Float32Array,
  width: number,
  body: Box,
): Box | null {
  const values: number[] = [];
  for (let y = body.y; y < body.y + body.h; y += 1) {
    for (let x = body.x; x < body.x + body.w; x += 1) {
      const score = scores[y * width + x];
      if (score > 0) values.push(score);
    }
  }
  if (values.length < 40) return null;
  values.sort((a, b) => a - b);

  let best: Box | null = null;
  let bestScore = 0;
  for (const keep of [0.08, 0.12, 0.16, 0.22, 0.3, 0.4]) {
    const cut = values[Math.max(0, Math.floor(values.length * (1 - keep)) - 1)];
    const mask = new Uint8Array(scores.length);
    for (let y = body.y; y < body.y + body.h; y += 1) {
      for (let x = body.x; x < body.x + body.w; x += 1) {
        if (scores[y * width + x] >= cut) mask[y * width + x] = 1;
      }
    }
    const joined = dilate(mask, width, scores.length / width, body, 7);
    const box = maskBounds(joined, width, body);
    if (!box) continue;
    const score = designScore(box, body);
    if (score > bestScore) {
      bestScore = score;
      best = box;
    }
  }
  return best;
}

function placement(body: Box, print: Box): Omit<ExtractedPrint, "image" | "hex"> {
  const bodyCx = body.x + body.w / 2;
  const bodyCy = body.y + body.h / 2;
  const printCx = print.x + print.w / 2;
  const printCy = print.y + print.h / 2;
  const scaleW = (print.w / body.w) * 1.7;
  const scaleH = (print.h / body.h) * 1.8;
  return {
    x: Math.max(-1, Math.min(1, (printCx - bodyCx) / (body.w / 2))),
    y: Math.max(-1, Math.min(1, (bodyCy - printCy) / (body.h / 2))),
    scale: Math.max(0.55, Math.min(2.8, Math.max(scaleW, scaleH * 0.92))),
  };
}

function scaleBox(box: Box, factor: number, maxW: number, maxH: number): Box {
  const x = Math.max(0, Math.round(box.x * factor));
  const y = Math.max(0, Math.round(box.y * factor));
  return {
    x,
    y,
    w: Math.min(maxW - x, Math.max(1, Math.round(box.w * factor))),
    h: Math.min(maxH - y, Math.max(1, Math.round(box.h * factor))),
  };
}

function cropDesign(image: HTMLImageElement, box: Box, fabric: Fabric | null) {
  const pad = Math.round(Math.max(box.w, box.h) * 0.08);
  const srcW = image.naturalWidth || image.width;
  const srcH = image.naturalHeight || image.height;
  const x = Math.max(0, box.x - pad);
  const y = Math.max(0, box.y - pad);
  const width = Math.min(srcW - x, box.w + pad * 2);
  const height = Math.min(srcH - y, box.h + pad * 2);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, width);
  canvas.height = Math.max(1, height);
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas.toDataURL("image/png");
  ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
  if (!fabric) return canvas.toDataURL("image/png");

  const pixels = ctx.getImageData(0, 0, width, height);
  const fabricCut = Math.max(14, fabric.spread * 1.05);
  for (let py = 0; py < height; py += 1) {
    for (let px = 0; px < width; px += 1) {
      const i = (py * width + px) * 4;
      if (pixels.data[i + 3] < 20) continue;
      const d = fabricDistance(
        pixels.data[i],
        pixels.data[i + 1],
        pixels.data[i + 2],
        fabric,
      );
      const edge = localContrast(pixels.data, width, height, px, py);
      const isDesign = d >= fabricCut || edge > 7;
      if (!isDesign) pixels.data[i + 3] = 0;
    }
  }
  ctx.putImageData(pixels, 0, 0);
  return canvas.toDataURL("image/png");
}

export async function extractShirtPrint(dataUrl: string): Promise<ExtractedPrint> {
  const image = await loadImage(dataUrl);
  const srcW = image.naturalWidth || image.width;
  const srcH = image.naturalHeight || image.height;
  const analyzeScale = Math.min(1, 760 / Math.max(srcW, srcH));
  const width = Math.max(1, Math.round(srcW * analyzeScale));
  const height = Math.max(1, Math.round(srcH * analyzeScale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    return { image: dataUrl, hex: "#FFFFFF", ...DEFAULT_PRINT };
  }
  ctx.drawImage(image, 0, 0, width, height);
  const pixels = ctx.getImageData(0, 0, width, height);
  const shirt = opaqueBounds(pixels.data, width, height);
  if (!shirt) {
    return { image: dataUrl, hex: "#FFFFFF", ...DEFAULT_PRINT };
  }

  const fabric = sampleFabric(pixels.data, width, shirt);
  const hex = fabric ? toHex(fabric.r, fabric.g, fabric.b) : "#FFFFFF";
  const body = torsoBox(shirt);

  if (!fabric) {
    return {
      image: cropDesign(
        image,
        scaleBox(body, 1 / analyzeScale, srcW, srcH),
        null,
      ),
      hex,
      ...DEFAULT_PRINT,
    };
  }

  const scores = new Float32Array(width * height);
  for (let y = body.y; y < body.y + body.h; y += 1) {
    for (let x = body.x; x < body.x + body.w; x += 1) {
      const i = (y * width + x) * 4;
      if (pixels.data[i + 3] < 40) continue;
      const d = fabricDistance(
        pixels.data[i],
        pixels.data[i + 1],
        pixels.data[i + 2],
        fabric,
      );
      const edge = localContrast(pixels.data, width, height, x, y);
      scores[y * width + x] = d + edge * 2.4;
    }
  }

  const print = findDesignBox(scores, width, body) ?? body;
  return {
    image: cropDesign(image, scaleBox(print, 1 / analyzeScale, srcW, srcH), fabric),
    hex,
    ...placement(body, print),
  };
}
