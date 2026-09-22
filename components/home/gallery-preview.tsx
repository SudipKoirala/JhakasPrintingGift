import Link from "next/link";
import { InspirationGallery } from "@/components/gallery/inspiration-gallery";
import { SectionHeading } from "@/components/brand/section-heading";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { getCatalogInspiration } from "@/lib/catalog";

export async function GalleryPreview() {
  const remoteItems = await getCatalogInspiration();

  return (
    <section id="gallery" className="scroll-mt-24 px-4 py-12 sm:px-6 md:px-8 lg:px-10 lg:py-20">
      <div className="page-shell">
        <Reveal className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Gallery"
            title="A little inspiration"
            description="Your photo, illustration, or logo — if you can upload it, we can print it."
          />
          <Button asChild variant="secondary" className="hidden shrink-0 sm:inline-flex">
            <Link href="/gallery">See gallery</Link>
          </Button>
        </Reveal>
        <InspirationGallery remoteItems={remoteItems} preview />
      </div>
    </section>
  );
}
