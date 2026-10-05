"use client";

import { useState, type CSSProperties } from "react";
import { scrollToPosition } from "@/lib/scroll";
import { muscle } from "@/lib/tokens";

// Curated examples of the app's paste → editable draft flow, not a live parser.
// The current editor imports structure only; targets and notes are not saved.
const SAMPLES = [
  {
    label: "Push / Pull",
    text: "Push\nbench 3x8\nincline db 3x10\nlat raises 4x12\n\nPull\ndeadlift 3x5\nlat pulldown 3x10",
    workouts: [
      { name: "Push", color: muscle.chest, exercises: ["Bench Press", "Incline Dumbbell Press", "Lateral Raise"] },
      { name: "Pull", color: muscle.back, exercises: ["Deadlift", "Lat Pulldown"] },
    ],
  },
  {
    label: "Full body",
    text: "Full Body\nBack squat — 3 x 5\nBench press — 3 x 8\nSeated cable row — 3 x 10\nRomanian deadlift — 3 x 8",
    workouts: [
      { name: "Full Body", color: muscle.legs, exercises: ["Back Squat", "Bench Press", "Seated Cable Row", "Romanian Deadlift"] },
    ],
  },
  {
    label: "From Notes",
    text: "gym notes\n\nPush A:\n• BENCH - 3x8\n• incline db, 3x10\n• lat raises 12/12/12\n\nPull A:\n1) deadlift 3x5\n2) seated row 3x10",
    workouts: [
      { name: "Push A", color: muscle.chest, exercises: ["Bench Press", "Incline Dumbbell Press", "Lateral Raise"] },
      { name: "Pull A", color: muscle.back, exercises: ["Deadlift", "Seated Cable Row"] },
    ],
  },
];

export function RoutineImportDemo() {
  const [selected, setSelected] = useState(0);
  const [read, setRead] = useState(false);
  const sample = SAMPLES[selected];
  const exercises = sample.workouts.reduce((count, workout) => count + workout.exercises.length, 0);

  return (
    <div className="routine-demo">
      <fieldset className="routine-demo__choices">
        <legend>Try an example</legend>
        <div className="routine-demo__options">
          {SAMPLES.map((item, index) => (
            <label key={item.label} className="routine-demo__choice">
              <input type="radio" name="routine-example" value={index} checked={index === selected}
                onChange={() => { setSelected(index); setRead(false); }} />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="paste">
        <div className="paste__input">
          <h3 className="paste__label">Paste your routine</h3>
          <pre className="paste__text" aria-label={`${sample.label} example text`}>{sample.text}</pre>
          <button type="button" className="routine-demo__read" aria-controls="routine-draft" onClick={() => {
            setRead(true);
            if (window.matchMedia("(max-width: 960px)").matches) requestAnimationFrame(() => {
              const result = document.getElementById("routine-draft");
              if (result) scrollToPosition(window.scrollY + result.getBoundingClientRect().top - 80);
            });
          }} disabled={read}>
            {read ? "Routine ready" : "Read routine"}
          </button>
          <p className="routine-demo__note">Example demo · Try your own in Stack.</p>
        </div>
        <span className="paste__arrow" aria-hidden="true">
          <svg width="40" height="12" viewBox="0 0 40 12"><path d="M0 6h37M32 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
        <div id="routine-draft" className="paste__result" aria-label="Routine draft">
          {read ? <div key={selected} className="routine-demo__draft">
            <p className="routine-demo__draft-label">Review your routine</p>
            {sample.workouts.map((workout, index) => (
              <article key={workout.name} className="routine-workout" style={{ "--c": workout.color } as CSSProperties}>
                <p className="routine-workout__head">
                  <span className="routine-workout__dot" aria-hidden="true" />
                  <span className="routine-workout__letter">WORKOUT {String.fromCharCode(65 + index)}</span>
                  <span className="routine-workout__count">{workout.exercises.length} exercises</span>
                </p>
                <h3 className="routine-workout__name">{workout.name}</h3>
                <ul>{workout.exercises.map((name) => <li key={name}>{name}</li>)}</ul>
              </article>
            ))}
            <p className="routine-demo__note">Check the exercises before saving. Set targets and notes aren’t carried over yet.</p>
          </div> : <div className="routine-demo__empty">
            <span className="eyebrow">ROUTINE DRAFT</span>
            <p>Your workouts appear here.</p>
            <p>Choose an example, then read the routine.</p>
            <noscript>This demo needs JavaScript. Stack turns pasted text into workouts you can review and edit.</noscript>
          </div>}
        </div>
      </div>
      <p className="sr-only" role="status">{read ? `${sample.label} organized into ${sample.workouts.length} ${sample.workouts.length === 1 ? "workout" : "workouts"} and ${exercises} exercises. Review your routine below.` : `${sample.label} selected. Read routine to see the draft.`}</p>
    </div>
  );
}
