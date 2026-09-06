/**
 * Original model, traced only from the supplied 400 × 400 character drawing.
 * Run: pnpm run model:rebacchi (Node 24; no Blender or browser required).
 * Coordinates deliberately preserve the asymmetric silhouette and smiling eyes.
 */
import { mkdir, writeFile } from "node:fs/promises";
import {
  CatmullRomCurve3,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Scene,
  Shape,
  SphereGeometry,
  TubeGeometry,
  Vector3,
  type BufferGeometry,
  type Material,
} from "three";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import {
  mergeGeometries,
  mergeVertices,
  toCreasedNormals,
} from "three/addons/utils/BufferGeometryUtils.js";

// GLTFExporter only needs this Blob → ArrayBuffer operation for texture-free GLB.
Object.defineProperty(globalThis, "FileReader", {
  value: class {
    result: ArrayBuffer | null = null;
    onloadend: (() => void) | null = null;
    async readAsArrayBuffer(blob: Blob) {
      this.result = await blob.arrayBuffer();
      this.onloadend?.();
    }
  },
});

type Command = ["M" | "L" | "Q" | "C" | "Z", ...number[]];
const body: Command[] = [
  ["M", 57, 172],
  ["Q", 136, 169, 214, 170],
  ["Q", 300, 170, 354, 173],
  ["Q", 343, 177, 333, 185],
  ["L", 278, 228],
  ["Q", 259, 243, 255, 249],
  ["Q", 299, 264, 324, 284],
  ["Q", 336, 311, 342, 335],
  ["Q", 343, 340, 337, 338],
  ["L", 156, 284],
  ["Q", 150, 283, 155, 279],
  ["Q", 187, 263, 201, 237],
  ["Q", 208, 224, 211, 215],
  ["Q", 174, 220, 129, 221],
  ["Q", 124, 222, 121, 227],
  ["L", 106, 249],
  ["Q", 103, 253, 102, 248],
  ["Q", 96, 223, 88, 210],
  ["L", 79, 192],
  ["Q", 73, 181, 57, 172],
  ["Z"],
];
const crest: Command[] = [
  ["M", 183, 49],
  ["Q", 179, 69, 162, 105],
  ["Q", 150, 122, 154, 132],
  ["Q", 161, 143, 176, 154],
  ["L", 237, 154],
  ["Q", 241, 154, 239, 149],
  ["Q", 228, 120, 215, 105],
  ["Q", 193, 79, 183, 49],
  ["Z"],
];

function shapeFrom(commands: Command[]) {
  const shape = new Shape();
  const x = (value: number) => (value - 205) / 100;
  const y = (value: number) => (200 - value) / 100;
  for (const [op, ...v] of commands) {
    switch (op) {
      case "M":
        shape.moveTo(x(v[0]), y(v[1]));
        break;
      case "L":
        shape.lineTo(x(v[0]), y(v[1]));
        break;
      case "Q":
        shape.quadraticCurveTo(x(v[0]), y(v[1]), x(v[2]), y(v[3]));
        break;
      case "C":
        shape.bezierCurveTo(
          x(v[0]),
          y(v[1]),
          x(v[2]),
          y(v[3]),
          x(v[4]),
          y(v[5]),
        );
        break;
      case "Z":
        shape.closePath();
    }
  }
  return shape;
}

const porcelain = new MeshPhysicalMaterial({
  name: "Moon-white glazed porcelain",
  color: 0xf8f6ff,
  metalness: 0.13,
  roughness: 0.26,
  clearcoat: 1,
  clearcoatRoughness: 0.19,
});
const titanium = new MeshPhysicalMaterial({
  name: "Iridescent indigo titanium",
  color: 0x6578d9,
  metalness: 0.82,
  roughness: 0.24,
  iridescence: 0.8,
  iridescenceIOR: 1.35,
  iridescenceThicknessRange: [100, 380],
  clearcoat: 0.65,
});
const light = new MeshStandardMaterial({
  name: "Periwinkle luminous seam",
  color: 0x8bacff,
  emissive: 0x668cff,
  emissiveIntensity: 2.5,
  roughness: 0.4,
});
const ink = new MeshStandardMaterial({
  name: "Midnight enamel smile",
  color: 0x080b21,
  metalness: 0.1,
  roughness: 0.32,
});

function optimize(geometry: BufferGeometry, preserveCaps = false) {
  geometry.deleteAttribute("uv");
  const smooth = toCreasedNormals(geometry, Math.PI / 3);
  if (preserveCaps) {
    // Keep the broad porcelain faces planar; smoothing them into the bevel
    // introduces triangular lighting artifacts across the concave silhouette.
    const normals = smooth.getAttribute("normal");
    for (const group of geometry.groups) {
      if (group.materialIndex !== 0) continue;
      for (
        let index = group.start;
        index < group.start + group.count;
        index++
      ) {
        const z = geometry.getAttribute("normal").getZ(index);
        normals.setXYZ(index, 0, 0, Math.sign(z));
      }
    }
  }
  return mergeVertices(smooth);
}

