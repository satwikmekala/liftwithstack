"use client";

import { useEffect, useState } from "react";
import { CAST_BEATS, CastStack } from "@/components/stack/CastStack";
import type { DemoBlock } from "@/lib/demo-block";
import { formatWeight } from "@/lib/workout";
import { StatusBar } from "./Phone";

/** Workout complete: the block is made (features/build/CastingScreen.tsx and castingCopy.ts). */
export function StackedScreen({ startedAt, demo }: { startedAt: number | null; demo?: DemoBlock | null }) {
  const [now, setNow] = useState(0);
  useEffect(() => {
    if (startedAt === null) return;
    const timer = setInterval(() => setNow(performance.now()), 100);
    return () => clearInterval(timer);
  }, [startedAt]);

  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const elapsed = startedAt === null ? -1 : reduce ? Number.POSITIVE_INFINITY : now - startedAt;
  const beat = elapsed >= CAST_BEATS.land + 250 ? 4 : elapsed >= CAST_BEATS.gold ? 3 : elapsed >= CAST_BEATS.grow ? 2 : 1;

  return (
    <div className="screen stacked">
      <div className="stacked__glow" aria-hidden="true" />
      <StatusBar />
      <div className="stacked__header">
        <span className="stacked__brand">YOUR STACK</span>
        <span className={`stacked__skip${beat === 4 ? " is-hidden" : ""}`} aria-hidden="true">Skip</span>
      </div>
      <div className="stacked__copy" aria-live="polite">
        {demo ? <div className="beat is-on">
          <p className="stacked__kicker">PUSH · DEMO COMPLETE</p>
          <p className="stacked__title">{beat === 4 ? "Your first block." : "You put in the work."}</p>
          <p className="stacked__caption">{beat === 4 ? "Find it at the top of the stack." : `${demo.sets} ${demo.sets === 1 ? "set" : "sets"} logged. Every one counts.`}</p>
        </div> : <>
        <div className={`beat${beat === 1 ? " is-on" : ""}`}>
          <p className="stacked__kicker">PUSH · DONE</p>
        </div>
        <div className={`beat${beat === 2 ? " is-on" : ""}`}>
          <p className="stacked__title">Better than<br />last time.</p>
          <p className="stacked__label">WHAT MADE IT THICKER</p>
          <p className="stacked__row"><b>+2.5 kg</b><span>Bench Press</span><em>80 → 82.5 kg</em></p>
          <p className="stacked__row"><b>+2 reps</b><span>Lateral Raise</span><em>10 → 12</em></p>
        </div>
        <div className={`beat${beat === 3 ? " is-on" : ""}`}>
          <p className="stacked__label stacked__label--gold">PR</p>
          <p className="stacked__record">Bench Press · 82.5 kg × 8</p>
          <p className="stacked__caption">Your best yet.</p>
        </div>
        <div className={`beat${beat === 4 ? " is-on" : ""}`}>
          <p className="stacked__title stacked__title--large">Stacked.</p>
          <p className="stacked__caption">Third block this week.</p>
        </div>
        </>}
      </div>
      <div className="stacked__stage">
        <CastStack startedAt={startedAt} demo={demo} />
      </div>
      <div className={`stacked__metrics${beat === 4 ? " is-on" : ""}`}>
        <p><b>{demo ? `${formatWeight(demo.movedKg)} kg` : "4,280 kg"}</b><span>MOVED</span></p>
        <p><b>{demo ? demo.improved : 2}</b><span>LIFTS UP</span></p>
        <p><b>{demo ? demo.sets : 1}</b><span>{demo ? "SETS" : "PR"}</span></p>
      </div>
      <span className="stacked__done" aria-hidden="true">Done</span>
    </div>
  );
}
