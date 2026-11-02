"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { HistorySheet } from "@/components/phone/HistorySheet";
import { LoggerScreen } from "@/components/phone/LoggerScreen";
import { Phone } from "@/components/phone/Phone";
import { MiniStack, TRUE_UNIT } from "@/components/stack/MiniStack";
import { Download } from "@/components/ui/Download";
import { CURL_HISTORY } from "@/lib/science/story";
import { block, HEIGHTS } from "@/lib/stack/model";
import { muscle } from "@/lib/tokens";
import { armsWorkout, workoutReducer } from "@/lib/workout";
import { Foot } from "./Foot";

const PAST = [HEIGHTS[0], HEIGHTS[1], HEIGHTS[1], HEIGHTS[0], HEIGHTS[1]].map((height, i) => block(`past-${i}`, muscle.arms, height));

/** Chapter 7: the log that makes the next rep a decision. Live: open history, add a rep, log it. */
export function YourLog() {
  const [workout, dispatch] = useReducer(workoutReducer, undefined, armsWorkout);
  const [history, setHistory] = useState(false);
  const curl = workout.exercises[0];
  const first = curl.sets[0];
  const logged = first.done;
  const beat = logged && (first.reps > 8 || first.weight > 12);
  const [landed, setLanded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!logged) return;
    timer.current = setTimeout(() => setLanded(true), 450);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [logged]);
  const slabs = landed ? [...PAST, block("today", muscle.arms, beat ? HEIGHTS[1] : HEIGHTS[0])] : PAST;

  return (
    <section className="log-chapter" id="chapter-7" aria-labelledby="log-title">
      <div className="log-chapter__copy">
        <p className="chapter mono"><span>7</span>Why you remember your workouts</p>
        <h2 id="log-title" className="d-title">You might remember what you lifted today. But six weeks ago?</h2>
        <p>Progressing needs one small thing: last time’s number, in front of you when you pick the dumbbell up.</p>
        <p>Writing a workout down doesn’t build any muscle, and plenty of people progress on feel or with a notebook. What a log does is make last time visible before you start, so that one more rep is something you decide rather than something you hope happened. People who keep track of their progress toward a goal are more likely to reach it, especially when they physically record it.<Foot of="harkin" /></p>
        <p>That’s why Stack keeps your log. Open the history to see six weeks of Dumbbell Curl, then roll the reps to one more than last time and log it.</p>
        <p className={`log-chapter__status${logged ? " is-shown" : ""}`} aria-live="polite">
          {logged ? (beat ? `Logged: ${first.weight} kg × ${first.reps}. More than last time, so the block lands a little thicker.` : `Logged: ${first.weight} kg × ${first.reps}. The same as last time still counts.`) : ""}
        </p>
        <p className="log-chapter__line">Every workout stacks up.</p>
        <div className="log-chapter__actions">
          <Download />
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a className="text-link" href="/">See how Stack works →</a>
        </div>
        <p className="log-chapter__note">iPhone beta · No account needed to start</p>
      </div>
      <div className="log-chapter__stage">
        <Phone className="log-chapter__phone" label="Stack's logger on Dumbbell Curl, with last time's 12 kg × 8 filled in">
          <div className={`screen-slot is-on${history ? " is-behind-sheet" : ""}`} inert={history}>
            <LoggerScreen state={workout} dispatch={dispatch} photos={0} onCamera={() => undefined} cameraCue={false}
              onHistory={() => setHistory(true)} onInfo={() => undefined} day="ARMS" />
          </div>
          <HistorySheet open={history} onClose={() => setHistory(false)} name="Dumbbell Curl" entries={CURL_HISTORY} />
        </Phone>
        <figure className="log-chapter__stack" aria-label={`Your stack: ${slabs.length} arm workouts`}>
          <MiniStack slabs={slabs} width={150} height={190} unit={TRUE_UNIT} base="plinth" flash={landed} glow />
          <figcaption className="mono">YOUR STACK</figcaption>
        </figure>
      </div>
    </section>
  );
}
