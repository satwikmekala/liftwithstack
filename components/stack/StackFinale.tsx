"use client";

import type { StageItem } from "@/lib/stack/stage";

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useDemoJourney } from "./DemoJourney";
import { formatWeight } from "@/lib/workout";
import { Icon } from "@/components/ui/Icon";
import { fusionFrame, FUSION_DURATION_MS } from "@/lib/stack/fusion";
import { finaleHistory } from "@/lib/stack/history";
import { BASE_HEIGHT, weeklyHeight } from "@/lib/stack/model";
import { dropOffset, focusFrame, follow, slabTop } from "@/lib/stack/motion";
import { prefersReducedMotion, useStage } from "./useStage";

/** Scroll progress at which each part of the sequence happens. */
const PRESS = [0.04, 0.36] as const;
const PULL = [0.42, 0.74] as const;
const DROPS = [0.76, 0.88] as const;
const DROP_MS_PER_PROGRESS = 9000;

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const span = (value: number, [from, to]: readonly [number, number]) => clamp((value - from) / (to - from));
const smooth = (t: number) => t * t * (3 - 2 * t);
const number = (value: number) => value.toLocaleString("en-GB");

export function StackFinale() {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const { completed } = useDemoJourney();
  const history = useMemo(() => finaleHistory(completed), [completed]);
  const [showPersonal, setShowPersonal] = useState(true);
  const progress = useRef({ target: 0, shown: 0 });
  const camera = useRef({ targetY: 0, logZoom: 0, ready: false });
  const [phase, setPhase] = useState(0);
  const [selected, setSelected] = useState(history.weeks.length - 2);
  const [ruler, setRuler] = useState<{ top: number; bottom: number; left: number } | null>(null);
  const selectedRef = useRef(selected);
  useEffect(() => { selectedRef.current = selected; }, [selected]);

  const totals = useMemo(() => {
    const sealed = history.weeks.filter((week) => week.sealed);
    return {
      layers: sealed.length,
      blocks: history.weeks.reduce((sum, week) => sum + week.blocks.length, 0),
      records: history.weeks.reduce((sum, week) => sum + week.records, 0),
      movedKg: history.weeks.reduce((sum, week) => sum + week.movedKg, 0),
    };
  }, [history]);

  // Week id → its range on the tower, for the ruler and for picking.
  const weekSpans = useMemo(() => {
    const { items } = history.final;
    const sealedCount = history.sealedSlabs.length + 1;
    return history.weeks.map((week, index) => {
      if (week.sealed) {
        const item = items[index];
        return { bottom: item.y, top: slabTop(item.y, item.slab) };
      }
      const first = items[sealedCount];
      const last = items[items.length - 1];
      return { bottom: first.y, top: slabTop(last.y, last.slab) };
    });
  }, [history]);

  useEffect(() => {
    const element = section.current;
    if (!element) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      progress.current.target = travel > 0 ? clamp(-rect.top / travel) : 1;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const stageRef = useStage(canvas, (stage, _now, dt) => {
    const { width, height } = stage.size;
    const reduce = prefersReducedMotion();
    const p = progress.current;
    p.shown = reduce || dt === 0 ? p.target : follow(p.shown, p.target, dt, 0.055);
    const t = p.shown;

    // Last week: four blocks press into one layer.
    const elapsed = span(t, PRESS) * FUSION_DURATION_MS;
    const composite = weeklyHeight(history.lastWeekBlocks);
    const fusion = fusionFrame(elapsed, history.lastWeekBlocks, composite);
    const items: StageItem[] = history.final.items.slice(0, history.sealedSlabs.length).map((item) => item);
    const baseY = history.lastWeekY;
    if (fusion.fused) {
      items.push({ slab: history.lastWeekLayer, y: baseY, dy: fusion.lift });
    } else {
      history.loose.forEach((slab, index) => {
        const piece = fusion.pieces[index];
        items.push({ slab, y: baseY + piece.y, dy: fusion.lift, scaleY: piece.scaleY });
      });
    }
    // This week: three blocks drop on top.
    const thisWeekItems = history.final.items.slice(history.sealedSlabs.length + 1);
    thisWeekItems.forEach((item, index) => {
      const start = DROPS[0] + ((DROPS[1] - DROPS[0]) / thisWeekItems.length) * index;
      const local = (t - start) * DROP_MS_PER_PROGRESS;
      items.push({ ...item, dy: dropOffset(local, 2.4), visible: local > 0 });
    });
    stage.sync(items);

    // Camera: close on last week, then pull back to the whole tower. On narrow screens the
    // copy sits above and the week panel below, so the tower is framed in the band between.
    const narrow = width < 700;
    const bandTop = narrow ? Math.min(250, height * 0.3) : 40;
    const bandBottom = narrow ? Math.min(completed ? 330 : 270, height * (completed ? 0.42 : 0.35)) : 40;
    const band = Math.max(160, height - bandTop - bandBottom);
    const lower = (bandTop - bandBottom) / 2;
    const layerTop = baseY + composite * BASE_HEIGHT;
    const near = focusFrame(layerTop, width, band, { bottom: baseY - 0.6, top: layerTop + 1.5 });
    // Keep the tower lighter on phones without scaling the canvas or its hit targets.
    const phoneScale = width <= 640 ? 0.82 : 1;
    const closeZoom = Math.min(near.zoom, Math.min(width, band) / (narrow ? 4.2 : 6.2)) * phoneScale;
    const close = { targetY: near.targetY + lower / (closeZoom * 0.906), zoom: closeZoom };
    const wideZoom = Math.min((width * 0.84) / 3.32, (band * 0.92) / (history.final.top * 0.906 + 1.41)) * phoneScale;
    const wide = { targetY: history.final.top / 2 + lower / (wideZoom * 0.906), zoom: wideZoom };
    const pull = smooth(span(t, PULL));
    const goalY = close.targetY + (wide.targetY - close.targetY) * pull;
    const goalZoom = Math.log(close.zoom) + (Math.log(wide.zoom) - Math.log(close.zoom)) * pull;
    const c = camera.current;
    if (!c.ready || reduce) {
      c.targetY = goalY;
      c.logZoom = goalZoom;
      c.ready = true;
    } else {
      c.targetY = follow(c.targetY, goalY, dt, 0.045);
      c.logZoom = follow(c.logZoom, goalZoom, dt, 0.045);
    }
    stage.render({ targetY: c.targetY, zoom: Math.exp(c.logZoom) }, history.final.top);

    const nextPhase = t < PULL[0] - 0.02 ? 0 : t < DROPS[1] + 0.02 ? 1 : 2;
    setPhase((current) => (current === nextPhase ? current : nextPhase));
    if (nextPhase === 2) {
      const personalItem = history.final.items[history.final.items.length - 1];
      const range = completed && showPersonal
        ? { bottom: personalItem.y, top: slabTop(personalItem.y, personalItem.slab) }
        : weekSpans[selectedRef.current];
      const top = stage.project(range.top);
      const bottom = stage.project(range.bottom);
      const offset = canvas.current?.offsetLeft ?? 0;
      const next = { top: top.y, bottom: bottom.y, left: offset + Math.min(top.x, bottom.x) };
      setRuler((current) => (current && Math.abs(current.top - next.top) < 0.5 && Math.abs(current.bottom - next.bottom) < 0.5
        && Math.abs(current.left - next.left) < 0.5 ? current : next));
    }
  }, () => setPhase(2));

  const pick = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (phase !== 2) return;
    const stage = stageRef.current;
    if (!stage) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const id = stage.pick(event.clientX - rect.left, event.clientY - rect.top);
    if (!id) return;
    if (completed && id === completed.slab.id) { setShowPersonal(true); return; }
    const index = id.startsWith("this-week") ? history.weeks.length - 1
      : history.weeks.findIndex((week) => week.id === id);
    if (index >= 0) { setShowPersonal(false); setSelected(index); }
  };

  const week = history.weeks[selected];
  const weekTitle = `${week.blocks.length} ${week.blocks.length === 1 ? "block" : "blocks"}${week.records ? ` · ${week.records} ${week.records === 1 ? "PR" : "PRs"}` : ""}`;

  return (
    <section id="your-stack" ref={section} className="finale" aria-labelledby="finale-title">
      <div className="finale__sticky">
        <div className="finale__glow" aria-hidden="true" />
        <canvas ref={canvas} className={`stack-canvas finale__canvas${phase === 2 ? " is-interactive" : ""}`}
          onPointerMove={(event) => event.pointerType === "mouse" && event.buttons === 0 && pick(event)} onPointerDown={pick}
          aria-hidden="true" />
        <p className="stack-fallback finale__fallback">Your Stack’s 3D view is unavailable here. Choose a week below to explore its workouts.</p>

        <div className="finale__copy">
          <p className="eyebrow">YOUR STACK</p>
          <div className="finale__titles">
            <div className={`finale__beat${phase === 0 ? " is-on" : ""}`} aria-hidden={phase !== 0}>
              <h2 id="finale-title" className="section-title">Every week becomes a layer.</h2>
              <p className="section-body">When the week ends, its blocks combine into a layer.</p>
            </div>
            <div className={`finale__beat${phase === 1 ? " is-on" : ""}`} aria-hidden={phase !== 1}>
              <p className="section-title">{totals.layers} layers built.</p>
              <p className="section-body">Every finished week, in order. Its colors show what you trained.</p>
            </div>
            <div className={`finale__beat${phase === 2 ? " is-on" : ""}`} aria-hidden={phase !== 2}>
              <p className="section-title">How high will you stack this year?</p>
              <p className="finale__metrics mono">{totals.blocks} BLOCKS · {totals.layers} LAYERS · {totals.records} PRs</p>
            </div>
          </div>
        </div>

        {phase === 2 && ruler && (
          <div className="finale__ruler" aria-hidden="true" style={{ top: Math.min(ruler.top, ruler.bottom), height: Math.max(2, Math.abs(ruler.bottom - ruler.top)), left: ruler.left - 14 }}>
            <span>{completed && showPersonal ? "YOUR FIRST BLOCK" : week.sealed ? week.range.toUpperCase() : "THIS WEEK"}</span>
          </div>
        )}

        <div className={`finale__week${phase === 2 ? " is-on" : ""}`} inert={phase !== 2}>
          <div className="week-panel" aria-live="polite">
            {completed && showPersonal ? <>
              <p className="week-panel__eyebrow mono">YOUR FIRST BLOCK · DEMO</p>
              <p className="week-panel__title">You made this.</p>
              <span className="week-panel__strata" aria-hidden="true"><i style={{ background: completed.slab.layers[0].color }} /></span>
              <p className="week-panel__caption">{completed.sets} {completed.sets === 1 ? "set" : "sets"} · {formatWeight(completed.movedKg)} kg moved</p>
              <ul className="first-block__lifts">{completed.lifts.map((lift, index) => <li key={index}><span>{lift.name}</span><span>{formatWeight(lift.weight)} kg × {lift.reps}</span></li>)}</ul>
            </> : <>
            <p className="week-panel__eyebrow mono">{week.sealed ? week.range.toUpperCase() : "THIS WEEK"}</p>
            <p className="week-panel__title">{weekTitle}</p>
            <span className="week-panel__strata" aria-hidden="true">
              {week.blocks.map((item, index) => <i key={index} style={{ background: item.color }} />)}
            </span>
            <p className="week-panel__caption">{number(week.movedKg)} kg moved</p>
            </>}
          </div>
          {completed && <button className="first-block__toggle" type="button" onClick={() => setShowPersonal((value) => !value)}>{showPersonal ? "Explore every week" : "Find your first block"}</button>}
          <div className="week-nav">
            <button type="button" aria-label="Previous week" disabled={selected === 0} onClick={() => { setShowPersonal(false); setSelected((value) => Math.max(0, value - 1)); }}>
              <Icon name="chevronLeft" size={20} />
            </button>
            <span>Choose a week</span>
            <button type="button" aria-label="Next week" disabled={selected === history.weeks.length - 1}
              onClick={() => { setShowPersonal(false); setSelected((value) => Math.min(history.weeks.length - 1, value + 1)); }}>
              <Icon name="chevronRight" size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
