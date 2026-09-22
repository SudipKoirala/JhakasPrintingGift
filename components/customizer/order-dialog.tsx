"use client";

import { IconChat } from "@/components/brand/icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type {
  BackgroundMode,
  ShirtSize,
  ShirtView,
} from "@/lib/constants";

export function OrderDialog({
  open,
  onOpenChange,
  shirtName,
  shirtHex,
  size,
  view,
  background,
  sending,
  error,
  onSend,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shirtName: string;
  shirtHex: string;
  size: ShirtSize;
  view: ShirtView;
  background: BackgroundMode;
  sending: boolean;
  error: string | null;
  onSend: () => void;
}) {
  const colorLabel = shirtName;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ready to send?</DialogTitle>
          <DialogDescription>
            We’ll open WhatsApp with your design link, color, and size.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-[120px_1fr] items-center gap-4 rounded-[24px] bg-white p-4 ring-1 ring-charcoal/8">
          <div className="relative">
            <div
              className="mx-auto h-24 w-20 rounded-2xl"
              style={{ background: shirtHex }}
            />
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-charcoal/55">Color</dt>
              <dd className="font-semibold">{colorLabel}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-charcoal/55">Size</dt>
              <dd className="font-semibold">{size}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-charcoal/55">Side</dt>
              <dd className="font-semibold capitalize">{view}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-charcoal/55">Artwork</dt>
              <dd className="font-semibold">
                {background === "removed" ? "Background removed" : "Original"}
              </dd>
            </div>
          </dl>
        </div>

        {error ? (
          <p className="rounded-2xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta-deep">
            {error}
          </p>
        ) : null}

        <div className="mt-2 flex flex-col gap-2">
          <Button
            variant="whatsapp"
            size="sm"
            onClick={onSend}
            disabled={sending}
          >
            <IconChat className="size-4" />
            {sending ? "Preparing…" : "Send on WhatsApp"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={sending}
          >
            Continue editing
          </Button>
          <p className="text-center text-xs text-charcoal/50">
            Your design will be sent to us through WhatsApp.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
