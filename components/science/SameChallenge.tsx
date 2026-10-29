"use client";

import { useMemo, useRef, useState } from "react";
import { sameChallenge } from "@/lib/science/model";
import { ref } from "@/lib/science/sources";
import { Foot } from "./Foot";
import { span, useProgress } from "./useProgress";

const BEATS = [
  { from: 0, to: 0.3, eyebrow: "ACT III · THE SAME CHALLENGE", title: "Same weight. Different workout.", body: <>Two people start with the same bench press: 60 kg for 8, with a couple of reps left in the tank. One keeps doing exactly that. The other keeps the set hard.</> },
  { from: 0.3, to: 0.62, eyebrow: "WHAT FADES", title: "The weight stays. The challenge shrinks.", body: <>As capacity grows, 60 kg becomes a smaller share of what the body can do. The set that used to end two reps from the limit now ends five or six away. The largest fibers are the last to be recruited, and now they never have to join in.<Foot n={ref("henneman")} /> Growth tracks how close a set gets to the limit.<Foot n={ref("refalo")} /><Foot n={ref("robinson")} /></> },
  { from: 0.62, to: 1.01, eyebrow: "THE NUANCE", title: "It isn’t the kilograms.", body: <>Had the first lifter kept 60 kg but pushed for 9, then 10, then 11 reps, that would have been progress too.<Foot n={ref("plotkin")} /> What fades isn&rsquo;t the weight. It&rsquo;s the distance to your limit.</> },
];

/** Act III: two timelines side by side, scroll-driven. */
export function SameChallenge() {
  const section = useRef<HTMLElement>(null);
  const [t, setT] = useState(0);
  useProgress(section, setT);
  const weeks = useMemo(() => sameChallenge(16), []);
  const progress = span(t, 0.06, 0.92);
  const week = Math.min(16, Math.floor(progress * 16 + 1e-6));
  const now = weeks[week];

  return (
    <section ref={section} className="same" aria-label="What happens when the challenge never changes">
      <div className="same__sticky">
        <div className="same__beats">
          {BEATS.map((beat) => {
            const on = t >= beat.from && t < beat.to;
            return (
              <div key={beat.title} className={`beat-copy${on ? " is-on" : t >= beat.to ? " is-past" : ""}`} aria-hidden={!on} inert={!on}>
                <p className="eyebrow">{beat.eyebrow}</p>
                <h2 className="beat-copy__title">{beat.title}</h2>
                <p className="beat-copy__body">{beat.body}</p>
              </div>
            );
          })}
        </div>
        <div className="same__stage" role="img" aria-label={`Week ${week}. Same weight: 60 kilograms for 8 reps, ${now.same.reserve} reps in reserve. Progressed: ${now.progressed.load} kilograms for ${now.progressed.reps}, ${now.progressed.reserve} in reserve.`}>
          <p className="same__week mono">WEEK {week}</p>
          <Lifter name="Keeps the same set" tone="same" load={now.same.load} reps={now.same.reps} reserve={now.same.reserve} relative={now.same.relative} capacity={now.max / weeks[0].max} />
          <Lifter name="Keeps it hard" tone="progressed" load={now.progressed.load} reps={now.progressed.reps} reserve={now.progressed.reserve} relative={now.progressed.relative} capacity={now.max / weeks[0].max} />
          <p className="same__note">Illustration. Capacity rises fast then slowly; the exact numbers are made up to show the idea.</p>
        </div>
      </div>
    </section>
  );
}

function Lifter({ name, tone, load, reps, reserve, relative, capacity }: {
  name: string; tone: "same" | "progressed"; load: number; reps: number; reserve: number; relative: number; capacity: number;
}) {
  // Stimulus: how close the set gets to the limit, 1 at two reps in reserve or fewer.
  const stimulus = Math.max(0, Math.min(1, 1 - (reserve - 2) / 6));
  const possible = reps + reserve;
  return (
    <div className={`lifter lifter--${tone}`} style={{ "--stimulus": stimulus } as React.CSSProperties}>
      <p className="lifter__name">{name}</p>
      <div className="lifter__set">
        <b>{load} kg</b><span>× {reps}</span>
      </div>
      <div className="lifter__gauge" aria-hidden="true">
        <span className="lifter__capacity" style={{ transform: `scaleY(${capacity})` }}><i /></span>
        <span className="lifter__load" style={{ bottom: `${relative * 100 / capacity * 1}%` }}>
          <em>{Math.round(relative * 100)}% of max</em>
        </span>
        <span className="lifter__axis mono">CAPACITY</span>
      </div>
      <div className="lifter__reps" aria-hidden="true">
        {Array.from({ length: Math.min(16, possible) }, (_, i) => <i key={i} className={i < reps ? "is-done" : "is-reserve"} />)}
      </div>
      <p className="lifter__reserve"><b>{reserve}</b> reps left in the tank</p>
      <p className="lifter__stimulus mono"><i />{stimulus > 0.8 ? "STIMULUS · STRONG" : stimulus > 0.4 ? "STIMULUS · FADING" : "STIMULUS · FAINT"}</p>
    </div>
  );
}
