"use client";

import { Suspense, type Ref } from "react";
import { Canvas } from "@react-three/fiber";
import {
  AccumulativeShadows,
  Center,
  Environment,
  RandomizedLight,
} from "@react-three/drei";
import { CameraControls } from "@/components/tshirt/CameraControls";
import { TShirtModel } from "@/components/tshirt/TShirtModel";
import type { DesignConfig, MoveTarget, PrintSide } from "@/types/tshirt";

export function TShirtCanvas({
  color,
  design,
  side,
  className,
  background = "#FFFFFF",
  autoRotate = false,
  enableOrbit = true,
  stageRef,
  onPlace,
  moveTarget = "shirt",
  locked = false,
  onMoveTarget,
  enableDesignDrag = true,
}: {
  color: string;
  design: DesignConfig;
  side: PrintSide;
  className?: string;
  background?: string | null;
  autoRotate?: boolean;
  enableOrbit?: boolean;
  enableDesignDrag?: boolean;
  stageRef?: Ref<HTMLDivElement>;
  onPlace?: (next: { x: number; y: number }) => void;
  moveTarget?: MoveTarget;
  locked?: boolean;
  onMoveTarget?: (target: MoveTarget) => void;
}) {
  return (
    <div ref={stageRef} className={className}>
      <Canvas
        shadows
        className="touch-none"
        dpr={[1, 1.8]}
        camera={{ position: [0, 0.05, 2.15], fov: 25 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        style={{ touchAction: "none" }}
      >
        {background ? <color attach="background" args={[background]} /> : null}
        <ambientLight intensity={0.45} />
        <Suspense fallback={null}>
          <Environment preset="city" environmentIntensity={0.7} />
          <AccumulativeShadows
            temporal
            frames={48}
            alphaTest={0.85}
            scale={8}
            opacity={0.55}
            color="#292624"
            rotation={[Math.PI / 2, 0, 0]}
            position={[0, 0, -0.14]}
          >
            <RandomizedLight
              amount={4}
              radius={9}
              ambient={0.35}
              intensity={2.4}
              position={[5, 5, -9]}
            />
            <RandomizedLight
              amount={4}
              radius={5}
              ambient={0.45}
              intensity={1.2}
              position={[-5, 5, -8]}
            />
          </AccumulativeShadows>
          <Center>
            <TShirtModel
              color={color}
              design={design}
              moveTarget={moveTarget}
              locked={locked}
              onPlace={onPlace}
              onMoveTarget={onMoveTarget}
              enableDesignDrag={enableDesignDrag}
            />
          </Center>
        </Suspense>
        {enableOrbit ? (
          <CameraControls
            side={side}
            autoRotate={autoRotate}
            enabled={!locked || moveTarget === "shirt"}
          />
        ) : null}
      </Canvas>
    </div>
  );
}
