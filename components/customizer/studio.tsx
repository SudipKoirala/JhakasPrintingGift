"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Eraser, MessageCircle, RotateCcw } from "lucide-react";
import { UploadZone } from "@/components/customizer/upload-zone";
import { PreviewStage } from "@/components/customizer/preview-stage";
import { OrderDialog } from "@/components/customizer/order-dialog";
import { useDesignCanvas } from "@/components/customizer/use-design-canvas";
import { Button } from "@/components/ui/button";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  SIZES,
  type BackgroundMode,
  type ShirtSize,
  type ShirtView,
} from "@/lib/constants";
import { buildOrderMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn, dataUrlToBlob, fileToDataUrl } from "@/lib/utils";
import {
  preloadBackgroundRemoval,
  removeImageBackground,
} from "@/lib/remove-background";
import {
  allShirts,
  loadAdminShirts,
  type ShirtProduct,
} from "@/lib/shirts";

const SESSION_KEY = "sparktee-studio-v1";

type SessionState = {
  originalDataUrl: string | null;
  removedDataUrl: string | null;
  background: BackgroundMode;
  shirtId: string;
  view: ShirtView;
  size: ShirtSize;
};

function loadSession(): SessionState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SessionState) : null;
  } catch {
    return null;
  }
}

function saveSession(state: SessionState) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
  } catch {
    // Quota or private mode — keep working in memory.
  }
}

