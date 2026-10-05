"use client";

import { useMemo, useRef } from "react";
import type { DemoBlock } from "@/lib/demo-block";
import { muscle } from "@/lib/tokens";
import { block, layoutSlabs } from "@/lib/stack/model";
import { dropOffset, focusFrame, slabTop } from "@/lib/stack/motion";
import { prefersReducedMotion, useStage } from "./useStage";

/** Beat timings for the workout-complete moment, in ms after it starts. */
export const CAST_BEATS = { grow: 600, gold: 2900, land: 4900 } as const;
const HOVER = 1.15;

/**
 * The completed workout's block: it forms above this week's blocks, grows thicker for
 * improved lifts, takes a gold seam for the PR, then drops into place.
 */
export function CastStack({ startedAt, demo }: { startedAt: number | null; demo?: DemoBlock | null }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useMemo(() => {
    const base = [block("cast-pull", muscle.back, 1.15), block("cast-legs", muscle.legs, 1)];
    const plain = demo?.slab ?? block("cast-push", muscle.chest, 1.3);
    const gold = demo?.slab ?? block("cast-push-pr", muscle.chest, 1.3, true);
    const { items, top } = layoutSlabs([...base, plain]);
    const landing = items[items.length - 1].y;
    return { base: items.slice(0, -1), plain, gold, landing, top };
  }, [demo]);

  useStage(canvas, (stage) => {
    const { width, height } = stage.size;
    const motion = !prefersReducedMotion();
    const elapsed = startedAt === null ? -1 : motion ? performance.now() - startedAt : Number.POSITIVE_INFINITY;
    const growth = Math.max(0, Math.min(1, (elapsed - CAST_BEATS.grow) / 1400));
    const eased = 1 - (1 - growth) ** 3;
    const goldOn = !demo && elapsed >= CAST_BEATS.gold;
    const fall = elapsed - CAST_BEATS.land;
    const dy = fall < 0 ? HOVER : dropOffset(fall, HOVER, 280);
    const visible = elapsed >= 0;
    stage.sync([
      ...scene.base,
      { slab: scene.plain, y: scene.landing, dy, scaleY: 1 / scene.plain.height + (1 - 1 / scene.plain.height) * eased, visible: visible && !goldOn },
      ...(!demo ? [{ slab: scene.gold, y: scene.landing, dy, visible: visible && goldOn }] : []),
    ]);
    const finalTop = slabTop(scene.landing, scene.plain);
    const frame = focusFrame(finalTop, width, height, { bottom: -0.1, top: finalTop + HOVER * 0.75 });
    stage.render({ targetY: frame.targetY, zoom: frame.zoom * 1.22 }, scene.top);
  });

  return <><canvas ref={canvas} className="stack-canvas" aria-hidden="true" /><p className="stack-fallback">Workout complete. One workout. One block.</p></>;
}
