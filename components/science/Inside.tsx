"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { drawScene } from "@/lib/science/scene";
import { LEVELS } from "@/lib/science/story";
import { Foot } from "./Foot";
import { Keep, Reveal, Step, Stop, useFinish } from "./lesson";
import { prefersReducedMotion } from "./useProgress";

const LEVEL_TEXT: { size: string; body: ReactNode }[] = [
  { size: "The whole muscle", body: <>The whole muscle, wrapped in its own sheath of connective tissue.<Foot of="openstaxStructure" /></> },
  { size: "A bundle you can see", body: <>Cut across a muscle and you find bundles called fascicles, each in its own wrapping. They’re the grain you can see in a piece of steak.</> },
  { size: "One cell, up to 0.1 mm wide", body: <>Each fascicle holds muscle fibers. A fiber is a single cell, but an unusual one: up to a tenth of a millimetre wide, up to 30&nbsp;cm long in the longest muscles, with many nuclei instead of one.</> },
  { size: "About 1.2 µm across", body: <>A fiber is packed with hundreds or thousands of thin rods called myofibrils, running its whole length. Their repeating stripes are why this kind of muscle is called striated.</> },
  { size: "About 2 µm long", body: <>The stripes come from one unit repeated end to end: the sarcomere, with a wall called a Z-disc at each end. Around 5,000 fit in a centimetre. It’s the smallest part of a muscle that can contract.</> },
  { size: "Single molecules", body: <>Inside each sarcomere, two kinds of filament overlap. Thin filaments of <b className="t-actin">actin</b> are anchored to the Z-discs. Thick filaments of <b className="t-myosin">myosin</b> sit in the middle, covered in small heads.</> },
];
/** Level 0 is the arm itself, turned toward the biceps, before any lens opens. */
const zOf = (level: number) => (level === 0 ? 0.1 : level);

/** The zoom into the muscle, one press per level. */
function Zoom({ onBottom }: { onBottom: () => void }) {
  const [level, setLevel] = useState(0);
  const canvas = useRef<HTMLCanvasElement>(null);
  const z = useRef(zOf(0));
  const [deepest, setDeepest] = useState(0);

  useEffect(() => {
    const target = canvas.current;
    if (!target) return;
    const goal = zOf(level);
    let raf = 0, last = performance.now();
    const draw = () => {
      const rect = target.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.max(1, Math.round(rect.width * dpr)), h = Math.max(1, Math.round(rect.height * dpr));
      if (target.width !== w || target.height !== h) { target.width = w; target.height = h; }
      const ctx = target.getContext("2d");
      if (ctx) drawScene(ctx, w, h, { angle: 104, z: z.current, dpr });
    };
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const gap = goal - z.current;
      // About a second per level, easing into place.
      const step = Math.sign(gap) * Math.min(Math.abs(gap), dt * Math.max(0.35, Math.min(1.2, Math.abs(gap) * 2.4)));
      z.current = Math.abs(gap) < 0.002 ? goal : z.current + step;
      draw();
      if (z.current !== goal) raf = requestAnimationFrame(tick);
    };
    if (prefersReducedMotion()) { z.current = goal; draw(); } else raf = requestAnimationFrame(tick);
    const onResize = () => draw();
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, [level]);

  const go = (next: number) => {
    const clamped = Math.max(0, Math.min(LEVELS.length - 1, next));
    setLevel(clamped);
    setDeepest((current) => Math.max(current, clamped));
    if (clamped === LEVELS.length - 1) onBottom();
  };
  const bottom = level === LEVELS.length - 1;

  return (
    <figure className="zoom">
      <div className="zoom__frame">
        <canvas ref={canvas} className="zoom__canvas" role="img" aria-label={`Inside the biceps, level ${level + 1} of 6: ${LEVELS[level]}`} />
        <p className="zoom__scale mono" aria-hidden="true">{level === 0 ? "ACTUAL SIZE" : `ABOUT ${(8 ** level).toLocaleString("en")}× CLOSER`}</p>
      </div>
      <ol className="zoom__rail mono" aria-label="Where you are inside the muscle">
        {LEVELS.map((name, index) => (
          <li key={name} className={index === level ? "is-on" : index < level ? "is-past" : ""}>
            <button type="button" onClick={() => go(index)} aria-current={index === level ? "step" : undefined} disabled={index > deepest + 1}>{name}</button>
          </li>
        ))}
      </ol>
      <div className="zoom__panel">
        <div className="zoom__text" aria-live="polite">
          <p className="zoom__name"><span className="mono">{level + 1} / 6</span>{LEVELS[level]}<em>{LEVEL_TEXT[level].size}</em></p>
          <p>{LEVEL_TEXT[level].body}</p>
        </div>
        <div className="zoom__actions">
          <button type="button" className="pill-button" onClick={() => go(level - 1)} disabled={level === 0}>Back out</button>
          <button type="button" className="pill-button pill-button--solid" onClick={() => go(level + 1)} disabled={bottom}>{bottom ? "That’s the bottom" : "Zoom in"}</button>
        </div>
      </div>
      {/* Without scripts, or for a reader who skips the zoom, every level is still here. */}
      <noscript>
        <dl className="zoom__all">{LEVELS.map((name, index) => <div key={name}><dt>{name}</dt><dd>{LEVEL_TEXT[index].body}</dd></div>)}</dl>
      </noscript>
      <figcaption className="fig-caption">Illustration. Each step is magnified about eight times; not to scale.</figcaption>
    </figure>
  );
}

