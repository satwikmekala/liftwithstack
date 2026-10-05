"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

/** Content rises 12px into place once, the first time it scrolls into view. */
export function Reveal({ as: Tag = "div", className = "", delay = 0, style, children, ...rest }: {
  as?: ElementType; className?: string; delay?: number; style?: CSSProperties; children: ReactNode; "aria-label"?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      element.classList.add("is-in");
      observer.disconnect();
    }, { rootMargin: "0px 0px -12% 0px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ ...style, "--delay": `${delay}ms` } as CSSProperties} {...rest}>
      {children}
    </Tag>
  );
}
