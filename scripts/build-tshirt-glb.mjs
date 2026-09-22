import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

const { JSDOM } = createRequire(import.meta.url)("jsdom");
const { window } = new JSDOM("<!DOCTYPE html><html></html>", {
  contentType: "text/html",
});
globalThis.DOMParser = window.DOMParser;
globalThis.Document = window.Document;
globalThis.FileReader = class FileReader {
  result = null;
  onload = null;
  onloadend = null;
  onerror = null;
  readAsArrayBuffer(blob) {
    Promise.resolve(blob.arrayBuffer())
      .then((buffer) => {
        this.result = buffer;
        this.onload?.({ target: this });
        this.onloadend?.({ target: this });
      })
      .catch((error) => {
        this.onerror?.(error);
      });
  }
};

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SHIRT_PATH =
  "M200 46c-34 0-58 18-66 42L62 114c-22 10-38 30-32 52l26 62c4 10 16 12 24 4l24-22 10 228c4 30 38 46 86 46s82-16 86-46l10-228 24 22c8 8 20 6 24-4l26-62c6-22-10-42-32-52l-72-26c-8-24-32-42-66-42Z";

function inflateShirt(geometry) {
  const pos = geometry.attributes.position;
  const vertex = new THREE.Vector3();
  for (let i = 0; i < pos.count; i += 1) {
    vertex.fromBufferAttribute(pos, i);
    const sleeve = Math.abs(vertex.x) > 0.78 && vertex.y > 0.15;
    const hem = vertex.y < -0.85;
    const bodyWidth = sleeve ? 1.55 : 0.95;
    const nx = THREE.MathUtils.clamp(vertex.x / bodyWidth, -1, 1);
    const round = Math.sqrt(Math.max(0, 1 - nx * nx));
    const amount = sleeve ? 0.16 : hem ? 0.2 : 0.34;
    const sign = vertex.z >= 0 ? 1 : -1;
    vertex.z = sign * (Math.abs(vertex.z) + round * amount);
    pos.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }
  pos.needsUpdate = true;
  geometry.computeVertexNormals();
}

function createShirtGeometry() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><path d="${SHIRT_PATH}"/></svg>`;
  const loaded = new SVGLoader().parse(svg);
  const shapes = loaded.paths.flatMap((path) => SVGLoader.createShapes(path));
  const geometry = new THREE.ExtrudeGeometry(shapes[0], {
    depth: 18,
    bevelEnabled: true,
    bevelThickness: 6,
    bevelSize: 5,
    bevelSegments: 2,
    curveSegments: 16,
  });
  geometry.center();
  geometry.rotateX(Math.PI);
  geometry.scale(0.0052, 0.0052, 0.0052);
  inflateShirt(geometry);
  return geometry;
}

function crc32(buf) {
  let crc = ~0;
  for (let i = 0; i < buf.length; i += 1) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j += 1) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return ~crc >>> 0;
}

function chunk(type, data) {
  const header = Buffer.alloc(8);
  header.writeUInt32BE(data.length, 0);
  header.write(type, 4);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([header.subarray(4), data])), 0);
  return Buffer.concat([header, data, crc]);
}

function writePng(path, size, pixel) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y += 1) {
    raw[(size * 4 + 1) * y] = 0;
    for (let x = 0; x < size; x += 1) {
      const [r, g, b] = pixel(x, y, size);
      const o = (size * 4 + 1) * y + 1 + x * 4;
      raw[o] = r;
      raw[o + 1] = g;
      raw[o + 2] = b;
      raw[o + 3] = 255;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
  writeFileSync(path, png);
}

async function exportGlb() {
  const scene = new THREE.Scene();
  const mesh = new THREE.Mesh(
    createShirtGeometry(),
    new THREE.MeshStandardMaterial({
      color: 0xf3eee6,
      roughness: 0.82,
      metalness: 0,
      name: "Fabric",
    }),
  );
  mesh.name = "TShirt";
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  const front = new THREE.Object3D();
  front.name = "FrontPrint";
  front.position.set(0, 0.18, 0.3);

  const back = new THREE.Object3D();
  back.name = "BackPrint";
  back.position.set(0, 0.18, -0.3);
  back.rotation.y = Math.PI;

  scene.add(mesh, front, back);

  const exporter = new GLTFExporter();
  const result = await exporter.parseAsync(scene, { binary: true });
  const models = join(root, "public", "models");
  mkdirSync(models, { recursive: true });
  writeFileSync(join(models, "tshirt.glb"), Buffer.from(result));
}

function exportTextures() {
  const dir = join(root, "public", "textures", "fabric");
  mkdirSync(dir, { recursive: true });
  const size = 512;

  writePng(join(dir, "color.png"), size, (x, y) => {
    const weave = ((x + y) % 6) * 1.4;
    return [248 - weave, 246 - weave * 0.6, 242 - weave * 0.4];
  });
  writePng(join(dir, "normal.png"), size, (x, y) => {
    const n = 128 + Math.sin(x * 0.7) * 8 + Math.sin(y * 1.1) * 8;
    const weave = ((x + y) % 4) * 3;
    return [n + weave, n - weave * 0.4, 255];
  });
  writePng(join(dir, "roughness.png"), size, (x, y) => {
    const v = 188 + ((x * 13 + y * 7) % 18);
    return [v, v, v];
  });
  writePng(join(dir, "ao.png"), size, (x, y, s) => {
    const cx = x / s - 0.5;
    const cy = y / s - 0.5;
    const v = 230 - Math.hypot(cx, cy) * 40;
    return [v, v, v];
  });
}

exportTextures();
await exportGlb();
console.log("Wrote public/models/tshirt.glb and fabric PBR maps");