function shell(
  name: string,
  shape: Shape,
  depth: number,
  z: number,
  bevelSize: number,
  bevelThickness: number,
  material: Material,
) {
  const geometry = new ExtrudeGeometry(shape, {
    depth,
    steps: 1,
    curveSegments: 6,
    bevelEnabled: true,
    bevelSegments: 4,
    bevelSize,
    bevelThickness,
  });
  geometry.translate(0, 0, z);
  const mesh = new Mesh(optimize(geometry, true), material);
  mesh.name = name;
  return mesh;
}

function sculpt(name: string, commands: Command[]) {
  const part = new Group();
  part.name = name;
  const shape = shapeFrom(commands);
  // Rounded ceramic shells sandwich a metal core; the seam stands just proud of it.
  part.add(
    shell(`${name}_Core`, shape, 0.3, -0.15, 0.04, 0.04, titanium),
    shell(`${name}_Front`, shape, 0.07, 0.17, 0.045, 0.065, porcelain),
    shell(`${name}_Back`, shape, 0.07, -0.24, 0.045, 0.065, porcelain),
    shell(`${name}_Light`, shape, 0.012, -0.006, 0.046, 0.006, light),
  );
  return part;
}

const scene = new Scene();
scene.name = "Rebacchi — moon porcelain";
scene.userData = {
  author: "REVATI Studio",
  source:
    "New geometry traced from the supplied Rebacchi character illustration",
  forward: "+Z",
  units: "meters",
};
const bodyGroup = sculpt("Body", body);
const crestGroup = sculpt("Crest", crest);
scene.add(bodyGroup, crestGroup);

const eyeGeometries: BufferGeometry[] = [];
for (const points of [
  [
    [132, 203],
    [141, 187],
    [148, 206],
  ],
  [
    [211, 199],
    [224, 180],
    [235, 205],
  ],
]) {
  const vectors = points.map(
    ([x, y]) => new Vector3((x - 205) / 100, (200 - y) / 100, 0.308),
  );
  eyeGeometries.push(
    new TubeGeometry(new CatmullRomCurve3(vectors), 16, 0.017, 8, false),
  );
  for (const point of [vectors[0], vectors[2]]) {
    const cap = new SphereGeometry(0.017, 8, 6);
    cap.translate(point.x, point.y, point.z);
    eyeGeometries.push(cap);
  }
}
const eyes = mergeGeometries(eyeGeometries);
if (eyes === null) throw new Error("Cannot merge eye geometry");
const face = new Mesh(optimize(eyes), ink);
face.name = "Smiling_eyes";
bodyGroup.add(face);

// Export real geometry and PBR materials; no runtime geometry generator is shipped.
const glb = await new GLTFExporter().parseAsync(scene, { binary: true });
if (!(glb instanceof ArrayBuffer)) throw new Error("Expected a binary GLB");
const output = new URL("../public/models/", import.meta.url);
await mkdir(output, { recursive: true });
await writeFile(new URL("rebacchi-porcelain.glb", output), Buffer.from(glb));

// The fallback shares the same source contours, so it survives disabled JS/WebGL.
const path = (commands: Command[]) =>
  commands.map(([op, ...v]) => `${op}${v.join(" ")}`).join(" ");
await writeFile(
  new URL("rebacchi-poster.svg", output),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="20 15 370 355" fill="none">
  <defs>
    <linearGradient id="pearl" x1=".1" y1="0" x2=".8" y2="1" gradientUnits="objectBoundingBox"><stop stop-color="#fff"/><stop offset=".55" stop-color="#e7eaff"/><stop offset="1" stop-color="#a5b2e7"/></linearGradient>
    <linearGradient id="edge" x2="1" y2="1"><stop stop-color="#c3caff"/><stop offset=".5" stop-color="#4855ae"/><stop offset="1" stop-color="#93d5f7"/></linearGradient>
  </defs>
  <g transform="translate(0 10)" fill="url(#edge)" stroke="#96aaff" stroke-width="2"><path d="${path(body)}"/><path d="${path(crest)}"/></g>
  <g fill="url(#pearl)" stroke="#f1f2ff" stroke-width="2" stroke-linejoin="round"><path d="${path(body)}"/><path d="${path(crest)}"/></g>
  <g stroke="#10132d" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M132 203 Q137 192 141 187 Q144 197 148 206"/><path d="M211 199 Q219 187 224 180 Q230 192 235 205"/></g>
</svg>\n`,
);

let triangles = 0;
scene.traverse((object) => {
  if (object instanceof Mesh) {
    triangles +=
      (object.geometry.index?.count ??
        object.geometry.getAttribute("position").count) / 3;
  }
});
console.log(
  `rebacchi-porcelain.glb: ${(glb.byteLength / 1024).toFixed(1)} KiB, ${triangles} triangles; poster SVG generated.`,
);
