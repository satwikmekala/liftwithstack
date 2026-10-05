"use client";

import { useEffect, useRef, type ReactNode } from "react";

const DEVICE_WIDTH = 426;
const DEVICE_HEIGHT = 898;

/**
 * An iPhone drawn at 402 × 874 points, so every screen inside uses the app's own
 * point metrics. The device scales to fit the box CSS gives `.phone`.
 */
export function Phone({ children, label, className = "" }: { children: ReactNode; label: string; className?: string }) {
  const box = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = box.current;
    if (!element) return;
    const fit = () => {
      const { width, height } = element.getBoundingClientRect();
      const scale = Math.min(width / DEVICE_WIDTH, height ? height / DEVICE_HEIGHT : Number.POSITIVE_INFINITY);
      element.style.setProperty("--phone-scale", String(Math.max(0.3, Math.min(1.1, scale))));
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <figure ref={box} className={`phone ${className}`} aria-label={label}>
      <div className="phone__device">
        <div className="phone__screen">
          {children}
          <div className="phone__island" aria-hidden="true" />
        </div>
      </div>
    </figure>
  );
}

export function StatusBar({ time = "9:41", hidden = false }: { time?: string; hidden?: boolean }) {
  return (
    <div className="status-bar" aria-hidden="true">
      <span className="status-bar__time">{hidden ? "" : time}</span>
      <span className="status-bar__icons">
        <svg width="19" height="12" viewBox="0 0 19 12"><rect x="0" y="7.5" width="3.2" height="4.5" rx="0.9" fill="currentColor" /><rect x="5.1" y="5" width="3.2" height="7" rx="0.9" fill="currentColor" /><rect x="10.2" y="2.5" width="3.2" height="9.5" rx="0.9" fill="currentColor" /><rect x="15.3" y="0" width="3.2" height="12" rx="0.9" fill="currentColor" /></svg>
        <svg width="17" height="12" viewBox="0 0 17 12"><path d="M8.5 2.4c2.3 0 4.4.9 6 2.4l1.2-1.2A10.2 10.2 0 0 0 8.5.7 10.2 10.2 0 0 0 1.3 3.6l1.2 1.2a8.5 8.5 0 0 1 6-2.4Zm0 3.4c1.4 0 2.6.5 3.6 1.4l1.2-1.2a6.8 6.8 0 0 0-9.6 0l1.2 1.2c1-.9 2.2-1.4 3.6-1.4Zm0 3.4c.5 0 .9.2 1.2.5L8.5 11 7.3 9.7c.3-.3.7-.5 1.2-.5Z" fill="currentColor" /></svg>
        <svg width="27" height="13" viewBox="0 0 27 13"><rect x="0.5" y="0.5" width="23" height="12" rx="3.8" fill="none" stroke="currentColor" strokeOpacity="0.4" /><rect x="2" y="2" width="20" height="9" rx="2.5" fill="currentColor" /><path d="M25 4.5v4c.8-.3 1.4-1.1 1.4-2s-.6-1.7-1.4-2Z" fill="currentColor" fillOpacity="0.45" /></svg>
      </span>
    </div>
  );
}
