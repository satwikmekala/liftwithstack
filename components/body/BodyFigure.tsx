"use client";

import { useEffect, useRef, useState } from "react";
import type { BodyStage } from "@/lib/body/stage";
import type { BodyRegion, BodySide, RegionStates } from "@/lib/body/regions";

type Props = {
  states: RegionStates;
  /** Frame these muscles; null shows the whole figure. */
  focus?: readonly BodyRegion[] | null;
  side?: BodySide;
  selected?: BodyRegion | null;
  /** Muscles to lift briefly whenever this key changes. */
  pulse?: { key: number; regions: readonly BodyRegion[] } | null;
  /** Drag to turn, tap a muscle. Off for a figure that only illustrates. */
  interactive?: boolean;
  onSelect?: (region: BodyRegion | null) => void;
  onSideChange?: (side: BodySide) => void;
  className?: string;
  label: string;
};

/**
 * The app's 3D figure. WebGL and the sculpt load as the canvas approaches the screen; it draws
 * only when something changes, and only while it is on screen.
 */
export function BodyFigure({ states, focus = null, side = "front", selected = null, pulse = null, interactive = true, onSelect, onSideChange, className = "", label }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<BodyStage | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const latest = useRef({ states, focus, side, selected, onSelect, onSideChange });
  useEffect(() => { latest.current = { states, focus, side, selected, onSelect, onSideChange }; });
  const wake = useRef<() => void>(() => {});

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    let disposed = false, pending = false, visible = false, frame = 0, last = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tick = (now: number) => {
      frame = 0;
      const current = stage.current;
      if (!current || !visible || document.hidden) return;
      const moving = current.tick(Math.min(0.05, (now - last) / 1000 || 0.016), now);
      last = now;
      if (moving) frame = requestAnimationFrame(tick);
    };
    wake.current = () => { if (!frame && stage.current && visible) { last = performance.now(); frame = requestAnimationFrame(tick); } };

    const load = async () => {
      if (stage.current || pending) return;
      pending = true;
      try {
        const [{ BodyStage, loadFigure }] = await Promise.all([import("@/lib/body/stage")]);
        const figure = await loadFigure();
        if (disposed) return;
        const created = new BodyStage(element, figure, reduced);
        const rect = element.getBoundingClientRect();
        created.resize(rect.width, rect.height);
        const now = latest.current;
        created.setFocus(now.focus);
        created.setSide(now.side);
        created.setPaint({ states: now.states, selected: now.selected });
        created.tick(0, performance.now());
        created.spinIn();
        stage.current = created;
        setReady(true);
        wake.current();
      } catch {
        if (!disposed) setFailed(true);
      } finally { pending = false; }
    };

    const resize = new ResizeObserver(() => {
      const rect = element.getBoundingClientRect();
      stage.current?.resize(rect.width, rect.height);
      wake.current();
    });
    resize.observe(element);
    const view = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) { void load(); wake.current(); }
    }, { rootMargin: "300px" });
    view.observe(element);
    const onVisibility = () => { if (!document.hidden) wake.current(); };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      view.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      stage.current?.dispose();
      stage.current = null;
    };
  }, []);

  useEffect(() => { stage.current?.setPaint({ states, selected }); wake.current(); }, [states, selected, ready]);
  useEffect(() => { stage.current?.setFocus(focus); wake.current(); }, [focus, ready]);
  useEffect(() => { stage.current?.setSide(side); wake.current(); }, [side, ready]);
  useEffect(() => { if (pulse) { stage.current?.pulse(pulse.regions); wake.current(); } }, [pulse]);

  // Drag turns the figure; a press that barely moves is a tap on a muscle.
  const drag = useRef<{ id: number; x: number; y: number; moved: boolean; last: number; at: number; vx: number } | null>(null);
  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!interactive || !stage.current) return;
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false, last: event.clientX, at: event.timeStamp, vx: 0 };
  };
  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const state = drag.current;
    if (!state || state.id !== event.pointerId || !stage.current) return;
    const dx = event.clientX - state.x;
    if (!state.moved && Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(event.clientY - state.y)) {
      state.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      stage.current.panBegin();
    }
    if (!state.moved) return;
    const dt = Math.max(1, event.timeStamp - state.at);
    state.vx = ((event.clientX - state.last) / dt) * 1000;
    state.last = event.clientX; state.at = event.timeStamp;
    stage.current.panUpdate(dx);
    wake.current();
  };
  const onPointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const state = drag.current;
    drag.current = null;
    if (!state || !stage.current) return;
    if (state.moved) {
      const landed = stage.current.panEnd(state.vx);
      latest.current.onSideChange?.(landed);
    } else if (latest.current.onSelect) {
      const rect = event.currentTarget.getBoundingClientRect();
      latest.current.onSelect(stage.current.pick(event.clientX - rect.left, event.clientY - rect.top));
    }
    wake.current();
  };

  return (
    <div className={`body-figure${ready ? " is-ready" : ""}${failed ? " is-failed" : ""}${interactive ? " is-interactive" : ""} ${className}`}>
      <canvas ref={canvas} role="img" aria-label={label}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={() => { if (drag.current?.moved) stage.current?.panEnd(0); drag.current = null; wake.current(); }} />
      {failed && <img className="body-figure__still" src="/app/body-front.webp" alt="" loading="lazy" decoding="async" />}
    </div>
  );
}
