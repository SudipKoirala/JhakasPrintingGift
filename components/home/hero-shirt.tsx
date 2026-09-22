"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ShirtStage } from "@/components/tshirt/ShirtStage";
import { featuredLook, loadAdminShirts, type ShirtProduct } from "@/lib/shirts";
import { DEFAULT_DESIGN } from "@/types/tshirt";

const TShirtCanvas = dynamic(
  () =>
    import("@/components/tshirt/TShirtCanvas").then((mod) => mod.TShirtCanvas),
  { ssr: false },
);

function lookToDesign(look: ShirtProduct | null) {
  const print = look?.frontPrint;
  if (!print?.image) {
    return { ...DEFAULT_DESIGN, image: "/samples/sun.svg" };
  }
  return {
    ...DEFAULT_DESIGN,
    image: print.image,
    x: print.x,
    y: print.y,
    scale: print.scale,
    side: "front" as const,
  };
}

export function HeroShirt() {
  const [autoRotate, setAutoRotate] = useState(true);
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

  return (
    <div
      className="relative mx-auto w-full max-w-[380px] sm:max-w-[460px] lg:max-w-[560px] xl:max-w-[620px]"
      onPointerEnter={() => setAutoRotate(false)}
      onPointerLeave={() => setAutoRotate(true)}
    >
      <ShirtStage showLiveBadge showDragHint>
        <TShirtCanvas
          className="h-[360px] w-full cursor-grab active:cursor-grabbing sm:h-[440px] lg:h-[520px] xl:h-[580px]"
          color={look?.hex ?? "#FFFFFF"}
          design={lookToDesign(look)}
          side="front"
          autoRotate={autoRotate}
          enableDesignDrag={false}
          background={null}
        />
      </ShirtStage>
    </div>
  );
}
