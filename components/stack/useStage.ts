"use client";

import { useEffect, useRef, type RefObject } from "react";
import { Stage } from "@/lib/stack/stage";

export type FrameCallback = (stage: Stage, now: number, dt: number) => void;

/**
 * Owns a Stage for a canvas and runs `onFrame` only while the canvas is on screen.
 * The callback reads the latest props through a ref, so it never restarts the loop.
 */
export function useStage(canvasRef: RefObject<HTMLCanvasElement | null>, onFrame: FrameCallback) {
  const callback = useRef(onFrame);
  const stageRef = useRef<Stage | null>(null);
  useEffect(() => {
    callback.current = onFrame;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let stage: Stage;
    try {
      stage = new Stage(canvas);
    } catch {
      // No WebGL: the static fallback underneath the canvas stays visible.
      canvas.dataset.failed = "true";
      return;
    }
    stageRef.current = stage;
    let frame = 0;
    let last = performance.now();
    let visible = false;

    const measure = () => {
      const rect = canvas.getBoundingClientRect();
      stage.resize(rect.width, rect.height);
    };
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      callback.current(stage, now, dt);
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      if (frame || !visible || document.hidden) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    measure();
    const resize = new ResizeObserver(() => {
      measure();
      callback.current(stage, performance.now(), 0);
    });
    resize.observe(canvas);
    const view = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    }, { rootMargin: "120px" });
    view.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    canvas.dataset.ready = "true";

    return () => {
      stop();
      resize.disconnect();
      view.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      stage.dispose();
      stageRef.current = null;
    };
  }, [canvasRef]);

  return stageRef;
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
