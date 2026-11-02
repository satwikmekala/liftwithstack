"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { CameraScreen } from "@/components/phone/CameraScreen";
import { HistorySheet } from "@/components/phone/HistorySheet";
import { InfoSheet } from "@/components/phone/InfoSheet";
import { LockScreen } from "@/components/phone/LockScreen";
import { LoggerScreen } from "@/components/phone/LoggerScreen";
import { Phone } from "@/components/phone/Phone";
import { StackedScreen } from "@/components/phone/StackedScreen";
import { TrainScreen } from "@/components/phone/TrainScreen";
import { useDemoJourney } from "@/components/stack/DemoJourney";
import { makeDemoBlock } from "@/lib/demo-block";
import { momentSetLine } from "@/lib/moments";
import { scrollToPosition } from "@/lib/scroll";
import { Icon, type IconName } from "@/components/ui/Icon";
import { isExerciseDone } from "@/lib/workout";

type StepId = "start" | "log" | "form" | "lock" | "done";
type Step = { id: StepId; chapter: string; eyebrow: string; title: string; body: string; hint: string | null; action?: { label: string; icon: IconName } };

const STEPS: Step[] = [
  { id: "start", chapter: "Start", eyebrow: "START", title: "Don’t overthink it.", body: "Your workout is ready before you are. Slide, and you’re lifting.", hint: "Slide the handle" },
  { id: "log", chapter: "Log", eyebrow: "LOG", title: "Forgot what you lifted last time?", body: "Not a problem. Stack remembers, and your last weights are already filled in.", hint: "Tap Log", action: { label: "Check history", icon: "history" } },
  { id: "form", chapter: "Form", eyebrow: "FORM CHECK", title: "Not sure about the form?", body: "That’s okay. Every exercise shows you how it’s done, with a short video one tap away.", hint: null, action: { label: "Check form", icon: "play" } },
  { id: "lock", chapter: "Lock", eyebrow: "LOCK SCREEN", title: "Don’t even unlock your phone.", body: "Log reps and weight from your Lock Screen or the Dynamic Island.", hint: "Tap + or the check" },
  { id: "done", chapter: "Stack", eyebrow: "WORKOUT COMPLETE", title: "One workout. One block.", body: "Keep stacking up your week. Beat last time and it lands thicker. Hit a PR and it lands with a line of gold.", hint: null },
];

