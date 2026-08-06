"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { howItWorksStateDescriptions } from "@/components/sections/how-it-works-data";
import type { HowItWorksStepId } from "@/components/sections/how-it-works-data";
import { WorkoutExerciseFlow } from "@/components/ui/WorkoutExerciseFlow";

export interface StackProductDemoProps {
  readonly state: HowItWorksStepId;
  readonly className?: string;
}

function Screen({
  children,
  state,
}: {
  readonly children: ReactNode;
  readonly state: HowItWorksStepId;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      key={state}
      className="iphone-demo__state"
      initial={prefersReducedMotion ? false : { opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      exit={prefersReducedMotion ? undefined : { opacity: 0, x: -14 }}
      transition={{ duration: 0.38, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

function TodayView() {
  return (
    <Screen state="today">
      <div className="iphone-demo__greeting">
        <span>Good morning</span>
        <h4>Ready when you are.</h4>
      </div>

      <div className="iphone-demo__workout">
        <span className="iphone-demo__eyebrow">TODAY · FULL BODY</span>
        <h5>Full Body A</h5>
        <p>6 exercises · 48 min</p>
        <button type="button" tabIndex={-1}>
          Start workout <span>→</span>
        </button>
      </div>

      <div className="iphone-demo__section-title">
        <span>UP NEXT</span>
        <small>3 OF 6 SHOWN</small>
      </div>
      <div className="iphone-demo__exercise-row">
        <i>01</i><strong>Back Squat</strong><span>3 × 6</span>
      </div>
      <div className="iphone-demo__exercise-row">
        <i>02</i><strong>Bench Press</strong><span>3 × 8</span>
      </div>
      <div className="iphone-demo__exercise-row">
        <i>03</i><strong>Lat Pulldown</strong><span>3 × 10</span>
      </div>
    </Screen>
  );
}

function ExerciseView() {
  return (
    <Screen state="exercise">
      <WorkoutExerciseFlow interactive />
    </Screen>
  );
}

function NextView() {
  return (
    <Screen state="next">
      <div className="iphone-demo__complete">
        <div className="iphone-demo__check">✓</div>
        <span>WORKOUT COMPLETE</span>
        <h4>That’s one more in the bank.</h4>
        <p>Full Body A · 47 min · 18 working sets</p>
      </div>

      <div className="iphone-demo__summary">
        <div><span>VOLUME</span><strong>8,420 <small>kg</small></strong></div>
        <div><span>SETS</span><strong>18</strong></div>
      </div>

      <div className="iphone-demo__next">
        <div>
          <span>NEXT UP</span>
          <h5>Full Body B</h5>
          <p>Ready when you are</p>
        </div>
        <div className="iphone-demo__calendar"><span>THU</span><strong>23</strong></div>
      </div>
    </Screen>
  );
}

export function StackProductDemo({ state, className }: StackProductDemoProps) {
  return (
    <div className={`iphone-demo ${className ?? ""}`.trim()}>
      <p aria-live="polite" className="sr-only">
        {howItWorksStateDescriptions[state]}
      </p>

      <div className="iphone-demo__hardware" aria-hidden="true">
        <span className="iphone-demo__mute" />
        <span className="iphone-demo__volume iphone-demo__volume--up" />
        <span className="iphone-demo__volume iphone-demo__volume--down" />
        <span className="iphone-demo__power" />

        <div className="iphone-demo__bezel">
          <div className="iphone-demo__screen">
            <div className="iphone-demo__statusbar">
              <strong>7:12</strong>
              <div className="iphone-demo__island"><i /></div>
              <span>● ᯤ ▰</span>
            </div>
            <header className={`iphone-demo__header${state === "exercise" ? " is-hidden" : ""}`}>
              <div className="iphone-demo__mark"><i /><i /><i /></div>
              <span>MON · JUL 20</span>
              <div className="iphone-demo__avatar">VK</div>
            </header>

            <main className={state === "exercise" ? "is-exercise" : undefined}>
              <AnimatePresence mode="wait" initial={false}>
                {state === "today" && <TodayView key="today" />}
                {state === "exercise" && <ExerciseView key="exercise" />}
                {state === "next" && <NextView key="next" />}
              </AnimatePresence>
            </main>

            <nav className={`iphone-demo__tabs${state === "exercise" ? " is-hidden" : ""}`}>
              <span className="is-active"><i>◆</i>Today</span>
              <span><i>▥</i>History</span>
              <span><i>↗</i>Progress</span>
            </nav>
            <div className="iphone-demo__home-indicator" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StackProductDemo;
