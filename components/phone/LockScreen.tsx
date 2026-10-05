"use client";

import { useState, type Dispatch } from "react";
import { formatWeight, isExerciseDone, type WorkoutAction, type WorkoutState } from "@/lib/workout";
import { StatusBar } from "./Phone";

/** The workout Live Activity on the Lock Screen (components/live-activity/WorkoutLiveActivityLayout.tsx). */
export function LockScreen({ state, dispatch }: { state: WorkoutState; dispatch: Dispatch<WorkoutAction> }) {
  const exercise = state.exercises[state.exercise];
  const set = exercise.sets[state.set];
  const done = isExerciseDone(exercise);
  const [pending, setPending] = useState(false);
  const setNumber = done ? exercise.sets.length : state.set + 1;
  const total = exercise.sets.length;

  const complete = () => {
    if (pending || done) return;
    setPending(true);
    setTimeout(() => {
      dispatch({ type: "log" });
      setPending(false);
    }, 280);
  };

  return (
    <div className="screen lock">
      <div className="lock__wallpaper" aria-hidden="true" />
      <StatusBar hidden />
      <p className="lock__date" aria-hidden="true">Thursday 8 October</p>
      <p className="lock__time" aria-hidden="true">9:41</p>

      <div className="activity" role="group" aria-label={`Live Activity. ${exercise.name}, set ${setNumber} of ${total}`}>
        <div className="activity__header">
          <span className="activity__name">
            <span className="activity__mark" aria-hidden="true"><i /><i /></span>
            {exercise.name}
          </span>
          <span className="activity__set" aria-hidden="true">
            <small>SET</small><b>{setNumber}</b><span>/ {total}</span>
          </span>
        </div>
        <div className="activity__progress" aria-hidden="true">
          {exercise.sets.slice(0, 6).map((item, index) => (
            <i key={index} className={item.done ? "is-done" : index === state.set ? "is-current" : ""} />
          ))}
        </div>
        <div className="activity__controls">
          <Value label="weight" unit="kg" value={formatWeight(set.weight)} disabled={done}
            onDecrease={() => dispatch({ type: "weight", value: set.weight - 2.5 })}
            onIncrease={() => dispatch({ type: "weight", value: set.weight + 2.5 })} />
          <span className="activity__divider" aria-hidden="true" />
          <Value label="reps" unit="reps" value={String(set.reps)} disabled={done}
            onDecrease={() => dispatch({ type: "reps", value: set.reps - 1 })}
            onIncrease={() => dispatch({ type: "reps", value: set.reps + 1 })} />
          <button type="button" className={`activity__done${pending ? " is-pending" : ""}`} onClick={complete} disabled={done}
            aria-label="Complete set">
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 12.5 10.5 16.5 18 8" fill="none" stroke="#17120F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>

      <div className="lock__shortcuts" aria-hidden="true">
        <span><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6c0 2-2 2-2 4v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V10c0-2-2-2-2-4V2h12z" /><path d="M6 6h12" /><path d="M12 12v2" /></svg></span>
        <span><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg></span>
      </div>
    </div>
  );
}

function Value({ value, unit, label, onDecrease, onIncrease, disabled }: {
  value: string; unit: string; label: string; onDecrease: () => void; onIncrease: () => void; disabled: boolean;
}) {
  return (
    <span className="activity__value">
      <button type="button" onClick={onDecrease} disabled={disabled} aria-label={`Decrease ${label}`}>−</button>
      <span className="activity__number" aria-live="polite"><b>{value}</b><small>{unit}</small></span>
      <button type="button" onClick={onIncrease} disabled={disabled} aria-label={`Increase ${label}`}>+</button>
    </span>
  );
}
