"use client";

import type { ReactNode } from "react";
import { IconHand } from "@/components/brand/icons";
import { cn } from "@/lib/utils";

export function ShirtStage({
  children,
  className,
  showLiveBadge = false,
  showDragHint = false,
  compact = false,
}: {
  children: ReactNode;
  className?: string;
  showLiveBadge?: boolean;
  showDragHint?: boolean;
  compact?: boolean;
}) {
  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "relative overflow-hidden ring-1 ring-charcoal/8",
          compact ? "rounded-[28px]" : "rounded-[40px]",
        )}
        style={{
          background:
            "radial-gradient(circle at 50% 45%, #ffffff 0%, #fcf8f1 45%, #f6ede2 100%)",
        }}
      >
        {children}
        {showLiveBadge ? (
          <div
            className={cn(
              "pointer-events-none absolute z-10 inline-flex items-center gap-1.5 rounded-full bg-white font-semibold text-charcoal shadow-[0_8px_20px_rgba(41,38,36,0.08)] ring-1 ring-charcoal/8",
              compact
                ? "top-3 right-3 px-2.5 py-1 text-[10px]"
                : "top-4 right-4 px-3 py-1.5 text-xs",
            )}
          >
            <span className="relative grid size-2 place-items-center">
              <span className="absolute size-2 animate-ping rounded-full bg-[#7CDB3A]/70" />
              <span className="relative size-1.5 rounded-full bg-[#7CDB3A]" />
            </span>
            Live 3D
          </div>
        ) : null}
        {showDragHint ? (
          <div
            className={cn(
              "pointer-events-none absolute z-10 inline-flex items-center gap-1.5 rounded-full bg-white font-semibold text-charcoal shadow-[0_8px_20px_rgba(41,38,36,0.08)] ring-1 ring-charcoal/8",
              compact
                ? "bottom-3 left-3 px-2.5 py-1 text-[10px]"
                : "bottom-4 left-4 px-3 py-1.5 text-xs",
            )}
          >
            <IconHand className={cn(compact ? "size-3.5" : "size-4", "text-charcoal/70")} />
            Drag to spin 360°
          </div>
        ) : null}
      </div>
    </div>
  );
}
