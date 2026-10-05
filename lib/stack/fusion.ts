/**
 * The week-close motion from the Stack app (features/build/fusion.ts): blocks peel off
 * top first, hover apart, press to the week's height and seat as one layer.
 */
import { BASE_HEIGHT, SLAB_GAP, type BuildLayer } from "./model";

export const FUSION_DURATION_MS = 4800;

const ease = (elapsed: number, start: number, end: number) => {
  const t = Math.max(0, Math.min(1, (elapsed - start) / (end - start)));
  return t * t * (3 - 2 * t);
};
const LIFT_STAGGER_MS = 110;
const HOVER_SPREAD = 0.12;

export function fusionFrame(elapsed: number, layers: readonly BuildLayer[], compositeHeight: number) {
  const compression = ease(elapsed, 900, 2200);
  const total = layers.reduce((sum, item) => sum + item.height, 0);
  const scale = 1 + (compositeHeight / total - 1) * compression;
  const lift = 1.1 * ease(elapsed, 0, 850) * (1 - ease(elapsed, 2900, 4000));
  const stagger = layers.length > 1 ? Math.min(LIFT_STAGGER_MS, 350 / (layers.length - 1)) : 0;
  const spread = HOVER_SPREAD * ease(elapsed, 200, 900) * (1 - ease(elapsed, 900, 1700));
  let cursor = 0;
  const pieces = layers.map((item, index) => {
    const delay = (layers.length - 1 - index) * stagger;
    const lag = 1.1 * Math.max(0, ease(elapsed, 0, 850) - ease(elapsed, delay, delay + 850));
    const y = cursor - lag;
    cursor += item.height * BASE_HEIGHT * scale + SLAB_GAP * (1 - compression) + spread;
    return { y, scaleY: scale };
  });
  return { pieces, fused: elapsed >= 2200, lift };
}
