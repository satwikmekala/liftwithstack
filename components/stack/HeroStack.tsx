"use client";

import { useMemo, useRef, useState } from "react";
import { muscle } from "@/lib/tokens";
import { block, exampleHistory, layoutSlabs } from "@/lib/stack/model";
import { dropOffset, focusFrame, follow, slabTop } from "@/lib/stack/motion";
import { prefersReducedMotion, useStage } from "./useStage";

const FIRST_DROP_MS = 700;
const DROP_EVERY_MS = 760;
const DROP_DISTANCE = 2.8;

/** Ten finished weeks, then this week's three workouts land one after another. */
export function HeroStack() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [landed, setLanded] = useState(false);
  const scene = useMemo(() => {
    const history = exampleHistory(10, new Date(2026, 8, 28), 11).map((week) => week.slab);
    const thisWeek = [
      block("pull", muscle.back, 1.15),
      block("legs", muscle.legs, 1),
      block("push", muscle.chest, 1.3, true),
    ];
    const layout = layoutSlabs([...history, ...thisWeek]);
    return { layout, historyCount: history.length, dropCount: thisWeek.length };
  }, []);
  const state = useRef({ start: 0, targetY: 0, zoom: 0, done: false });

  useStage(canvas, (stage, now, dt) => {
    const { width, height } = stage.size;
    const motion = !prefersReducedMotion();
    const s = state.current;
    if (!s.start) s.start = now;
    const elapsed = motion ? now - s.start : Number.POSITIVE_INFINITY;
    const { items, top } = scene.layout;
    let landedTop = items[scene.historyCount - 1] ? slabTop(items[scene.historyCount - 1].y, items[scene.historyCount - 1].slab) : 0;
    const frameItems = items.map((item, index) => {
      if (index < scene.historyCount) return item;
      const local = elapsed - FIRST_DROP_MS - (index - scene.historyCount) * DROP_EVERY_MS;
      if (local < 0) return { ...item, visible: false };
      if (local >= 300) landedTop = slabTop(item.y, item.slab);
      return { ...item, dy: dropOffset(local, DROP_DISTANCE) };
    });
    stage.sync(frameItems);
    // Keep the growing top in frame, as the app's camera does.
    const goal = focusFrame(Math.max(landedTop, 0.6), width, height);
    const final = focusFrame(top, width, height);
    if (!s.zoom || dt === 0 || !motion) {
      s.targetY = motion ? goal.targetY : final.targetY;
      s.zoom = final.zoom;
    } else {
      s.targetY = follow(s.targetY, goal.targetY, dt, 0.32);
      s.zoom = final.zoom;
    }
    stage.render({ targetY: s.targetY, zoom: s.zoom }, top);
    const finished = elapsed > FIRST_DROP_MS + scene.dropCount * DROP_EVERY_MS;
    if (finished && !s.done) {
      s.done = true;
      setLanded(true);
    }
  });

  return (
    <div className="hero-stack">
      <canvas ref={canvas} className="stack-canvas" aria-hidden="true" />
      <p className="stack-fallback hero-stack__fallback">One workout. One block.<br />Every finished week becomes a layer of Your Stack.</p>
      <p className={`hero-stack__caption mono${landed ? " is-visible" : ""}`} aria-hidden="true">
        THIS WEEK · 3 BLOCKS · <span className="gold">1 PR</span>
      </p>
    </div>
  );
}
