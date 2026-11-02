"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { MomentPhoto } from "@/components/moments/MomentPhoto";
import { MiniStack, stackAspect, TRUE_UNIT } from "@/components/stack/MiniStack";
import { useDemoJourney } from "@/components/stack/DemoJourney";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { thisWeekSlabs } from "@/lib/circle";
import { EXAMPLE_WEEK, type MomentPrint } from "@/lib/moments";

/** Drawn wide, at My Stack's true block height. */
const STACK = 340;

/** Where each print comes to rest around the week's Stack, as a share of the stage, and its tilt. */
const SPOTS = [
  { x: 5, y: 3, r: -6, mx: 3, my: 0 },
  { x: 13, y: 50, r: 4, mx: 3, my: 67 },
  { x: 66, y: 48, r: -4, mx: 57, my: 69 },
  { x: 75, y: 2, r: 5, mx: 57, my: 2 },
];
/** One photo from each workout this week, oldest first; the visitor's own photo takes Thursday's second. */
const SHOWN = ["mon-deadlift", "wed-squat", "thu-bench", "thu-raise"];

/**
 * Moments: photos taken in a workout stay with it (features/moments). Here they slide out from
 * behind the week's Stack and settle around it, each labelled with its day and workout, each
 * with the app's lock: open goes to your circle, closed stays yours.
 */
export function Moments() {
  const { photos, locks, toggleLock, completed } = useDemoJourney();
  const [open, setOpen] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const slabs = useMemo(() => thisWeekSlabs(completed), [completed]);
  const prints = useMemo(() => {
    const all = EXAMPLE_WEEK.flatMap((group) => group.prints.map((print) => ({ ...print, label: group.label, color: group.color })));
    const chosen: (MomentPrint & { label: string; color: string })[] = SHOWN.map((id) => all.find((print) => print.id === id)!);
    const yours = photos.at(-1);
    if (yours) chosen[3] = { ...yours, label: "THURSDAY · PUSH", color: "#FF7A3D" };
    return chosen;
  }, [photos]);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setOpen(true);
      observer.disconnect();
    }, { threshold: 0.4 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="moments" id="moments" aria-labelledby="moments-title">
      <Reveal className="section-head">
        <p className="eyebrow">MOMENTS</p>
        <h2 id="moments-title" className="section-title">Some workouts are worth remembering.</h2>
        <p className="section-body">Take a photo between sets. It stays with that workout, so looking back holds more than numbers.</p>
      </Reveal>

      <div ref={stage} className={`moments__stage${open ? " is-open" : ""}`}>
        <div className="moments__floor" aria-hidden="true" />
        <MiniStack slabs={slabs} width={STACK} height={Math.round(STACK * stackAspect(slabs, TRUE_UNIT))} unit={TRUE_UNIT} base="shadow" className="moments__stack" />
        <p className="moments__week mono" aria-hidden="true">THIS WEEK</p>
        {prints.map((print, index) => {
          const spot = SPOTS[index];
          const locked = Boolean(locks[print.id]);
          return (
            <figure key={print.id} className={`moment${print.yours ? " is-yours" : ""}`}
              style={{ "--x": spot.x, "--y": spot.y, "--mx": spot.mx, "--my": spot.my, "--r": `${spot.r}deg`, "--i": index, "--c": print.color } as CSSProperties}>
              <span className="moment__print">
                <MomentPhoto exercise={print.exercise} line={print.line} label={print.line !== null} />
                <button type="button" className={`moment__lock${locked ? " is-locked" : ""}`} onClick={() => toggleLock(print.id)} aria-pressed={locked}
                  tabIndex={open ? 0 : -1} aria-label={locked ? `${print.exercise}. Kept private. Share with your circle` : `${print.exercise}. Goes to your circle. Keep private`}>
                  <Icon name={locked ? "lock" : "lockOpen"} size={15} stroke={2.4} />
                </button>
              </span>
              <figcaption className="moment__caption mono"><i />{print.yours ? "YOURS · " : ""}{print.label}</figcaption>
            </figure>
          );
        })}
      </div>

      <div className="moments__notes">
        <p><Icon name="camera" size={16} stroke={2} />One tap from any workout. No filters, no feed.</p>
        <p><Icon name="lockOpen" size={15} stroke={2.2} />Share with your circle, or <Icon name="lock" size={15} stroke={2.2} className="is-private" />keep it yours.</p>
      </div>
    </section>
  );
}
