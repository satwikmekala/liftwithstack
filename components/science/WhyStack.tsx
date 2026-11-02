"use client";

import { useReducer, useState } from "react";
import { HistorySheet } from "@/components/phone/HistorySheet";
import { LoggerScreen } from "@/components/phone/LoggerScreen";
import { Phone } from "@/components/phone/Phone";
import { Download } from "@/components/ui/Download";
import { Reveal } from "@/components/ui/Reveal";
import { initialWorkout, workoutReducer } from "@/lib/workout";
import { Foot } from "./Foot";

/** It takes time, and that's fine: any number of days counts. */
export function Slower() {
  return (
    <section className="slower" aria-labelledby="slower-title">
      <Reveal>
        <p className="eyebrow">THE HONEST PART</p>
        <h2 id="slower-title" className="sci-title">It’s slower than you think.</h2>
      </Reveal>
      <Reveal className="slower__days" delay={80}>
        {[2, 3, 4].map((days) => (
          <p key={days}><span className="slower__dots" aria-hidden="true">{Array.from({ length: 7 }, (_, i) => <i key={i} className={i < days ? "is-on" : ""} />)}</span><b>{days} days a week</b> counts.</p>
        ))}
      </Reveal>
      <Reveal className="slower__body" delay={140}>
        <p className="sci-body">The first months move fast. After that, every step gets smaller, and that’s normal.<Foot of="rhea" /> Everyone’s different too: when 585 people did the same 12 weeks, some barely changed and others changed a lot.<Foot of="hubal" /></p>
        <p className="sci-body">You don’t need to live at the gym. You need to show up, and know what you’re there to beat.</p>
      </Reveal>
    </section>
  );
}

/** The record, and the app that keeps it. The logger is live, with last time's weight already filled in. */
export function WhyStack() {
  const [workout, dispatch] = useReducer(workoutReducer, undefined, initialWorkout);
  const [history, setHistory] = useState(false);
  return (
    <section className="why" id="why-stack" aria-labelledby="why-title">
      <Reveal className="why__copy">
        <p className="eyebrow">SO WHAT DO YOU DO?</p>
        <h2 id="why-title" className="sci-title">You can’t beat a number you can’t remember.</h2>
        <p className="sci-body">Was it 10 × 11 or 10 × 12? If you don’t know, you’re guessing, and all that effort might only be keeping you where you are. People who keep a record of their progress get further.<Foot of="harkin" /><Foot of="michie" /></p>
        <p className="sci-body">But notebooks get forgotten, and most apps feel like homework. Stack is made for busy people who just want to lift:</p>
        <ul className="why__list">
          <li><b>Your last weights are already there.</b> Beat them, or match them.</li>
          <li><b>One tap to log.</b> Then get back to your set.</li>
          <li><b>Every workout becomes a block.</b> Better than last time, and it lands thicker.</li>
          <li><b>Your friends can see you stacking up.</b> It’s more fun that way.</li>
        </ul>
        <p className="why__line">Know what you’re lifting.<br />Make the effort count.</p>
        <div className="why__actions">
          <Download />
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a className="text-link" href="/">See how Stack works →</a>
        </div>
        <p className="why__note">iPhone beta · No account needed to start</p>
      </Reveal>
      <div className="why__stage">
        <Phone className="why__phone" label="Stack's logger, with last time's weight already filled in">
          <div className={`screen-slot is-on${history ? " is-behind-sheet" : ""}`} inert={history}>
            <LoggerScreen state={workout} dispatch={dispatch} photos={0} onCamera={() => undefined} cameraCue={false}
              onHistory={() => setHistory(true)} onInfo={() => undefined} />
          </div>
          <HistorySheet open={history} onClose={() => setHistory(false)} />
        </Phone>
        <p className="why__callout"><i />Try it: tap Log, or the history button for last time.</p>
      </div>
    </section>
  );
}
