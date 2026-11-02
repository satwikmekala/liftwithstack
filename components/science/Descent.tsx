"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CURL_END, ISOLATE_END, LEVELS, ZOOM_AT } from "@/lib/science/story";
import { Foot } from "./Foot";
import { frameUrl, loadFrames, onFrame, paint } from "./frames";
import { prefersReducedMotion } from "./useProgress";

/** A paragraph of the article that also tells the figure where to be when it reaches the reading line. */
type Step = { frame: number; level?: number; content: ReactNode; id?: string; className?: string };

const STEPS: Step[] = [
  {
    frame: 0, className: "d-step--open", content: (
      <>
        <p className="eyebrow">THE SCIENCE OF GETTING STRONGER</p>
        <h1 className="d-hook">Remember when 10&nbsp;kg felt heavy?</h1>
        <p className="d-deck">The weight hasn’t changed since then. This is what did, from the curl down to the molecules, and what it means for your next workout.</p>
        <p className="d-meta mono">8 MIN READ · 7 CHAPTERS</p>
      </>
    ),
  },
  {
    frame: 0, id: "chapter-1", content: (
      <>
        <p className="chapter mono"><span>1</span>The weight hasn’t changed</p>
        <p>You picked the dumbbell up, and by the seventh curl your arm was shaking. You finished the set, or nearly did, and put it down faster than you meant to.</p>
      </>
    ),
  },
  {
    frame: CURL_END, content: (
      <>
        <p>A few weeks later the same dumbbell came off the rack and it was fine. Nothing about it had changed. It’s still 10&nbsp;kg of iron, and gravity pulls on it exactly as hard.</p>
        <p>So something changed in you. To find out what, start with the muscle doing the lifting.</p>
      </>
    ),
  },
  {
    frame: CURL_END, content: (
      <>
        <p>The one lit up on the front of the upper arm is the <b>biceps brachii</b>. It starts on the shoulder blade, crosses the elbow and attaches to the forearm. When it shortens, the forearm comes up.</p>
        <p>Muscles can only pull. Every weight you have ever lifted came down to something getting shorter.</p>
      </>
    ),
  },
  {
    frame: ISOLATE_END, content: (
      <p className="d-turn">How does a muscle get shorter? You have to go inside to see it.</p>
    ),
  },
  {
    frame: ZOOM_AT[0], level: 0, id: "chapter-2", content: (
      <>
        <p className="chapter mono"><span>2</span>Inside your muscle</p>
        <h2 className="d-title">Bundles inside bundles.</h2>
        <p>A muscle looks like one solid thing, but it’s built more like a rope. Six steps take you from the biceps to the molecules that do the work.</p>
        <p className="d-level"><b>Biceps brachii.</b> The whole muscle, wrapped in its own sheath of connective tissue.<Foot of="openstaxStructure" /></p>
      </>
    ),
  },
  {
    frame: ZOOM_AT[1], level: 1, content: (
      <p className="d-level"><b>Fascicle.</b> Cut across a muscle and you find bundles called fascicles, each in its own wrapping. They’re the grain you can see in a piece of steak.</p>
    ),
  },
  {
    frame: ZOOM_AT[2], level: 2, content: (
      <p className="d-level"><b>Muscle fiber.</b> Each fascicle holds muscle fibers. A fiber is a single cell, but an unusual one: up to a tenth of a millimetre wide, up to 30&nbsp;cm long in the longest muscles, and with many nuclei instead of one. You can see some just under its surface.</p>
    ),
  },
  {
    frame: ZOOM_AT[3], level: 3, content: (
      <p className="d-level"><b>Myofibril.</b> A fiber is packed with hundreds or thousands of thin rods called myofibrils, about 1.2&nbsp;µm across, running its whole length. Their repeating stripes are why this kind of muscle is called striated.</p>
    ),
  },
  {
    frame: ZOOM_AT[4], level: 4, content: (
      <p className="d-level"><b>Sarcomere.</b> The stripes come from one unit repeated end to end: the sarcomere, about 2&nbsp;µm long, with a wall called a Z-disc at each end. Around 5,000 fit in a centimetre. It’s the smallest part of a muscle that can contract.</p>
    ),
  },
  {
    frame: ZOOM_AT[5], level: 5, content: (
      <>
        <p className="d-level"><b>Actin and myosin.</b> Inside each sarcomere, two kinds of filament overlap. Thin filaments of <b className="t-actin">actin</b> are anchored to the Z-discs. Thick filaments of <b className="t-myosin">myosin</b> sit in the middle, covered in small heads.</p>
        <p>Those heads are where force begins.</p>
      </>
    ),
  },
];

