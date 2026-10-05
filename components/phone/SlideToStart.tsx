"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { Bolt, Icon } from "@/components/ui/Icon";

const THUMB = 56;
const INSET = 7;
/** Same commit point as the app (features/home/slideCommit.ts). */
const COMMIT = 0.9;

/**
 * Slide to start, as on Train: the handle follows the pointer from the first point,
 * readiness shows near the end, and releasing early springs it back.
 */
export function SlideToStart({ color, onStart }: {
  color: string;
  onStart: (origin: { x: number; y: number }) => void;
}) {
  const track = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startX: number; startOffset: number; id: number } | null>(null);
  const [offset, setOffset] = useState(0);
  const [travel, setTravel] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [launched, setLaunched] = useState(false);

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const measure = () => setTravel(Math.max(1, element.offsetWidth - THUMB - INSET * 2));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const progress = offset / travel;
  const ready = progress >= COMMIT;

  const commit = () => {
    setLaunched(true);
    setOffset(travel);
    const rect = thumb.current?.getBoundingClientRect();
    const screen = track.current?.closest(".phone__screen")?.getBoundingClientRect();
    // Launch origin in screen points (the phone is scaled with CSS).
    const scale = screen ? screen.width / 402 : 1;
    onStart(rect && screen
      ? { x: (rect.left + rect.width / 2 - screen.left) / scale, y: (rect.top + rect.height / 2 - screen.top) / scale }
      : { x: 330, y: 470 });
  };

  const onPointerDown = (event: ReactPointerEvent) => {
    if (launched) return;
    drag.current = { startX: event.clientX, startOffset: offset, id: event.pointerId };
    try { (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId); } catch { /* synthetic pointers can't be captured */ }
    setDragging(true);
  };
  const onPointerMove = (event: ReactPointerEvent) => {
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    const screen = track.current?.closest(".phone__screen")?.getBoundingClientRect();
    const scale = screen ? screen.width / 402 : 1;
    setOffset(Math.max(0, Math.min(travel, current.startOffset + (event.clientX - current.startX) / scale)));
  };
  const onPointerUp = () => {
    if (!drag.current) return;
    drag.current = null;
    setDragging(false);
    if (ready) commit();
    else setOffset(0);
  };

  const style = { "--slide": color, "--offset": `${offset}px`, "--progress": progress } as CSSProperties;
  return (
    <div ref={track} className={`slide${dragging ? " is-dragging" : ""}${ready ? " is-ready" : ""}${launched ? " is-launched" : ""}`} style={style}>
      <div className="slide__rail" aria-hidden="true" />
      <div className="slide__fill" aria-hidden="true" style={{ width: THUMB + travel }} />
      <span className="slide__label" aria-hidden="true">Slide to start</span>
      <span className="slide__release" aria-hidden="true">Time to stack up</span>
      <span className="slide__target" aria-hidden="true"><Icon name="arrowRight" size={18} stroke={1.8} /></span>
      <div ref={thumb} className="slide__thumb" role="button" tabIndex={0} aria-label="Start workout, Push"
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
        onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); commit(); } }}>
        <Bolt />
      </div>
    </div>
  );
}
