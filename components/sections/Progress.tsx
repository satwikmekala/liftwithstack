"use client";

import { useState, type CSSProperties } from "react";
import { BodyFigure } from "@/components/body/BodyFigure";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { LAST4_STATES, MUSCLE_LIFTS, WEEK_STATES, regionsOf } from "@/lib/body/demo";
import { REGION_INFO, regionColor, type BodyRegion, type BodySide } from "@/lib/body/regions";
import { artFor } from "@/lib/exercises";
import { color, muscle } from "@/lib/tokens";

const WEEK = [
  { letter: "M", name: "Monday", state: "trained" },
  { letter: "T", name: "Tuesday", state: "rest" },
  { letter: "W", name: "Wednesday", state: "trained" },
  { letter: "T", name: "Thursday", state: "trained", today: true },
  { letter: "F", name: "Friday", state: "rest" },
  { letter: "S", name: "Saturday", state: "planned" },
  { letter: "S", name: "Sunday", state: "rest" },
] as const;

/** Bench Press, heaviest set at 8 reps, one point per workout; a gold point set a record. */
const BENCH = [70, 70, 72.5, 72.5, 75, 75, 77.5, 77.5, 80, 80, 82.5];
const DATES = ["21 Aug", "2 Oct", "12 Nov"];
const AXIS = { min: 67.5, max: 85, ticks: [70, 75, 80, 85] };
const CHART = { w: 520, h: 200, left: 6, right: 40, top: 12, bottom: 26 };
const px = (index: number) => CHART.left + (index / (BENCH.length - 1)) * (CHART.w - CHART.left - CHART.right);
const py = (value: number) => CHART.top + (1 - (value - AXIS.min) / (AXIS.max - AXIS.min)) * (CHART.h - CHART.top - CHART.bottom);
const LINE = BENCH.map((value, index) => `${px(index)},${py(value)}`).join(" ");

const LIFTS = [
  { name: "Bench Press", set: "82.5 kg × 8", when: "Today" },
  { name: "Barbell Squat", set: "100 kg × 6", when: "Yesterday" },
  { name: "Deadlift", set: "140 kg × 5", when: "3 days ago" },
];

const TIMEFRAMES = [
  { id: "week", label: "This week", states: WEEK_STATES, workouts: 3 },
  { id: "last4", label: "Last 4 weeks", states: LAST4_STATES, workouts: 13 },
] as const;

