"use client";

import { useRef } from "react";
import { IconUpload } from "@/components/brand/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FilePickButton({
  label = "Choose from files",
  accept = "image/png,image/jpeg,image/webp",
  multiple = false,
  disabled = false,
  className,
  onFiles,
}: {
  label?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  onFiles: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        disabled={disabled}
        onChange={(event) => {
          const files = event.target.files ? Array.from(event.target.files) : [];
          if (files.length) onFiles(files);
          event.target.value = "";
        }}
      />
      <Button
        type="button"
        size="lg"
        disabled={disabled}
        className={cn("w-full text-base", className)}
        onClick={() => inputRef.current?.click()}
      >
        <IconUpload className="size-5" />
        {label}
      </Button>
    </>
  );
}
