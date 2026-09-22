import type { Metadata } from "next";
import Link from "next/link";
import { TShirtCustomizer } from "@/components/tshirt/TShirtCustomizer";
import { IconQuestion } from "@/components/brand/icons";

export const metadata: Metadata = {
  title: "Customize Your T-Shirt",
  description:
    "Upload your image, place it on a T-shirt, and send your design on WhatsApp. No account required.",
};

export default function CustomizePage() {
  return (
    <main className="min-h-screen">
      <div className="page-shell flex items-center justify-between px-4 pt-5 sm:px-6 md:px-8 lg:px-10">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-terracotta">
            Studio
          </p>
          <h1 className="font-display text-xl font-extrabold tracking-tight sm:text-2xl">
            Customize
          </h1>
        </div>
        <Link
          href="/#how-it-works"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal/55 transition hover:text-charcoal"
        >
          <IconQuestion className="size-3.5" />
          How it works
        </Link>
      </div>
      <TShirtCustomizer />
    </main>
  );
}
