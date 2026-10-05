let scroll: ((top: number) => void) | null = null;

export function setScroller(scroller: typeof scroll) { scroll = scroller; }

export function scrollToPosition(top: number) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo({ top, behavior: "instant" });
  } else if (scroll) {
    scroll(top);
  } else {
    window.scrollTo({ top, behavior: "smooth" });
  }
}
