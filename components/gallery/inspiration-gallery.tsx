"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { TShirtMockup } from "@/components/customizer/tshirt-mockup";
import { SamplePrint } from "@/components/brand/sample-prints";
import { Button } from "@/components/ui/button";
import { PRINT_AREA } from "@/lib/constants";
import type { InspirationItem } from "@/lib/catalog";
import {
  inspirationCover,
  inspirationDescription,
  inspirationPhotos,
  loadLocalInspiration,
  mergeInspiration,
  SAMPLE_INSPIRATION,
} from "@/lib/inspiration";
import {
  GalleryDetail,
  isUploadedInspiration,
  type GalleryEntry,
} from "@/components/gallery/gallery-detail";
import { Reveal } from "@/components/motion/reveal";

export function InspirationGallery({
  remoteItems,
  preview = false,
}: {
  remoteItems: InspirationItem[];
  preview?: boolean;
}) {
  const [localItems, setLocalItems] = useState<InspirationItem[]>([]);
  const [selected, setSelected] = useState<GalleryEntry | null>(null);

  useEffect(() => {
    setLocalItems(loadLocalInspiration());
  }, []);

  const uploaded = useMemo(
    () => mergeInspiration(remoteItems, localItems),
    [remoteItems, localItems],
  );

  const cards = preview
    ? [...uploaded, ...SAMPLE_INSPIRATION].slice(0, 4)
    : [...uploaded, ...SAMPLE_INSPIRATION];

  return (
    <>
      <div
        className={
          preview
            ? "grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6"
            : "grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4 xl:gap-6"
        }
      >
        {cards.map((item, index) => {
          const uploadedItem = isUploadedInspiration(item);
          const cover = uploadedItem ? inspirationCover(item) : "";
          const extra = uploadedItem
            ? Math.max(inspirationPhotos(item).length - 1, 0)
            : 0;
          const blurb = inspirationDescription(item);

          return (
            <Reveal key={item.id} delay={Math.min(index, 7) * 80} className="h-full">
            <button
              type="button"
              onClick={() => setSelected(item)}
              className="group h-full w-full rounded-[28px] bg-white p-3 text-left shadow-[0_10px_30px_rgba(41,38,36,0.05)] ring-1 ring-charcoal/6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(41,38,36,0.1)] sm:p-4"
            >
              {uploadedItem && cover ? (
                <div className="relative overflow-hidden rounded-[20px] bg-cream">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cover}
                    alt={item.title}
                    className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  {extra > 0 ? (
                    <span className="absolute right-2 bottom-2 rounded-full bg-white/95 px-2 py-1 text-[11px] font-semibold text-charcoal shadow-sm">
                      +{extra} more
                    </span>
                  ) : null}
                </div>
              ) : !uploadedItem ? (
                <div className="relative overflow-hidden rounded-[20px]">
                  <TShirtMockup color={item.color} view="front" />
                  <div
                    className="absolute overflow-hidden"
                    style={PRINT_AREA.front}
                  >
                    <SamplePrint name={item.sample} className="h-full w-full" />
                  </div>
                </div>
              ) : null}
              <h2 className="mt-3 font-display text-lg font-bold">{item.title}</h2>
              {blurb ? (
                <p className="line-clamp-2 text-sm text-charcoal/55">{blurb}</p>
              ) : null}
            </button>
            </Reveal>
          );
        })}
      </div>
      {preview ? (
        <div className="mt-6 sm:hidden">
          <Button asChild variant="secondary" className="w-full">
            <Link href="/gallery">See gallery</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-10 flex justify-center">
          <Button asChild size="lg">
            <Link href="/customize">Start with your image</Link>
          </Button>
        </div>
      )}

      <GalleryDetail
        item={selected}
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      />
    </>
  );
}
