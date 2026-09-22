"use client";

import { Eraser, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function BackgroundChoiceDialog({
  open,
  processing,
  onOpenChange,
  onKeepOriginal,
  onRemoveBackground,
}: {
  open: boolean;
  processing: boolean;
  onOpenChange: (open: boolean) => void;
  onKeepOriginal: () => void;
  onRemoveBackground: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-cream p-6 sm:p-7">
        <DialogHeader>
          <DialogTitle>Clean up your design?</DialogTitle>
          <DialogDescription>
            Your image is ready. Keep the original background or remove it so
            your design sits cleanly on the shirt.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={processing}
            onClick={onKeepOriginal}
            className="group rounded-2xl bg-white p-4 text-left ring-1 ring-charcoal/8 transition hover:-translate-y-0.5 hover:ring-terracotta/45 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="mb-3 grid size-10 place-items-center rounded-xl bg-cream text-charcoal transition group-hover:bg-terracotta/12 group-hover:text-terracotta">
              <ImageIcon className="size-5" />
            </span>
            <span className="block text-sm font-bold">Keep original</span>
            <span className="mt-1 block text-xs leading-relaxed text-charcoal/55">
              Use the image exactly as uploaded.
            </span>
          </button>
          <button
            type="button"
            disabled={processing}
            onClick={onRemoveBackground}
            className="group rounded-2xl bg-charcoal p-4 text-left text-cream transition hover:-translate-y-0.5 hover:bg-charcoal/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="mb-3 grid size-10 place-items-center rounded-xl bg-mustard text-charcoal">
              <Eraser className="size-5" />
            </span>
            <span className="block text-sm font-bold">Remove background</span>
            <span className="mt-1 block text-xs leading-relaxed text-cream/65">
              Let the image cleanup run before you place it.
            </span>
          </button>
        </div>
        <Button
          type="button"
          variant="ghost"
          className="mx-auto mt-1 text-charcoal/55"
          disabled={processing}
          onClick={() => onOpenChange(false)}
        >
          Decide later
        </Button>
      </DialogContent>
    </Dialog>
  );
}
