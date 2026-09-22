"use client";

import { fileToDataUrl } from "@/lib/utils";

/** Browser-safe BiRefNet (MIT). Full 1024 models OOM in-tab; 512×512 is the one that actually runs. */
const MODEL_ID = "onnx-community/BiRefNet_512x512-ONNX";

type Cutout = {
  toBlob: (type?: string, quality?: number) => Promise<Blob>;
};

let pipelinePromise: Promise<(input: string) => Promise<Cutout>> | null = null;

export function canRunBirefnet() {
  if (typeof navigator === "undefined") return false;
  if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) return false;
  return "gpu" in navigator;
}

async function loadPipeline() {
  const { pipeline, env } = await import("@huggingface/transformers");
  env.allowLocalModels = false;
  env.useBrowserCache = true;

  const segmenter = await pipeline("background-removal", MODEL_ID, {
    device: "webgpu",
    dtype: "fp16",
  });

  return async (input: string) => {
    const output = await segmenter(input);
    const cutout = Array.isArray(output) ? output[0] : output;
    return cutout as Cutout;
  };
}

function getPipeline() {
  if (!pipelinePromise) {
    pipelinePromise = loadPipeline().catch((error) => {
      pipelinePromise = null;
      throw error;
    });
  }
  return pipelinePromise;
}

export async function removeWithBirefnet(dataUrl: string) {
  const segmenter = await getPipeline();
  const cutout = await segmenter(dataUrl);
  const blob = await cutout.toBlob("image/png");
  return fileToDataUrl(new File([blob], "removed.png", { type: "image/png" }));
}

export function preloadBirefnet() {
  if (!canRunBirefnet()) return;
  void getPipeline().catch(() => {
    // First click will try again.
  });
}
