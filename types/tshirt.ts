import type { BackgroundMode, ShirtSize, ShirtView } from "@/lib/constants";

export type PrintSide = ShirtView;
export type MoveTarget = "shirt" | "image";

export type DesignConfig = {
  image: string | null;
  side: PrintSide;
  x: number;
  y: number;
  scale: number;
  rotation: number;
};

export type TShirtSession = {
  originalDataUrl: string | null;
  removedDataUrl: string | null;
  background: BackgroundMode;
  shirtId: string;
  customHex?: string;
  size: ShirtSize;
  design: DesignConfig;
};

export const DEFAULT_DESIGN: DesignConfig = {
  image: null,
  side: "front",
  x: 0,
  y: 0,
  scale: 1.25,
  rotation: 0,
};
