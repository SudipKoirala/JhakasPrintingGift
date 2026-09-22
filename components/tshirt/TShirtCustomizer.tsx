"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { IconChat } from "@/components/brand/icons";
import { OrderDialog } from "@/components/customizer/order-dialog";
import { CustomizationPanel } from "@/components/tshirt/CustomizationPanel";
import { Button } from "@/components/ui/button";
import { MAX_IMAGE_BYTES, type BackgroundMode } from "@/lib/constants";
import { buildOrderMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn, dataUrlToBlob, fileToDataUrl, isAcceptedImage } from "@/lib/utils";
import {
  preloadBackgroundRemoval,
  removeImageBackground,
} from "@/lib/remove-background";
import { useTShirtCustomization } from "@/hooks/useTShirtCustomization";
import { DEFAULT_DESIGN, type MoveTarget } from "@/types/tshirt";
import { ShirtStage } from "@/components/tshirt/ShirtStage";
import { StageMoveBar } from "@/components/tshirt/StageMoveBar";

const TShirtCanvas = dynamic(
  () =>
    import("@/components/tshirt/TShirtCanvas").then((mod) => mod.TShirtCanvas),
  { ssr: false },
);

export function TShirtCustomizer() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const {
    shirts,
    shirt,
    shirtId,
    setShirtId,
    customHex,
    setCustomHex,
    size,
    setSize,
    design,
    setDesignImage,
    updateDesign,
    setSide,
    originalDataUrl,
    setOriginalDataUrl,
    removedDataUrl,
    setRemovedDataUrl,
    background,
    setBackground,
    resetDesign,
  } = useTShirtCustomization();

  const [error, setError] = useState<{ title: string; body: string } | null>(
    null,
  );
  const [processing, setProcessing] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [moveTarget, setMoveTarget] = useState<MoveTarget>("shirt");
  const [locked, setLocked] = useState(false);

  const hasDesign = Boolean(design.image);

  useEffect(() => {
    if (hasDesign) return;
    setMoveTarget("shirt");
    setLocked(false);
  }, [hasDesign]);

  useEffect(() => {
    if (originalDataUrl) preloadBackgroundRemoval();
  }, [originalDataUrl]);

  const applyFile = useCallback(
    async (file: File) => {
      setError(null);
      if (!isAcceptedImage(file)) {
        setError({
          title: "That file type isn’t supported.",
          body: "Please choose a PNG, JPG, or WEBP image.",
        });
        return;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        setError({
          title: "That image is a little too large.",
          body: "Try uploading an image smaller than 10 MB.",
        });
        return;
      }
      const dataUrl = await fileToDataUrl(file);
      setOriginalDataUrl(dataUrl);
      setRemovedDataUrl(null);
      setBackground("original");
      setDesignImage(dataUrl);
    },
    [setBackground, setDesignImage, setOriginalDataUrl, setRemovedDataUrl],
  );

  const handleBackground = useCallback(
    async (mode: BackgroundMode) => {
      if (!originalDataUrl) return;
      setError(null);
      if (mode === "original") {
        setBackground("original");
        setDesignImage(originalDataUrl);
        return;
      }
      if (removedDataUrl) {
        setBackground("removed");
        setDesignImage(removedDataUrl);
        return;
      }
      setProcessing(true);
      try {
        const url = await removeImageBackground(originalDataUrl);
        setRemovedDataUrl(url);
        setBackground("removed");
        setDesignImage(url);
      } catch {
        setBackground("original");
        setError({
          title: "We couldn’t remove the background.",
          body: "Your original image is still safe. You can continue without background removal.",
        });
      } finally {
        setProcessing(false);
      }
    },
    [
      originalDataUrl,
      removedDataUrl,
      setBackground,
      setDesignImage,
      setRemovedDataUrl,
    ],
  );

  async function exportMockupPreview() {
    const preview = stageRef.current?.querySelector("canvas");
    if (!preview) return design.image;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 1000;
      const ctx = canvas.getContext("2d");
      if (!ctx) return design.image;
      ctx.fillStyle = "#FFF9F2";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const pad = 40;
      const drawW = canvas.width - pad * 2;
      const drawH = (preview.height / preview.width) * drawW;
      const dy = (canvas.height - drawH) / 2;
      ctx.drawImage(preview, pad, dy, drawW, drawH);
      return canvas.toDataURL("image/png");
    } catch {
      return design.image;
    }
  }

  async function uploadDataUrl(dataUrl: string, filename: string) {
    const blob = dataUrlToBlob(dataUrl);
    const form = new FormData();
    form.append("file", blob, filename);
    const response = await fetch("/api/upload", { method: "POST", body: form });
    if (response.status === 503) return { configured: false as const };
    if (!response.ok) return { configured: true as const, url: null };
    const json = (await response.json()) as { url?: string };
    return { configured: true as const, url: json.url ?? null };
  }

  async function sendOrder() {
    setSending(true);
    setOrderError(null);
    try {
      const artwork = design.image;
      if (!artwork) {
        setOrderError("Please add a design before sending.");
        return;
      }
      const preview = await exportMockupPreview();
      const designUpload = await uploadDataUrl(artwork, "sparktee-design.png");
      const previewUpload = preview
        ? await uploadDataUrl(preview, "sparktee-preview.png")
        : { configured: true as const, url: null };

      if (!designUpload.configured) {
        const text = [
          "Hi Jhakash Printing Gift! I want this design printed.",
          "",
          `Color: ${shirt.name}`,
          `Size: ${size}`,
          `Side: ${design.side === "front" ? "Front" : "Back"}`,
          `Artwork: ${background === "removed" ? "Background removed" : "Original image"}`,
          "",
          "I’ll attach the design image in this chat.",
        ].join("\n");
        window.open(buildWhatsAppUrl(text), "_blank", "noopener,noreferrer");
        setOrderOpen(false);
        return;
      }

      if (!designUpload.url) {
        setOrderError(
          "We couldn’t save your design just now. Please try again in a moment.",
        );
        return;
      }

      const text = buildOrderMessage({
        designUrl: designUpload.url,
        previewUrl: previewUpload.url ?? undefined,
        color: shirt.name,
        size,
        view: design.side,
        background,
      });
      window.open(buildWhatsAppUrl(text), "_blank", "noopener,noreferrer");
      setOrderOpen(false);
    } catch {
      setOrderError(
        "Something went sideways while preparing your design. Please try again.",
      );
    } finally {
      setSending(false);
    }
  }

  function openOrder() {
    if (!hasDesign) {
      fileInputRef.current?.click();
      return;
    }
    setOrderError(null);
    setOrderOpen(true);
  }

  return (
    <div className="page-shell grid gap-5 px-4 pb-24 pt-4 sm:px-6 md:px-8 lg:grid-cols-[minmax(0,340px)_1fr] lg:items-start lg:gap-8 lg:px-10 lg:pb-12 lg:pt-6 xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.png,.jpg,.jpeg,.webp"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void applyFile(file);
          event.target.value = "";
        }}
      />

      <div className="order-2 lg:order-1">
        <CustomizationPanel
          shirts={shirts}
          shirtId={shirtId}
          onShirtId={setShirtId}
          customHex={customHex}
          onCustomHex={setCustomHex}
          size={size}
          onSize={setSize}
          design={design}
          onDesign={updateDesign}
          onSide={setSide}
          hasDesign={hasDesign}
          background={background}
          processing={processing}
          error={error}
          onUpload={(file) => void applyFile(file)}
          onBackground={(mode) => void handleBackground(mode)}
          onReset={resetDesign}
          onChooseImage={() => fileInputRef.current?.click()}
          onWhatsApp={openOrder}
        />
      </div>

      <div className="order-1 lg:order-2 lg:sticky lg:top-24">
        <div className="mx-auto w-full max-w-[500px] lg:max-w-[520px]">
          <div className="mb-3 flex items-center justify-center">
            <div className="inline-flex rounded-full bg-white p-0.5 ring-1 ring-charcoal/8">
              {(["front", "back"] as const).map((side) => (
                <button
                  key={side}
                  type="button"
                  onClick={() => setSide(side)}
                  className={cn(
                    "h-8 rounded-full px-4 text-xs font-semibold capitalize transition",
                    design.side === side
                      ? "bg-terracotta text-white"
                      : "text-charcoal/55 hover:text-charcoal",
                  )}
                >
                  {side}
                </button>
              ))}
            </div>
          </div>

          <ShirtStage compact showLiveBadge showDragHint={!hasDesign}>
            <div className="relative">
              <TShirtCanvas
                stageRef={stageRef}
                className="h-[340px] w-full sm:h-[400px] lg:h-[460px]"
                color={shirt.hex}
                design={hasDesign ? design : DEFAULT_DESIGN}
                side={design.side}
                onPlace={updateDesign}
                moveTarget={moveTarget}
                locked={locked}
                onMoveTarget={setMoveTarget}
              />
              {processing ? (
                <div className="absolute inset-0 z-10 grid place-items-center bg-white/55 backdrop-blur-[1px]">
                  <div className="rounded-2xl bg-white px-4 py-3 text-center shadow-[0_10px_30px_rgba(41,38,36,0.08)]">
                    <p className="text-sm font-semibold">
                      Cleaning up your image…
                    </p>
                    <p className="mt-0.5 text-[11px] text-charcoal/55">
                      First time can take a minute while the free AI model
                      loads.
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </ShirtStage>

          <StageMoveBar
            moveTarget={moveTarget}
            locked={locked}
            hasDesign={hasDesign}
            onMoveTarget={setMoveTarget}
            onLocked={setLocked}
          />
          <p className="mt-2 text-center text-[11px] leading-relaxed text-charcoal/45">
            Shirt spins the tee, Image moves your print, and Lock keeps that
            mode on.
          </p>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-charcoal/8 bg-cream/95 px-4 py-2.5 pb-[max(0.65rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <Button
          variant="whatsapp"
          size="sm"
          className="w-full"
          onClick={openOrder}
        >
          <IconChat className="size-4" />
          Send on WhatsApp
        </Button>
      </div>

      <OrderDialog
        open={orderOpen}
        onOpenChange={setOrderOpen}
        shirtName={shirt.name}
        shirtHex={shirt.hex}
        size={size}
        view={design.side}
        background={background}
        sending={sending}
        error={orderError}
        onSend={() => void sendOrder()}
      />
    </div>
  );
}