/** Start → log (with history) → check form → Lock Screen → workout complete, on one phone that stays in view. */
export function Story() {
  const { workout, dispatch, photos, takePhoto, completed, finish } = useDemoJourney();
  const [step, setStep] = useState(0);
  const [launch, setLaunch] = useState<{ x: number; y: number } | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [castAt, setCastAt] = useState<number | null>(null);
  const [sheet, setSheet] = useState<"history" | "info" | null>(null);
  const [playing, setPlaying] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const canFinish = makeDemoBlock(workout).sets > 0;
  const finishRef = useRef(finish);
  useEffect(() => { finishRef.current = finish; }, [finish]);
  const captions = useRef<HTMLDivElement>(null);
  useEffect(() => { captions.current?.scrollTo({ top: 0, behavior: "instant" }); }, [step]);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);
  const current = STEPS[step].id;
  const screen = current === "start" && launch ? "log" : current;

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setStep(Number((entry.target as HTMLElement).dataset.step));
      }
    }, { rootMargin: "-48% 0px -48% 0px" });
    stepRefs.current.forEach((element) => element && observer.observe(element));
    return () => observer.disconnect();
  }, []);

  // Each chapter sets its own scene: the start puts the handle back, Form opens the
  // exercise's info, and anything opened elsewhere closes, as leaving a screen does.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (current === "start") {
        setLaunch(null);
        setResetKey((value) => value + 1);
      }
      setSheet(current === "form" ? "info" : null);
      setPlaying(false);
      setCameraOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [current]);

  // The completion moment plays each time it comes into view.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (screen === "done") finishRef.current();
      setCastAt(screen === "done" ? performance.now() : null);
    }, 0);
    return () => clearTimeout(timer);
  }, [screen]);

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

  // The camera in the logger's corner still works, for anyone who finds it.
  const exercise = workout.exercises[workout.exercise];
  const set = exercise.sets[workout.set];
  const shotLine = set ? momentSetLine({ number: workout.set + 1, weight: set.weight, reps: set.reps }) : null;
  const shoot = (labelled: boolean) => {
    takePhoto({ exercise: exercise.name, line: labelled ? shotLine : null });
    setTimeout(() => setCameraOpen(false), 120);
  };

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
  const act = (id: StepId) => {
    if (id === "log") setSheet((open) => (open === "history" ? null : "history"));
    if (id === "form") { setSheet("info"); setPlaying(true); }
  };
  const doneIndex = STEPS.length - 1;
  const copy = (item: Step, index: number) => (
    <StepCopy item={item} onAction={() => act(item.id)} active={(item.id === "log" && sheet === "history") || (item.id === "form" && playing)}
      onReplay={() => setCastAt(performance.now())} canFinish={canFinish && index > 0 && index < doneIndex}
      onFinish={() => { finish(); jump(doneIndex); }} personal={!!completed && index === doneIndex} onExplore={finish} />
  );
  const logging = screen === "log" || screen === "form";

  return (
    <section ref={story} className="story" id="how" aria-label="How Stack works">
      <div className="story__steps">
        {STEPS.map((item, index) => (
          <article key={item.id} ref={(node) => { stepRefs.current[index] = node; }} data-step={index}
            className={`story__step${step === index ? " is-active" : ""}`}>
            {copy(item, index)}
          </article>
        ))}
      </div>
      <div className="story__stage">
        <Phone className="story__phone" label="Stack on iPhone">
          <div className={`screen-slot${screen === "start" ? " is-on" : ""}`} inert={screen !== "start"}>
            <TrainScreen onStart={start} resetKey={resetKey} />
          </div>
          <div className={`screen-slot${logging ? " is-on" : ""}${sheet === "history" ? " is-behind-sheet" : sheet === "info" ? " is-behind-half" : ""}`} inert={!logging || sheet !== null || cameraOpen}>
            <LoggerScreen state={workout} dispatch={dispatch} photos={photos.length} onCamera={() => setCameraOpen(true)} cameraCue={false}
              onHistory={() => setSheet("history")} onInfo={() => setSheet("info")} />
          </div>
          <div className={`screen-slot${screen === "lock" ? " is-on" : ""}`} inert={screen !== "lock"}>
            <LockScreen state={workout} dispatch={dispatch} />
          </div>
          <div className={`screen-slot${screen === "done" ? " is-on" : ""}`} inert={screen !== "done"}>
            <StackedScreen startedAt={castAt} demo={completed} />
          </div>
          <HistorySheet open={logging && sheet === "history"} onClose={() => setSheet(null)} />
          <InfoSheet open={logging && sheet === "info"} playing={logging && playing} onPlay={() => setPlaying(true)}
            onStop={() => setPlaying(false)} onClose={() => { setSheet(null); setPlaying(false); }} />
          <CameraScreen open={cameraOpen && logging} exercise={exercise.name} line={shotLine}
            count={photos.length} onShoot={shoot} onClose={() => setCameraOpen(false)} />
          {launch && current === "start" && (
            <span className="launch" aria-hidden="true" style={{ "--x": `${launch.x}px`, "--y": `${launch.y}px` } as CSSProperties} />
          )}
        </Phone>
        <div className="story__panel">
          <div className="story__progress" role="group" aria-label="Chapters">
            {STEPS.map((item, index) => (
              <button key={item.id} type="button" aria-pressed={step === index} aria-label={item.title}
                className={`story__segment${index === step ? " is-current" : index < step ? " is-done" : ""}`}
                onClick={() => jump(index)}><i /><span>{item.chapter}</span></button>
            ))}
          </div>
          <div ref={captions} className="story__captions" aria-live="polite" tabIndex={0} role="region" aria-label="Chapter details">
            {STEPS.map((item, index) => (
              <div key={item.id} className={`story__caption${index === step ? " is-on" : index < step ? " is-past" : ""}`}
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

function StepCopy({ item, onAction, active, onReplay, canFinish, onFinish, personal, onExplore }: {
  item: Step; onAction: () => void; active: boolean; onReplay: () => void; canFinish: boolean; onFinish: () => void; personal: boolean; onExplore: () => void;
}) {
  return (
    <div className="story__copy">
      <p className="eyebrow">{item.eyebrow}</p>
      <h2 className="story__title">{personal ? "Your first block." : item.title}</h2>
      <p className="story__body">{personal ? "The sets you just logged, made visible. Find your orange block at the top of the stack." : item.body}</p>
      {item.action && (
        <button type="button" className={`story__action${active ? " is-active" : ""}`} onClick={onAction} aria-pressed={active}>
          <span className="story__action-icon"><Icon name={item.action.icon} size={item.action.icon === "play" ? 11 : 18} stroke={item.action.icon === "play" ? 0 : 2} /></span>
          {item.action.label}
        </button>
      )}
      <div className="story__controls">
        {item.hint ? (
          <p className="story__hint"><span className="story__hint-dot" />{item.hint}</p>
        ) : item.id === "done" ? (
          <button type="button" className="story__hint story__replay" onClick={onReplay}>
            <Icon name="repeat" size={15} stroke={2} />Play again
          </button>
        ) : null}
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
