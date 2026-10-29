"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { CameraScreen } from "@/components/phone/CameraScreen";
import { GuidedScreen } from "@/components/phone/GuidedScreen";
import { LockScreen } from "@/components/phone/LockScreen";
import { LoggerScreen } from "@/components/phone/LoggerScreen";
import { Phone } from "@/components/phone/Phone";
import { StackedScreen } from "@/components/phone/StackedScreen";
import { SummaryScreen } from "@/components/phone/SummaryScreen";
import { TrainScreen } from "@/components/phone/TrainScreen";
import { useDemoJourney, type LogMode } from "@/components/stack/DemoJourney";
import { makeDemoBlock } from "@/lib/demo-block";
import { GUIDED_PLAN } from "@/lib/guided";
import { momentSetLine } from "@/lib/moments";
import { scrollToPosition } from "@/lib/scroll";
import { Icon } from "@/components/ui/Icon";
import { isExerciseDone } from "@/lib/workout";

type StepId = "start" | "log" | "moment" | "lock" | "done";
type Step = { id: StepId; chapter: string; eyebrow: string; title: string; body: string; hint: string | null };

const START: Step = { id: "start", chapter: "Start", eyebrow: "START", title: "Don’t overthink it.", body: "Your workout is ready. Log every set, or switch Log sets off and just train.", hint: "Slide the handle" };
const LOG: Step = { id: "log", chapter: "Log", eyebrow: "LOG SETS", title: "Forget what you lifted last time.", body: "Stack remembers. Your last weights are already filled in, with your history one tap away.", hint: "Tap Log" };
const TRAIN: Step = { id: "log", chapter: "Train", eyebrow: "JUST TRAIN", title: "Or don’t count a thing.", body: "One exercise at a time, with a picture to go by. Tap Done and move on. Nothing to weigh, count or time.", hint: "Tap Done" };
const MOMENT: Step = { id: "moment", chapter: "Moment", eyebrow: "MOMENTS", title: "Keep the moment too.", body: "The camera sits in the corner of every workout. One tap, one photo, and you’re back on your set. Turn on Label to print the exercise into it.", hint: "Tap the camera" };
const LOCK: Step = { id: "lock", chapter: "Lock", eyebrow: "LOCK SCREEN", title: "Don’t even unlock your phone.", body: "Log reps and weight from your Lock Screen or the Dynamic Island.", hint: "Tap + or the check" };
const STACKED: Step = { id: "done", chapter: "Stack", eyebrow: "WORKOUT COMPLETE", title: "One workout. One block.", body: "Improve on last time and it lands thicker. Hit a PR and it lands with a line of gold.", hint: null };
const NOTED: Step = { id: "done", chapter: "Stack", eyebrow: "WORKOUT COMPLETE", title: "No sets. Still a block.", body: "A workout you didn’t log still lands in your Stack. Show up, and it counts.", hint: "Your Stack is next" };

const stepsFor = (mode: LogMode): Step[] => (mode === "tracked" ? [START, LOG, MOMENT, LOCK, STACKED] : [START, TRAIN, MOMENT, NOTED]);

