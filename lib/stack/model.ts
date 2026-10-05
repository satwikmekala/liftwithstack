/**
 * Mirrors the Stack app's build model (features/build/model.ts) so blocks on the
 * site have the same proportions, heights and colours as Your Stack in the app.
 */
import { muscle } from "@/lib/tokens";

export type BuildLayer = { color: string; height: number; record: boolean };
export type BuildSlab = { id: string; height: number; layers: BuildLayer[]; sealed: boolean };
export type BuildTuning = { chamfer: number; seam: number; compression: number };

export const DEFAULT_TUNING: BuildTuning = { chamfer: 0.24, seam: 0.022, compression: 0.35 };
/** Block height by improved exercises: 0, 1, 2, 3+. */
export const HEIGHTS = [1, 1.15, 1.3, 1.45] as const;
export const BASE_HEIGHT = 0.28;
export const SLAB_GAP = 0.045;
export const GOLD = "#FFE84A";

export function weeklyHeight(layers: readonly BuildLayer[], compression = DEFAULT_TUNING.compression, min = 0.75, max = 2.5) {
  return Math.min(max, Math.max(min, layers.reduce((sum, layer) => sum + layer.height, 0) * compression));
}

export function layoutSlabs(slabs: readonly BuildSlab[], gap = SLAB_GAP) {
  let top = 0.12;
  const items = slabs.map((slab) => {
    const y = top;
    top += slab.height * BASE_HEIGHT + gap;
    return { slab, y };
  });
  return { items, top };
}

export const block = (id: string, color: string, height: number, record = false): BuildSlab => ({
  id, sealed: false, height, layers: [{ color, height, record }],
});

export const layer = (id: string, blocks: BuildLayer[]): BuildSlab => ({
  id, sealed: true, layers: blocks, height: weeklyHeight(blocks),
});

/** Stack's plan colours: Push, Pull, Legs, plus the occasional routine workout. */
const ROTATION = [muscle.chest, muscle.back, muscle.legs];
const ROUTINE = [muscle.shoulders, muscle.arms, muscle.core];

/** A small deterministic generator so every render shows the same history. */
function seeded(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 2 ** 32;
  };
}

export type HistoryWeek = { slab: BuildSlab; start: Date; blocks: BuildLayer[]; records: number };

/**
 * Example training history: real-looking weeks of 2–5 workouts, a few quiet weeks,
 * thicker blocks when lifts improved and the odd PR. Illustration only.
 */
export function exampleHistory(weeks: number, endWeekStart: Date, seed = 7): HistoryWeek[] {
  const random = seeded(seed);
  const result: HistoryWeek[] = [];
  let rotation = 0;
  for (let index = 0; index < weeks; index++) {
    const start = new Date(endWeekStart);
    start.setDate(start.getDate() - (weeks - 1 - index) * 7);
    const roll = random();
    const count = roll < 0.06 ? 1 : roll < 0.3 ? 2 : roll < 0.68 ? 3 : roll < 0.9 ? 4 : 5;
    const blocks: BuildLayer[] = Array.from({ length: count }, () => {
      const routine = random() < 0.16;
      const color = routine ? ROUTINE[Math.floor(random() * ROUTINE.length)] : ROTATION[rotation++ % ROTATION.length];
      const improved = random();
      const height = HEIGHTS[improved < 0.38 ? 0 : improved < 0.68 ? 1 : improved < 0.88 ? 2 : 3];
      return { color, height, record: random() < 0.09 };
    });
    result.push({ slab: layer(`week-${index}`, blocks), start, blocks, records: blocks.filter((item) => item.record).length });
  }
  return result;
}
