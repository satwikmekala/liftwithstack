"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { BodyFigure } from "@/components/body/BodyFigure";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { ADDABLE, BODY_WORKOUT, EXERCISE_MUSCLES, regionsOf, statesOf } from "@/lib/body/demo";
import { BODY_REGIONS, REGION_INFO, involvementColor, sideFor, type BodyRegion, type BodySide } from "@/lib/body/regions";
import { artFor } from "@/lib/exercises";
import { color } from "@/lib/tokens";

const EXERCISE = "Bench Press";

/**
 * Body Map, as the Muscles worked sheet works in a workout (components/body-map/BodyMapScreen.tsx):
 * the app's own 3D figure, lit by this exercise or by everything today. Drag to turn it, tap a
 * muscle to see the exercises that train it, and add one to the workout.
 */
export function BodyMap() {
  const [view, setView] = useState<"exercise" | "today">("exercise");
  const [side, setSide] = useState<BodySide>("front");
  const [full, setFull] = useState(false);
  const [selected, setSelected] = useState<BodyRegion | null>(null);
  const [added, setAdded] = useState<string[]>([]);
  const [pulse, setPulse] = useState<{ key: number; regions: BodyRegion[] } | null>(null);

  const workout = useMemo(() => [...BODY_WORKOUT, ...added.map((name) => ({ name, status: "planned" as const }))], [added]);
  const states = useMemo(() => view === "exercise" ? EXERCISE_MUSCLES[EXERCISE] : statesOf(workout.map((item) => item.name)), [view, workout]);
  const focus = useMemo(() => full ? null : selected ? [...new Set([...regionsOf(states), selected])] : regionsOf(states), [full, selected, states]);
  const primary = BODY_REGIONS.filter((region) => states[region] === "primary");
  const secondary = BODY_REGIONS.filter((region) => states[region] === "secondary");

  const select = (region: BodyRegion | null) => {
    setSelected(region);
    // A chip for a muscle on the far side turns the figure to show it.
    if (region && sideFor([region]) === "back" && side === "front") setSide("back");
  };
  const add = (name: string) => {
    const before = statesOf(workout.map((item) => item.name));
    const brought = regionsOf(EXERCISE_MUSCLES[name]).filter((region) => !before[region]);
    setAdded((current) => [...current, name]);
    setView("today");
    setPulse((current) => ({ key: (current?.key ?? 0) + 1, regions: brought.length ? brought : regionsOf(EXERCISE_MUSCLES[name]) }));
  };

  const inWorkout = selected ? workout
    .map((item) => ({ ...item, involvement: EXERCISE_MUSCLES[item.name]?.[selected] }))
    .filter((item) => item.involvement)
    .sort((a, b) => (a.involvement === b.involvement ? 0 : a.involvement === "primary" ? -1 : 1)) : [];
  const suggestions = selected ? ADDABLE.filter((name) => EXERCISE_MUSCLES[name][selected] === "primary" && !added.includes(name)) : [];
  const tint = selected ? involvementColor(selected, states[selected] ?? "primary") : color.accent;

  return (
    <section className="bodymap" id="body-map" aria-labelledby="bodymap-title">
      <Reveal className="bodymap__copy">
        <p className="eyebrow">BODY MAP</p>
        <h2 id="bodymap-title" className="section-title">See what you’re training, live.</h2>
        <p className="section-body">Every workout lights up the muscles you’ve worked. Tap one to swap an exercise or add another.</p>
        <ul className="circle__points">
          <li><Icon name="eye" size={18} stroke={1.8} /><span><b>This exercise, or today.</b> What the lift in front of you trains, and everything the workout reaches.</span></li>
          <li><Icon name="pointer" size={18} stroke={1.8} /><span><b>Tap any muscle.</b> See which exercises train it, and add one without leaving your workout.</span></li>
          <li><Icon name="refresh" size={17} stroke={1.8} /><span><b>Turn it round.</b> Drag the figure to see your back, hamstrings and calves.</span></li>
        </ul>
      </Reveal>

      <div className="bodymap__stage">
        <Reveal className="bm-sheet" aria-label="Muscles worked in Stack, an example you can use">
          <div className="bm-sheet__head">
            <span><span className="bm-sheet__eyebrow mono">MUSCLES WORKED</span><span className="bm-sheet__title">{view === "exercise" ? EXERCISE : "Chest and Triceps"}</span></span>
            <span className="bm-sheet__close" aria-hidden="true"><Icon name="x" size={16} color={color.bone} /></span>
          </div>
          <div className="bm-seg" role="group" aria-label="What to show">
            <button type="button" className={view === "exercise" ? "is-on" : ""} aria-pressed={view === "exercise"} onClick={() => { setView("exercise"); setSelected(null); }}>This exercise</button>
            <button type="button" className={view === "today" ? "is-on" : ""} aria-pressed={view === "today"} onClick={() => { setView("today"); setSelected(null); }}>Today</button>
          </div>

          <div className="bm-figure">
            <BodyFigure states={states} focus={focus} side={side} selected={selected} pulse={pulse} onSelect={select} onSideChange={setSide}
              label="Stack’s 3D figure with the trained muscles lit. Drag to turn it, tap a muscle for its exercises." />
            <button type="button" className="bm-figure__pill" onClick={() => setFull((value) => !value)} aria-pressed={full}>
              <Icon name="expand" size={13} stroke={2.2} />{full ? "Zoom in" : "Full body"}
            </button>
            <div className="bm-seg bm-seg--small" role="group" aria-label="Side of the body">
              <button type="button" className={side === "front" ? "is-on" : ""} aria-pressed={side === "front"} onClick={() => setSide("front")}>Front</button>
              <button type="button" className={side === "back" ? "is-on" : ""} aria-pressed={side === "back"} onClick={() => setSide("back")}>Back</button>
            </div>
          </div>

          <div className="bm-lower">
            {selected ? (
              <div className="bm-muscle" style={{ "--c": tint } as CSSProperties}>
                <div className="bm-muscle__head">
                  <span className="bm-muscle__name"><i />{REGION_INFO[selected].name}</span>
                  {states[selected] && <span className="bm-muscle__tag mono">{states[selected] === "primary" ? "PRIMARY" : "SECONDARY"}</span>}
                  <button type="button" className="bm-muscle__close" onClick={() => setSelected(null)} aria-label={`Close ${REGION_INFO[selected].name}`}><Icon name="x" size={16} color={color.bone} /></button>
                </div>
                {inWorkout.length > 0 ? (
                  <>
                    <p className="bm-label mono">IN THIS WORKOUT</p>
                    <div className="bm-rows">
                      {inWorkout.slice(0, 2).map((item) => (
                        <div key={item.name} className="bm-row"><i /><span><b>{item.name}</b><small>{item.involvement === "primary" ? "Primary" : "Secondary"} · {item.status === "done" ? "Done" : "Not started"}</small></span>
                          {item.status === "done" ? <Icon name="check" size={16} stroke={2.4} color={tint} /> : <span className="bm-row__replace" aria-hidden="true">Replace</span>}</div>
                      ))}
                    </div>
                  </>
                ) : <p className="bm-muscle__none">Nothing in this workout trains it yet.</p>}
                {suggestions.length > 0 && (
                  <>
                    <p className="bm-muscle__line">Exercises where <em>{REGION_INFO[selected].name.toLowerCase()}</em> do the main work</p>
                    <div className="bm-adds">
                      {suggestions.map((name) => (
                        <div key={name} className="bm-add">
                          <span className="bm-add__art"><img src={artFor(name).image} alt="" loading="lazy" decoding="async" /></span>
                          <b>{name}</b>
                          <button type="button" onClick={() => add(name)}><Icon name="plus" size={13} stroke={2.6} />Add</button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="bm-groups">
                <p className="bm-hint"><Icon name="pointer" size={15} stroke={1.9} />Tap any muscle to find exercises for it</p>
                <p className="bm-label mono">PRIMARY</p>
                <div className="bm-chips">
                  {primary.map((region) => <button key={region} type="button" className="bm-chip" onClick={() => select(region)}><i style={{ background: involvementColor(region, "primary") }} />{REGION_INFO[region].name}</button>)}
                </div>
                {secondary.length > 0 && <>
                  <p className="bm-label mono">SECONDARY</p>
                  <div className="bm-chips">
                    {secondary.map((region) => <button key={region} type="button" className="bm-chip" onClick={() => select(region)}><i style={{ background: involvementColor(region, "secondary") }} />{REGION_INFO[region].name}</button>)}
                  </div>
                </>}
              </div>
            )}
          </div>
        </Reveal>
        <p className="circle__hint"><span className="story__hint-dot" />{selected ? (suggestions.length ? "Add one and watch it light up" : "Tap another muscle, or drag to turn") : "Drag to turn · tap a muscle"}</p>
      </div>
    </section>
  );
}
