"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Canvas, FabricImage } from "fabric";

function styleDefaults(InteractiveFabricObject: {
  ownDefaults: Record<string, unknown>;
}) {
  InteractiveFabricObject.ownDefaults.transparentCorners = false;
  InteractiveFabricObject.ownDefaults.cornerColor = "#E87852";
  InteractiveFabricObject.ownDefaults.cornerStrokeColor = "#ffffff";
  InteractiveFabricObject.ownDefaults.borderColor = "#E87852";
  InteractiveFabricObject.ownDefaults.cornerSize = 14;
  InteractiveFabricObject.ownDefaults.cornerStyle = "circle";
  InteractiveFabricObject.ownDefaults.padding = 8;
  InteractiveFabricObject.ownDefaults.borderScaleFactor = 2;
}

export function useDesignCanvas() {
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<Canvas | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let disposed = false;
    let observer: ResizeObserver | undefined;
    let canvas: Canvas | undefined;

    async function setup() {
      const el = canvasElRef.current;
      const wrap = wrapRef.current;
      if (!el || !wrap) return;

      const fabric = await import("fabric");
      if (disposed) return;

      styleDefaults(fabric.InteractiveFabricObject);

      const rect = wrap.getBoundingClientRect();
      canvas = new fabric.Canvas(el, {
        width: Math.max(Math.floor(rect.width), 1),
        height: Math.max(Math.floor(rect.height), 1),
        selection: false,
        preserveObjectStacking: true,
        allowTouchScrolling: true,
        backgroundColor: "transparent",
      });
      canvasRef.current = canvas;
      setReady(true);

      observer = new ResizeObserver(() => {
        if (!canvas || !wrapRef.current) return;
        const next = wrapRef.current.getBoundingClientRect();
        canvas.setDimensions({
          width: Math.max(Math.floor(next.width), 1),
          height: Math.max(Math.floor(next.height), 1),
        });
        canvas.requestRenderAll();
      });
      observer.observe(wrap);
    }

    void setup();

    return () => {
      disposed = true;
      observer?.disconnect();
      canvas?.dispose();
      canvasRef.current = null;
      setReady(false);
    };
  }, []);

  const getDesignObject = useCallback(() => {
    return canvasRef.current?.getObjects()[0] as FabricImage | undefined;
  }, []);

  const addImage = useCallback(async (dataUrl: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { FabricImage } = await import("fabric");
    canvas.getObjects().forEach((obj) => canvas.remove(obj));
    const img = await FabricImage.fromURL(dataUrl);
    const maxW = canvas.getWidth() * 0.78;
    const maxH = canvas.getHeight() * 0.78;
    img.scaleToWidth(maxW);
    if (img.getScaledHeight() > maxH) {
      img.scaleToHeight(maxH);
    }
    canvas.add(img);
    canvas.centerObject(img);
    canvas.setActiveObject(img);
    canvas.requestRenderAll();
  }, []);

  const replaceImageKeepTransform = useCallback(async (dataUrl: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const current = canvas.getObjects()[0] as FabricImage | undefined;
    const { FabricImage } = await import("fabric");
    const img = await FabricImage.fromURL(dataUrl);
    if (current) {
      img.set({
        left: current.left,
        top: current.top,
        angle: current.angle,
        originX: current.originX,
        originY: current.originY,
      });
      const targetWidth = current.getScaledWidth();
      img.scaleToWidth(targetWidth);
      canvas.remove(current);
    } else {
      img.scaleToWidth(canvas.getWidth() * 0.78);
      canvas.centerObject(img);
    }
    canvas.add(img);
    canvas.setActiveObject(img);
    canvas.requestRenderAll();
  }, []);

  const clearDesign = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getObjects().forEach((obj) => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }, []);

  const exportDesignPng = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.getObjects().length === 0) return null;
    const active = canvas.getActiveObject();
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    const dataUrl = canvas.toDataURL({
      format: "png",
      multiplier: 2,
      enableRetinaScaling: true,
    });
    if (active) {
      canvas.setActiveObject(active);
      canvas.requestRenderAll();
    }
    return dataUrl;
  }, []);

  return {
    canvasElRef,
    wrapRef,
    canvasRef,
    ready,
    addImage,
    replaceImageKeepTransform,
    clearDesign,
    exportDesignPng,
    getDesignObject,
  };
}
