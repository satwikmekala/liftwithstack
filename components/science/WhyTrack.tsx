"use client";

import { useReducer, useState } from "react";
import { HistorySheet } from "@/components/phone/HistorySheet";
import { LoggerScreen } from "@/components/phone/LoggerScreen";
import { Phone } from "@/components/phone/Phone";
import { Download } from "@/components/ui/Download";
import { Reveal } from "@/components/ui/Reveal";
import { ref } from "@/lib/science/sources";
import { initialWorkout, workoutReducer } from "@/lib/workout";
import { Foot } from "./Foot";

/** Act VI: the record, and the app that keeps it. The logger is live; its suggestion is the principle in one tap. */
export function WhyTrack() {
  const [workout, dispatch] = useReducer(workoutReducer, undefined, initialWorkout);
  const [history, setHistory] = useState(false);
  return (
    <section className="why" id="why-track" aria-labelledby="why-title">
      <Reveal className="why__copy">
        <p className="eyebrow">ACT VI · THIS IS WHY YOU TRACK</p>
        <h2 id="why-title" className="sci-title">You can’t see the curve you never wrote down.</h2>
        <p className="sci-body">Your body keeps its record in protein. It won&rsquo;t tell you that last Thursday was 60 × 8 with two left, or that the Thursday before was 60 × 7. The only way to know whether today should be a ninth rep or 62.5 kg is to have written it down.</p>
        <p className="sci-body">It isn&rsquo;t just intuition. Across 138 experiments, people who recorded their progress got further toward their goals, and more so when the record was physical.<Foot n={ref("harkin")} /> Of 26 ways to change a habit, keeping track explained the most.<Foot n={ref("michie")} /></p>
        <p className="why__line">Your body remembers the work.<br />Stack remembers the numbers.</p>
        <div className="why__actions">
          <Download />
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a className="text-link" href="/">See how Stack works →</a>
        </div>
        <p className="why__note">iPhone beta · No account needed to start</p>
      </Reveal>
      <div className="why__stage">
        <Phone className="why__phone" label="Stack's logger, with last time's weight filled in and a suggestion">
          <div className={`screen-slot is-on${history ? " is-behind-sheet" : ""}`} inert={history}>
            <LoggerScreen state={workout} dispatch={dispatch} photos={0} onCamera={() => undefined} cameraCue={false}
              onHistory={() => setHistory(true)} onInfo={() => undefined} />
          </div>
          <HistorySheet open={history} onClose={() => setHistory(false)} />
        </Phone>
        <p className="why__callout"><i />Last 80 · Try 82.5. That pill is progressive overload, in one tap.</p>
      </div>
    </section>
  );
}
