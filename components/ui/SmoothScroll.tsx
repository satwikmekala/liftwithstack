"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { scrollToPosition, setScroller } from "@/lib/scroll";

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
        anchors: false,
        prevent: (node) => (node.classList.contains("wheel") && node === document.activeElement) || node.classList.contains("first-block__lifts"),
      });
      setScroller((top) => lenis?.scrollTo(top));
    };
    // Own same-page anchors once. Native hash jumps and Lenis animations can
    // otherwise run together and overshoot the opening chapter in Chromium.
    const onAnchor = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link || link.target === "_blank") return;
      const target = document.getElementById(link.hash.slice(1));
      if (!target) return;
      event.preventDefault();
      const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      history.pushState(null, "", link.hash);
      scrollToPosition(link.hash === "#top" ? 0 : window.scrollY + target.getBoundingClientRect().top - margin);
    };
    window.addEventListener("click", onAnchor);
    configure();
    window.addEventListener("resize", configure);
    desktop.addEventListener("change", configure);
    reduced.addEventListener("change", configure);
    return () => {
      lenis?.destroy();
      setScroller(null);
      window.removeEventListener("click", onAnchor);
      window.removeEventListener("resize", configure);
      desktop.removeEventListener("change", configure);
      reduced.removeEventListener("change", configure);
    };
  }, []);
  return null;
}
