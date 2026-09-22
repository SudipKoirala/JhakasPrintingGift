"use client";

import { forwardRef, useLayoutEffect, useRef } from "react";
import { useEffect, useState } from "react";
import { Decal } from "@react-three/drei";
import * as THREE from "three";
import type { DesignConfig, PrintSide } from "@/types/tshirt";

export const PRINT_SPAN_X = 0.38;
export const PRINT_SPAN_Y = 0.44;

function useReadyTexture(src?: string | null) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!src) {
      setTexture(null);
      return;
    }

    let cancelled = false;
    const image = new Image();
    image.onload = () => {
      if (cancelled) return;
      const next = new THREE.Texture(image);
      next.colorSpace = THREE.SRGBColorSpace;
      next.anisotropy = 16;
      next.flipY = false;
      next.needsUpdate = true;
      setTexture(next);
    };
    image.onerror = () => {
      if (!cancelled) setTexture(null);
    };
    image.src = src;

    return () => {
      cancelled = true;
    };
  }, [src]);

  useEffect(() => {
    return () => {
      texture?.dispose();
    };
  }, [texture]);

  return texture;
}

export function designToPosition(
  design: DesignConfig,
): [number, number, number] {
  return [
    design.x * PRINT_SPAN_X,
    design.y * PRINT_SPAN_Y,
    design.side === "back" ? -0.1 : 0.1,
  ];
}

export function hitToDesign(local: THREE.Vector3): { x: number; y: number } {
  return {
    x: THREE.MathUtils.clamp(local.x / PRINT_SPAN_X, -1.2, 1.2),
    y: THREE.MathUtils.clamp(local.y / PRINT_SPAN_Y, -1.2, 1.2),
  };
}

function clipDecalToSide(mesh: THREE.Mesh, side: PrintSide) {
  const geometry = mesh.geometry;
  const position = geometry.attributes.position;
  if (!position) return;

  const forward = new THREE.Vector3(0, 0, side === "back" ? -1 : 1);
  const ab = new THREE.Vector3();
  const ac = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const va = new THREE.Vector3();
  const vb = new THREE.Vector3();
  const vc = new THREE.Vector3();

  function facing(a: number, b: number, c: number) {
    va.fromBufferAttribute(position, a);
    vb.fromBufferAttribute(position, b);
    vc.fromBufferAttribute(position, c);
    ab.subVectors(vb, va);
    ac.subVectors(vc, va);
    normal.crossVectors(ab, ac).normalize();
    return normal.dot(forward) > 0.02;
  }

  const index = geometry.index;
  const next: number[] = [];
  if (index) {
    const src = index.array;
    for (let i = 0; i < src.length; i += 3) {
      const a = src[i];
      const b = src[i + 1];
      const c = src[i + 2];
      if (facing(a, b, c)) next.push(a, b, c);
    }
  } else {
    for (let i = 0; i < position.count; i += 3) {
      if (facing(i, i + 1, i + 2)) next.push(i, i + 1, i + 2);
    }
  }
  geometry.setIndex(next);
  geometry.computeVertexNormals();
}

export const DesignDecal = forwardRef<THREE.Mesh, { design: DesignConfig }>(
  function DesignDecal({ design }, ref) {
    const localRef = useRef<THREE.Mesh>(null);
    const texture = useReadyTexture(design.image);

    useLayoutEffect(() => {
      const mesh = localRef.current;
      if (!mesh?.geometry) return;
      clipDecalToSide(mesh, design.side);
    }, [
      design.side,
      design.x,
      design.y,
      design.scale,
      design.rotation,
      design.image,
      texture,
    ]);

    if (!texture) return null;

    const image = texture.image as { width?: number; height?: number };
    const aspect = Math.max(
      0.35,
      Math.min(2.8, (image.width || 1) / (image.height || 1)),
    );
    const height = 0.3 * design.scale;
    const width = height * aspect;
    const limit = 0.48 * Math.max(design.scale, 0.7);
    const fit = Math.min(1, limit / Math.max(width, height));

    return (
      <Decal
        ref={(node) => {
          localRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        position={designToPosition(design)}
        rotation={design.rotation}
        scale={[width * fit, height * fit, 0.24]}
        map={texture}
        depthTest
        polygonOffsetFactor={-8}
      />
    );
  },
);

export function FabricDecal({
  src,
  position = [0, 0, 0],
  rotation = 0,
  full = false,
}: {
  src?: string | null;
  position?: [number, number, number];
  rotation?: number | [number, number, number];
  full?: boolean;
}) {
  const texture = useReadyTexture(src);
  if (!texture) return null;

  return (
    <Decal
      position={position}
      rotation={rotation}
      scale={full ? 1 : [1.45, 1.85, 1]}
      map={texture}
      depthTest={false}
    />
  );
}
