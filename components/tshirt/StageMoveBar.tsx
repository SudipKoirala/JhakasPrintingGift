"use client";

import {
  IconImage,
  IconLock,
  IconSpin,
  IconUnlock,
} from "@/components/brand/icons";
import { cn } from "@/lib/utils";
import type { MoveTarget } from "@/types/tshirt";

export function StageMoveBar({
  moveTarget,
  locked,
  hasDesign,
  onMoveTarget,
  onLocked,
}: {
  moveTarget: MoveTarget;
  locked: boolean;
  hasDesign: boolean;
  onMoveTarget: (target: MoveTarget) => void;
  onLocked: (locked: boolean) => void;
}) {
  return (
    <div className="mt-3 flex items-center gap-2">
      <div className="flex flex-1 rounded-full bg-white p-0.5 ring-1 ring-charcoal/10">
        <button
          type="button"
          onClick={() => onMoveTarget("shirt")}
          className={cn(
            "inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-full text-xs font-semibold transition",
            moveTarget === "shirt"
              ? "bg-charcoal text-cream"
              : "text-charcoal/60 hover:text-charcoal",
          )}
        >
          <IconSpin className="size-3.5" />
          Shirt
        </button>
        <button
          type="button"
          disabled={!hasDesign}
          onClick={() => onMoveTarget("image")}
          className={cn(
            "inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-full text-xs font-semibold transition disabled:opacity-35",
            moveTarget === "image"
              ? "bg-charcoal text-cream"
              : "text-charcoal/60 hover:text-charcoal",
          )}
        >
          <IconImage className="size-3.5" />
          Image
        </button>
      </div>
      <button
        type="button"
        onClick={() => onLocked(!locked)}
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold ring-1 transition",
          locked
            ? "bg-terracotta text-white ring-terracotta"
            : "bg-white text-charcoal/70 ring-charcoal/10 hover:text-charcoal",
        )}
        aria-pressed={locked}
      >
        {locked ? <IconLock className="size-3.5" /> : <IconUnlock className="size-3.5" />}
        {locked ? "Locked" : "Lock"}
      </button>
    </div>
  );
}
