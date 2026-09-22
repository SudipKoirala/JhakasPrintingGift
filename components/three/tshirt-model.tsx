"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Decal } from "@react-three/drei";
import * as THREE from "three";
import {
  createFabricNormalMap,
  createTShirtGeometry,
} from "@/components/three/tshirt-geometry";

function useImageTexture(src?: string | null) {
  const texture = useMemo(() => {
    if (!src) return null;
    const next = new THREE.TextureLoader().load(src);
    next.colorSpace = THREE.SRGBColorSpace;
    next.anisotropy = 8;
    return next;
  }, [src]);

  useEffect(() => {
    return () => {
      texture?.dispose();
    };
  }, [texture]);

  return texture;
}

export function TShirtModel({
  color,
  frontTexture,
  backTexture,
  designCanvas,
  designUrl,
}: {
  color: string;
  frontTexture?: string | null;
  backTexture?: string | null;
  designCanvas?: HTMLCanvasElement | null;
  designUrl?: string | null;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => createTShirtGeometry(), []);
  const normalMap = useMemo(() => createFabricNormalMap(), []);
  const frontMap = useImageTexture(frontTexture);
  const backMap = useImageTexture(backTexture);
  const designImage = useImageTexture(designUrl);

  const canvasTexture = useMemo(() => {
    if (!designCanvas) return null;
    const next = new THREE.CanvasTexture(designCanvas);
    next.colorSpace = THREE.SRGBColorSpace;
    next.flipY = true;
    return next;
  }, [designCanvas]);

  useFrame(() => {
    if (canvasTexture) canvasTexture.needsUpdate = true;
  });

  const material = useMemo(() => {
    const sheen = new THREE.Color(color).clone().offsetHSL(0, 0.02, 0.06);
    return new THREE.MeshPhysicalMaterial({
      color,
      roughness: 0.82,
      metalness: 0,
      sheen: 0.55,
      sheenRoughness: 0.88,
      sheenColor: sheen,
      clearcoat: 0.04,
      clearcoatRoughness: 0.7,
      normalMap: normalMap ?? undefined,
      normalScale: new THREE.Vector2(0.18, 0.18),
    });
  }, [color, normalMap]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
      normalMap?.dispose();
      canvasTexture?.dispose();
    };
  }, [geometry, material, normalMap, canvasTexture]);

  const liveDesign = canvasTexture ?? designImage;

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      castShadow
      receiveShadow
    >
      {frontMap ? (
        <Decal
          position={[0, 0.05, 0.22]}
          rotation={[0, 0, 0]}
          scale={[1.45, 1.85, 1]}
        >
          <meshPhysicalMaterial
            map={frontMap}
            transparent
            roughness={0.78}
            metalness={0}
            polygonOffset
            polygonOffsetFactor={-1}
          />
        </Decal>
      ) : null}
      {backMap ? (
        <Decal
          position={[0, 0.05, -0.22]}
          rotation={[0, Math.PI, 0]}
          scale={[1.45, 1.85, 1]}
        >
          <meshPhysicalMaterial
            map={backMap}
            transparent
            roughness={0.78}
            metalness={0}
            polygonOffset
            polygonOffsetFactor={-1}
          />
        </Decal>
      ) : null}
      {liveDesign ? (
        <Decal
          position={[0, 0.22, 0.3]}
          rotation={[0, 0, 0]}
          scale={[0.52, 0.58, 0.5]}
        >
          <meshPhysicalMaterial
            map={liveDesign}
            transparent
            roughness={0.7}
            metalness={0}
            polygonOffset
            polygonOffsetFactor={-2}
          />
        </Decal>
      ) : null}
    </mesh>
  );
}
