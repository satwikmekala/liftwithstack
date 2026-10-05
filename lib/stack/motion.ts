import { BASE_HEIGHT, type BuildSlab } from "./model";

export type Frame = { targetY: number; zoom: number };

/** The app's camera framing (features/build/monolithModel.ts). */
export function focusFrame(top: number, width: number, height: number, focus?: { bottom: number; top: number }): Frame {
  const span = focus ? focus.top - focus.bottom : Math.min(top, 3.4);
  return {
    targetY: focus ? (focus.bottom + focus.top) / 2 : Math.max(0.3, top - 1.65),
    zoom: Math.min(width / 4.6, height / (span * 0.91 + 3.1)),
  };
}

/** Quadratic fall with a short bounce: 300 ms down, 80 ms settle. */
export function dropOffset(elapsed: number, distance: number, fall = 300) {
  if (elapsed <= 0) return distance;
  if (elapsed < fall) {
    const t = elapsed / fall;
    return distance * (1 - t * t);
  }
  const settle = elapsed - fall;
  return settle < 80 ? 0.045 * Math.sin((Math.PI * settle) / 80) : 0;
}

export const slabTop = (y: number, slab: BuildSlab) => y + slab.height * BASE_HEIGHT;

/** Critically damped follow, so the camera eases without overshoot. */
export function follow(current: number, target: number, dt: number, smooth = 0.28) {
  const omega = 2 / smooth;
  const x = omega * dt;
  const factor = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  return target + (current - target) * factor;
}
