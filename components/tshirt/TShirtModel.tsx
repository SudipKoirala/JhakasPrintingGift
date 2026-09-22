"use client";

import { useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { DesignDecal } from "@/components/tshirt/DesignDecal";
import { ShirtInteraction } from "@/components/tshirt/ShirtInteraction";
import type { DesignConfig, MoveTarget } from "@/types/tshirt";

const MODEL_PATH = "/models/shirt_baked.glb";
useGLTF.preload(MODEL_PATH);

export function TShirtModel({
  color,
  design,
  moveTarget = "shirt",
  locked = false,
  onPlace,
  onMoveTarget,
  enableDesignDrag = true,
}: {
  color: string;
  design: DesignConfig;
  moveTarget?: MoveTarget;
  locked?: boolean;
  onPlace?: (next: { x: number; y: number }) => void;
  onMoveTarget?: (target: MoveTarget) => void;
  enableDesignDrag?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const decalRef = useRef<THREE.Mesh>(null);
  const { scene } = useGLTF(MODEL_PATH);
  const shirt = scene.getObjectByName("T_Shirt_male");
  const baked =
    shirt instanceof THREE.Mesh
      ? (shirt.material as THREE.MeshStandardMaterial)
      : null;

  const map = baked?.map ?? null;
  if (map) {
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 16;
  }

  const sheen = useMemo(
    () => new THREE.Color(color).clone().offsetHSL(0, 0.04, 0.08),
    [color],
  );

  if (!(shirt instanceof THREE.Mesh)) return null;

  return (
    <mesh
      ref={meshRef}
      geometry={shirt.geometry}
      castShadow
      receiveShadow
      dispose={null}
    >
      <meshPhysicalMaterial
        map={map}
        color={color}
        roughness={0.92}
        metalness={0}
        sheen={0.45}
        sheenRoughness={0.82}
        sheenColor={sheen}
        clearcoat={0.02}
        clearcoatRoughness={0.85}
      />
      <DesignDecal ref={decalRef} design={design} />
      {enableDesignDrag ? (
        <ShirtInteraction
          shirtRef={meshRef}
          decalRef={decalRef}
          hasDesign={Boolean(design.image)}
          moveTarget={moveTarget}
          locked={locked}
          onPlace={onPlace}
          onMoveTarget={onMoveTarget}
        />
      ) : null}
    </mesh>
  );
}
