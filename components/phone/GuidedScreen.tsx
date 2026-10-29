"use client";

import { useEffect, useRef, useState, type CSSProperties, type Dispatch } from "react";
import { Icon } from "@/components/ui/Icon";
import { artFor } from "@/lib/exercises";
import { GUIDED_PLAN, type GuidedAction, type GuidedState } from "@/lib/guided";
import { color } from "@/lib/tokens";
import { ActionPills } from "./ActionPills";
import { StatusBar } from "./Phone";
import { UpNext } from "./UpNext";

/**
 * Push started with Log sets off (features/untracked/GuidedWorkoutScreen.tsx): the exercise
 * and its picture, Skip, Check form and Done, and what's up next. Nothing is weighed or counted.
 */
export function GuidedScreen({ state, dispatch, photos, onCamera, cameraCue }: {
  state: GuidedState; dispatch: Dispatch<GuidedAction>; photos: number; onCamera: () => void; cameraCue: boolean;
}) {
  const current = GUIDED_PLAN[state.index];
  const art = current ? artFor(current) : undefined;
  const isDone = current ? state.done.includes(current) : false;
  const queue = GUIDED_PLAN.filter((name, index) => index > state.index && !state.done.includes(name));
  const [confirming, setConfirming] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const done = () => {
    if (confirming || !current) return;
    setConfirming(true);
    timer.current = setTimeout(() => {
      dispatch({ type: "done" });
      setConfirming(false);
    }, 320);
  };

  return (
    <div className="screen guided" style={{ "--c": color.accent } as CSSProperties}>
      <StatusBar />
      <div className="guided__content">
        <div className="logger__header">
          <span className="day-label"><span className="day-label__dot" />PUSH</span>
          <span className="logger__actions" aria-hidden="true">
            <span className="glass-button glass-button--wide"><Icon name="repeat" size={18} color={color.ash} />Change</span>
            <span className="glass-button"><Icon name="chevronDown" size={20} color={color.ash} /></span>
            <span className="glass-button"><Icon name="x" size={20} color={color.ash} /></span>
          </span>
        </div>
        <div className="guided__segments" aria-hidden="true">
          {GUIDED_PLAN.map((name, index) => (
            <span key={name} className={index === state.index ? "is-current" : state.done.includes(name) ? "is-done" : ""} />
          ))}
        </div>

        {current ? (
          <div key={current} className="guided__exercise enter-right">
            <p className="guided__name">{current}</p>
            <div className="guided__picture">
              {art ? <img src={art.image} alt="" width={640} height={600} loading="lazy" decoding="async" /> : <Icon name="dumbbell" size={40} color={color.ashDim} />}
            </div>
          </div>
        ) : (
          <div className="guided__exercise guided__exercise--empty">
            <p className="guided__name">That’s the plan.</p>
          </div>
        )}

        {current ? (
          <>
            <div className="guided__controls">
              <button type="button" className="guided__round" onClick={() => dispatch({ type: "skip" })} aria-label={`Skip ${current}`}>Skip</button>
              <span className="guided__form" aria-hidden="true">
                Check form<span className="guided__play"><Icon name="play" size={11} stroke={0} color={color.ink} className="guided__play-icon" /></span>
              </span>
              <button type="button" className={`log-button${confirming ? " is-confirming" : ""}`} onClick={done}
                aria-label={isDone ? "Next exercise" : `Done with ${current}`}>
                <span className="log-button__label">{isDone ? "Next" : "Done"}</span>
                <span className="log-button__check"><Icon name="check" size={24} stroke={2.8} color={color.ink} /></span>
              </button>
            </div>
            {queue.length > 0 ? (
              <UpNext name={queue[0]} following={queue.slice(1)} />
            ) : <div className="guided__spacer" />}
          </>
        ) : (
          <div className="guided__dock">
            <span className="guided__finish" aria-hidden="true">Finish workout</span>
            <span className="guided__text-button" aria-hidden="true">Add another exercise</span>
          </div>
        )}
      </div>
      <ActionPills photos={photos} onCamera={onCamera} cue={cameraCue}
        left={<span><Icon name="message" size={24} stroke={1.8} color={color.bone} /></span>} />
    </div>
  );
}
