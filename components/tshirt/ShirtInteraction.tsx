"use client";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { hitToDesign } from "@/components/tshirt/DesignDecal";
import type { MoveTarget } from "@/types/tshirt";

export function ShirtInteraction({
  shirtRef,
  decalRef,
  hasDesign,
  moveTarget,
  locked,
  onPlace,
  onMoveTarget,
}: {
  shirtRef: React.RefObject<THREE.Mesh | null>;
  decalRef: React.RefObject<THREE.Mesh | null>;
  hasDesign: boolean;
  moveTarget: MoveTarget;
  locked: boolean;
  onPlace?: (next: { x: number; y: number }) => void;
  onMoveTarget?: (target: MoveTarget) => void;
}) {
  const { camera, gl, raycaster } = useThree();
  const placeRef = useRef(onPlace);
  const modeRef = useRef(onMoveTarget);
  const targetRef = useRef(moveTarget);
  const lockedRef = useRef(locked);
  const hasDesignRef = useRef(hasDesign);
  const dragging = useRef(false);

  placeRef.current = onPlace;
  modeRef.current = onMoveTarget;
  targetRef.current = moveTarget;
  lockedRef.current = locked;
  hasDesignRef.current = hasDesign;

  useEffect(() => {
    const el = gl.domElement;
    const pointer = new THREE.Vector2();

    function pick(event: PointerEvent) {
      const rect = el.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const objects = [decalRef.current, shirtRef.current].filter(
        (mesh): mesh is THREE.Mesh => Boolean(mesh),
      );
      return raycaster.intersectObjects(objects, false);
    }

    function place(hits: THREE.Intersection[]) {
      const shirt = shirtRef.current;
      if (!shirt || !placeRef.current) return;
      const hit =
        hits.find((item) => item.object === shirt) ??
        hits.find((item) => item.object === decalRef.current);
      if (!hit) return;
      const local = shirt.worldToLocal(hit.point.clone());
      placeRef.current(hitToDesign(local));
    }

    function onDown(event: PointerEvent) {
      if (event.button !== 0) return;
      const hits = pick(event);
      const hitDecal = hits.some((item) => item.object === decalRef.current);
      const hitShirt = hits.some((item) => item.object === shirtRef.current);
      const exclusiveImage = lockedRef.current && targetRef.current === "image";
      const exclusiveShirt = lockedRef.current && targetRef.current === "shirt";

      if (exclusiveShirt || !hasDesignRef.current) return;

      if (exclusiveImage && (hitShirt || hitDecal)) {
        event.stopImmediatePropagation();
        dragging.current = true;
        el.setPointerCapture(event.pointerId);
        place(hits);
        return;
      }

      if (!lockedRef.current && hitDecal) {
        event.stopImmediatePropagation();
        dragging.current = true;
        el.setPointerCapture(event.pointerId);
        modeRef.current?.("image");
        place(hits);
        return;
      }

      if (!lockedRef.current && hitShirt) {
        modeRef.current?.("shirt");
      }
    }

    function onMove(event: PointerEvent) {
      if (!dragging.current) return;
      event.stopImmediatePropagation();
      place(pick(event));
    }

    function onUp(event: PointerEvent) {
      if (!dragging.current) return;
      dragging.current = false;
      if (el.hasPointerCapture(event.pointerId)) {
        el.releasePointerCapture(event.pointerId);
      }
    }

    el.addEventListener("pointerdown", onDown, true);
    el.addEventListener("pointermove", onMove, true);
    el.addEventListener("pointerup", onUp, true);
    el.addEventListener("pointercancel", onUp, true);
    return () => {
      el.removeEventListener("pointerdown", onDown, true);
      el.removeEventListener("pointermove", onMove, true);
      el.removeEventListener("pointerup", onUp, true);
      el.removeEventListener("pointercancel", onUp, true);
    };
  }, [camera, gl, raycaster, shirtRef, decalRef]);

  return null;
}
