"use client";

import { useLayoutEffect, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { PrintSide } from "@/types/tshirt";

export function CameraControls({
  side,
  autoRotate = false,
  enabled = true,
}: {
  side: PrintSide;
  autoRotate?: boolean;
  enabled?: boolean;
}) {
  const controls = useRef<OrbitControlsImpl>(null);

  useLayoutEffect(() => {
    const orbit = controls.current;
    if (!orbit) return;
    orbit.setAzimuthalAngle(side === "back" ? Math.PI : 0);
    orbit.setPolarAngle(Math.PI / 2.05);
    orbit.update();
  }, [side]);

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      minDistance={1.15}
      maxDistance={3.2}
      minPolarAngle={Math.PI / 3.6}
      maxPolarAngle={Math.PI / 1.7}
      target={[0, 0, 0]}
      enabled={enabled}
      autoRotate={autoRotate && enabled}
      autoRotateSpeed={0.7}
    />
  );
}
