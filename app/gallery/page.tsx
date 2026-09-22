import type { Metadata } from "next";
import { InspirationGallery } from "@/components/gallery/inspiration-gallery";
import { Reveal } from "@/components/motion/reveal";
import { getCatalogInspiration } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "A few ideas for what your custom Jhakash Printing Gift could look like.",
};

export default async function GalleryPage() {
  const remoteItems = await getCatalogInspiration();

  return (
    <main className="page-shell px-4 py-14 sm:px-6 md:px-8 lg:px-10 lg:py-20">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="mb-3 text-sm font-semibold text-terracotta">Gallery</p>
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          A little inspiration
        </h1>
        <p className="mt-4 text-base leading-relaxed text-charcoal/62">
          Sample looks to get you going — your upload is the real star. Drop in
          a photo, a logo, or a doodle and make it yours.
        </p>
      </Reveal>
      <div className="mt-12">
        <InspirationGallery remoteItems={remoteItems} />
      </div>
    </main>
  );
}
