import type { CSSProperties } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
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
const AXIS = { min: 67.5, max: 85, ticks: [70, 75, 80, 85] };
const CHART = { w: 520, h: 190, left: 6, right: 44, top: 12, bottom: 12 };
const px = (index: number) => CHART.left + (index / (BENCH.length - 1)) * (CHART.w - CHART.left - CHART.right);
const py = (value: number) => CHART.top + (1 - (value - AXIS.min) / (AXIS.max - AXIS.min)) * (CHART.h - CHART.top - CHART.bottom);

const LIFTS = [
  { name: "Bench Press", set: "82.5 kg × 8", when: "Today" },
  { name: "Deadlift", set: "140 kg × 5", when: "2 days ago" },
  { name: "Barbell Squat", set: "100 kg × 6", when: "4 days ago" },
];

/** The Progress tab (app/(tabs)/profile.tsx, features/progress): Your strength, a lift's graph, Highlights and Your lifts. */
export function Progress() {
  return (
    <section className="progress" id="progress" aria-labelledby="progress-title">
      <Reveal className="section-head">
        <p className="eyebrow">PROGRESS</p>
        <h2 id="progress-title" className="section-title">Progress has substance.</h2>
        <p className="section-body">The muscles you’ve trained, how each lift is moving, and the highlights worth knowing.</p>
      </Reveal>

      <div className="progress__board">
        <Reveal className="strength-card" aria-label="Your strength, this week. 8 muscles trained in 3 workouts.">
          <div className="strength-card__head">
            <span className="bm-label mono">YOUR STRENGTH</span>
            <span className="bm-seg bm-seg--small" aria-hidden="true"><span className="is-on">This week</span><span>Last 4 weeks</span></span>
          </div>
          <img src="/app/body-front.webp" alt="" width={490} height={885} loading="lazy" decoding="async" />
          <p className="strength-card__count">8 muscles trained</p>
          <p className="strength-card__note">In 3 workouts. Tap a muscle to see the lifts that train it.</p>
        </Reveal>

        <Reveal className="graph-card" delay={80} style={{ "--c": muscle.chest } as CSSProperties}
          aria-label="Bench Press. Last time, 82.5 kg × 8. Improving, up 12.5 kg since 21 Aug.">
          <div className="graph-card__head">
            <span><b>Bench Press</b><small><i />Chest · also front delts, triceps</small></span>
          </div>
          <p className="bm-label mono">LAST TIME</p>
          <p className="graph-card__value mono"><b>82.5 kg × 8</b><small>Today</small></p>
          <p className="graph-card__trend"><Icon name="trendingUp" size={14} stroke={2.2} color={color.accent} /><b>Improving</b>Up 12.5 kg since 21 Aug (+17.9%).</p>
          <div className="graph-card__chart">
            <div className="graph-card__tabs" aria-hidden="true"><span className="is-on">Best set</span><span>Est. 1RM</span></div>
            <svg viewBox={`0 0 ${CHART.w} ${CHART.h}`} role="img" aria-label="Bench Press best set, rising from 70 kg to 82.5 kg">
              {AXIS.ticks.map((tick) => (
                <g key={tick}>
                  <line x1={CHART.left} x2={CHART.w - CHART.right} y1={py(tick)} y2={py(tick)} stroke="rgba(245,240,232,0.06)" />
                  <text x={CHART.w - 4} y={py(tick) + 4} textAnchor="end" className="graph-card__tick">{tick}</text>
                </g>
              ))}
              <polyline points={BENCH.map((value, index) => `${px(index)},${py(value)}`).join(" ")} fill="none" stroke={color.accent} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
              {BENCH.map((value, index) => {
                const record = index > 0 && value > BENCH[index - 1];
                return <circle key={index} cx={px(index)} cy={py(value)} r={record ? 4.5 : 3} fill={record ? "#13110E" : color.accent} stroke={record ? "#FFE84A" : "none"} strokeWidth="2" />;
              })}
            </svg>
            <p className="graph-card__caption">Heaviest set at 8 reps. <span className="gold">Gold</span> marks a record.</p>
          </div>
        </Reveal>

        <Reveal className="highlight-card card-surface" delay={140} style={{ "--c": muscle.chest } as CSSProperties}>
          <p className="highlight-card__eyebrow mono"><i />CHEST<span>HIGHLIGHT</span></p>
          <p className="highlight-card__title">Your chest lifts are improving together.</p>
          <p className="highlight-card__body">Bench Press and Incline Dumbbell Press are both trending up.</p>
          <p className="highlight-card__meta mono">Last 12 weeks</p>
        </Reveal>

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
