"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks which step id is closest to the vertical center of the viewport
 * using a single IntersectionObserver with a thin center band, so the
 * active step only changes on discrete crossings rather than every scroll
 * frame.
 */
export function useActiveStep<StepId extends string>(
  defaultId: StepId,
): {
  readonly activeId: StepId;
  readonly activateStep: (id: StepId) => void;
  readonly registerStep: (id: StepId) => (element: HTMLElement | null) => void;
} {
  const [activeId, setActiveId] = useState<StepId>(defaultId);
  const elementsRef = useRef(new Map<StepId, HTMLElement>());

  useEffect(() => {
    const elements = elementsRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (!visible) return;

        for (const [id, element] of elements) {
          if (element === visible.target) {
            setActiveId(id);
            break;
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    for (const element of elements.values()) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  const registerStep =
    (id: StepId) =>
    (element: HTMLElement | null): void => {
      if (element) {
        elementsRef.current.set(id, element);
      } else {
        elementsRef.current.delete(id);
      }
    };

  return { activeId, activateStep: setActiveId, registerStep };
}

export default useActiveStep;
