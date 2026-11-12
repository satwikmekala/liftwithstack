import type { CSSProperties } from "react";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { color, muscle } from "@/lib/tokens";

const LIFTS = [
  { name: "Bench Press", color: muscle.chest, sets: "3 × 8", top: "82.5 kg", record: true },
  { name: "Incline Dumbbell Press", color: muscle.chest, sets: "3 × 10", top: "28 kg" },
  { name: "Triceps Pushdown", color: muscle.arms, sets: "3 × 12", top: "35 kg" },
];

/** The workout summary (app/workout-summary.tsx): what you did, the muscles it reached, any PRs, and Share. */
export function Recap() {
  return (
    <section className="recap" id="recap" aria-labelledby="recap-title">
      <div className="recap__stage">
        <Reveal className="recap-card card-surface" style={{ "--c": color.accent } as CSSProperties} aria-label="Workout summary in Stack, an example">
          <span className="summary__pill"><Icon name="check" size={13} stroke={3} color={color.accent} />WORKOUT COMPLETE</span>
          <p className="recap-card__title">Chest and Triceps</p>
          <p className="recap-card__date">Thursday, 12 Nov</p>
          <p className="recap-card__meta">3 exercises · 9 sets · 48 min</p>
          <p className="recap-card__pr"><Icon name="trophy" size={14} color={color.accent} />1 PR this workout</p>

          <div className="recap-card__muscles">
            <div>
              <p className="bm-label mono">MUSCLES WORKED</p>
              <ul>
                <li><i style={{ background: muscle.chest }} />Chest</li>
                <li><i style={{ background: muscle.arms }} />Triceps</li>
              </ul>
              <p className="bm-label mono">SECONDARY</p>
              <p className="recap-card__secondary">Upper chest · Front delts</p>
            </div>
            <img src="/app/torso-push.webp" alt="" width={720} height={770} loading="lazy" decoding="async" />
          </div>

          <p className="bm-label mono">EXERCISES COMPLETED</p>
          <ul className="recap-card__lifts">
            {LIFTS.map((lift) => (
              <li key={lift.name} style={{ "--c": lift.color } as CSSProperties}>
                <i />
                <span><b>{lift.name}</b><small>{lift.sets}{lift.record ? <em>PR</em> : null}</small></span>
                <span className="mono">{lift.top}</span>
              </li>
            ))}
          </ul>
          <div className="recap-card__actions" aria-hidden="true">
            <span><Icon name="share" size={17} stroke={2} />Share</span>
            <span>Done</span>
          </div>
        </Reveal>
      </div>

      <Reveal className="recap__copy">
        <p className="eyebrow">WORKOUT SUMMARY</p>
        <h2 id="recap-title" className="section-title">Every workout gets a proper recap.</h2>
        <p className="section-body">What you hit, any PRs, and a card for your Story.</p>
        <ul className="circle__points">
          <li><Icon name="trophy" size={18} stroke={1.8} /><span><b>PRs called out.</b> Beat your best and the summary says so, set by set.</span></li>
          <li><Icon name="share" size={18} stroke={1.8} /><span><b>Share it your way.</b> Pick a card for the workout, a PR or your whole week, and post it to a Story.</span></li>
          <li><Icon name="pencil" size={17} stroke={1.8} /><span><b>Fix it later.</b> Rename it, edit a set or delete it from the same screen.</span></li>
        </ul>
      </Reveal>
    </section>
  );
}
