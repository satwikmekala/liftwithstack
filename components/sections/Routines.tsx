import type { CSSProperties } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { muscle } from "@/lib/tokens";

/** The paste box placeholder in the app (app/paste-routine.tsx), line by line. */
const PASTE = ["Push", "bench 3x8", "incline db 3x10", "lat raises 4x12", "", "Pull", "deadlift 3x5", "lat pulldown 3x10"];

const WORKOUTS = [
  { letter: "A", name: "Push", color: muscle.chest, exercises: [["Bench Press", "3 × 8"], ["Incline Dumbbell Press", "3 × 10"], ["Lateral Raise", "4 × 12"]] },
  { letter: "B", name: "Pull", color: muscle.back, exercises: [["Deadlift", "3 × 5"], ["Lat Pulldown", "3 × 10"]] },
];

const WAYS: { title: string; body: string; icon: IconName }[] = [
  { title: "Get Stack’s plan", body: "Workouts in order, set by how often you train.", icon: "calendarDays" },
  { title: "Import from Hevy", body: "Bring your routines and workout history into Stack.", icon: "download" },
  { title: "Build your own", body: "Choose the exercises, sets and reps for each workout.", icon: "pencil" },
  { title: "Share a routine", body: "Send a link. They save their own copy to edit.", icon: "link" },
];

export function Routines() {
  let order = 0;
  return (
    <section className="routines" aria-labelledby="routines-title">
      <Reveal className="section-head">
        <p className="eyebrow">ROUTINES</p>
        <h2 id="routines-title" className="section-title">Bring the routine you already have.</h2>
        <p className="section-body">Paste what you already train. Stack will sort it out.</p>
      </Reveal>

      <Reveal className="paste">
        <div className="paste__input" aria-label="A routine pasted from notes">
          <p className="paste__label">Paste your routine</p>
          <div className="paste__text">
            {PASTE.map((line, index) => line
              ? <span key={index} className="paste__line" style={{ "--i": index } as CSSProperties}>{line}</span>
              : <span key={index} className="paste__gap" />)}
          </div>
        </div>
        <span className="paste__arrow" aria-hidden="true">
          <svg width="40" height="12" viewBox="0 0 40 12"><path d="M0 6h37M32 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
        <div className="paste__result" aria-label="The routine Stack builds from it">
          {WORKOUTS.map((workout) => (
            <div key={workout.letter} className="routine-workout" style={{ "--c": workout.color } as CSSProperties}>
              <p className="routine-workout__head">
                <span className="routine-workout__dot" />
                <span className="routine-workout__letter">WORKOUT {workout.letter}</span>
              </p>
              <p className="routine-workout__name">{workout.name}</p>
              <ul>
                {workout.exercises.map(([name, scheme]) => (
                  <li key={name} style={{ "--i": ++order } as CSSProperties}><span>{name}</span><span className="mono">{scheme}</span></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="ways">
        {WAYS.map((way, index) => (
          <Reveal key={way.title} className="way" delay={index * 70}>
            <span className="way__icon"><Icon name={way.icon} size={22} stroke={1.8} /></span>
            <p className="way__title">{way.title}</p>
            <p className="way__body">{way.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
