"use client";

import { IconChat, IconReset } from "@/components/brand/icons";
import { UploadZone } from "@/components/customizer/upload-zone";
import { Button } from "@/components/ui/button";
import { SIZES, type BackgroundMode, type ShirtSize } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ShirtProduct } from "@/lib/shirts";
import type { DesignConfig, PrintSide } from "@/types/tshirt";

export function CustomizationPanel({
  shirts,
  shirtId,
  onShirtId,
  customHex,
  onCustomHex,
  size,
  onSize,
  design,
  onDesign,
  onSide,
  hasDesign,
  background,
  processing,
  error,
  onUpload,
  onBackground,
  onReset,
  onChooseImage,
  onWhatsApp,
}: {
  shirts: ShirtProduct[];
  shirtId: string;
  onShirtId: (id: string) => void;
  customHex: string;
  onCustomHex: (hex: string) => void;
  size: ShirtSize;
  onSize: (size: ShirtSize) => void;
  design: DesignConfig;
  onDesign: (patch: Partial<DesignConfig>) => void;
  onSide: (side: PrintSide) => void;
  hasDesign: boolean;
  background: BackgroundMode;
  processing: boolean;
  error: { title: string; body: string } | null;
  onUpload: (file: File) => void;
  onBackground: (mode: BackgroundMode) => void;
  onReset: () => void;
  onChooseImage: () => void;
  onWhatsApp: () => void;
}) {
  return (
    <div className="space-y-4 rounded-[28px] bg-white p-4 ring-1 ring-charcoal/8 sm:p-5">
      <section>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-charcoal/40">
          Design
        </p>
        {hasDesign && design.image ? (
          <div className="flex items-center gap-3 rounded-2xl bg-cream px-2.5 py-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={design.image}
              alt=""
              className="size-11 rounded-xl bg-white object-contain ring-1 ring-charcoal/8"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Design added</p>
              <p className="text-[11px] text-charcoal/50">Ready to place on the shirt</p>
            </div>
            <Button type="button" size="sm" variant="outline" onClick={onChooseImage}>
              Replace
            </Button>
          </div>
        ) : (
          <UploadZone compact onFile={onUpload} />
        )}
      </section>

      <section>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-charcoal/40">
          Background
        </p>
        <div className="flex rounded-full bg-cream p-0.5">
          {(
            [
              ["original", "Keep"],
              ["removed", "Remove"],
            ] as const
          ).map(([mode, label]) => (
            <button
              key={mode}
              type="button"
              disabled={!hasDesign || processing}
              onClick={() => onBackground(mode)}
              className={cn(
                "h-8 flex-1 rounded-full text-xs font-semibold transition disabled:opacity-40",
                background === mode
                  ? "bg-white text-charcoal shadow-sm"
                  : "text-charcoal/50 hover:text-charcoal",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-charcoal/40">
          Color
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {shirts
            .filter((item) => item.id !== "custom")
            .map((item) => (
              <button
                key={item.id}
                type="button"
                title={item.name}
                onClick={() => onShirtId(item.id)}
                className={cn(
                  "size-8 overflow-hidden rounded-full ring-2 ring-offset-2 ring-offset-white transition",
                  shirtId === item.id ? "ring-terracotta" : "ring-charcoal/10 hover:ring-charcoal/25",
                )}
                style={{ background: item.hex }}
              >
                {item.frontTexture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.frontTexture} alt="" className="size-full object-cover" />
                ) : null}
              </button>
            ))}
          <label className="ml-1 inline-flex items-center gap-2 text-xs font-semibold text-charcoal/60">
            Custom
            <input
              type="color"
              value={customHex}
              onChange={(event) => {
                onCustomHex(event.target.value);
                onShirtId("custom");
              }}
              className={cn(
                "h-8 w-8 cursor-pointer rounded-full bg-transparent",
                shirtId === "custom" ? "ring-2 ring-terracotta ring-offset-2" : "",
              )}
            />
          </label>
        </div>
      </section>

      <section>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-charcoal/40">
          Size
        </p>
        <div className="flex flex-wrap gap-1.5">
          {SIZES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onSize(item)}
              className={cn(
                "h-8 min-w-8 rounded-full px-3 text-xs font-bold transition",
                size === item
                  ? "bg-charcoal text-cream"
                  : "bg-cream text-charcoal/70 hover:bg-cream-deep hover:text-charcoal",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {hasDesign ? (
        <section>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-charcoal/40">
            Print
          </p>
          <div className="space-y-3">
            <div className="flex rounded-full bg-cream p-0.5">
              {(["front", "back"] as const).map((side) => (
                <button
                  key={side}
                  type="button"
                  onClick={() => onSide(side)}
                  className={cn(
                    "h-8 flex-1 rounded-full text-xs font-semibold capitalize",
                    design.side === side
                      ? "bg-white text-charcoal shadow-sm"
                      : "text-charcoal/50",
                  )}
                >
                  {side}
                </button>
              ))}
            </div>
            <Slider
              label="Horizontal"
              min={-1.2}
              max={1.2}
              step={0.01}
              value={design.x}
              onChange={(x) => onDesign({ x })}
            />
            <Slider
              label="Vertical"
              min={-1.2}
              max={1.2}
              step={0.01}
              value={design.y}
              onChange={(y) => onDesign({ y })}
            />
            <Slider
              label="Size"
              min={0.4}
              max={3.2}
              step={0.01}
              value={design.scale}
              onChange={(scale) => onDesign({ scale })}
            />
            <Slider
              label="Rotation"
              min={-180}
              max={180}
              step={1}
              value={Math.round((design.rotation * 180) / Math.PI)}
              onChange={(degrees) =>
                onDesign({ rotation: (degrees * Math.PI) / 180 })
              }
            />
          </div>
        </section>
      ) : null}

      {error ? (
        <div className="rounded-2xl bg-terracotta/10 px-3 py-2.5">
          <p className="text-sm font-semibold">{error.title}</p>
          <p className="mt-0.5 text-xs text-charcoal/70">{error.body}</p>
          {error.title.includes("large") || error.title.includes("type") ? (
            <Button className="mt-2" size="sm" onClick={onChooseImage}>
              Choose another
            </Button>
          ) : null}
        </div>
      ) : null}

      <div className="flex items-center gap-2 pt-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          disabled={!hasDesign}
          className="shrink-0"
        >
          <IconReset className="size-3.5" />
          Reset
        </Button>
        <Button
          variant="whatsapp"
          size="sm"
          className="hidden min-w-0 flex-1 lg:inline-flex"
          onClick={onWhatsApp}
        >
          <IconChat className="size-3.5" />
          Send on WhatsApp
        </Button>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex justify-between text-[11px] font-semibold text-charcoal/45">
        {label}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-cream-deep accent-terracotta"
      />
    </label>
  );
}
