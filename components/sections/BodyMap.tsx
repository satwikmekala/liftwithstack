"use client";

import { useState, type CSSProperties } from "react";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { artFor } from "@/lib/exercises";
import { color, muscle } from "@/lib/tokens";

/** The lighter tints the figure uses for muscles that help rather than lead (features/body-map/colors.ts). */
const TINT = { upperChest: "#FFB48F", frontDelts: "#C7A4F6", triceps: "#7FDCD4" };
const SUGGESTED = ["Arnold Press", "Bradford Press"];

/**
 * Body Map, as the Muscles worked sheet shows it in a workout (app/body-map.tsx): the figure
 * lights up what this exercise trains; tapping a muscle lists the exercises already in the
 * workout that train it, and others that could be added. The figure is the app's own render.
 */
export function BodyMap() {
  const [open, setOpen] = useState(false);
  const [added, setAdded] = useState<string[]>([]);
  const toggle = (name: string) => setAdded((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);

  return (
    <section className="bodymap" id="body-map" aria-labelledby="bodymap-title">
      <Reveal className="bodymap__copy">
        <p className="eyebrow">BODY MAP</p>
        <h2 id="bodymap-title" className="section-title">See what you’re training, live.</h2>
        <p className="section-body">Every workout lights up the muscles you’ve worked. Tap one to swap an exercise or add another.</p>
        <ul className="circle__points">
          <li><Icon name="eye" size={18} stroke={1.8} /><span><b>This exercise, or today.</b> What the lift in front of you trains, and everything you’ve hit so far.</span></li>
          <li><Icon name="pointer" size={18} stroke={1.8} /><span><b>Tap any muscle.</b> See which exercises train it, and add one without leaving your workout.</span></li>
          <li><Icon name="check" size={18} stroke={2.2} /><span><b>In your recap too.</b> Finish, and the summary shows every muscle the workout reached.</span></li>
        </ul>
      </Reveal>

      <div className="bodymap__stage">
        <Reveal className="bm-sheet" aria-label="Muscles worked in Stack, an example">
          <div className="bm-sheet__head">
            <span><span className="bm-sheet__eyebrow mono">MUSCLES WORKED</span><span className="bm-sheet__title">Bench Press</span></span>
            <span className="bm-sheet__close" aria-hidden="true"><Icon name="x" size={16} color={color.bone} /></span>
          </div>
          <div className="bm-seg" aria-hidden="true"><span className="is-on">This exercise</span><span>Today</span></div>

          <div className="bm-figure">
            <img src="/app/torso-push.webp" alt="A figure with the chest, front delts and triceps lit up" width={720} height={770} loading="lazy" decoding="async" />
            <span className="bm-figure__pill" aria-hidden="true"><Icon name="expand" size={13} stroke={2.2} />Full body</span>
            <span className="bm-seg bm-seg--small" aria-hidden="true"><span className="is-on">Front</span><span>Back</span></span>
            <button type="button" className="bm-figure__spot bm-figure__spot--left" onClick={() => setOpen(true)} aria-label="Front delts. Show exercises" />
            <button type="button" className="bm-figure__spot bm-figure__spot--right" onClick={() => setOpen(true)} tabIndex={-1} aria-hidden="true" />
          </div>

          <div className="bm-groups" inert={open}>
            <p className="bm-label mono">PRIMARY</p>
            <div className="bm-chips"><span className="bm-chip"><i style={{ background: muscle.chest }} />Chest</span></div>
            <p className="bm-label mono">SECONDARY</p>
            <div className="bm-chips">
              <span className="bm-chip"><i style={{ background: TINT.upperChest }} />Upper chest</span>
              <button type="button" className="bm-chip bm-chip--tap" onClick={() => setOpen(true)}><i style={{ background: TINT.frontDelts }} />Front delts</button>
              <span className="bm-chip"><i style={{ background: TINT.triceps }} />Triceps</span>
            </div>
          </div>

          <div className={`bm-muscle${open ? " is-open" : ""}`} inert={!open} role="dialog" aria-label="Front delts" style={{ "--c": TINT.frontDelts } as CSSProperties}>
            <div className="bm-muscle__head">
              <span className="bm-muscle__name"><i />Front delts</span>
              <span className="bm-muscle__tag mono">SECONDARY</span>
              <button type="button" className="bm-muscle__close" onClick={() => setOpen(false)} aria-label="Close front delts"><Icon name="x" size={16} color={color.bone} /></button>
            </div>
            <p className="bm-label mono">IN THIS WORKOUT</p>
            <div className="bm-rows">
              <div className="bm-row"><i /><span><b>Seated Dumbbell Shoulder Press</b><small>Primary · Not started</small></span><span className="bm-row__replace" aria-hidden="true">Replace</span></div>
              <div className="bm-row"><i /><span><b>Bench Press</b><small>Secondary · Done</small></span><Icon name="check" size={16} stroke={2.4} color={TINT.frontDelts} /></div>
            </div>
            <p className="bm-label mono">ADD TO THIS WORKOUT</p>
            <p className="bm-muscle__line">Exercises where <em>front delts</em> do the main work</p>
            <div className="bm-adds">
              {SUGGESTED.map((name) => {
                const on = added.includes(name);
                return (
                  <div key={name} className="bm-add">
                    <span className="bm-add__art"><img src={artFor(name).image} alt="" loading="lazy" decoding="async" /></span>
                    <b>{name}</b>
                    <button type="button" className={on ? "is-on" : ""} onClick={() => toggle(name)} aria-pressed={on}>
                      <Icon name={on ? "check" : "plus"} size={13} stroke={2.6} />{on ? "Added" : "Add"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
        <p className="circle__hint"><span className="story__hint-dot" />{open ? "Add one, or close to go back" : "Tap Front delts"}</p>
      </div>
    </section>
  );
}
