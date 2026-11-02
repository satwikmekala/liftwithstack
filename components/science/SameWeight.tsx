"use client";

import { useEffect, useRef, useState } from "react";
import { CURL_END, SAME_WEIGHT, effort } from "@/lib/science/story";
import { Foot } from "./Foot";
import { loadFrames, onFrame, paint } from "./frames";
import { prefersReducedMotion } from "./useProgress";

type Week = "week1" | "week6";
/** Seconds per rep. In week 1 the last reps grind; in week 6 they don't. */
const TEMPO: Record<Week, number[]> = {
  week1: [1.3, 1.35, 1.45, 1.6, 1.85, 2.15, 2.65, 3.4],
  week6: [1.25, 1.25, 1.25, 1.3, 1.3, 1.3, 1.35, 1.35],
};
const COPY: Record<Week, { label: string; line: string }> = {
  week1: { label: "Week 1", line: "Rep 8 is a fight. About one more was left." },
  week6: { label: "Week 6", line: "Rep 8 is comfortable. About four more were left." },
};

/** Chapter 5's figure: the same arm, the same 10 kg × 8, two different sets. */
function Set() {
  const [week, setWeek] = useState<Week>("week1");
  const [rep, setRep] = useState(0);
  const [current, setCurrent] = useState(1);
  const [done, setDone] = useState(false);
  const [run, setRun] = useState(0);
  const canvas = useRef<HTMLCanvasElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const pose = useRef(0);
  const set = SAME_WEIGHT[week];

  useEffect(() => {
    const element = box.current;
    if (!element) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      loadFrames(canvas.current?.getBoundingClientRect().width ?? 400);
      if (prefersReducedMotion()) { setDone(true); setRep(8); } else { setDone(false); setRep(0); setRun((n) => n + 1); }
      io.disconnect();
    }, { threshold: 0.55 });
    io.observe(element);
    const off = onFrame(() => { if (canvas.current) paint(canvas.current, pose.current, 1.12); });
    return () => { io.disconnect(); off(); };
  }, []);

  useEffect(() => {
    if (!run) return;
    const durations = TEMPO[week];
    const total = durations.reduce((a, b) => a + b, 0);
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      let t = (now - start) / 1000;
      if (t >= total) { pose.current = 0; setRep(8); setDone(true); if (canvas.current) paint(canvas.current, 0, 1.12); return; }
      let i = 0;
      while (t > durations[i]) { t -= durations[i]; i++; }
      const d = durations[i], up = d * 0.5;
      const x = t < up ? t / up : 1 - (t - up) / (d - up);
      const eased = x * x * (3 - 2 * x);
      pose.current = eased * CURL_END;
      setRep(i + (t >= up ? 1 : 0));
      setCurrent(i + 1);
      if (canvas.current) paint(canvas.current, pose.current, 1.12);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, week]);

  const choose = (next: Week) => {
    setWeek(next);
    if (prefersReducedMotion()) { setDone(true); setRep(8); } else { setDone(false); setRep(0); setCurrent(1); setRun((n) => n + 1); }
  };

  return (
    <figure className="same" ref={box}>
      <div className="same__switch" role="group" aria-label="Choose a week">
        {(Object.keys(COPY) as Week[]).map((key) => (
          <button key={key} type="button" aria-pressed={week === key} onClick={() => choose(key)}>{COPY[key].label}<span>10 kg × 8</span></button>
        ))}
      </div>
      <div className="same__stage">
        <canvas ref={canvas} className="same__canvas" aria-hidden="true" />
        <div className="same__readout">
          <p className="same__count mono" aria-live="off">{done ? "SET DONE" : `REP ${current}`}</p>
          <div className="reps" role="img" aria-label={`8 reps done, about ${set.left} more possible`}>
            {Array.from({ length: 8 }, (_, i) => <i key={i} className={i < rep ? "is-done" : ""} />)}
            {Array.from({ length: set.left }, (_, i) => <i key={`left-${i}`} className={`is-left${done ? " is-shown" : ""}`} style={{ transitionDelay: `${i * 90}ms` }} />)}
          </div>
          <p className={`same__line${done ? " is-shown" : ""}`}>{COPY[week].line}</p>
          <div className="effort" aria-hidden="true">
            <span className="effort__label">Share of what you could do</span>
            <span className="effort__bar"><i style={{ width: done ? `${effort(set) * 100}%` : "0%" }} /></span>
          </div>
        </div>
      </div>
      <figcaption className="fig-caption">A made-up but typical example. Filled dots are reps done; open dots are reps that were still in reserve.</figcaption>
    </figure>
  );
}

/** Chapter 5: the payoff, and the new question it raises. */
export function SameWeight() {
  return (
    <section className="chapter-block" id="chapter-5" aria-labelledby="same-title">
      <div className="prose">
        <p className="chapter mono"><span>5</span>Back to the dumbbell</p>
        <h2 id="same-title" className="d-title">10 kg doesn’t feel the same anymore.</h2>
        <p>Same person, same 10&nbsp;kg, six weeks apart. In week 1, eight curls is close to everything they have. In week 6, eight curls leaves plenty in the tank.</p>
      </div>
      <Set />
      <div className="prose">
        <p>The load hasn’t moved. The share of their capacity it takes has, and that share is what you feel. It’s called <b>relative effort</b>. A stronger, better-coordinated arm lifts the same 10&nbsp;kg further from its limit.</p>
        <p>How quickly this happens varies a lot between people.<Foot of="hubal" /> But it raises a question that didn’t exist in week 1. Now that eight curls is easier, what should change next?</p>
      </div>
    </section>
  );
}