/** Train → log (or just train) → a photo → Lock Screen → workout complete, on one phone that stays in view. */
export function Story() {
  const { mode, setMode, workout, dispatch, guided, guide, photos, takePhoto, completed, finish } = useDemoJourney();
  const steps = useMemo(() => stepsFor(mode), [mode]);
  const [step, setStep] = useState(0);
  const [launch, setLaunch] = useState<{ x: number; y: number } | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [castAt, setCastAt] = useState<number | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const canFinish = mode === "tracked" ? makeDemoBlock(workout).sets > 0 : guided.done.length > 0;
  const finishRef = useRef(finish);
  useEffect(() => { finishRef.current = finish; }, [finish]);
  const captions = useRef<HTMLDivElement>(null);
  useEffect(() => { captions.current?.scrollTo({ top: 0, behavior: "instant" }); }, [step]);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);
  const current = steps[Math.min(step, steps.length - 1)].id;
  const screen = current === "start" && launch ? "log" : current;

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setStep(Number((entry.target as HTMLElement).dataset.step));
      }
    }, { rootMargin: "-48% 0px -48% 0px" });
    stepRefs.current.slice(0, steps.length).forEach((element) => element && observer.observe(element));
    return () => observer.disconnect();
  }, [steps]);

  // Coming back to the start puts the handle back.
  useEffect(() => {
    if (current !== "start") return;
    const timer = setTimeout(() => {
      setLaunch(null);
      setResetKey((value) => value + 1);
    }, 0);
    return () => clearTimeout(timer);
  }, [current]);

  // The camera belongs to the Moment chapter; leaving it closes the camera, as leaving the app does.
  useEffect(() => {
    if (current === "moment") return;
    const timer = setTimeout(() => setCameraOpen(false), 0);
    return () => clearTimeout(timer);
  }, [current]);

  // The completion moment plays each time it comes into view.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (screen === "done") finishRef.current();
      setCastAt(screen === "done" ? performance.now() : null);
    }, 0);
    return () => clearTimeout(timer);
  }, [screen, mode]);

  // A finished exercise moves on, as “Move on to …” does in the app.
  const exerciseDone = isExerciseDone(workout.exercises[workout.exercise]);
  useEffect(() => {
    if (!exerciseDone) return;
    const timer = setTimeout(() => dispatch({ type: "next" }), 1100);
    return () => clearTimeout(timer);
  }, [exerciseDone, workout.exercise, dispatch]);

  const start = useCallback((origin: { x: number; y: number }) => {
    setLaunch(origin);
    const next = stepRefs.current[1];
    setTimeout(() => {
      if (next) scrollToPosition(window.scrollY + next.getBoundingClientRect().top + next.offsetHeight / 2 - window.innerHeight / 2);
    }, 520);
  }, []);

  // What the label would print: the exercise on screen and, when logging, the set as it stands.
  const exercise = mode === "tracked" ? workout.exercises[workout.exercise] : null;
  const shotExercise = exercise?.name ?? GUIDED_PLAN[Math.min(guided.index, GUIDED_PLAN.length - 1)];
  const shotSet = exercise ? exercise.sets[workout.set] : null;
  const shotLine = exercise && shotSet ? momentSetLine({ number: workout.set + 1, weight: shotSet.weight, reps: shotSet.reps }) : null;
  const shoot = (labelled: boolean) => {
    takePhoto({ exercise: shotExercise, line: labelled ? shotLine : null });
    setTimeout(() => setCameraOpen(false), 120);
  };
  const cue = current === "moment" && photos.length === 0;

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
  const doneIndex = steps.length - 1;
  const copy = (item: Step, index: number) => (
    <StepCopy item={item} mode={mode} onMode={setMode} onReplay={replay} canFinish={canFinish && index > 0 && index < doneIndex}
      onFinish={() => { finish(); jump(doneIndex); }} personal={completed?.mode === mode && index === doneIndex ? completed.exercises.length : null}
      photoTaken={photos.length > 0 && item.id === "moment"} onExplore={finish} />
  );

  return (
    <section ref={story} className="story" id="how" aria-label="How Stack works">
      <div className="story__steps">
        {steps.map((item, index) => (
          <article key={`${mode}-${item.id}`} ref={(node) => { stepRefs.current[index] = node; }} data-step={index}
            className={`story__step${step === index ? " is-active" : ""}`}>
            {copy(item, index)}
          </article>
        ))}
      </div>
      <div className="story__stage">
        <Phone className="story__phone" label="Stack on iPhone">
          <div className={`screen-slot${screen === "start" ? " is-on" : ""}`} inert={screen !== "start"}>
            <TrainScreen onStart={start} resetKey={resetKey} logSets={mode === "tracked"} onLogSets={(on) => setMode(on ? "tracked" : "untracked")} />
          </div>
          <div className={`screen-slot${(screen === "log" || screen === "moment") && mode === "tracked" ? " is-on" : ""}`}
            inert={!((screen === "log" || screen === "moment") && mode === "tracked") || cameraOpen}>
            <LoggerScreen state={workout} dispatch={dispatch} photos={photos.length} onCamera={() => setCameraOpen(true)} cameraCue={cue} />
          </div>
          <div className={`screen-slot${(screen === "log" || screen === "moment") && mode === "untracked" ? " is-on" : ""}`}
            inert={!((screen === "log" || screen === "moment") && mode === "untracked") || cameraOpen}>
            <GuidedScreen state={guided} dispatch={guide} photos={photos.length} onCamera={() => setCameraOpen(true)} cameraCue={cue} />
          </div>
          <div className={`screen-slot${screen === "lock" ? " is-on" : ""}`} inert={screen !== "lock"}>
            <LockScreen state={workout} dispatch={dispatch} />
          </div>
          <div className={`screen-slot${screen === "done" && mode === "tracked" ? " is-on" : ""}`} inert={!(screen === "done" && mode === "tracked")}>
            <StackedScreen startedAt={mode === "tracked" ? castAt : null} demo={completed?.mode === "tracked" ? completed : null} />
          </div>
          <div className={`screen-slot${screen === "done" && mode === "untracked" ? " is-on" : ""}`} inert={!(screen === "done" && mode === "untracked")}>
            <SummaryScreen exercises={guided.done} photos={photos} />
          </div>
          <CameraScreen open={cameraOpen && (screen === "log" || screen === "moment")} exercise={shotExercise} line={shotLine}
            count={photos.length} onShoot={shoot} onClose={() => setCameraOpen(false)} />
          {launch && current === "start" && (
            <span className="launch" aria-hidden="true" style={{ "--x": `${launch.x}px`, "--y": `${launch.y}px` } as CSSProperties} />
          )}
        </Phone>
        <div className="story__panel">
          <div className="story__progress" role="group" aria-label="Chapters">
            {steps.map((item, index) => (
              <button key={`${mode}-${item.id}`} type="button" aria-pressed={step === index} aria-label={item.title}
                className={`story__segment${index === step ? " is-current" : index < step ? " is-done" : ""}`}
                onClick={() => jump(index)}><i /><span>{item.chapter}</span></button>
            ))}
          </div>
          <div ref={captions} className="story__captions" aria-live="polite" tabIndex={0} role="region" aria-label="Chapter details">
            {steps.map((item, index) => (
              <div key={`${mode}-${item.id}`} className={`story__caption${index === step ? " is-on" : index < step ? " is-past" : ""}`}
                aria-hidden={index !== step} inert={index !== step}>
                {copy(item, index)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCopy({ item, mode, onMode, onReplay, canFinish, onFinish, personal, photoTaken, onExplore }: {
  item: Step; mode: LogMode; onMode: (mode: LogMode) => void; onReplay: () => void; canFinish: boolean; onFinish: () => void;
  /** The visitor's own block: how many exercises it holds. */
  personal: number | null; photoTaken: boolean; onExplore: () => void;
}) {
  const tracked = mode === "tracked";
  const title = personal !== null ? (tracked ? "Your first block." : "Still a block.") : item.title;
  const body = personal !== null
    ? (tracked ? "The sets you just logged, made visible. Find your orange block at the top of the stack."
      : `${personal} ${personal === 1 ? "exercise" : "exercises"}, no sets, one block. Find it at the top of the stack.`)
    : photoTaken ? "Kept with this workout, and you’re straight back on your set. No review, no caption, no filter." : item.body;
  return (
    <div className="story__copy">
      <p className="eyebrow">{item.eyebrow}</p>
      <h2 className="story__title">{title}</h2>
      <p className="story__body">{body}</p>
      {(item.id === "start" || item.id === "log") && (
        <div className="mode-switch" role="radiogroup" aria-label="How you log this workout">
          <button type="button" role="radio" aria-checked={tracked} className={tracked ? "is-on" : ""} onClick={() => onMode("tracked")}>Log sets</button>
          <button type="button" role="radio" aria-checked={!tracked} className={!tracked ? "is-on" : ""} onClick={() => onMode("untracked")}>Just train</button>
          <span className="mode-switch__thumb" aria-hidden="true" />
        </div>
      )}
      <div className="story__controls">
        {item.hint ? (
          <p className="story__hint"><span className="story__hint-dot" />{photoTaken ? "Photo kept" : item.hint}</p>
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
