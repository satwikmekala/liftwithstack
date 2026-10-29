"use client";

import { useRef, useState } from "react";
import { ref } from "@/lib/science/sources";
import { Foot } from "./Foot";
import { span, smooth, useProgress } from "./useProgress";

const WEEKS = 10;
const DAYS = WEEKS * 7;
/** Three workouts a week: Monday, Wednesday, Friday. */
const WORKOUTS = Array.from({ length: WEEKS }, (_, w) => [w * 7, w * 7 + 2, w * 7 + 4]).flat();

/** Protein synthesis after one workout: up fast, roughly doubled by a day, back near baseline by two. */
const bump = (hoursAfter: number) => {
  if (hoursAfter < 0) return 0;
  const h = hoursAfter;
  return Math.max(0, (h / 20) * Math.exp(1 - h / 20)) * (h < 48 ? 1 : Math.max(0, 1 - (h - 48) / 12));
};

const W = 920;
const H = 440;
const left = 70;
const right = W - 30;

const BEATS = [
  { from: 0, to: 0.26, eyebrow: "ACT II · THE BODY ANSWERS", title: "The building happens afterwards.", body: <>For a day or two after a hard workout, the muscle makes protein faster than usual. It more than doubles the rate by about 24 hours, and is close to normal again by 36 to 48.<Foot n={ref("macdougall")} /><Foot n={ref("phillips")} /> Breakdown rises too; the balance only tips toward building when you eat enough.</> },
  { from: 0.26, to: 0.52, eyebrow: "REPETITION", title: "One workout changes very little.", body: <>Each bout is a small, temporary push. The muscle doesn&rsquo;t grow in a day; it grows because the pushes keep coming, spaced by rest. Sleep and protein are the materials.<Foot n={ref("morton")} /><Foot n={ref("knowles")} /></> },
  { from: 0.52, to: 0.76, eyebrow: "WHAT GROWS", title: "Strength comes first. Size follows.", body: <>In the first weeks, most of what you gain is nerve: the spinal cord learns to drive the muscle harder.<Foot n={ref("delvecchio")} /> Measurable growth takes about three weeks, as the fiber adds strands in parallel.<Foot n={ref("seynnes")} /><Foot n={ref("jorgenson")} /></> },
  { from: 0.76, to: 1.01, eyebrow: "NOT THE SIGNAL", title: "Soreness isn’t growth.", body: <>Early on, much of that protein is repair work. Growth tracked protein synthesis only once the damage had faded, by week three.<Foot n={ref("damas")} /> You don&rsquo;t need to hurt to be building.</> },
];

