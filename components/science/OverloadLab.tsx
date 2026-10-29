"use client";

import { useState } from "react";
import { EFFORT_COPY, effortBand, oneRepMax, relativeLoad, repsPossible } from "@/lib/science/model";
import { ref } from "@/lib/science/sources";
import { Foot } from "./Foot";
import { Sarcomere } from "./Sarcomere";

/** Week 1 and week 8 of the lab: the body got stronger (illustrative), the bar didn't change. */
const GROWTH = 1.1;

const WAYS: { label: string; detail: string; apply: (s: Lab) => Lab }[] = [
  { label: "Add a rep", detail: "Same weight, one more rep.", apply: (s) => ({ ...s, reps: Math.min(15, s.reps + 1) }) },
  { label: "Add 2.5 kg", detail: "The smallest plate.", apply: (s) => ({ ...s, load: Math.min(120, s.load + 2.5) }) },
  { label: "Add a set", detail: "More total work at the same effort.", apply: (s) => ({ ...s, sets: Math.min(6, s.sets + 1) }) },
  { label: "Fuller range", detail: "Deeper, with control. Counts as more.", apply: (s) => ({ ...s, range: true }) },
  { label: "Closer to the limit", detail: "Stop one rep later.", apply: (s) => ({ ...s, reserve: Math.max(0, s.reserve - 1) }) },
];

type Lab = { load: number; reps: number; sets: number; reserve: number; range: boolean };
const START: Lab = { load: 60, reps: 8, sets: 3, reserve: 2, range: false };

/**
 * Act IV: change the set and watch the challenge change. The arithmetic is Epley's rule of
 * thumb for how load and reps relate to a one-rep max; it is shown as an illustration, never
 * as a prediction of growth.
 */
export function OverloadLab() {
  const [lab, setLab] = useState<Lab>(START);
  const [later, setLater] = useState(false);
  // Week 1: the set as entered defines the lifter's max. Week 8: the same body, 10% stronger.
  const baseMax = oneRepMax(START.load, START.reps, START.reserve);
  const max = baseMax * (later ? GROWTH : 1);
  const possible = repsPossible(lab.load, max);
  const reserve = Math.max(0, possible - lab.reps);
  const tooHeavy = possible < lab.reps;
  const band = tooHeavy ? "limit" : effortBand(reserve);
  const relative = relativeLoad(lab.load, max);
  const stimulus = tooHeavy ? 1 : Math.max(0.1, Math.min(1, 1 - (reserve - 2) / 6));
  const work = lab.load * lab.reps * lab.sets;
  const set = (patch: Partial<Lab>) => setLab((current) => ({ ...current, ...patch }));

  return (
    <section className="lab" id="lab" aria-labelledby="lab-title">
      <div className="lab__head">
        <p className="eyebrow">ACT IV · THE PRINCIPLE OF PROGRESS</p>
        <h2 id="lab-title" className="sci-title">The challenge grows with you.</h2>
        <p className="sci-body">Progressive overload isn&rsquo;t adding plates every workout. It&rsquo;s keeping the challenge in step with a body that keeps changing, by whichever variable fits.<Foot n={ref("acsm")} /> Try it.</p>
      </div>

      <div className="lab__bench">
        <div className="lab__controls">
          <div className="lab__when" role="radiogroup" aria-label="When">
            <button type="button" role="radio" aria-checked={!later} className={!later ? "is-on" : ""} onClick={() => setLater(false)}>Week 1</button>
            <button type="button" role="radio" aria-checked={later} className={later ? "is-on" : ""} onClick={() => setLater(true)}>Week 8 · same body, 10% stronger</button>
          </div>
          <Slider label="Weight" unit="kg" value={lab.load} min={30} max={120} step={2.5} onChange={(load) => set({ load })} />
          <Slider label="Reps" unit="" value={lab.reps} min={1} max={15} step={1} onChange={(reps) => set({ reps })} />
          <Slider label="Sets" unit="" value={lab.sets} min={1} max={6} step={1} onChange={(sets) => set({ sets })} />
          <label className="lab__range">
            <input type="checkbox" checked={lab.range} onChange={(event) => set({ range: event.target.checked })} />
            <span>Full range of motion</span>
            <small>Deeper reps with control build more strength and size than partial ones.<Foot n={ref("pallares")} /></small>
          </label>
          <button type="button" className="lab__reset" onClick={() => { setLab(START); setLater(false); }}>Reset</button>
        </div>

        <div className="lab__readout" aria-live="polite">
          <div className="lab__strip" style={{ "--stimulus": stimulus } as React.CSSProperties}>
            <Sarcomere contraction={0.25 + 0.55 * stimulus} glow={stimulus} width={420} animate />
          </div>
          <p className={`lab__band is-${band}`}>
            <b>{tooHeavy ? "Past your limit" : EFFORT_COPY[band].label}</b>
            <span>{tooHeavy ? `At this weight the set ends around rep ${possible}. The body can't do what you asked, which is its own kind of signal to lower the bar.` : EFFORT_COPY[band].detail}</span>
          </p>
          <dl className="lab__numbers">
            <div><dt>Reps in reserve</dt><dd>{tooHeavy ? "0" : reserve}</dd></div>
            <div><dt>Share of your max</dt><dd>{Math.round(relative * 100)}%</dd></div>
            <div><dt>Total work</dt><dd>{work.toLocaleString("en-GB")} kg</dd></div>
            <div><dt>Range</dt><dd>{lab.range ? "Full" : "Partial"}</dd></div>
          </dl>
          {later && band !== "limit" && !tooHeavy && (
            <p className="lab__hint">Same set, stronger body: it got easier. Pick a way to bring the challenge back.</p>
          )}
          <div className="lab__ways" role="group" aria-label="Ways to progress">
            {WAYS.map((way) => (
              <button key={way.label} type="button" onClick={() => setLab(way.apply)}>
                <b>{way.label}</b><span>{way.detail}</span>
              </button>
            ))}
          </div>
          <p className="lab__fine">An illustration. The weight-to-reps arithmetic is Epley&rsquo;s rule of thumb; real bodies vary, and no slider predicts how much muscle anyone will build. Taken near the limit, light and heavy weights grow muscle similarly; heavier ones build more top-end strength.<Foot n={ref("schoenfeld-load")} /></p>
        </div>
      </div>
    </section>
  );
}

function Slider({ label, unit, value, min, max, step, onChange }: { label: string; unit: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) {
  const id = `lab-${label.toLowerCase()}`;
  return (
    <div className="lab__slider">
      <label htmlFor={id}><span>{label}</span><b>{value}{unit && ` ${unit}`}</b></label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))}
        style={{ "--fill": `${((value - min) / (max - min)) * 100}%` } as React.CSSProperties} />
    </div>
  );
}
