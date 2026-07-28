"use client";

import { AnimatePresence } from "framer-motion";
import { motion, useReducedMotion } from "framer-motion";

import { howItWorksStateDescriptions } from "@/components/sections/how-it-works-data";
import type { HowItWorksStepId } from "@/components/sections/how-it-works-data";
import { StackLogo } from "@/components/ui/StackLogo";

export interface StackProductDemoProps {
  readonly state: HowItWorksStepId;
  readonly className?: string;
}

function Screen({
  children,
  state,
}: {
  readonly children: React.ReactNode;
  readonly state: HowItWorksStepId;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      key={state}
      className="stack-demo__screen"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
      transition={{ duration: 0.38, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

function TodayView() {
  return (
    <Screen state="today">
      <div className="stack-demo__welcome">
        <span>Good morning, Vikram.</span>
        <strong>Your next workout is ready.</strong>
      </div>
      <div className="stack-demo__workout-card">
        <div>
          <span className="stack-demo__kicker">TODAY · FULL BODY</span>
          <h4>Full Body A</h4>
          <p>6 exercises · 48 min</p>
        </div>
        <button type="button" tabIndex={-1}>Start workout <span>→</span></button>
      </div>
      <div className="stack-demo__exercise-list">
        <span>01</span><strong>Back Squat</strong><em>3 × 6</em>
        <span>02</span><strong>Bench Press</strong><em>3 × 8</em>
        <span>03</span><strong>Lat Pulldown</strong><em>3 × 10</em>
      </div>
    </Screen>
  );
}

function ExerciseView() {
  return (
    <Screen state="exercise">
      <div className="stack-demo__crumb">FULL BODY A <span>/</span> EXERCISE 02 OF 06</div>
      <div className="stack-demo__lift-heading">
        <div><h4>Bench Press</h4><p>3 working sets · 8 reps</p></div>
        <span className="stack-demo__status">IN PROGRESS</span>
      </div>
      <div className="stack-demo__progression">
        <div><span>LAST TIME</span><strong>60 <small>kg</small></strong><em>× 8 reps</em></div>
        <div className="stack-demo__progress-arrow">→</div>
        <div className="stack-demo__progression--today"><span>TODAY</span><strong>62.5 <small>kg</small></strong><em>× 8 reps</em></div>
      </div>
      <div className="stack-demo__set-row">
        <span>SET 1</span><strong>62.5 kg</strong><strong>8 reps</strong>
        <button type="button" tabIndex={-1}>Log set</button>
      </div>
    </Screen>
  );
}

function NextView() {
  return (
    <Screen state="next">
      <div className="stack-demo__complete-mark">✓</div>
      <div className="stack-demo__complete-copy">
        <span>WORKOUT COMPLETE</span>
        <h4>Nice work. Keep the streak moving.</h4>
        <p>Full Body A · 47 min · 18 working sets</p>
      </div>
      <div className="stack-demo__next-card">
        <div><span>NEXT UP</span><h5>Full Body B</h5><p>Ready when you are</p></div>
        <div className="stack-demo__next-date"><span>THU</span><strong>23</strong></div>
      </div>
    </Screen>
  );
}

export function StackProductDemo({ state, className }: StackProductDemoProps) {
  return (
    <div className={`stack-demo ${className ?? ""}`.trim()}>
      <p aria-live="polite" className="sr-only">
        {howItWorksStateDescriptions[state]}
      </p>

      <div className="stack-demo__chrome" aria-hidden="true">
        <div className="stack-demo__titlebar">
          <div className="stack-demo__traffic"><span /><span /><span /></div>
          <span>app.liftwithstack.com</span>
          <div className="stack-demo__live"><i /> LIVE</div>
        </div>
        <div className="stack-demo__app">
          <aside className="stack-demo__sidebar">
            <StackLogo className="stack-demo__logo" />
            <nav>
              <span className="stack-demo__nav--active">Today</span>
              <span>History</span>
              <span>Progress</span>
              <span>Settings</span>
            </nav>
            <div className="stack-demo__profile">
              <span>VK</span>
              <div><strong>Vikram</strong><small>4 day plan</small></div>
            </div>
          </aside>
          <div className="stack-demo__main">
            <header>
              <div>
                <span className="stack-demo__date">MONDAY · JUL 20</span>
                <strong>Training</strong>
              </div>
              <div className="stack-demo__week">
                <span>M<i>20</i></span><span>T<i>21</i></span><span>W<i>22</i></span>
                <span>T<i>23</i></span><span>F<i>24</i></span>
              </div>
            </header>
            <AnimatePresence mode="wait" initial={false}>
              {state === "today" && <TodayView key="today" />}
              {state === "exercise" && <ExerciseView key="exercise" />}
              {state === "next" && <NextView key="next" />}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StackProductDemo;
