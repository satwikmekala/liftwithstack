/**
 * Block geometry, ported from the Stack app (features/build/geometry.ts): one mesh per
 * block or layer with chamfered key corner, colour strata, face lighting and gold seams.
 */
import { BufferGeometry, Color, Float32BufferAttribute } from "three";
import { BASE_HEIGHT, GOLD, type BuildSlab, type BuildTuning } from "./model";

type Point = [number, number, number];

export function createSlabGeometry(slab: BuildSlab, tuning: BuildTuning): BufferGeometry {
  const positions: number[] = [];
  const colors: number[] = [];
  const height = slab.height * BASE_HEIGHT;
  const cut = Math.min(0.55, Math.max(0.08, tuning.chamfer));
  const perimeter: [number, number][] = [[-1, -1], [1, -1], [1, 1 - cut], [1 - cut, 1], [-1, 1]];
  const layers = slab.layers;
  const topColor = layers[layers.length - 1].color;
  const topHasRecord = layers[layers.length - 1].record;
  const rgb = new Color();
  const hsl = { h: 0, s: 0, l: 0 };

  const triangle = (a: Point, b: Point, c: Point, hex: string, light = 1) => {
    positions.push(...a, ...b, ...c);
    rgb.set(hex);
    if (hex !== GOLD) {
      // Richer pigment for the object, as in the app.
      rgb.getHSL(hsl, "srgb");
      rgb.setHSL(hsl.h, Math.min(1, hsl.s * 1.18), Math.min(0.72, hsl.l + 0.035), "srgb");
    }
    rgb.multiplyScalar(light);
    for (let i = 0; i < 3; i++) colors.push(rgb.r, rgb.g, rgb.b);
  };
  const quad = (a: Point, b: Point, c: Point, d: Point, hex: string, light = 1) => {
    triangle(a, b, c, hex, light);
    triangle(a, c, d, hex, light);
  };
  const point = ([x, z]: [number, number], y: number): Point => [x, y, z];
  const total = layers.reduce((sum, item) => sum + item.height, 0);

  perimeter.forEach((a, edge) => {
    const b = perimeter[(edge + 1) % perimeter.length];
    const light = edge === 2 ? 1.08 : edge === 1 ? 0.66 : 0.88;
    let y = 0;
    layers.forEach((item) => {
      const next = y + (height * item.height) / total;
      const seam = item.record ? Math.min((next - y) * 0.1, Math.max(0, tuning.seam)) : 0;
      quad(point(a, y), point(a, next - seam), point(b, next - seam), point(b, y), item.color, light);
      if (seam > 0) quad(point(a, next - seam), point(a, next), point(b, next), point(b, next - seam), GOLD, 1.35);
      y = next;
    });
    const inset = topHasRecord && tuning.seam > 0 ? 0.014 : 0;
    const innerA: [number, number] = [a[0] * (1 - inset), a[1] * (1 - inset)];
    const innerB: [number, number] = [b[0] * (1 - inset), b[1] * (1 - inset)];
    triangle([0, height, 0], point(innerB, height), point(innerA, height), topColor, 1.05);
    if (inset > 0) {
      const lerp = (p: [number, number], q: [number, number], t: number): Point => [p[0] + (q[0] - p[0]) * t, height, p[1] + (q[1] - p[1]) * t];
      layers.forEach((_, index) => {
        const start = index / layers.length;
        const end = (index + 1) / layers.length;
        quad(lerp(a, b, start), lerp(innerA, innerB, start), lerp(innerA, innerB, end), lerp(a, b, end), GOLD, 1.35);
      });
    }
    triangle([0, 0, 0], point(a, 0), point(b, 0), topColor, 0.4);
  });

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}
