"use client";

import { useState } from "react";

type ExerciseFlowState = "logging" | "complete" | "pr";

export interface WorkoutExerciseFlowProps {
  readonly compact?: boolean;
  readonly interactive?: boolean;
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function SwapIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 3 4 4-4 4" /><path d="M4 7h16" />
      <path d="m8 21-4-4 4-4" /><path d="M20 17H4" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" /><path d="M8 6H5v2a4 4 0 0 0 4 4M16 6h3v2a4 4 0 0 1-4 4M12 13v4M8 20h8M9 17h6" />
    </svg>
  );
}

function SessionHeader({ complete }: { readonly complete?: boolean }) {
  return (
    <>
      <div className="stack-session__toolbar">
        <span className="stack-session__day"><i />CHEST DAY</span>
        <div className="stack-session__toolbar-actions">
          <span className="stack-session__change"><SwapIcon />Change</span>
          <span className="stack-session__close"><CloseIcon /></span>
        </div>
      </div>
      <div className="stack-session__title-row">
        <h4>Bench Press</h4>
        {complete && <span className="stack-session__finished"><CheckIcon /></span>}
      </div>
      <div className="stack-session__progress" aria-hidden="true">
        <span className="is-active" /><span /><span /><span />
      </div>
    </>
  );
}

function SetStepper({ label, value, unit, highlight }: { readonly label: string; readonly value: string; readonly unit: string; readonly highlight?: boolean }) {
  return (
    <div className="stack-session__stepper">
      <span>{label}</span>
      <div><i>−</i><strong className={highlight ? "is-highlight" : undefined}>{value}</strong><i>+</i></div>
      <small>{unit}</small>
    </div>
  );
}

function LoggingState({ advance, interactive }: { readonly advance: () => void; readonly interactive: boolean }) {
  return (
    <>
      <SessionHeader />
      <div className="stack-session__set-track" aria-label="Set one is active; sets two and three are upcoming">
        <div className="is-now"><i /><span>NOW</span></div>
        <div><i /><span>−</span></div>
        <div><i /><span>−</span></div>
      </div>
      <div className="stack-session__entry-card">
        <div className="stack-session__entry-heading"><strong>Set 1</strong><span>RECOMMENDED</span></div>
        <div className="stack-session__steppers">
          <SetStepper label="WEIGHT" value="40" unit="kg" highlight />
          <SetStepper label="REPS" value="8" unit="reps" />
        </div>
        <div className="stack-session__entry-actions">
          <button type="button" onClick={interactive ? advance : undefined} tabIndex={interactive ? 0 : -1}><CheckIcon />Log</button>
          <span>Skip</span>
        </div>
      </div>
      <div className="stack-session__up-next">
        <span>UP NEXT</span>
        <div><i /><strong>Incline Dumbbell Press</strong><small>3 SETS&nbsp; ›</small></div>
      </div>
    </>
  );
}

function CompleteState({ advance, interactive }: { readonly advance: () => void; readonly interactive: boolean }) {
  return (
    <>
      <SessionHeader complete />
      <div className="stack-session__completed-sets">
        {[1, 2, 3].map((set) => <div key={set}><span>SET {set}</span><strong>40 kg</strong><small>× 8 reps</small></div>)}
      </div>
      <p className="stack-session__prompt">Tap a set to edit it, push a little further, or move on.</p>
      <div className="stack-session__bonus-grid">
        <button type="button" tabIndex={-1} className="is-extra"><i>+</i><strong>Extra Set</strong><small>40 kg × 8</small></button>
        <button type="button" tabIndex={-1} className="is-drop"><i>↓</i><strong>Drop Set</strong><small>32.5 kg × 8</small></button>
        <button type="button" onClick={interactive ? advance : undefined} tabIndex={interactive ? 0 : -1} className="is-pr"><i><TrophyIcon /></i><strong>PR Attempt</strong><small>45 kg × 5</small></button>
      </div>
      <button type="button" tabIndex={-1} className="stack-session__move-on">Move on to Incline Dumbbell Press <span>›</span></button>
    </>
  );
}

function PrState({ reset, interactive }: { readonly reset: () => void; readonly interactive: boolean }) {
  return (
    <>
      <SessionHeader />
      <div className="stack-session__set-track stack-session__set-track--pr">
        {[1, 2, 3].map((set) => <div className="is-complete" key={set}><i><CheckIcon /></i><span>40·8</span></div>)}
        <div className="is-record"><i /><span>PR</span></div>
      </div>
      <div className="stack-session__entry-card stack-session__entry-card--pr">
        <div className="stack-session__entry-heading"><strong>PR Attempt</strong><span>BONUS SET</span></div>
        <div className="stack-session__steppers">
          <SetStepper label="WEIGHT" value="45" unit="kg" highlight />
          <SetStepper label="REPS" value="5" unit="reps" />
        </div>
        <div className="stack-session__entry-actions">
          <button type="button" onClick={interactive ? reset : undefined} tabIndex={interactive ? 0 : -1}><CheckIcon />Done</button>
          <span>Cancel</span>
        </div>
      </div>
    </>
  );
}

export function WorkoutExerciseFlow({ compact = false, interactive = false }: WorkoutExerciseFlowProps) {
  const [state, setState] = useState<ExerciseFlowState>("logging");

  return (
    <div className={`stack-session${compact ? " stack-session--compact" : ""}`}>
      {state === "logging" && <LoggingState interactive={interactive} advance={() => setState("complete")} />}
      {state === "complete" && <CompleteState interactive={interactive} advance={() => setState("pr")} />}
      {state === "pr" && <PrState interactive={interactive} reset={() => setState("logging")} />}
    </div>
  );
}

export default WorkoutExerciseFlow;
