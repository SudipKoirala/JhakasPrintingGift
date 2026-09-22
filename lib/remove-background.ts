"use client";

import { dataUrlToBlob, fileToDataUrl } from "@/lib/utils";
import {
  canRunBirefnet,
  preloadBirefnet,
  removeWithBirefnet,
} from "@/lib/birefnet-remove";

function prefersGpu() {
  return typeof navigator !== "undefined" && "gpu" in navigator;
}

function imglyOptions() {
  const mobile =
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  return {
    model: prefersGpu() && !mobile ? ("isnet" as const) : ("isnet_fp16" as const),
    device: prefersGpu() ? ("gpu" as const) : ("cpu" as const),
    output: { format: "image/png" as const, quality: 0.95 },
  };
}

async function removeWithImgly(dataUrl: string) {
  const { removeBackground } = await import("@imgly/background-removal");
  const cleaned = await removeBackground(dataUrl, imglyOptions());
  return fileToDataUrl(new File([cleaned], "removed.png", { type: "image/png" }));
}

async function removeWithCloud(dataUrl: string) {
  const blob = dataUrlToBlob(dataUrl);
  const form = new FormData();
  form.append("image", blob, "design.png");
  const response = await fetch("/api/remove-bg", {
    method: "POST",
    body: form,
  });
  if (!response.ok) return null;
  const cleaned = await response.blob();
  return fileToDataUrl(new File([cleaned], "removed.png", { type: "image/png" }));
}

export async function removeImageBackground(dataUrl: string): Promise<string> {
  if (canRunBirefnet()) {
    try {
      return await removeWithBirefnet(dataUrl);
    } catch {
      // Fall through to the lighter in-browser model.
    }
  }

  try {
    return await removeWithImgly(dataUrl);
  } catch {
    const cloud = await removeWithCloud(dataUrl);
    if (cloud) return cloud;
    throw new Error("background_removal_failed");
  }
}

export function preloadBackgroundRemoval() {
  if (canRunBirefnet()) {
    preloadBirefnet();
    return;
  }
  void import("@imgly/background-removal")
    .then(({ preload }) => preload(imglyOptions()))
    .catch(() => {
      // Model will download on the first click instead.
    });
}
