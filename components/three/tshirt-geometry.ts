import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

const SHIRT_PATH =
  "M200 46c-34 0-58 18-66 42L62 114c-22 10-38 30-32 52l26 62c4 10 16 12 24 4l24-22 10 228c4 30 38 46 86 46s82-16 86-46l10-228 24 22c8 8 20 6 24-4l26-62c6-22-10-42-32-52l-72-26c-8-24-32-42-66-42Z";

function inflateShirt(geometry: THREE.BufferGeometry) {
  const pos = geometry.attributes.position;
  const vertex = new THREE.Vector3();
  for (let i = 0; i < pos.count; i += 1) {
    vertex.fromBufferAttribute(pos, i);
    const x = vertex.x;
    const y = vertex.y;
    const sleeve = Math.abs(x) > 0.78 && y > 0.15;
    const hem = y < -0.85;
    const bodyWidth = sleeve ? 1.55 : 0.95;
    const nx = THREE.MathUtils.clamp(x / bodyWidth, -1, 1);
    const round = Math.sqrt(Math.max(0, 1 - nx * nx));
    const amount = sleeve ? 0.16 : hem ? 0.2 : 0.34;
    const sign = vertex.z >= 0 ? 1 : -1;
    vertex.z = sign * (Math.abs(vertex.z) + round * amount);
    pos.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }
  pos.needsUpdate = true;
  geometry.computeVertexNormals();
}

let cached: THREE.BufferGeometry | null = null;

export function createTShirtGeometry() {
  if (cached) return cached.clone();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><path d="${SHIRT_PATH}"/></svg>`;
  const loaded = new SVGLoader().parse(svg);
  const shapes = loaded.paths.flatMap((path) => SVGLoader.createShapes(path));
  const shape = shapes[0];
  if (!shape) {
    throw new Error("T-shirt shape failed to parse");
  }

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 18,
    bevelEnabled: true,
    bevelThickness: 6,
    bevelSize: 5,
    bevelOffset: 0,
    bevelSegments: 4,
    curveSegments: 28,
    steps: 1,
  });

  geometry.center();
  geometry.rotateX(Math.PI);
  geometry.scale(0.0052, 0.0052, 0.0052);
  inflateShirt(geometry);
  cached = geometry;
  return geometry.clone();
}

export function createFabricNormalMap() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#8080ff";
  ctx.fillRect(0, 0, size, size);
  const image = ctx.getImageData(0, 0, size, size);
  const data = image.data;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const i = (y * size + x) * 4;
      const n = 128 + Math.sin(x * 0.9) * 6 + Math.sin(y * 1.3) * 6;
      const weave = ((x + y) % 3) * 4;
      data[i] = n + weave;
      data[i + 1] = n - weave * 0.4;
      data[i + 2] = 255;
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 10);
  return texture;
}
