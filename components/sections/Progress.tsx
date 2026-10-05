import type { CSSProperties } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
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

const LIFTS = [
  { name: "Bench Press", color: muscle.chest, date: "8 Oct", value: "82.5", reps: 8, previous: "80 kg × 8" },
  { name: "Deadlift", color: muscle.back, date: "5 Oct", value: "140", reps: 5, previous: "135 kg × 5" },
];

/** The Progress tab, at the size it is on iPhone (app/(tabs)/profile.tsx). */
export function Progress() {
  return (
    <section className="progress" aria-labelledby="progress-title">
      <Reveal className="section-head">
        <p className="eyebrow">PROGRESS</p>
        <h2 id="progress-title" className="section-title">Progress has substance.</h2>
        <p className="section-body">Your week, your top sets and every PR, kept in one place.</p>
      </Reveal>

      <div className="progress__board">
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

        {LIFTS.map((lift, index) => (
          <Reveal key={lift.name} delay={80 + index * 80} className="lift-card card-surface" style={{ "--c": lift.color } as CSSProperties}
            aria-label={`${lift.name}. Latest top set, ${lift.value} kg × ${lift.reps}, ${lift.date}. Previous top set, ${lift.previous}.`}>
            <span className="lift-card__mark" />
            <span className="lift-card__name">{lift.name}<Icon name="chevronRight" size={16} color={color.ash} /></span>
            <span className="lift-card__date">{lift.date}</span>
            <span className="lift-card__value"><b>{lift.value}</b><small>kg</small></span>
            <span className="lift-card__reps">× {lift.reps}</span>
            <span className="lift-card__prev"><span>Prev </span>{lift.previous}</span>
          </Reveal>
        ))}

        <Reveal className="record-row" delay={120}>
          <span className="record-row__icon"><Icon name="trophy" size={20} color={color.bone} /></span>
          <span className="record-row__copy"><b>Personal records</b><span>14 exercises tracked</span></span>
          <Icon name="chevronRight" size={18} color={color.ash} />
        </Reveal>
        <Reveal className="record-row" delay={200}>
          <span className="record-row__icon"><Icon name="history" size={20} color={color.bone} /></span>
          <span className="record-row__copy"><b>History</b><span>48 workouts logged</span></span>
          <Icon name="chevronRight" size={18} color={color.ash} />
        </Reveal>
      </div>
    </section>
  );
}
