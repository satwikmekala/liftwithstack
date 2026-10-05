"use client";

import { useCallback, useEffect, useRef, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";

const ITEM = 44;

/**
 * The logger's number wheel (components/WorkoutNumberWheel.tsx): 44 pt rows on a drum,
 * fading and tilting away from the centre. Moves by drag, arrow keys, or the scroll wheel when focused.
 */
export function Wheel({ values, value, onChange, label, align = "center", height = 180, format = String }: {
  values: readonly number[];
  value: number;
  onChange: (value: number) => void;
  label: string;
  align?: "left" | "center" | "right";
  height?: number;
  format?: (value: number) => string;
}) {
  const list = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLSpanElement | null)[]>([]);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const drag = useRef<{ y: number; top: number; id: number } | null>(null);
  const index = Math.max(0, values.indexOf(value));
  const pad = height / 2 - ITEM / 2;

  const paint = useCallback(() => {
    const element = list.current;
    if (!element) return;
    const position = element.scrollTop / ITEM;
    const from = Math.max(0, Math.floor(position) - 4);
    const to = Math.min(values.length - 1, Math.ceil(position) + 4);
    for (let i = from; i <= to; i++) {
      const item = items.current[i];
      if (!item) continue;
      const distance = i - position;
      const absolute = Math.min(2, Math.abs(distance));
      const opacity = absolute <= 1 ? 1 - 0.54 * absolute : 0.46 - 0.28 * (absolute - 1);
      item.style.opacity = String(opacity);
      item.style.transform = `rotateX(${Math.max(-52, Math.min(52, -distance * 26))}deg)`;
    }
  }, [values.length]);

  const snap = useCallback(() => {
    const element = list.current;
    if (!element) return;
    const next = Math.max(0, Math.min(values.length - 1, Math.round(element.scrollTop / ITEM)));
    element.scrollTo({ top: next * ITEM, behavior: "smooth" });
    if (values[next] !== value) onChange(values[next]);
  }, [onChange, value, values]);

  useEffect(() => {
    const element = list.current;
    if (!element) return;
    const target = index * ITEM;
    if (Math.abs(element.scrollTop - target) < 1) {
      paint();
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const first = !element.dataset.ready;
    element.dataset.ready = "true";
    element.scrollTo({ top: target, behavior: first || reduce ? "instant" : "smooth" });
    paint();
  }, [index, paint]);

  const onKeyDown = (event: KeyboardEvent) => {
    const step = event.key === "ArrowUp" ? -1 : event.key === "ArrowDown" ? 1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = values[Math.max(0, Math.min(values.length - 1, index + step))];
    if (next !== value) onChange(next);
  };

  // The page keeps scrolling over the wheel; the wheel moves by drag, keys, or the
  // scroll wheel once it has focus.
  const onPointerDown = (event: ReactPointerEvent) => {
    if (!list.current) return;
    drag.current = { y: event.clientY, top: list.current.scrollTop, id: event.pointerId };
    try { list.current.setPointerCapture(event.pointerId); } catch { /* synthetic pointers can't be captured */ }
    list.current.classList.add("is-grabbing");
  };
  const onPointerMove = (event: ReactPointerEvent) => {
    const current = drag.current;
    const element = list.current;
    if (!current || !element) return;
    const scale = element.getBoundingClientRect().height / height || 1;
    element.scrollTop = current.top - (event.clientY - current.y) / scale;
  };
  const onPointerUp = () => {
    if (!drag.current || !list.current) return;
    drag.current = null;
    list.current.classList.remove("is-grabbing");
    snap();
  };
  useEffect(() => {
    const element = list.current;
    if (!element) return;
    const onWheel = (event: WheelEvent) => {
      if (document.activeElement !== element) return;
      event.preventDefault();
      element.scrollTop += event.deltaY;
      if (settleTimer.current) clearTimeout(settleTimer.current);
      settleTimer.current = setTimeout(snap, 140);
    };
    element.addEventListener("wheel", onWheel, { passive: false });
    return () => element.removeEventListener("wheel", onWheel);
  }, [snap]);

  return (
    <div ref={list} className={`wheel wheel--${align}`} style={{ height }} role="spinbutton" tabIndex={0} aria-label={label}
      aria-valuenow={value} aria-valuetext={format(value)} onScroll={paint} onKeyDown={onKeyDown}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
      <div style={{ height: pad }} aria-hidden="true" />
      {values.map((item, i) => (
        <span key={item} ref={(node) => { items.current[i] = node; }} className="wheel__item" aria-hidden="true">{format(item)}</span>
      ))}
      <div style={{ height: pad }} aria-hidden="true" />
    </div>
  );
}
