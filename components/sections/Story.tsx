"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { LockScreen } from "@/components/phone/LockScreen";
import { LoggerScreen } from "@/components/phone/LoggerScreen";
import { Phone } from "@/components/phone/Phone";
import { StackedScreen } from "@/components/phone/StackedScreen";
import { TrainScreen } from "@/components/phone/TrainScreen";
import { useDemoJourney } from "@/components/stack/DemoJourney";
import { makeDemoBlock } from "@/lib/demo-block";
import { scrollToPosition } from "@/lib/scroll";
import { Icon } from "@/components/ui/Icon";
import { isExerciseDone } from "@/lib/workout";

const STEPS = [
  { id: "start", eyebrow: "START", title: "Don’t overthink it.", body: "Stack has your workout ready. Just tap start.", hint: "Slide the handle" },
  { id: "log", eyebrow: "LOG", title: "Forget what you lifted last time.", body: "Stack remembers. Your last weights are already filled in, with your history one scroll away.", hint: "Tap Log" },
  { id: "lock", eyebrow: "LOCK SCREEN", title: "Don’t even unlock your phone.", body: "Log reps and weight from your Lock Screen or the Dynamic Island.", hint: "Tap + or the check" },
  { id: "done", eyebrow: "WORKOUT COMPLETE", title: "One workout. One block.", body: "Improve on last time and it lands thicker. Hit a PR and it lands with a line of gold.", hint: null },
] as const;

const CHAPTERS = ["Start", "Log", "Lock", "Stack"];

