"use client";

import { useEffect, useRef, useState } from "react";
import type { FiberScene } from "@/lib/science/fiber";
import { ref } from "@/lib/science/sources";
import { Sarcomere } from "./Sarcomere";
import { Foot } from "./Foot";
import { prefersReducedMotion, span, useProgress } from "./useProgress";

/** Where each beat of copy is on screen, as a share of the chapter's scroll. */
const BEATS = [
  { from: 0.0, to: 0.17, eyebrow: "ACT I · THE INVISIBLE WORK", title: "A muscle is a stack.", body: <>Thousands of fibers, bundled. Each fiber is a bundle of thinner strands. Each strand is a chain of identical units, stacked end to end. What you call a bicep is a stack, all the way down.</> },
  { from: 0.24, to: 0.46, eyebrow: "THE STRAND", title: "The stripes are the units.", body: <>Those bands are sarcomeres, a few thousandths of a millimetre long, repeated thousands of times along every strand. When the muscle works, every one of them shortens at once.</> },
  { from: 0.52, to: 0.72, eyebrow: "THE UNIT", title: "Nothing shortens by itself.", body: <>Inside each unit, two kinds of filament lie side by side. The thin ones are anchored to the end plates. The thick ones sit in the middle and never change length. The unit shortens because the thin filaments are pulled inward, over the thick ones.<Foot n={ref("huxley")} /></> },
  { from: 0.76, to: 0.92, eyebrow: "TENSION", title: "This is what a rep is.", body: <>The thick filaments are studded with heads. Each one grabs a thin filament, pulls, lets go, and grabs again, a few nanometres at a time. The weight in your hand is millions of these pulls, added up. That force, running through the muscle, is mechanical tension.</> },
  { from: 0.93, to: 1.0, eyebrow: "THE SIGNAL", title: "Tension is the message.", body: <>Muscle has sensors for strain. Pull hard enough, often enough, and they switch on a building program: a signalling hub called mTORC1 tells the cell to make more of this machinery.<Foot n={ref("wackerhage")} /><Foot n={ref("bodine")} /> Which sensor comes first is still being worked out.<Foot n={ref("roberts")} /></> },
];

const SCALES = [
  { at: 0.02, label: "Whole muscle", size: "~30 cm" },
  { at: 0.3, label: "One fiber", size: "~0.05 mm across" },
  { at: 0.58, label: "One sarcomere", size: "~0.002 mm" },
  { at: 0.82, label: "Myosin heads", size: "~0.00001 mm" },
];

/** Act I: the pinned scene, from the outside of the muscle to the heads that pull. */
export function FiberChapter() {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const progress = useRef(0);
  const [shown, setShown] = useState(0);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  useProgress(section, (t) => { progress.current = t; setShown(t); });

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    let scene: FiberScene | undefined;
    let frame = 0;
    let disposed = false;
    let visible = false;
    const start = performance.now();
    const motion = !prefersReducedMotion();
    const tick = () => {
      if (!scene) return;
      scene.render(progress.current, (performance.now() - start) / 1000, motion);
      frame = requestAnimationFrame(tick);
    };
    const run = () => { if (!frame && scene && visible && !document.hidden) frame = requestAnimationFrame(tick); };
    const stop = () => { cancelAnimationFrame(frame); frame = 0; };
    const measure = () => {
      const rect = element.getBoundingClientRect();
      const lite = rect.width < 760;
      scene?.resize(rect.width, rect.height, Math.min(lite ? 1.5 : 2, window.devicePixelRatio || 1));
    };
    const load = async () => {
      if (scene || disposed) return;
      try {
        const { FiberScene } = await import("@/lib/science/fiber");
        if (disposed) return;
        scene = new FiberScene(element, element.getBoundingClientRect().width < 760 ? "lite" : "full");
        measure();
        setReady(true);
        run();
      } catch {
        if (!disposed) setFailed(true);
      }
    };
    const resize = new ResizeObserver(measure);
    resize.observe(element);
    const view = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) { void load(); run(); } else stop();
    }, { rootMargin: "200px" });
    view.observe(element);
    const onVisibility = () => (document.hidden ? stop() : run());
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      disposed = true;
      stop();
      resize.disconnect();
      view.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      scene?.dispose();
    };
  }, []);

  const scale = [...SCALES].reverse().find((item) => shown >= item.at) ?? SCALES[0];

  return (
    <section ref={section} className="fiber" aria-label="Inside the muscle">
      <div className="fiber__sticky">
        <canvas ref={canvas} className={`fiber__canvas${ready ? " is-ready" : ""}`} aria-hidden="true" />
        {failed && (
          <div className="fiber__fallback" aria-hidden="true">
            <Sarcomere contraction={0.35} glow={0.8} width={520} animate />
            <p>A sarcomere: thin filaments pulled over thick ones.</p>
          </div>
        )}
        <div className="fiber__scale mono" aria-live="polite">
          <span className="fiber__scale-label">{scale.label}</span>
          <span className="fiber__scale-size">{scale.size}</span>
          <span className="fiber__scale-note">Schematic, not to scale</span>
        </div>
        <div className="fiber__beats">
          {BEATS.map((beat) => {
            const on = shown >= beat.from && shown < beat.to;
            const past = shown >= beat.to;
            return (
              <div key={beat.title} className={`beat-copy${on ? " is-on" : past ? " is-past" : ""}`} aria-hidden={!on} inert={!on}>
                <p className="eyebrow">{beat.eyebrow}</p>
                <h2 className="beat-copy__title">{beat.title}</h2>
                <p className="beat-copy__body">{beat.body}</p>
              </div>
            );
          })}
        </div>
        <div className="fiber__tension" style={{ opacity: span(shown, 0.76, 0.86) }} aria-hidden="true">
          <span className="mono">TENSION</span>
          <i style={{ transform: `scaleX(${0.3 + 0.7 * span(shown, 0.78, 0.98)})` }} />
        </div>
      </div>
      {/* The same words, in order, for readers and search engines. */}
      <div className="sr-only">
        {BEATS.map((beat) => <p key={beat.title}><strong>{beat.title}</strong> {beat.body}</p>)}
      </div>
    </section>
  );
}
