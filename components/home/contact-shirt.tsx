"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { featuredLook, loadAdminShirts, type ShirtProduct } from "@/lib/shirts";
import { DEFAULT_DESIGN } from "@/types/tshirt";

const TShirtCanvas = dynamic(
  () =>
    import("@/components/tshirt/TShirtCanvas").then((mod) => mod.TShirtCanvas),
  { ssr: false },
);

export function ContactShirt() {
  const [look, setLook] = useState<ShirtProduct | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const response = await fetch("/api/catalog/shirts");
        const json = (await response.json()) as { items?: ShirtProduct[] };
        const remote = json.items ?? [];
        setLook(featuredLook([...loadAdminShirts(), ...remote]));
      } catch {
        setLook(featuredLook(loadAdminShirts()));
      }
    })();
  }, []);

  const print = look?.frontPrint;

  return (
    <TShirtCanvas
      className="h-56 w-56 cursor-grab active:cursor-grabbing"
      color={look?.hex ?? "#FFFFFF"}
      design={
        print?.image
          ? {
              ...DEFAULT_DESIGN,
              image: print.image,
              x: print.x,
              y: print.y,
              scale: print.scale,
            }
          : { ...DEFAULT_DESIGN, image: "/samples/sun.svg" }
      }
      side="front"
      autoRotate
      background={null}
      enableDesignDrag={false}
    />
  );
}