const ORDER = ["Fascicle", "Muscle fiber", "Myofibril", "Sarcomere"] as const;
const SHUFFLED = ["Myofibril", "Fascicle", "Sarcomere", "Muscle fiber"] as const;
const HINT: Record<(typeof ORDER)[number], string> = {
  Fascicle: "A fascicle is a bundle of fibers, so it is the biggest of these four.",
  "Muscle fiber": "A fiber sits inside a fascicle and is packed with myofibrils.",
  Myofibril: "A myofibril is one rod inside a fiber, and it is a chain of sarcomeres.",
  Sarcomere: "A sarcomere is one link in a myofibril, the smallest of the four.",
};

/** Put four parts in order of size: recall, with the picture taken away. */
function Sort() {
  const [placed, setPlaced] = useState<string[]>([]);
  const [miss, setMiss] = useState<string | null>(null);
  const finish = useFinish();
  const solved = placed.length === ORDER.length;
  const tap = (name: (typeof ORDER)[number]) => {
    if (placed.includes(name)) return;
    if (name === ORDER[placed.length]) {
      const next = [...placed, name];
      setPlaced(next); setMiss(null);
      if (next.length === ORDER.length) finish();
    } else setMiss(name);
  };
  const show = () => { setPlaced([...ORDER]); setMiss(null); finish(); };
  const wanted = ORDER[placed.length];
  return (
    <div className={`ask sort${solved ? " is-solved" : ""}`}>
      <p className="ask__prompt">Without looking back: tap these from largest to smallest.</p>
      <div className="sort__chips" role="group" aria-label="Parts of a muscle">
        {SHUFFLED.map((name) => {
          const rank = placed.indexOf(name);
          return (
            <button key={name} type="button" className={`sort__chip${rank >= 0 ? " is-placed" : ""}${miss === name ? " is-miss" : ""}`}
              onClick={() => tap(name)} disabled={rank >= 0}>
              <span className="ask__key mono" aria-hidden="true">{rank >= 0 ? rank + 1 : "·"}</span>{name}
              {rank >= 0 && <span className="sr-only">, number {rank + 1}</span>}
            </button>
          );
        })}
      </div>
      <p className={`ask__feedback${miss || solved ? " is-shown" : ""}${solved ? " is-right" : ""}`} aria-live="polite">
        {solved ? "Fascicle, fiber, myofibril, sarcomere. Bundles inside bundles."
          : miss ? <><b>Not yet. </b>{placed.length === 0 ? "Start with the biggest. " : ""}{HINT[wanted]}</>
            : placed.length === 0 ? "Start with the biggest." : "Keep going."}
      </p>
      {!solved && <button type="button" className="ask__skip" onClick={show}>Show me</button>}
      <Reveal open={solved}>
        <Keep>A muscle is bundles inside bundles: fascicle, fiber, myofibril, sarcomere. At the bottom are two filaments, actin and myosin.</Keep>
        <p className="step__bridge">Those small heads on the myosin are where force begins.</p>
      </Reveal>
    </div>
  );
}

/** Stop 2: the hierarchy, and its names. */
export function Inside() {
  const [bottom, setBottom] = useState(false);
  return (
    <Stop n={2} title="Bundles inside bundles." lead={<p>A muscle looks like one solid thing, but it’s built more like a rope. Five presses take you from the biceps to the molecules that do the work.</p>}>
      <Step wide stage={<Zoom onBottom={() => setBottom(true)} />}>
        <p className={`step__nudge${bottom ? " is-done" : ""}`}><span className="mono">{bottom ? "DONE" : "TRY IT"}</span>Zoom in until you can’t go any further.</p>
        <div className={`gate${bottom ? " is-open" : ""}`}><Sort /></div>
      </Step>
    </Stop>
  );
}
