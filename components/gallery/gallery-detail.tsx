"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  IconChevronLeft,
  IconChevronRight,
  IconClose,
  IconExpand,
} from "@/components/brand/icons";
import { TShirtMockup } from "@/components/customizer/tshirt-mockup";
import { SamplePrint } from "@/components/brand/sample-prints";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PRINT_AREA } from "@/lib/constants";
import type { InspirationItem } from "@/lib/catalog";
import {
  inspirationCover,
  inspirationDescription,
  inspirationPhotos,
  type SampleInspiration,
} from "@/lib/inspiration";
import { cn } from "@/lib/utils";

export type GalleryEntry = InspirationItem | SampleInspiration;

export function isUploadedInspiration(
  item: GalleryEntry,
): item is InspirationItem {
  return (
    "imageUrl" in item ||
    ("images" in item && Array.isArray(item.images) && item.images.length > 0)
  );
}

export function GalleryDetail({
  item,
  open,
  onOpenChange,
}: {
  item: GalleryEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const photos =
    item && isUploadedInspiration(item) ? inspirationPhotos(item) : [];
  const [active, setActive] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!item) return;
    const cover = isUploadedInspiration(item)
      ? inspirationPhotos(item).indexOf(inspirationCover(item))
      : 0;
    setActive(cover >= 0 ? cover : 0);
    setFullscreen(false);
  }, [item]);

  useEffect(() => {
    if (!fullscreen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        setFullscreen(false);
      }
      if (event.key === "ArrowRight") {
        setActive((index) => (index + 1) % Math.max(photos.length, 1));
      }
      if (event.key === "ArrowLeft") {
        setActive(
          (index) =>
            (index - 1 + Math.max(photos.length, 1)) %
            Math.max(photos.length, 1),
        );
      }
    }
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [fullscreen, photos.length]);

  if (!item) return null;

  const uploaded = isUploadedInspiration(item);
  const description = inspirationDescription(item);
  const current = photos[active] ?? photos[0];

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!next) setFullscreen(false);
          onOpenChange(next);
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto bg-white p-4 sm:p-6">
          <DialogHeader className="mb-3">
            <DialogTitle>{item.title}</DialogTitle>
            {description ? (
              <DialogDescription>{description}</DialogDescription>
            ) : (
              <DialogDescription>
                A Sparktee look you can use as a starting point.
              </DialogDescription>
            )}
          </DialogHeader>

          {uploaded && current ? (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setFullscreen(true)}
                className="group relative block w-full overflow-hidden rounded-[22px] bg-cream"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={current}
                  alt={item.title}
                  className="max-h-[52vh] w-full object-contain"
                />
                <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-charcoal shadow-sm ring-1 ring-charcoal/8">
                  <IconExpand className="size-3.5" />
                  Full screen
                </span>
              </button>
              {photos.length > 1 ? (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {photos.map((photo, index) => (
                    <button
                      key={`${photo}-${index}`}
                      type="button"
                      onClick={() => setActive(index)}
                      className={cn(
                        "size-16 shrink-0 overflow-hidden rounded-2xl ring-2 transition",
                        index === active
                          ? "ring-terracotta"
                          : "ring-charcoal/10 hover:ring-charcoal/25",
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo}
                        alt=""
                        className="size-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : !uploaded ? (
            <div className="relative mx-auto max-w-xs overflow-hidden rounded-[22px]">
              <TShirtMockup color={item.color} view="front" />
              <div
                className="absolute overflow-hidden"
                style={PRINT_AREA.front}
              >
                <SamplePrint name={item.sample} className="h-full w-full" />
              </div>
            </div>
          ) : null}

          <div className="mt-5">
            <Button asChild>
              <Link href="/customize">Start with your image</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {fullscreen && current ? (
        <div className="fixed inset-0 z-[80] bg-charcoal/94 text-white">
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            className="absolute top-4 right-4 z-10 grid size-11 place-items-center rounded-full bg-white/10 hover:bg-white/16"
            aria-label="Close full screen"
          >
            <IconClose className="size-5" />
          </button>
          {photos.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() =>
                  setActive(
                    (index) => (index - 1 + photos.length) % photos.length,
                  )
                }
                className="absolute top-1/2 left-3 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/16"
                aria-label="Previous photo"
              >
                <IconChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setActive((index) => (index + 1) % photos.length)
                }
                className="absolute top-1/2 right-3 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/16"
                aria-label="Next photo"
              >
                <IconChevronRight className="size-6" />
              </button>
            </>
          ) : null}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current}
            alt={item.title}
            className="h-full w-full object-contain p-4 sm:p-10"
          />
        </div>
      ) : null}
    </>
  );
}
