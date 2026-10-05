"use client";

import { useEffect, useRef, useState, type CSSProperties, type Dispatch } from "react";
import { Icon } from "@/components/ui/Icon";
import { color } from "@/lib/tokens";
import { formatWeight, isExerciseDone, SUGGESTED_WEIGHT, type WorkoutAction, type WorkoutState } from "@/lib/workout";
import { StatusBar } from "./Phone";
import { Wheel } from "./Wheel";

const WHOLE = Array.from({ length: 301 }, (_, index) => index);
const TENTHS = Array.from({ length: 10 }, (_, index) => index);
const REPS = Array.from({ length: 50 }, (_, index) => index + 1);

const percent = (value: number, previous: number | null) => {
  if (previous === null || previous <= 0) return null;
  const change = Math.round(((value - previous) / previous) * 100);
  return `${change >= 0 ? "+" : ""}${change}%`;
};

/** The active workout (app/workout.tsx with ActiveSetCard), Push in progress. */
export function LoggerScreen({ state, dispatch }: { state: WorkoutState; dispatch: Dispatch<WorkoutAction> }) {
  const exercise = state.exercises[state.exercise];
  const done = isExerciseDone(exercise);
  const set = exercise.sets[state.set];
  const previous = state.set > 0 ? exercise.sets[state.set - 1] : null;
  const [confirming, setConfirming] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const log = () => {
    if (confirming || done) return;
    setConfirming(true);
    timer.current = setTimeout(() => {
      dispatch({ type: "log" });
      setConfirming(false);
    }, 320);
  };

  const whole = Math.floor(set.weight);
  const tenth = Math.round((set.weight - whole) * 10);
  const accent = { "--c": color.accent } as CSSProperties;
  const longName = exercise.name.length > 18;

  return (
    <div className="screen logger" style={accent}>
      <StatusBar />
      <div className="logger__content">
        <div className="logger__header">
          <span className="day-label"><span className="day-label__dot" />PUSH</span>
          <span className="logger__actions" aria-hidden="true">
            <span className="glass-button glass-button--wide"><Icon name="repeat" size={18} color={color.ash} />Change</span>
            <span className="glass-button"><Icon name="chevronDown" size={20} color={color.ash} /></span>
            <span className="glass-button"><Icon name="x" size={20} color={color.ash} /></span>
          </span>
        </div>
        <div className="segments" aria-hidden="true">
          {state.exercises.map((item, index) => (
            <span key={item.name} className={`segments__item${index === state.exercise ? " is-current" : isExerciseDone(item) ? " is-done" : ""}`} />
          ))}
        </div>
        <div key={`title-${state.exercise}`} className="logger__title-row enter-right">
          <p className={`logger__title${longName ? " logger__title--long" : ""}`}>{exercise.name}</p>
          <span className="logger__info" aria-hidden="true"><Icon name="info" size={20} color={color.ash} stroke={1.8} /></span>
          {done && <span className="logger__done"><Icon name="check" size={16} stroke={3} color={color.accent} />DONE</span>}
        </div>

        <div key={`body-${state.exercise}`} className="enter-right">
          <div className="set-rail" role="list" aria-label={`${exercise.name} sets`}>
            {exercise.sets.map((item, index) => {
              const current = index === state.set && !item.done;
              const label = item.done ? `${formatWeight(item.weight)} × ${item.reps}` : current ? "Now" : null;
              return (
                <span key={index} role="listitem" className={`set-pip${current ? " is-current" : ""}${item.done ? " is-done" : ""}`}
                  aria-label={item.done ? `Set ${index + 1}, ${formatWeight(item.weight)} kg, ${item.reps} reps` : `Set ${index + 1}${current ? ", current" : ""}`}>
                  <span className="set-pip__glyph">
                    <span className="set-pip__number">{index + 1}</span>
                    <span className="set-pip__check"><Icon name="check" size={15} stroke={2.6} color={color.accent} /></span>
                  </span>
                  {label && <span className="set-pip__label">{label}</span>}
                </span>
              );
            })}
          </div>

          <div className={`set-card${done ? " is-finished" : ""}`}>
            <div className="set-card__measure">
              <div className="set-card__column set-card__column--weight">
                <p className="set-card__caption">Weight{!done && percent(set.weight, previous?.weight ?? null) && <span className="set-card__delta">{percent(set.weight, previous!.weight)}</span>}</p>
                <div className="weight-picker">
                  <span className="weight-picker__band" aria-hidden="true" />
                  <Wheel values={WHOLE} value={whole} align="right" label="Weight in kilograms, whole number"
                    onChange={(value) => dispatch({ type: "weight", value: value + tenth / 10 })} />
                  <span className="weight-picker__dot" aria-hidden="true">.</span>
                  <Wheel values={TENTHS} value={tenth} align="left" label="Weight in kilograms, decimal digit"
                    onChange={(value) => dispatch({ type: "weight", value: whole + value / 10 })} />
                </div>
              </div>
              <div className="set-card__column set-card__column--reps">
                <p className="set-card__caption">Reps{!done && percent(set.reps, previous?.reps ?? null) && <span className="set-card__delta">{percent(set.reps, previous!.reps)}</span>}</p>
                <div className="reps-picker">
                  <span className="weight-picker__band" aria-hidden="true" />
                  <Wheel values={REPS} value={set.reps} label="Reps" onChange={(value) => dispatch({ type: "reps", value })} />
                </div>
              </div>
            </div>
            {state.suggestion && !done && set.weight < SUGGESTED_WEIGHT && (
              <button type="button" className="suggestion" onClick={() => dispatch({ type: "suggest" })}
                aria-label="Last time 80 kg. Use suggested 82.5 kg">
                Last 80 · Try 82.5
              </button>
            )}
          </div>

          <div className="set-controls">
            <button type="button" className="set-controls__skip" tabIndex={-1} aria-hidden="true">Skip</button>
            <span className="unit-toggle" aria-hidden="true">
              <span className="unit-toggle__indicator" />
              <span className="is-selected">kg</span>
              <span>lb</span>
            </span>
            <button type="button" className={`log-button${confirming ? " is-confirming" : ""}`} onClick={log} disabled={done}
              aria-label={`Log set ${state.set + 1}`}>
              <span className="log-button__label">Log</span>
              <span className="log-button__check"><Icon name="check" size={24} stroke={2.8} color={color.ink} /></span>
            </button>
          </div>

          {state.exercise < state.exercises.length - 1 && !done && (
            <div className="up-next" aria-hidden="true">
              <span className="up-next__copy">
                <span className="up-next__eyebrow">UP NEXT</span>
                <span className="up-next__name"><span className="up-next__dot" />{state.exercises[state.exercise + 1].name}</span>
              </span>
              <span className="up-next__sets">{state.exercises[state.exercise + 1].sets.length} SETS</span>
              <Icon name="chevronRight" size={20} color={color.ashDim} />
            </div>
          )}
        </div>
      </div>
      <div className="action-pill" aria-hidden="true">
        <span><Icon name="history" size={22} stroke={1.8} color={color.bone} /></span>
        <i />
        <span><Icon name="message" size={22} stroke={1.8} color={color.bone} /></span>
      </div>
    </div>
  );
}
