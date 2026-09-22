export const SITE = {
  name: "Jhakash Printing Gift",
  tagline: "Custom T-shirts made from your ideas.",
  description:
    "Upload your image, customize your T-shirt, and see how it looks before you order. No account required — just send it to us on WhatsApp.",
} as const;

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
] as const;

export const SIZES = ["S", "M", "L", "XL", "XXL"] as const;
export type ShirtSize = (typeof SIZES)[number];

export const SHIRT_COLORS = [
  {
    id: "white",
    label: "White",
    hex: "#F4EFE8",
    stitch: "#D9D0C6",
    shade: "rgba(41,38,36,0.10)",
    highlight: "rgba(255,255,255,0.55)",
  },
  {
    id: "black",
    label: "Black",
    hex: "#1C1917",
    stitch: "#3A3532",
    shade: "rgba(0,0,0,0.35)",
    highlight: "rgba(255,255,255,0.08)",
  },
] as const;

export type ShirtColorId = (typeof SHIRT_COLORS)[number]["id"];
export type ShirtView = "front" | "back";
export type BackgroundMode = "original" | "removed";

export const PRINT_AREA = {
  front: { left: "35%", top: "30%", width: "30%", height: "32%" },
  back: { left: "34%", top: "28%", width: "32%", height: "34%" },
} as const;

export function getWhatsAppNumber() {
  return (process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER || "").replace(
    /\D/g,
    "",
  );
}

export function getPhoneNumber() {
  return (process.env.NEXT_PUBLIC_ADMIN_PHONE || "").replace(/\D/g, "");
}

export function getInstagramUrl() {
  return process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com";
}
