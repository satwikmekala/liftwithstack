"use client";

import { useMemo, useRef, useState } from "react";
import { useStage } from "@/components/stack/useStage";
import { oneRepMax, smallSteps } from "@/lib/science/model";
import { ref } from "@/lib/science/sources";
import { block, layoutSlabs } from "@/lib/stack/model";
import { dropOffset, focusFrame, follow } from "@/lib/stack/motion";
import { muscle } from "@/lib/tokens";
import { Foot } from "./Foot";
import { prefersReducedMotion, span, useProgress } from "./useProgress";

const BEATS = [
  { from: 0, to: 0.3, eyebrow: "ACT V · SMALL INCREASES, BIG DIFFERENCE", title: "One more rep.", body: <>Progress rarely looks like a new plate. It looks like a ninth rep where there were eight. A set that felt heavy and now feels fine. The bar moving a little faster.</> },
  { from: 0.3, to: 0.62, eyebrow: "ADDED UP", title: "Twenty-four weeks of small.", body: <>Follow one bench press: a rep most weeks early on, 2.5 kg whenever the reps are there, then slower. No single week is impressive. The stack is.</> },
  { from: 0.62, to: 1.01, eyebrow: "THE CURVE", title: "It slows. That’s the shape.", body: <>Beginners climb fast; later, every step is smaller and further apart, and the same effort buys less.<Foot n={ref("rhea")} /> People differ enormously too: in one study of 585 people doing the same twelve weeks, size changes ran from −2% to +59%.<Foot n={ref("hubal")} /> The curve bending isn&rsquo;t failure. It&rsquo;s the body being honest.</> },
];

/** Act V: twenty-four weeks of small steps, each a block, stacking as you scroll. */
export function Accumulate() {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const progress = useRef({ target: 0, shown: 0 });
  const [t, setT] = useState(0);
  useProgress(section, (value) => { progress.current.target = value; setT(value); });
  const steps = useMemo(() => smallSteps(24), []);
  const scene = useMemo(() => {
    const slabs = steps.map((step) => block(`week-${step.week}`, muscle.chest, step.change ? (step.record ? 1.3 : 1.15) : 1, step.record));
    return layoutSlabs(slabs);
  }, [steps]);
  const camera = useRef({ targetY: 0, zoom: 0, ready: false });

  useStage(canvas, (stage, _now, dt) => {
    const { width, height } = stage.size;
    const reduce = prefersReducedMotion();
    const p = progress.current;
    p.shown = reduce || dt === 0 ? p.target : follow(p.shown, p.target, dt, 0.06);
    const reveal = span(p.shown, 0.04, 0.9);
    const items = scene.items.map((item, index) => {
      const start = index / scene.items.length;
      const local = (reveal - start) * 9000;
      return { ...item, dy: dropOffset(local, 2.2), visible: local > 0 };
    });
    stage.sync(items);
    const landed = Math.min(scene.items.length, Math.floor(reveal * scene.items.length + 0.001));
    const top = landed ? scene.items[landed - 1].y + scene.items[landed - 1].slab.height * 0.28 : 0.3;
    const narrow = width < 700;
    const frame = focusFrame(Math.max(top, 1.2), width, narrow ? height * 0.7 : height, { bottom: -0.2, top: Math.max(top, 1.2) + 0.8 });
    const goal = { targetY: frame.targetY, zoom: Math.min(frame.zoom, width / (narrow ? 5 : 7)) };
    const c = camera.current;
    if (!c.ready || reduce) { c.targetY = goal.targetY; c.zoom = goal.zoom; c.ready = true; }
    else { c.targetY = follow(c.targetY, goal.targetY, dt, 0.08); c.zoom = follow(c.zoom, goal.zoom, dt, 0.08); }
    stage.render({ targetY: c.targetY, zoom: c.zoom }, scene.top);
  });

  const reveal = span(t, 0.04, 0.9);
  const week = Math.min(24, Math.floor(reveal * 24 + 0.001));
  const current = week ? steps[week - 1] : null;
  const estimate = current ? oneRepMax(current.load, current.reps, 2) : oneRepMax(50, 8, 2);
  const first = oneRepMax(50, 8, 2);
  const changes = steps.slice(0, week).filter((step) => step.change);

  return (
    <section ref={section} className="accumulate" aria-label="Small increases add up">
      <div className="accumulate__sticky">
        <div className="accumulate__beats">
          {BEATS.map((beat) => {
            const on = t >= beat.from && t < beat.to;
            return (
              <div key={beat.title} className={`beat-copy${on ? " is-on" : t >= beat.to ? " is-past" : ""}`} aria-hidden={!on} inert={!on}>
                <p className="eyebrow">{beat.eyebrow}</p>
                <h2 className="beat-copy__title">{beat.title}</h2>
                <p className="beat-copy__body">{beat.body}</p>
              </div>
            );
          })}
        </div>
        <div className="accumulate__stage">
          <canvas ref={canvas} className="stack-canvas accumulate__canvas" aria-hidden="true" />
          <p className="stack-fallback accumulate__fallback">Twenty-four weeks, one block each: a rep most weeks early on, 2.5 kg when the reps are there, slower later.</p>
          <div className="accumulate__readout" aria-live="polite">
            <p className="mono">WEEK {week || 1} OF 24</p>
            <p className="accumulate__set">{current ? `${current.load} kg × ${current.reps}` : "50 kg × 8"}</p>
            <p className="accumulate__estimate">Estimated max <b>{Math.round(estimate)} kg</b> <span>{estimate > first ? `+${Math.round(((estimate - first) / first) * 100)}%` : "start"}</span></p>
            <ul className="accumulate__changes" aria-label="Changes so far">
              {changes.slice(-6).map((step) => <li key={step.week} className={step.record ? "is-record" : ""}>{step.change}<small>wk {step.week}</small></li>)}
            </ul>
          </div>
          <Curve steps={steps} week={week} />
        </div>
      </div>
      <div className="sr-only">
        {BEATS.map((beat) => <p key={beat.title}><strong>{beat.title}</strong> {beat.body}</p>)}
      </div>
    </section>
  );
}

/** The estimated max over the 24 weeks: fast at first, flattening. */
function Curve({ steps, week }: { steps: ReturnType<typeof smallSteps>; week: number }) {
  const W = 320, H = 110;
  const values = steps.map((step) => oneRepMax(step.load, step.reps, 2));
  const min = values[0] * 0.97, max = values[values.length - 1] * 1.03;
  const x = (i: number) => 8 + (i / (steps.length - 1)) * (W - 16);
  const y = (v: number) => H - 16 - ((v - min) / (max - min)) * (H - 30);
  const path = values.slice(0, Math.max(1, week)).map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  return (
    <svg className="accumulate__curve" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <line x1={8} x2={W - 8} y1={H - 16} y2={H - 16} stroke="rgba(245,240,232,0.14)" />
      <path d={path} fill="none" stroke="#F5F0E8" strokeWidth={2} strokeLinejoin="round" />
      {week > 0 && <circle cx={x(week - 1)} cy={y(values[week - 1])} r={3.5} fill="#FF7A3D" />}
      <text x={8} y={12} className="accumulate__curve-label">ESTIMATED MAX · ILLUSTRATION</text>
    </svg>
  );
}