/** Train → log → Lock Screen → workout complete, on one phone that stays in view. */
export function Story() {
  const [step, setStep] = useState(0);
  const [launch, setLaunch] = useState<{ x: number; y: number } | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [castAt, setCastAt] = useState<number | null>(null);
  const { workout, dispatch, completed, finish } = useDemoJourney();
  const canFinish = makeDemoBlock(workout).sets > 0;
  const finishRef = useRef(finish);
  useEffect(() => { finishRef.current = finish; }, [finish]);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);
  const screen = step === 0 && launch ? 1 : step;

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setStep(Number((entry.target as HTMLElement).dataset.step));
      }
    }, { rootMargin: "-48% 0px -48% 0px" });
    stepRefs.current.forEach((element) => element && observer.observe(element));
    return () => observer.disconnect();
  }, []);

  // Coming back to the start puts the handle back.
  useEffect(() => {
    if (step !== 0) return;
    const timer = setTimeout(() => {
      setLaunch(null);
      setResetKey((value) => value + 1);
    }, 0);
    return () => clearTimeout(timer);
  }, [step]);

  // The completion moment plays each time it comes into view.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (screen === 3) finishRef.current();
      setCastAt(screen === 3 ? performance.now() : null);
    }, 0);
    return () => clearTimeout(timer);
  }, [screen]);

  // A finished exercise moves on, as “Move on to …” does in the app.
  const exerciseDone = isExerciseDone(workout.exercises[workout.exercise]);
  useEffect(() => {
    if (!exerciseDone) return;
    const timer = setTimeout(() => dispatch({ type: "next" }), 1100);
    return () => clearTimeout(timer);
  }, [exerciseDone, workout.exercise]);

  const start = useCallback((origin: { x: number; y: number }) => {
    setLaunch(origin);
    const next = stepRefs.current[1];
    setTimeout(() => {
      if (next) scrollToPosition(window.scrollY + next.getBoundingClientRect().top + next.offsetHeight / 2 - window.innerHeight / 2);
    }, 520);
  }, []);

  const replay = () => setCastAt(performance.now());
  // Chapter buttons on phones: bring that chapter's scroll position to the middle.
  const story = useRef<HTMLElement>(null);
  const jump = (index: number) => {
    const target = stepRefs.current[index];
    const section = story.current;
    if (!target || !section) return;
    const rect = target.getBoundingClientRect();
    const middle = window.scrollY + rect.top + rect.height / 2 - window.innerHeight / 2;
    // Never stop above the point where the phone pins.
    const top = Math.max(window.scrollY + section.getBoundingClientRect().top, middle);
    scrollToPosition(top);
  };

  return (
    <section ref={story} className="story" id="how" aria-label="How Stack works">
      <div className="story__steps">
        {STEPS.map((item, index) => (
          <article key={item.id} ref={(node) => { stepRefs.current[index] = node; }} data-step={index}
            className={`story__step${step === index ? " is-active" : ""}`}>
            <StepCopy item={item} onReplay={replay} canFinish={canFinish && index > 0 && index < 3} onFinish={() => { finish(); jump(3); }} personal={!!completed && index === 3} onExplore={finish} />
          </article>
        ))}
      </div>
      <div className="story__stage">
        <Phone className="story__phone" label="Stack on iPhone">
          <div className={`screen-slot${screen === 0 ? " is-on" : ""}`} inert={screen !== 0}>
            <TrainScreen onStart={start} resetKey={resetKey} />
          </div>
          <div className={`screen-slot${screen === 1 ? " is-on" : ""}`} inert={screen !== 1}>
            <LoggerScreen state={workout} dispatch={dispatch} />
          </div>
          <div className={`screen-slot${screen === 2 ? " is-on" : ""}`} inert={screen !== 2}>
            <LockScreen state={workout} dispatch={dispatch} />
          </div>
          <div className={`screen-slot${screen === 3 ? " is-on" : ""}`} inert={screen !== 3}>
            <StackedScreen startedAt={castAt} demo={completed} />
          </div>
          {launch && step === 0 && (
            <span className="launch" aria-hidden="true" style={{ "--x": `${launch.x}px`, "--y": `${launch.y}px` } as CSSProperties} />
          )}
        </Phone>
        <div className="story__panel">
          <div className="story__progress" role="group" aria-label="Chapters">
            {STEPS.map((item, index) => (
              <button key={item.id} type="button" aria-pressed={step === index} aria-label={item.title}
                className={`story__segment${index === step ? " is-current" : index < step ? " is-done" : ""}`}
                onClick={() => jump(index)}><i /><span>{CHAPTERS[index]}</span></button>
            ))}
          </div>
          <div className="story__captions" aria-live="polite">
            {STEPS.map((item, index) => (
              <div key={item.id} className={`story__caption${index === step ? " is-on" : index < step ? " is-past" : ""}`}
                aria-hidden={index !== step} inert={index !== step}>
                <StepCopy item={item} onReplay={replay} canFinish={canFinish && index > 0 && index < 3} onFinish={() => { finish(); jump(3); }} personal={!!completed && index === 3} onExplore={finish} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCopy({ item, onReplay, canFinish, onFinish, personal, onExplore }: { item: (typeof STEPS)[number]; onReplay: () => void; canFinish: boolean; onFinish: () => void; personal: boolean; onExplore: () => void }) {
  return (
    <div className="story__copy">
      <p className="eyebrow">{item.eyebrow}</p>
      <h2 className="story__title">{personal ? "Your first block." : item.title}</h2>
      <p className="story__body">{personal ? "The sets you just logged, made visible. Find your orange block at the top of the stack." : item.body}</p>
      <div className="story__controls">
      {item.hint ? (
        <p className="story__hint"><span className="story__hint-dot" />{item.hint}</p>
      ) : (
        <button type="button" className="story__hint story__replay" onClick={onReplay}>
          <Icon name="repeat" size={15} stroke={2} />Play again
        </button>
      )}
      {canFinish && <button type="button" className="story__finish" onClick={onFinish}>Finish demo</button>}
      <a className="story__explore" href="#your-stack" onClick={(event) => {
        const target = document.getElementById("your-stack");
        if (!target) return;
        event.preventDefault();
        // Lenis also handles anchors at the window; this link has a custom destination.
        event.stopPropagation();
        onExplore();
        scrollToPosition(window.scrollY + target.getBoundingClientRect().top + Math.max(0, target.offsetHeight - window.innerHeight));
      }}>Explore the stack ↓</a>
      </div>
    </div>
  );
}
