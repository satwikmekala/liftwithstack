"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * How far a tall section has scrolled through the viewport, 0 at its top edge and 1 once its
 * bottom edge arrives: the number every scroll-driven scene on /science reads.
 */
export function useProgress(ref: RefObject<HTMLElement | null>, onChange?: (t: number) => void) {
  const [progress, setProgress] = useState(0);
  const callback = useRef(onChange);
  useEffect(() => { callback.current = onChange; });
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let frame = 0;
    let last = -1;
    const measure = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const t = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : rect.top < 0 ? 1 : 0;
      if (Math.abs(t - last) < 0.0005) return;
      last = t;
      callback.current?.(t);
      setProgress(t);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref]);
  return progress;
}

export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
/** 0 → 1 across [from, to], clamped. */
export const span = (t: number, from: number, to: number) => clamp((t - from) / (to - from));
export const smooth = (t: number) => t * t * (3 - 2 * t);

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