export function CustomizerStudio() {
  const restored = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const shirtRef = useRef<HTMLDivElement>(null);
  const {
    canvasElRef,
    wrapRef,
    addImage,
    replaceImageKeepTransform,
    clearDesign,
    exportDesignPng,
    ready,
  } = useDesignCanvas();

  const [originalDataUrl, setOriginalDataUrl] = useState<string | null>(null);
  const [removedDataUrl, setRemovedDataUrl] = useState<string | null>(null);
  const [background, setBackground] = useState<BackgroundMode>("original");
  const [shirtId, setShirtId] = useState("white");
  const [adminShirts, setAdminShirts] = useState<ShirtProduct[]>([]);
  const [designCanvas, setDesignCanvas] = useState<HTMLCanvasElement | null>(
    null,
  );
  const [view, setView] = useState<ShirtView>("front");
  const [size, setSize] = useState<ShirtSize>("M");
  const [error, setError] = useState<{ title: string; body: string } | null>(
    null,
  );
  const [processing, setProcessing] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const hasDesign = Boolean(originalDataUrl);
  const shirts = allShirts(adminShirts);
  const shirt = shirts.find((item) => item.id === shirtId) ?? shirts[0];

  useEffect(() => {
    setAdminShirts(loadAdminShirts());
  }, []);

  useEffect(() => {
    if (!ready || restored.current) return;
    restored.current = true;
    const saved = loadSession();
    if (!saved?.originalDataUrl) return;
    setOriginalDataUrl(saved.originalDataUrl);
    setRemovedDataUrl(saved.removedDataUrl);
    setBackground(saved.background);
    setShirtId(saved.shirtId || "white");
    setView(saved.view);
    setSize(saved.size);
    const url =
      saved.background === "removed" && saved.removedDataUrl
        ? saved.removedDataUrl
        : saved.originalDataUrl;
    void addImage(url);
  }, [ready, addImage]);

  useEffect(() => {
    if (ready) setDesignCanvas(canvasElRef.current);
  }, [ready]);

  useEffect(() => {
    if (!originalDataUrl) return;
    preloadBackgroundRemoval();
  }, [originalDataUrl]);

  useEffect(() => {
    if (!restored.current) return;
    saveSession({
      originalDataUrl,
      removedDataUrl,
      background,
      shirtId,
      view,
      size,
    });
  }, [originalDataUrl, removedDataUrl, background, shirtId, view, size]);

  const applyFile = useCallback(
    async (file: File) => {
      setError(null);
      if (
        !ACCEPTED_IMAGE_TYPES.includes(
          file.type as (typeof ACCEPTED_IMAGE_TYPES)[number],
        )
      ) {
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
      await addImage(dataUrl);
    },
    [addImage],
  );

  const handleBackground = useCallback(
    async (mode: BackgroundMode) => {
      if (!originalDataUrl) return;
      setError(null);
      if (mode === "original") {
        setBackground("original");
        await replaceImageKeepTransform(originalDataUrl);
        return;
      }
      if (removedDataUrl) {
        setBackground("removed");
        await replaceImageKeepTransform(removedDataUrl);
        return;
      }
      setProcessing(true);
      try {
        const url = await removeImageBackground(originalDataUrl);
        setRemovedDataUrl(url);
        setBackground("removed");
        await replaceImageKeepTransform(url);
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
    [originalDataUrl, removedDataUrl, replaceImageKeepTransform],
  );

  const resetDesign = useCallback(() => {
    clearDesign();
    setOriginalDataUrl(null);
    setRemovedDataUrl(null);
    setBackground("original");
    setError(null);
  }, [clearDesign]);

  async function exportMockupPreview() {
    const overlay = await exportDesignPng();
    const canvases = shirtRef.current?.querySelectorAll("canvas");
    const preview = canvases
      ? Array.from(canvases).find((node) => node !== canvasElRef.current)
      : null;
    if (!overlay) return overlay;
    if (!preview) return overlay;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 1000;
      const ctx = canvas.getContext("2d");
      if (!ctx) return overlay;
      ctx.fillStyle = "#FFF9F2";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const pad = 40;
      const drawW = canvas.width - pad * 2;
      const drawH = (preview.height / preview.width) * drawW;
      const dy = (canvas.height - drawH) / 2;
      ctx.drawImage(preview, pad, dy, drawW, drawH);
      return canvas.toDataURL("image/png");
    } catch {
      return overlay;
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
      const design = await exportDesignPng();
      if (!design) {
        setOrderError("Please add a design before sending.");
        return;
      }
      const preview = await exportMockupPreview();
      const designUpload = await uploadDataUrl(design, "sparktee-design.png");
      const previewUpload = preview
        ? await uploadDataUrl(preview, "sparktee-preview.png")
        : { configured: true as const, url: null };

      if (!designUpload.configured) {
        const text = [
          "Hi Sparktee! I want this design printed.",
          "",
          `Color: ${shirt.name}`,
          `Size: ${size}`,
          `Side: ${view === "front" ? "Front" : "Back"}`,
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
        view,
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

  const stepClass =
    "mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-charcoal/45";

  const help = useMemo(
    () => (
      <p className="hidden text-sm text-charcoal/55 lg:block">
        Drag to move, pinch or use the corners to resize, and the handle to
        rotate — like placing a sticker.
      </p>
    ),
    [],
  );

  return (
    <div className="page-shell grid gap-8 px-4 pb-28 pt-6 sm:px-6 md:px-8 lg:grid-cols-[minmax(0,380px)_1fr] lg:items-start lg:gap-12 lg:px-10 lg:pb-16 lg:pt-10">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void applyFile(file);
          event.target.value = "";
        }}
      />

      <div className="order-2 space-y-6 lg:order-1">
        <section>
          <p className={stepClass}>
            <span className="grid size-6 place-items-center rounded-full bg-terracotta/15 text-[11px] text-terracotta">
              1
            </span>
            Upload design
          </p>
          <UploadZone onFile={(file) => void applyFile(file)} />
        </section>

        <section>
          <p className={stepClass}>
            <span className="grid size-6 place-items-center rounded-full bg-terracotta/15 text-[11px] text-terracotta">
              2
            </span>
            Clean up background
          </p>
          <div className="rounded-[24px] bg-white p-4 shadow-[0_8px_20px_rgba(41,38,36,0.05)] ring-1 ring-charcoal/8">
            <div className="mb-3 flex items-start gap-3">
              <span className="grid size-10 place-items-center rounded-2xl bg-mustard/40 text-charcoal">
                <Eraser className="size-5" />
              </span>
              <div>
                <p className="font-display font-bold">Clean Up Background</p>
                <p className="text-sm text-charcoal/60">
                  Automatically remove the background from your image.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 rounded-full bg-cream p-1">
              {(
                [
                  ["original", "Original"],
                  ["removed", "Remove Background"],
                ] as const
              ).map(([mode, label]) => (
                <button
                  key={mode}
                  type="button"
                  disabled={!hasDesign || processing}
                  onClick={() => void handleBackground(mode)}
                  className={cn(
                    "rounded-full px-3 py-2.5 text-sm font-semibold transition",
                    background === mode
                      ? "bg-white text-charcoal shadow-sm"
                      : "text-charcoal/55",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section>
          <p className={stepClass}>
            <span className="grid size-6 place-items-center rounded-full bg-terracotta/15 text-[11px] text-terracotta">
              3
            </span>
            T-shirt
          </p>
          <div className="grid grid-cols-2 gap-3">
            {shirts.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setShirtId(item.id)}
                className={cn(
                  "flex items-center gap-3 rounded-[22px] bg-white p-3 text-left ring-2 transition hover:scale-[1.01]",
                  shirt.id === item.id
                    ? "ring-terracotta"
                    : "ring-charcoal/8 hover:ring-terracotta/40",
                )}
              >
                <span
                  className="grid size-12 place-items-center overflow-hidden rounded-2xl"
                  style={{ background: item.hex }}
                >
                  {item.frontTexture ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.frontTexture}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : (
                    <svg viewBox="0 0 24 24" className="size-7" aria-hidden="true">
                      <path
                        fill={item.id === "white" ? "#d9d0c6" : "#f4efe8"}
                        d="M8.2 5.2 5 7.2 6.4 10.4 8.8 9v8.2c0 .6.5 1 1 1h4.4c.5 0 1-.4 1-1V9l2.4 1.4L19 7.2l-3.2-2C15.4 3.8 13.8 3 12 3s-3.4.8-3.8 2.2Z"
                      />
                    </svg>
                  )}
                </span>
                <span className="font-semibold">{item.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <p className={stepClass}>
            <span className="grid size-6 place-items-center rounded-full bg-terracotta/15 text-[11px] text-terracotta">
              4
            </span>
            Size
          </p>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSize(item)}
                className={cn(
                  "h-11 min-w-11 rounded-full px-4 text-sm font-bold ring-2 transition",
                  size === item
                    ? "bg-charcoal text-cream ring-charcoal"
                    : "bg-white text-charcoal ring-charcoal/10 hover:ring-terracotta/50",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {error ? (
          <div className="rounded-[24px] bg-terracotta/10 p-4">
            <p className="font-display font-bold">{error.title}</p>
            <p className="mt-1 text-sm text-charcoal/70">{error.body}</p>
            {error.title.includes("large") || error.title.includes("type") ? (
              <Button
                className="mt-3"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose Another Image
              </Button>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={resetDesign} disabled={!hasDesign}>
            <RotateCcw className="size-4" />
            Reset Design
          </Button>
        </div>

        <div className="hidden lg:block">
          <Button
            variant="whatsapp"
            size="lg"
            className="w-full"
            onClick={() => {
              if (!hasDesign) {
                fileInputRef.current?.click();
                return;
              }
              setOrderError(null);
              setOrderOpen(true);
            }}
          >
            <MessageCircle className="size-5" />
            Send via WhatsApp
          </Button>
          <p className="mt-2 text-center text-xs text-charcoal/50">
            Your design will be sent to us through WhatsApp.
          </p>
          {help}
        </div>
      </div>

      <div className="order-1 lg:order-2 lg:sticky lg:top-24">
        <PreviewStage
          shirt={shirt}
          view={view}
          onViewChange={setView}
          hasDesign={hasDesign}
          processing={processing}
          canvasElRef={canvasElRef}
          wrapRef={wrapRef}
          shirtRef={shirtRef}
          onUploadClick={() => fileInputRef.current?.click()}
          fabricCanvas={designCanvas}
        />
        {hasDesign ? (
          <p className="mt-4 text-center text-sm text-charcoal/50">
            Drag the shirt to spin 360°, then place your design like a sticker
          </p>
        ) : null}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-charcoal/8 bg-cream/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <Button
          variant="whatsapp"
          size="lg"
          className="w-full"
          onClick={() => {
            if (!hasDesign) {
              fileInputRef.current?.click();
              return;
            }
            setOrderError(null);
            setOrderOpen(true);
          }}
        >
          <MessageCircle className="size-5" />
          Send via WhatsApp
        </Button>
      </div>

      <OrderDialog
        open={orderOpen}
        onOpenChange={setOrderOpen}
        shirtName={shirt.name}
        shirtHex={shirt.hex}
        size={size}
        view={view}
        background={background}
        sending={sending}
        error={orderError}
        onSend={() => void sendOrder()}
      />
    </div>
  );
}