/**
 * The opening and the first two chapters: the article scrolls normally while one sticky figure
 * follows it, from a curl, to the biceps on its own, down through one continuous zoom.
 */
export function Descent() {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const figure = useRef<HTMLDivElement>(null);
  const steps = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const level = STEPS[active].level;

  useEffect(() => {
    const element = root.current, target = canvas.current, box = figure.current;
    if (!element || !target || !box) return;
    const still = prefersReducedMotion();
    let frame = 0, current = -1, shown = -1;
    const measure = () => {
      frame = 0;
      const vh = window.innerHeight;
      const stacked = window.matchMedia("(max-width: 960px)").matches;
      const figureBottom = box.getBoundingClientRect().bottom;
      const line = stacked ? figureBottom + (vh - figureBottom) * 0.42 : vh * 0.56;
      const tops = steps.current.map((step) => step?.getBoundingClientRect().top ?? 0);
      let i = 0;
      while (i < tops.length - 1 && tops[i + 1] <= line) i++;
      let f = STEPS[i].frame;
      if (!still && i < tops.length - 1 && tops[i] <= line) {
        const t = Math.min(1, Math.max(0, (line - tops[i]) / (tops[i + 1] - tops[i])));
        const eased = t * t * (3 - 2 * t);
        f = STEPS[i].frame + (STEPS[i + 1].frame - STEPS[i].frame) * eased;
      }
      if (i !== shown) { shown = i; setActive(i); }
      if (Math.abs(f - current) > 0.001) { current = f; paint(target, f); }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    const repaint = () => { current = -1; schedule(); };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadFrames(target.getBoundingClientRect().width);
    }, { rootMargin: "100% 0px" });
    io.observe(element);
    const off = onFrame(repaint);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", repaint);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect(); off();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", repaint);
    };
  }, []);

  return (
    <section ref={root} className="descent" aria-label="Chapters 1 and 2">
      <div ref={figure} className="descent__figure">
        <div className="descent__frame">
          {/* Without scripts the poster stands in for the sequence. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <noscript><img className="descent__poster" src={frameUrl("arm/c27.webp")} alt="" /></noscript>
          <canvas ref={canvas} className="descent__canvas" role="img"
            aria-label="An anatomical figure curls a dumbbell; the view then moves into the biceps, down to actin and myosin" />
        </div>
        <ol className={`rail mono${level === undefined ? "" : " is-on"}`} aria-label="Where you are inside the muscle">
          {LEVELS.map((name, index) => (
            <li key={name} className={level === undefined ? "" : index === level ? "is-on" : index < level ? "is-past" : ""}
              aria-current={index === level ? "step" : undefined}>{name}</li>
          ))}
        </ol>
        <p className="descent__credit"><a href="#credits">{level === undefined ? "Anatomy: Écorché, CC BY-SA 4.0" : "Illustration. Each step is magnified; not to scale."}</a></p>
      </div>
      <div className="descent__text">
        {STEPS.map((step, index) => (
          <div key={index} id={step.id} ref={(node) => { steps.current[index] = node; }}
            className={`d-step${step.className ? ` ${step.className}` : ""}${index === active ? " is-active" : ""}`}>
            <div className="d-step__body">{step.content}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
