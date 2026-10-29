"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { MomentPhoto } from "@/components/moments/MomentPhoto";
import { MiniStack } from "@/components/stack/MiniStack";
import { useDemoJourney } from "@/components/stack/DemoJourney";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { thisWeekSlabs } from "@/lib/circle";
import { EXAMPLE_WEEK, type MomentPrint } from "@/lib/moments";

const TILT = [0, -9, 8];
const SHIFT = [0, -7, 7];

/**
 * Moments: the photos kept with a week's workouts, tucked into the corner of its Stack as a
 * little pile (features/moments/WeekMoments.tsx). Opened, they spread into the grid grouped by
 * workout, each with its lock: open goes to your circle, closed stays private.
 */
export function Moments() {
  const { photos, locks, toggleLock, completed } = useDemoJourney();
  const [open, setOpen] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const pile = useRef<HTMLButtonElement>(null);
  const prints = useRef(new Map<string, HTMLElement>());
  const slabs = useMemo(() => thisWeekSlabs(completed), [completed]);
  const groups = useMemo(() => EXAMPLE_WEEK.map((group, index) => (index === 0 && photos.length
    ? { ...group, prints: [...[...photos].reverse(), ...group.prints] } : group)), [photos]);
  const all = useMemo(() => groups.flatMap((group) => group.prints), [groups]);
  const top = all.slice(0, 3);
  const privateCount = all.filter((print) => locks[print.id]).length;

  // Opens by itself the first time most of it is in view.
  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setOpen(true);
      observer.disconnect();
    }, { threshold: 0.55 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Each print knows the way back to the pile, so closing and opening is one move.
  useLayoutEffect(() => {
    const measure = () => {
      const target = pile.current?.getBoundingClientRect();
      if (!target) return;
      for (const [id, element] of prints.current) {
        // Measure where it sits in the grid, without the transform that moves it.
        const style = element.style;
        style.transition = "none";
        style.transform = "none";
        const base = element.getBoundingClientRect();
        style.transform = "";
        void element.offsetWidth;
        style.transition = "";
        const index = all.findIndex((print) => print.id === id);
        const layer = index < 3 ? index : 3;
        style.setProperty("--dx", `${target.left + target.width / 2 - (base.left + base.width / 2) + (SHIFT[layer] ?? 0)}px`);
        style.setProperty("--dy", `${target.top + target.height / 2 - (base.top + base.height / 2)}px`);
        style.setProperty("--s", String(46 / Math.max(1, base.width)));
        style.setProperty("--r", `${TILT[layer] ?? 0}deg`);
        style.setProperty("--z", String(10 - layer));
        style.setProperty("--order", String(index));
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (stage.current) observer.observe(stage.current);
    return () => observer.disconnect();
  }, [all]);

  return (
    <section className="moments" id="moments" aria-labelledby="moments-title">
      <Reveal className="moments__copy">
        <p className="eyebrow">MOMENTS</p>
        <h2 id="moments-title" className="section-title">Pictures too.</h2>
        <p className="section-body">Stack up a few photos while you train. Each one stays with its workout, there to look back on after it and across your week.</p>
        <ul className="facts">
          <li><span className="facts__mark"><Icon name="camera" size={16} stroke={2} /></span>One tap from any workout. No filters, no feed.</li>
          <li><span className="facts__mark"><Icon name="lock" size={15} stroke={2.2} /></span>Share them with your circle, or lock them for yourself.</li>
        </ul>
      </Reveal>

      <div ref={stage} className={`moments__stage${open ? " is-open" : ""}`}>
        <div className="moments__week">
          <p className="moments__week-label mono">THIS WEEK · 3 BLOCKS</p>
          <MiniStack slabs={slabs} width={220} height={250} unit={14} glow className="moments__stack" />
          <button ref={pile} type="button" className="moments__pile" onClick={() => setOpen((value) => !value)}
            aria-expanded={open} aria-controls="moments-grid"
            aria-label={open ? "Tuck this week’s photos back" : `Open this week’s ${all.length} photos`}>
            <span className="moments__pile-count">{all.length}</span>
          </button>
          <button type="button" className="moments__toggle" onClick={() => setOpen((value) => !value)} aria-hidden="true" tabIndex={-1}>
            {open ? "Tuck them back" : "Open this week’s photos"}
          </button>
        </div>

        <div id="moments-grid" className="moments__grid">
          {groups.map((group) => (
            <div key={group.label} className="moments__group">
              <p className="moments__group-label mono" style={{ "--c": group.color } as CSSProperties}><i />{group.label}</p>
              <div className="moments__prints">
                {group.prints.map((print: MomentPrint) => {
                  const locked = Boolean(locks[print.id]);
                  return (
                    <figure key={print.id} ref={(node) => { if (node) prints.current.set(print.id, node); else prints.current.delete(print.id); }}
                      className={`print${top.some((item) => item.id === print.id) ? " is-top" : ""}${print.yours ? " is-yours" : ""}`}>
                      <MomentPhoto exercise={print.exercise} line={print.line} label={print.line !== null} />
                      {print.yours && <figcaption className="print__yours mono">YOURS</figcaption>}
                      <button type="button" className={`print__lock${locked ? " is-locked" : ""}`} onClick={() => toggleLock(print.id)}
                        tabIndex={open ? 0 : -1} aria-pressed={locked}
                        aria-label={locked ? `${print.exercise}. Kept private. Share with your circle` : `${print.exercise}. Goes to your circle. Keep private`}>
                        <Icon name={locked ? "lock" : "lockOpen"} size={15} stroke={2.4} />
                      </button>
                    </figure>
                  );
                })}
              </div>
            </div>
          ))}
          <p className="moments__legend" aria-live="polite">
            <span><Icon name="lockOpen" size={13} stroke={2.4} />Goes to your circle</span>
            <span className="is-private"><Icon name="lock" size={13} stroke={2.4} />Kept private{privateCount ? ` · ${privateCount}` : ""}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
