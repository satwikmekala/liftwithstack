"use client";

import { useEffect, useRef, type RefObject } from "react";
import type { Stage } from "@/lib/stack/stage";

export type FrameCallback = (stage: Stage, now: number, dt: number) => void;

/** Load WebGL on approach; render only while visible and the tab is active. */
export function useStage(canvasRef: RefObject<HTMLCanvasElement | null>, onFrame: FrameCallback, onFailure?: () => void) {
  const callback = useRef(onFrame);
  const failure = useRef(onFailure);
  const stageRef = useRef<Stage | null>(null);
  useEffect(() => { callback.current = onFrame; failure.current = onFailure; });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let stage: Stage | undefined;
    let pending = false;
    let disposed = false;
    let frame = 0;
    let last = performance.now();
    let visible = false;
    const measure = () => {
      const rect = canvas.getBoundingClientRect();
      stage?.resize(rect.width, rect.height);
    };
    const tick = (now: number) => {
      if (!stage) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      callback.current(stage, now, dt);
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      if (frame || !stage || !visible || document.hidden) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };
    const stop = () => { cancelAnimationFrame(frame); frame = 0; };
    const load = async () => {
      if (stage || pending || canvas.dataset.failed) return;
      pending = true;
      try {
        const { Stage } = await import("@/lib/stack/stage");
        if (disposed) return;
        stage = new Stage(canvas);
        stageRef.current = stage;
        measure();
        canvas.dataset.ready = "true";
        start();
      } catch {
        if (!disposed) { canvas.dataset.failed = "true"; failure.current?.(); }
      } finally { pending = false; }
    };
    const resize = new ResizeObserver(() => {
      measure();
      if (stage) callback.current(stage, performance.now(), 0);
    });
    resize.observe(canvas);
    const view = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) { void load(); start(); } else stop();
    }, { rootMargin: "120px" });
    view.observe(canvas);
    const onVisibility = () => document.hidden ? stop() : start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      disposed = true;
      stop();
      resize.disconnect();
      view.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      stage?.dispose();
      stageRef.current = null;
    };
  }, [canvasRef]);
  return stageRef;
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