/** Act II: ten weeks on one chart. Workouts, the synthesis bumps after each, and the fiber growing. */
export function Adapt() {
  const section = useRef<HTMLElement>(null);
  const [t, setT] = useState(0);
  useProgress(section, setT);
  // The window starts on one week, close enough to see a single bump, then widens to all ten.
  const window = 7 + (DAYS - 7) * smooth(span(t, 0.2, 0.5));
  const dayX = (day: number) => left + ((right - left) * day) / window;
  const reveal = span(t, 0.04, 0.9);
  const shownDays = Math.min(window, reveal * DAYS);
  // Synthesis trace, sampled every few hours.
  const samples = 600;
  const trace: string[] = [];
  for (let i = 0; i <= samples; i++) {
    const day = (i / samples) * window;
    if (day > shownDays) break;
    const hours = day * 24;
    let level = 0;
    for (const workout of WORKOUTS) level += bump(hours - workout * 24);
    const y = H - 118 - Math.min(1.3, level) * 150;
    trace.push(`${i ? "L" : "M"}${dayX(day).toFixed(1)},${y.toFixed(1)}`);
  }
  const baseline = H - 118;
  // Strength (fast, neural at first) and size (slower, from about week three), as shares of their ten-week gain.
  const strength = (day: number) => 1 - Math.exp(-day / 22);
  const size = (day: number) => Math.max(0, 1 - Math.exp(-(day - 12) / 34)) / (1 - Math.exp(-(DAYS - 12) / 34));
  const line = (fn: (day: number) => number, top: number, bottom: number) => {
    const points: string[] = [];
    for (let day = 0; day <= shownDays; day += window / 140) points.push(`${points.length ? "L" : "M"}${dayX(day).toFixed(1)},${(bottom - fn(day) * (bottom - top)).toFixed(1)}`);
    return points.join(" ");
  };
  const grown = reveal * DAYS;
  const strands = Math.round(7 + 12 * size(grown));
  const fiberRadius = 26 + 10 * size(grown);

  return (
    <section ref={section} className="adapt" aria-label="How the body adapts">
      <div className="adapt__sticky">
        <div className="adapt__beats">
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
        <figure className="adapt__chart">
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Ten weeks of training: protein synthesis rises after each workout and settles between them; strength rises quickly, size more slowly.">
            <defs>
              <linearGradient id="mps-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#FF7A3D" stopOpacity="0.45" />
                <stop offset="1" stopColor="#FF7A3D" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Week grid */}
            {window < 21
              ? Array.from({ length: 8 }, (_, d) => (
                <g key={d} style={{ opacity: d <= window ? 1 : 0 }}>
                  <line x1={dayX(d)} x2={dayX(d)} y1={40} y2={H - 60} stroke="rgba(245,240,232,0.07)" />
                  {d < 7 && <text x={dayX(d + 0.5)} y={H - 38} textAnchor="middle" className="adapt__tick">{["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"][d]}</text>}
                </g>
              ))
              : Array.from({ length: WEEKS + 1 }, (_, w) => (
                <g key={w} style={{ opacity: w * 7 <= window + 0.5 ? 1 : 0 }}>
                  <line x1={dayX(w * 7)} x2={dayX(w * 7)} y1={40} y2={H - 60} stroke="rgba(245,240,232,0.07)" />
                  {w < WEEKS && <text x={dayX(w * 7 + 3.5)} y={H - 38} textAnchor="middle" className="adapt__tick">W{w + 1}</text>}
                </g>
              ))}
            {/* Workouts */}
            {WORKOUTS.map((day) => (
              <g key={day} style={{ opacity: day <= shownDays ? 1 : 0 }}>
                <rect x={dayX(day) - 3} y={baseline + 10} width={6} height={10} rx={1.5} fill="#FF7A3D" />
              </g>
            ))}
            {/* Synthesis */}
            <text x={left - 8} y={baseline + 4} textAnchor="end" className="adapt__axis">normal</text>
            <text x={left - 8} y={baseline - 150 + 4} textAnchor="end" className="adapt__axis">×2</text>
            <line x1={left} x2={right} y1={baseline} y2={baseline} stroke="rgba(245,240,232,0.18)" strokeDasharray="2 4" />
            {trace.length > 1 && <>
              <path d={`${trace.join(" ")} L${dayX(shownDays).toFixed(1)},${baseline} L${left},${baseline} Z`} fill="url(#mps-fill)" />
              <path d={trace.join(" ")} fill="none" stroke="#FF7A3D" strokeWidth={2} strokeLinejoin="round" />
            </>}
            <text x={left} y={28} className="adapt__label">PROTEIN SYNTHESIS · {window < 21 ? "the first week" : "ten weeks"}</text>
            {window < 21 && <text x={dayX(1.05)} y={baseline - 158} className="adapt__tick" style={{ opacity: span(t, 0.08, 0.14) }}>PEAK ~24 H</text>}
            {window < 21 && <text x={dayX(1.6)} y={baseline - 8} className="adapt__tick" style={{ opacity: span(t, 0.12, 0.18) }}>BACK TO NORMAL ~36–48 H</text>}
            {/* Strength and size, as lines along the bottom band */}
            <g style={{ opacity: smooth(span(t, 0.5, 0.62)) }}>
              <line x1={left} x2={right} y1={H - 62} y2={H - 62} stroke="rgba(245,240,232,0.12)" />
              <path d={line(strength, H - 100, H - 64)} fill="none" stroke="#F5F0E8" strokeWidth={2} />
              <path d={line(size, H - 100, H - 64)} fill="none" stroke="#4F8BFF" strokeWidth={2} />
              <text x={right} y={H - 104} textAnchor="end" className="adapt__label"><tspan fill="#F5F0E8">STRENGTH</tspan>  <tspan fill="#4F8BFF">SIZE</tspan></text>
            </g>
          </svg>
          <figcaption className="adapt__fiber" aria-hidden="true" style={{ opacity: smooth(span(t, 0.5, 0.62)) }}>
            <svg viewBox="0 0 100 100" width={110} height={110}>
              <circle cx={50} cy={50} r={fiberRadius} fill="#3A1A16" stroke="#7A3A2C" strokeWidth={1.5} />
              {Array.from({ length: strands }, (_, i) => {
                const ring = i < 7 ? 0 : 1;
                const n = ring ? strands - 7 : 7;
                const k = ring ? i - 7 : i;
                const r = ring ? fiberRadius * 0.68 : (k === 0 ? 0 : fiberRadius * 0.34);
                const a = (k / Math.max(1, n - (ring ? 0 : 1))) * Math.PI * 2;
                return <circle key={i} cx={50 + Math.cos(a) * r} cy={50 + Math.sin(a) * r} r={4.2} fill="#B8503A" />;
              })}
            </svg>
            <span className="mono">ONE FIBER · {strands} STRANDS</span>
            <span className="adapt__fiber-note">Schematic. A real fiber holds hundreds.</span>
          </figcaption>
        </figure>
      </div>
      <div className="sr-only">
        {BEATS.map((beat) => <p key={beat.title}><strong>{beat.title}</strong> {beat.body}</p>)}
      </div>
    </section>
  );
}
