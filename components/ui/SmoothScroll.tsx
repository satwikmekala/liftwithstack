"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { setScroller } from "@/lib/scroll";

export function SmoothScroll() {
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 961px) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | undefined;
    const configure = () => {
      const enabled = desktop.matches && !reduced.matches;
      if (enabled === !!lenis) return;
      lenis?.destroy();
      lenis = undefined;
      setScroller(null);
      if (!enabled) return;
      lenis = new Lenis({
        autoRaf: true, lerp: 0.16, smoothWheel: true, syncTouch: false,
        anchors: { offset: -72 },
        prevent: (node) => (node.classList.contains("wheel") && node === document.activeElement) || node.classList.contains("first-block__lifts"),
      });
      setScroller((top) => lenis?.scrollTo(top));
    };
    configure();
    window.addEventListener("resize", configure);
    desktop.addEventListener("change", configure);
    reduced.addEventListener("change", configure);
    return () => {
      lenis?.destroy();
      setScroller(null);
      window.removeEventListener("resize", configure);
      desktop.removeEventListener("change", configure);
      reduced.removeEventListener("change", configure);
    };
  }, []);
  return null;
}
