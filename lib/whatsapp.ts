import { getWhatsAppNumber } from "@/lib/constants";
import type { BackgroundMode, ShirtSize, ShirtView } from "@/lib/constants";

export function buildWhatsAppUrl(text: string) {
  const number = getWhatsAppNumber();
  const encoded = encodeURIComponent(text);
  if (!number) return `https://wa.me/?text=${encoded}`;
  return `https://wa.me/${number}?text=${encoded}`;
}

export function buildOrderMessage(input: {
  designUrl: string;
  previewUrl?: string;
  color: string;
  size: ShirtSize;
  view: ShirtView;
  background: BackgroundMode;
}) {
  const colorLabel = input.color;
  const side = input.view === "front" ? "Front" : "Back";
  const bg =
    input.background === "removed" ? "Background removed" : "Original image";

  const lines = [
    "Hi Sparktee! I want this design printed.",
    "",
    `Design: ${input.designUrl}`,
  ];

  if (input.previewUrl) {
    lines.push(`Preview: ${input.previewUrl}`);
  }

  lines.push(
    "",
    `Color: ${colorLabel}`,
    `Size: ${input.size}`,
    `Side: ${side}`,
    `Artwork: ${bg}`,
    "",
    "Please confirm so I can share delivery details.",
  );

  return lines.join("\n");
}
