"use client";

import dynamic from "next/dynamic";
import type { CSSProperties, Ref } from "react";
import { type ShirtView } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  facingFromRotation,
  useShirtSpin,
} from "@/components/customizer/use-shirt-spin";
import type { ShirtProduct } from "@/lib/shirts";

const TShirtScene = dynamic(
  () =>
    import("@/components/three/tshirt-scene").then((mod) => mod.TShirtScene),
  { ssr: false },
);

export function PreviewStage({
  shirt,
  view,
  onViewChange,
  hasDesign,
  processing,
  canvasElRef,
  wrapRef,
  shirtRef,
  onUploadClick,
  fabricCanvas,
}: {
  shirt: ShirtProduct;
  view: ShirtView;
  onViewChange: (view: ShirtView) => void;
  hasDesign: boolean;
  processing: boolean;
  canvasElRef: Ref<HTMLCanvasElement>;
  wrapRef: Ref<HTMLDivElement>;
  shirtRef: Ref<HTMLDivElement>;
  onUploadClick: () => void;
  fabricCanvas: HTMLCanvasElement | null;
}) {
  const spin = useShirtSpin(view === "back" ? 180 : 0);
  const facing = facingFromRotation(spin.rotation);
  const canEdit = facing === "front" && hasDesign;
  const area = {
    left: "28%",
    top: "24%",
    width: "44%",
    height: "46%",
  };

  function goTo(next: ShirtView) {
    spin.snapTo(next === "back" ? 180 : 0);
    onViewChange(next);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 inline-flex rounded-full bg-white p-1 shadow-[0_8px_20px_rgba(41,38,36,0.06)] ring-1 ring-charcoal/8">
        {(["front", "back"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => goTo(item)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-semibold capitalize transition",
              facing === item
                ? "bg-terracotta text-white"
                : "text-charcoal/60 hover:text-charcoal",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="w-full max-w-[420px] rounded-[32px] bg-white/70 p-3 shadow-[0_16px_40px_rgba(41,38,36,0.08)] ring-1 ring-charcoal/6 sm:p-4">
        <div
          ref={shirtRef}
          className="relative cursor-grab touch-pan-y select-none active:cursor-grabbing"
          {...spin.bind}
          onPointerUp={(event) => {
            spin.bind.onPointerUp();
            onViewChange(facingFromRotation(spin.getRotation()));
            event.currentTarget.releasePointerCapture?.(event.pointerId);
          }}
        >
          <TShirtScene
            className="h-[390px] w-full sm:h-[430px]"
            color={shirt.hex}
            rotation={spin.rotation}
            frontTexture={shirt.frontTexture}
            backTexture={shirt.backTexture}
            designCanvas={hasDesign ? fabricCanvas : null}
          />

          <div
            ref={wrapRef}
            data-no-spin={canEdit ? true : undefined}
            className={cn(
              "absolute overflow-hidden",
              canEdit ? "touch-none" : "pointer-events-none opacity-0",
            )}
            style={area as CSSProperties}
            onPointerDown={(event) => {
              if (canEdit) event.stopPropagation();
            }}
          >
            <canvas ref={canvasElRef} className="block size-full" />
          </div>

          {processing ? (
            <div className="absolute inset-0 z-10 grid place-items-center rounded-[24px] bg-cream/55 backdrop-blur-[1px]">
              <div className="flex flex-col items-center gap-2 rounded-3xl bg-white px-6 py-5 shadow-[0_10px_30px_rgba(41,38,36,0.08)]">
                <p className="font-semibold">Cleaning up your image…</p>
                <p className="text-xs text-charcoal/55">
                  The first time can take a few seconds.
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-3 space-y-2 px-1">
          <div className="flex items-center justify-between text-xs font-semibold text-charcoal/50">
            <span>Drag to spin 360°</span>
            <span>{Math.round(spin.rotation)}°</span>
          </div>
          <input
            type="range"
            min={0}
            max={360}
            value={Math.round(spin.rotation)}
            onChange={(event) => {
              const next = Number(event.target.value);
              spin.setRotation(next);
              onViewChange(facingFromRotation(next));
            }}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-cream-deep accent-terracotta"
            aria-label="Rotate T-shirt 360 degrees"
          />
        </div>

        {!hasDesign ? (
          <div className="px-2 pt-3 text-center">
            <p className="font-display text-lg font-bold">
              Your T-shirt is waiting for a design.
            </p>
            <p className="mt-1 text-sm text-charcoal/60">
              Upload an image to get started.
            </p>
            <Button type="button" className="mt-4" onClick={onUploadClick}>
              Upload Design
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
