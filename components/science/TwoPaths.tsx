"use client";

import { useEffect, useRef, useState } from "react";
import { PATHS, TRIAL, type Effort } from "@/lib/science/story";
import { Foot } from "./Foot";
import { prefersReducedMotion } from "./useProgress";

function Record({ set, on }: { set: Effort; on: boolean }) {
  return (
    <span className={`record${on ? " is-on" : ""}`}>
      <span className="record__set">{set.load} kg × {set.reps}</span>
      <span className="record__dots" aria-hidden="true">
        {Array.from({ length: set.reps }, (_, i) => <i key={i} />)}
        {Array.from({ length: set.left }, (_, i) => <i key={`l${i}`} className="is-left" />)}
      </span>
      <span className="sr-only">, about {set.left} reps left</span>
    </span>
  );
}

/** Two aligned logs and one scrubber: the same weeks, two ways. */
function Paths() {
  const [week, setWeek] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const last = PATHS.weeks.length - 1;

  useEffect(() => {
    const element = box.current;
    if (!element) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      if (prefersReducedMotion()) { setWeek(last); return; }
      timer = setInterval(() => setWeek((w) => { if (w >= last) { clearInterval(timer); return w; } return w + 1; }), 900);
    }, { threshold: 0.6 });
    io.observe(element);
    return () => { io.disconnect(); if (timer) clearInterval(timer); };
  }, [last]);

  const a = PATHS.repeat[week], b = PATHS.progress[week];
  return (
    <figure className="paths" ref={box}>
      <div className="paths__table" role="table" aria-label="Two ways to train the next five weeks">
        <div className="paths__row paths__row--head" role="row">
          <span role="columnheader" className="mono">WEEK</span>
          <span role="columnheader">Repeats the workout</span>
          <span role="columnheader">Records and progresses</span>
        </div>
        {PATHS.weeks.map((label, i) => (
          <div key={label} role="row" className={`paths__row${i <= week ? " is-shown" : ""}${i === week ? " is-current" : ""}`}>
            <span role="cell" className="paths__week mono">{label}</span>
            <span role="cell"><Record set={PATHS.repeat[i]} on={i === week} /></span>
            <span role="cell"><Record set={PATHS.progress[i]} on={i === week} /></span>
          </div>
        ))}
      </div>
      <label className="range range--wide">
        <span className="range__label mono">WEEK {PATHS.weeks[0]}</span>
        <input type="range" min={0} max={last} step={1} value={week} aria-label="Scrub through the weeks"
          aria-valuetext={`Week ${PATHS.weeks[week]}`} onChange={(event) => setWeek(Number(event.target.value))} />
        <span className="range__label mono">WEEK {PATHS.weeks[last]}</span>
      </label>
      <p className="paths__summary" aria-live="polite">
        Week {PATHS.weeks[week]}: repeating, {a.load} kg × {a.reps} with about {a.left} reps to spare. Progressing, {b.load} kg × {b.reps} with about {b.left}.
      </p>
      <figcaption className="fig-caption">Illustrative. Filled dots are reps done, open dots are reps left over. Real progress is rarely this tidy, and some weeks go backwards.</figcaption>
    </figure>
  );
}

function Trial() {
  const max = Math.max(...TRIAL.map((row) => row.change));
  return (
    <figure className="trial">
      <p className="trial__title">Change in triceps thickness after 8 weeks<Foot of="kassiano" /></p>
      <div className="trial__bars">
        {TRIAL.map((row, i) => (
          <div key={row.label} className={`trial__row${i === 0 ? " is-lead" : ""}`}>
            <span className="trial__label">{row.label}</span>
            <span className="trial__track"><i style={{ width: `${(row.change / max) * 100}%` }} /></span>
            <span className="trial__value mono">+{row.change}%</span>
          </div>
        ))}
      </div>
      <figcaption className="fig-caption">55 untrained young women, one exercise, arms randomly assigned. A real trial, but a short one, in beginners. It isn’t a forecast for you.</figcaption>
    </figure>
  );
}

/** Chapter 6: two ways to continue, then the real evidence. */
export function TwoPaths() {
  return (
    <section className="chapter-block" id="chapter-6" aria-labelledby="paths-title">
      <div className="prose">
        <p className="chapter mono"><span>6</span>Two ways to continue</p>
        <h2 id="paths-title" className="d-title">Same person, next five weeks, two versions.</h2>
        <p>One keeps doing the workout that used to be hard. The other writes down what they did and asks for a little more next time. Drag through the weeks.</p>
      </div>
      <Paths />
      <div className="prose">
        <p>Neither person has wasted their time. Repeating a workout still trains you, and it can keep building muscle for a while, especially for beginners. It just asks a little less of you each week: you’re getting further from your limit while the workout stays where it is. Sets that finish closer to your limit tend to build more muscle.<Foot of="robinson" /><Foot of="refalo" /></p>
        <p>The second person keeps the challenge matched to what they can do. That has a name: <b>progressive overload</b>.<Foot of="acsm" /> It doesn’t mean adding weight every week. It means gradually asking more than your body is used to. One more rep at the same weight counts, and so does an extra set. In one study of trained lifters, adding reps built muscle about as well as adding weight.<Foot of="plotkin" /></p>
        <p>A trial published in 2026 tested the difference directly. Untrained young women did the same triceps exercise for eight weeks. One arm had its load raised whenever it reached the top of the rep range, one kept the same load, and one didn’t train.</p>
      </div>
      <Trial />
      <div className="prose">
        <p>Both trained arms grew, and the one with overload grew about twice as much.<Foot of="kassiano" /> Even the authors note that training without progression was enough to cause growth in these beginners. What happens over years is still open.</p>
      </div>
      <aside className="sci-summary" aria-labelledby="summary-title">
        <p id="summary-title" className="sci-summary__title mono">THE SHORT VERSION</p>
        <ol>
          <li>Myosin heads pull on actin, powered by ATP. Sarcomeres shorten, fibers shorten, your arm bends.</li>
          <li>A load that’s hard for you creates tension, and tension starts the change.</li>
          <li>Over weeks your nervous system improves and your fibers thicken. Those are two different things.</li>
          <li>So the same weight takes a smaller share of what you’ve got. It gets easier, and it asks less of you.</li>
          <li>Asking for a little more, in whichever way fits, is progressive overload.</li>
        </ol>
      </aside>
    </section>
  );
}
