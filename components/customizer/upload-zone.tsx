"use client";

import { useRef } from "react";
import { IconUpload } from "@/components/brand/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function UploadZone({
  onFile,
  compact = false,
}: {
  onFile: (file: File) => void;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) onFile(file);
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
      }}
      onDrop={(event) => {
        event.preventDefault();
        handleFiles(event.dataTransfer.files);
      }}
      className={cn(
        "rounded-2xl border border-dashed border-terracotta/35 bg-cream text-center transition hover:border-terracotta/60 hover:bg-white",
        compact ? "px-3 py-3.5" : "p-5",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.png,.jpg,.jpeg,.webp"
        className="sr-only"
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
      />
      <div className="flex items-center gap-3 text-left">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-terracotta ring-1 ring-charcoal/8">
          <IconUpload className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Drop a design, or choose a file</p>
          <p className="text-[11px] text-charcoal/50">PNG, JPG or WEBP · max 10 MB</p>
        </div>
        <Button
          type="button"
          size="sm"
          className="shrink-0"
          onClick={() => inputRef.current?.click()}
        >
          Choose
        </Button>
      </div>
    </div>
  );
}