/** The Progress tab (app/(tabs)/profile.tsx, features/progress): Your strength on the 3D figure, a lift's graph, Highlights and Your lifts. */
export function Progress() {
  const [timeframe, setTimeframe] = useState<(typeof TIMEFRAMES)[number]["id"]>("week");
  const [side, setSide] = useState<BodySide>("front");
  const [selected, setSelected] = useState<BodyRegion | null>(null);
  const frame = TIMEFRAMES.find((item) => item.id === timeframe)!;
  const count = regionsOf(frame.states).length;
  const lifts = selected ? MUSCLE_LIFTS[selected] ?? [] : [];
  const trained = selected ? Boolean(frame.states[selected]) : false;

  return (
    <section className="progress" id="progress" aria-labelledby="progress-title">
      <Reveal className="section-head">
        <p className="eyebrow">PROGRESS</p>
        <h2 id="progress-title" className="section-title">Progress has substance.</h2>
        <p className="section-body">The muscles you’ve trained, how each lift is moving, and the highlights worth knowing.</p>
      </Reveal>

      <div className="progress__board">
        <Reveal className="strength-card">
          <div className="strength-card__head">
            <span className="bm-label mono">YOUR STRENGTH</span>
            <div className="bm-seg bm-seg--small" role="group" aria-label="Your strength timeframe">
              {TIMEFRAMES.map((item) => (
                <button key={item.id} type="button" className={timeframe === item.id ? "is-on" : ""} aria-pressed={timeframe === item.id} onClick={() => setTimeframe(item.id)}>{item.label}</button>
              ))}
            </div>
          </div>
          <div className="strength-card__figure">
            <BodyFigure states={frame.states} side={side} selected={selected} onSelect={setSelected} onSideChange={setSide}
              label="Stack’s 3D figure with every muscle trained in this timeframe lit. Drag to turn it, tap a muscle for its lifts." />
            <div className="bm-seg bm-seg--small strength-card__side" role="group" aria-label="Side of the body">
              <button type="button" className={side === "front" ? "is-on" : ""} aria-pressed={side === "front"} onClick={() => setSide("front")}>Front</button>
              <button type="button" className={side === "back" ? "is-on" : ""} aria-pressed={side === "back"} onClick={() => setSide("back")}>Back</button>
            </div>
            <p className="strength-card__drag"><Icon name="refresh" size={13} stroke={2} />Drag to turn</p>
          </div>
          <div className="strength-card__foot" aria-live="polite">
            {selected ? (
              <div className="strength-muscle" style={{ "--c": regionColor(selected) } as CSSProperties}>
                <p className="strength-muscle__head">
                  <span><i />{REGION_INFO[selected].name}</span>
                  <button type="button" onClick={() => setSelected(null)} aria-label="Show all muscles">Show all muscles</button>
                </p>
                {lifts.length > 0 && trained ? lifts.map((lift) => (
                  <div key={lift.name} className="strength-muscle__lift">
                    <img src={artFor(lift.name)?.image ?? "/exercises/bench-press.webp"} alt="" loading="lazy" decoding="async" />
                    <span><b>{lift.name}</b><small className="mono">{lift.set}</small></span>
                    <span className={`strength-muscle__trend${lift.trend === "Improving" ? " is-up" : ""}`}>
                      <Icon name={lift.trend === "Improving" ? "trendingUp" : "minus"} size={13} stroke={2.4} />{lift.trend}
                    </span>
                  </div>
                )) : <p className="strength-card__note">{timeframe === "week" ? "Not trained this week. Last 4 weeks shows your recent training." : "Nothing trained it in the last 4 weeks."}</p>}
              </div>
            ) : (
              <>
                <p className="strength-card__count">{count} muscles trained</p>
                <p className="strength-card__note">In {frame.workouts} workouts. Tap a muscle to see the lifts that train it.</p>
              </>
            )}
          </div>
        </Reveal>

        <div className="progress__column">
          <Reveal className="graph-card" delay={80} style={{ "--c": muscle.chest } as CSSProperties}
            aria-label="Bench Press. Last time, 82.5 kg × 8. Improving, up 12.5 kg since 21 Aug.">
            <div className="graph-card__top">
              <div className="graph-card__head">
                <b>Bench Press</b>
                <small><i />Chest · also front delts, triceps</small>
              </div>
              <img src={artFor("Bench Press").image} alt="" loading="lazy" decoding="async" />
            </div>
            <div className="graph-card__stats">
              <div>
                <p className="bm-label mono">LAST TIME</p>
                <p className="graph-card__value mono"><b>82.5 kg × 8</b></p>
              </div>
              <p className="graph-card__trend"><span><Icon name="trendingUp" size={14} stroke={2.4} />Improving</span>Up 12.5 kg since 21 Aug (+17.9%)</p>
            </div>
            <div className="graph-card__chart">
              <div className="graph-card__tabs" aria-hidden="true"><span className="is-on">Best set</span><span>Est. 1RM</span></div>
              <svg viewBox={`0 0 ${CHART.w} ${CHART.h}`} role="img" aria-label="Bench Press best set, rising from 70 kg to 82.5 kg over twelve weeks">
                <defs>
                  <linearGradient id="bench-fill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor={color.accent} stopOpacity="0.22" /><stop offset="1" stopColor={color.accent} stopOpacity="0" />
                  </linearGradient>
                </defs>
                {AXIS.ticks.map((tick) => (
                  <g key={tick}>
                    <line x1={CHART.left} x2={CHART.w - CHART.right} y1={py(tick)} y2={py(tick)} stroke="rgba(245,240,232,0.06)" />
                    <text x={CHART.w - 4} y={py(tick) + 4} textAnchor="end" className="graph-card__tick">{tick}</text>
                  </g>
                ))}
                <polygon points={`${px(0)},${CHART.h - CHART.bottom} ${LINE} ${px(BENCH.length - 1)},${CHART.h - CHART.bottom}`} fill="url(#bench-fill)" />
                <polyline className="graph-card__line" pathLength={1} points={LINE} fill="none" stroke={color.accent} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                {BENCH.map((value, index) => {
                  const record = index > 0 && value > BENCH[index - 1];
                  return <circle key={index} className="graph-card__dot" style={{ "--i": index } as CSSProperties} cx={px(index)} cy={py(value)} r={record ? 5 : 3.2} fill={record ? "#1d1915" : color.accent} stroke={record ? "#FFE84A" : "none"} strokeWidth="2.2" />;
                })}
                {DATES.map((date, index) => (
                  <text key={date} x={index === 0 ? CHART.left : index === 1 ? (CHART.w - CHART.right + CHART.left) / 2 : CHART.w - CHART.right} y={CHART.h - 6}
                    textAnchor={index === 0 ? "start" : index === 1 ? "middle" : "end"} className="graph-card__tick">{date}</text>
                ))}
              </svg>
              <p className="graph-card__caption">Heaviest set at 8 reps. <span className="gold">Gold</span> marks a record.</p>
            </div>
          </Reveal>

          <Reveal className="highlight-card card-surface" delay={140} style={{ "--c": muscle.chest } as CSSProperties}>
            <div>
              <p className="highlight-card__eyebrow mono"><i />CHEST</p>
              <p className="highlight-card__title">Your chest lifts are improving together.</p>
              <p className="highlight-card__body">Bench Press and Incline Dumbbell Press are both trending up.</p>
              <p className="highlight-card__meta mono">2 lifts improving · Last 12 weeks</p>
            </div>
            <svg className="highlight-card__spark" viewBox="0 0 120 64" aria-hidden="true">
              <polyline points="2,54 22,50 42,44 62,40 82,28 102,22 118,10" fill="none" stroke={color.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="2,60 22,58 42,52 62,50 82,42 102,34 118,26" fill="none" stroke={color.accent} strokeOpacity="0.45" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="118" cy="10" r="4" fill={color.accent} />
            </svg>
          </Reveal>
        </div>

        <Reveal className="week-card card-surface" style={{ "--c": color.accent } as CSSProperties}
          aria-label="This week. 3 of 4 training days. 1 to go.">
          <div className="week-card__heading">
            <span className="week-card__copy"><span className="week-card__label">This week</span><span className="week-card__caption">1 to go</span></span>
            <span className="week-card__count">3<small>/4</small></span>
          </div>
          <div className="week-card__days" aria-hidden="true">
            {WEEK.map((day) => (
              <span key={day.name} className="week-card__day">
                <span className={`week-card__letter${"today" in day ? " is-today" : ""}`}>{day.letter}</span>
                <span className={`week-card__mark is-${day.state}`}>
                  {day.state === "trained" ? <Icon name="check" size={13} stroke={3} color={color.ink} /> : day.state === "planned" ? "○" : "–"}
                </span>
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal className="lifts-card" delay={80} aria-label="Your lifts">
          <p className="lifts-card__head"><span className="bm-label mono">YOUR LIFTS</span><span>See all<Icon name="chevronRight" size={14} color={color.ash} /></span></p>
          {LIFTS.map((lift) => (
            <div key={lift.name} className="lifts-card__row">
              <img src={artFor(lift.name).image} alt="" loading="lazy" decoding="async" />
              <span><b>{lift.name}</b><small className="mono">{lift.set}</small></span>
              <small>{lift.when}</small>
              <Icon name="chevronRight" size={16} color={color.ash} />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
