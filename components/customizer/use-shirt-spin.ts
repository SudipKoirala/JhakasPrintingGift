import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";

function wrapDeg(value: number) {
  return ((value % 360) + 360) % 360;
}

export function facingFromRotation(rotation: number): "front" | "back" {
  const angle = wrapDeg(rotation);
  return angle > 90 && angle < 270 ? "back" : "front";
}

export function turntableLayers(rotation: number) {
  const rad = (rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const frontAmount = Math.max(0, cos);
  const backAmount = Math.max(0, -cos);
  const sideAmount = Math.abs(sin);

  return {
    frontScale: Math.max(0.04, frontAmount),
    backScale: Math.max(0.04, backAmount),
    frontOpacity: Math.pow(frontAmount, 0.55),
    backOpacity: Math.pow(backAmount, 0.55),
    sideOpacity: Math.pow(sideAmount, 1.15),
    sideScale: 0.22 + sideAmount * 0.78,
    sideFlip: sin < 0,
    shadowScale: 0.42 + Math.abs(cos) * 0.58,
    canEdit: frontAmount > 0.62,
  };
}

export function useShirtSpin(initial = 0) {
  const [rotation, setRotationState] = useState(initial);
  const rotationRef = useRef(initial);
  const velocityRef = useRef(0);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const inertiaRef = useRef<number>(0);
  const snapRef = useRef<number>(0);

  const setRotation = useCallback((value: number) => {
    rotationRef.current = value;
    setRotationState(value);
  }, []);

  const stopMotion = useCallback(() => {
    cancelAnimationFrame(inertiaRef.current);
    cancelAnimationFrame(snapRef.current);
  }, []);

  const snapTo = useCallback(
    (target: number) => {
      stopMotion();
      const tick = () => {
        const current = rotationRef.current;
        let delta = wrapDeg(target - current);
        if (delta > 180) delta -= 360;
        if (Math.abs(delta) < 0.4) {
          setRotation(wrapDeg(target));
          return;
        }
        setRotation(current + delta * 0.16);
        snapRef.current = requestAnimationFrame(tick);
      };
      snapRef.current = requestAnimationFrame(tick);
    },
    [setRotation, stopMotion],
  );

  useEffect(() => () => stopMotion(), [stopMotion]);

  const bind = {
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      if ((event.target as HTMLElement).closest("[data-no-spin]")) return;
      stopMotion();
      draggingRef.current = true;
      lastXRef.current = event.clientX;
      velocityRef.current = 0;
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    onPointerMove: (event: PointerEvent<HTMLElement>) => {
      if (!draggingRef.current) return;
      const dx = event.clientX - lastXRef.current;
      lastXRef.current = event.clientX;
      velocityRef.current = dx * 0.52;
      setRotation(rotationRef.current + dx * 0.52);
    },
    onPointerUp: () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      const tick = () => {
        if (draggingRef.current) return;
        velocityRef.current *= 0.93;
        if (Math.abs(velocityRef.current) < 0.12) return;
        setRotation(rotationRef.current + velocityRef.current);
        inertiaRef.current = requestAnimationFrame(tick);
      };
      inertiaRef.current = requestAnimationFrame(tick);
    },
    onPointerCancel: () => {
      draggingRef.current = false;
    },
  };

  return {
    rotation: wrapDeg(rotation),
    rawRotation: rotation,
    getRotation: () => rotationRef.current,
    setRotation,
    snapTo,
    bind,
  };
}
