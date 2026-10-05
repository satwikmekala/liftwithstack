"use client";

import { useEffect, useRef } from "react";

const LINES = ["Easier to start.", "Easier to keep going.", "Easier to look back on."];

/** Three lines that light up as they reach the middle of the screen. */
export function Thesis() {
  const lines = useRef<(HTMLSpanElement | null)[]>([]);
  useEffect(() => {
    let frame = 0;
    const paint = () => {
      frame = 0;
      const middle = window.innerHeight * 0.62;
      for (const line of lines.current) {
        if (!line) continue;
        const rect = line.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (middle - rect.top) / (rect.height * 1.6)));
        line.style.setProperty("--lit", progress.toFixed(3));
      }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(paint); };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="thesis" aria-label="What Stack does">
      <p className="thesis__lines">
        {LINES.map((line, index) => (
          <span key={line} ref={(node) => { lines.current[index] = node; }} className="thesis__line">{line} </span>
        ))}
      </p>
    </section>
  );
}
