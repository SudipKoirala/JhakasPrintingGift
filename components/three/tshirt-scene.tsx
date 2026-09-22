"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { TShirtModel } from "@/components/three/tshirt-model";

export function TShirtScene({
  color,
  rotation = 0,
  frontTexture,
  backTexture,
  designCanvas,
  designUrl,
  className,
  background = "#FFF9F2",
}: {
  color: string;
  rotation?: number;
  frontTexture?: string | null;
  backTexture?: string | null;
  designCanvas?: HTMLCanvasElement | null;
  designUrl?: string | null;
  className?: string;
  background?: string | null;
}) {
  return (
    <div className={className}>
      <Canvas
        shadows
        dpr={[1, 1.8]}
        camera={{ position: [0, 0.15, 3.35], fov: 32 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      >
        {background ? <color attach="background" args={[background]} /> : null}
        <ambientLight intensity={0.55} />
        <directionalLight
          position={[2.4, 3.2, 2.8]}
          intensity={1.35}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-2.2, 1.4, 1.2]} intensity={0.35} />
        <directionalLight position={[0, 1.5, -2.4]} intensity={0.25} />
        <Environment preset="warehouse" environmentIntensity={0.35} />
        <group rotation={[0.1, (rotation * Math.PI) / 180, 0]}>
          <TShirtModel
            color={color}
            frontTexture={frontTexture}
            backTexture={backTexture}
            designCanvas={designCanvas}
            designUrl={designUrl}
          />
        </group>
        <ContactShadows
          position={[0, -1.35, 0]}
          opacity={0.32}
          scale={4.2}
          blur={2.4}
          far={2.4}
        />
      </Canvas>
    </div>
  );
}
