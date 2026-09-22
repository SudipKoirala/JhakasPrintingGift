"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { BackgroundMode, ShirtSize } from "@/lib/constants";
import { allShirts, loadAdminShirts, type ShirtProduct } from "@/lib/shirts";
import {
  DEFAULT_DESIGN,
  type DesignConfig,
  type PrintSide,
  type TShirtSession,
} from "@/types/tshirt";

const SESSION_KEY = "sparktee-studio-v1";

function loadSession(): TShirtSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as TShirtSession) : null;
  } catch {
    return null;
  }
}

function saveSession(state: TShirtSession) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
  } catch {
    // Quota or private mode — keep working in memory.
  }
}

export function useTShirtCustomization() {
  const restored = useRef(false);
  const [adminShirts, setAdminShirts] = useState<ShirtProduct[]>([]);
  const [originalDataUrl, setOriginalDataUrl] = useState<string | null>(null);
  const [removedDataUrl, setRemovedDataUrl] = useState<string | null>(null);
  const [background, setBackground] = useState<BackgroundMode>("original");
  const [shirtId, setShirtId] = useState("white");
  const [customHex, setCustomHex] = useState("#E87852");
  const [size, setSize] = useState<ShirtSize>("M");
  const [design, setDesign] = useState<DesignConfig>(DEFAULT_DESIGN);

  const shirts = useMemo(() => {
    const extras = [
      ...adminShirts,
      { id: "custom", name: "Custom", hex: customHex },
    ];
    return allShirts(extras);
  }, [adminShirts, customHex]);
  const shirt = shirts.find((item) => item.id === shirtId) ?? shirts[0];

  useEffect(() => {
    void (async () => {
      try {
        const response = await fetch("/api/catalog/shirts");
        const json = (await response.json()) as { items?: ShirtProduct[] };
        setAdminShirts(json.items?.length ? json.items : loadAdminShirts());
      } catch {
        setAdminShirts(loadAdminShirts());
      }
    })();
  }, []);

  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    const saved = loadSession() as
      | (TShirtSession & { view?: PrintSide })
      | null;
    if (!saved) return;
    setOriginalDataUrl(saved.originalDataUrl);
    setRemovedDataUrl(saved.removedDataUrl);
    setBackground(saved.background ?? "original");
    setShirtId(saved.shirtId || "white");
    if (saved.customHex) setCustomHex(saved.customHex);
    setSize(saved.size || "M");
    const image =
      saved.background === "removed" && saved.removedDataUrl
        ? saved.removedDataUrl
        : saved.originalDataUrl;
    setDesign({
      ...DEFAULT_DESIGN,
      ...saved.design,
      side: saved.design?.side ?? saved.view ?? "front",
      image,
    });
  }, []);

  useEffect(() => {
    if (!restored.current) return;
    saveSession({
      originalDataUrl,
      removedDataUrl,
      background,
      shirtId,
      customHex,
      size,
      design,
    });
  }, [
    originalDataUrl,
    removedDataUrl,
    background,
    shirtId,
    customHex,
    size,
    design,
  ]);

  const setDesignImage = useCallback((image: string | null) => {
    setDesign((current) => ({ ...current, image }));
  }, []);

  const updateDesign = useCallback((patch: Partial<DesignConfig>) => {
    setDesign((current) => ({ ...current, ...patch }));
  }, []);

  const setSide = useCallback((side: PrintSide) => {
    setDesign((current) => ({ ...current, side }));
  }, []);

  const resetDesign = useCallback(() => {
    setOriginalDataUrl(null);
    setRemovedDataUrl(null);
    setBackground("original");
    setDesign(DEFAULT_DESIGN);
  }, []);

  return {
    shirts,
    shirt,
    shirtId,
    setShirtId,
    customHex,
    setCustomHex,
    size,
    setSize,
    design,
    setDesignImage,
    updateDesign,
    setSide,
    originalDataUrl,
    setOriginalDataUrl,
    removedDataUrl,
    setRemovedDataUrl,
    background,
    setBackground,
    resetDesign,
  };
}
