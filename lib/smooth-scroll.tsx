"use client";

import Lenis from "lenis";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

const SmoothScrollContext = createContext<Lenis | null>(null);

export function SmoothScrollProvider({ children }: PropsWithChildren) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let activeLenis: Lenis | null = null;

    const syncMotionPreference = () => {
      activeLenis?.destroy();
      activeLenis = null;

      if (!reducedMotionQuery.matches) {
        activeLenis = new Lenis({
          anchors: true,
          autoRaf: true,
          smoothWheel: true,
        });
      }

      setLenis(activeLenis);
    };

    syncMotionPreference();
    reducedMotionQuery.addEventListener("change", syncMotionPreference);

    return () => {
      reducedMotionQuery.removeEventListener("change", syncMotionPreference);
      activeLenis?.destroy();
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={lenis}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

export const LenisProvider = SmoothScrollProvider;

export function useSmoothScroll(): Lenis | null {
  return useContext(SmoothScrollContext);
}
