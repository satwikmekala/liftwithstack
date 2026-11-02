"use client";

import { useMemo, useState } from "react";
import { Foot } from "./Foot";
import { Note } from "./Note";

const STAGES = [
  { when: "During the set", what: "Hard work puts the fibers under tension." },
  { when: "The next day or so", what: "Protein building runs faster, then settles.", source: "macdougall" },
  { when: "The first weeks", what: "Your nervous system gets better at the lift.", source: "delvecchio" },
  { when: "Weeks to months", what: "Fibers slowly thicken.", source: "seynnes" },
] as const;

/** Myofibril positions inside a fiber's cross-section, packed in rings. */
function packed(radius: number, spacing: number) {
  const dots: [number, number][] = [];
  const h = spacing * Math.sqrt(3) / 2;
  for (let j = -20; j <= 20; j++) for (let i = -20; i <= 20; i++) {
    const x = (i + (j % 2 ? 0.5 : 0)) * spacing, y = j * h;
    if (Math.hypot(x, y) <= radius) dots.push([x, y]);
  }
  return dots;
}

const NEURONS = [0, 1, 2, 3, 4];

/** Two adaptations side by side, before and after, with one switch. */
function Lanes() {
  const [later, setLater] = useState(false);
  const fiber = useMemo(() => ({ before: packed(76, 12.5), after: packed(92, 12.5) }), []);
  const dots = later ? fiber.after : fiber.before;
  const active = later ? [0, 1, 2, 3] : [1, 3];
  return (
    <figure className="lanes">
      <div className="lanes__switch" role="group" aria-label="Show the muscle">
        <button type="button" aria-pressed={!later} onClick={() => setLater(false)}>First workouts</button>
        <button type="button" aria-pressed={later} onClick={() => setLater(true)}>Months later</button>
      </div>
      <div className="lanes__grid">
        <div className="lane">
          <p className="lane__title">Nervous system</p>
          <svg viewBox="0 0 320 220" className={`lane__svg${later ? " is-later" : ""}`} role="img"
            aria-label={later ? "Four of five motor units firing together." : "Two of five motor units firing, out of step."}>
            <rect x={8} y={14} width={34} height={192} rx={17} className="cord" />
            {NEURONS.map((n) => {
              const y = 34 + n * 38;
              const on = active.includes(n);
              return (
                <g key={n} className={on ? "unit is-on" : "unit"} style={{ animationDelay: later ? "0s" : `${n * 0.37}s` }}>
                  <circle cx={25} cy={y} r={7} className="unit__body" />
                  <path d={`M 32 ${y} C 120 ${y}, 150 ${y}, 220 ${y}`} className="unit__axon" />
                  <path d={`M 32 ${y} C 120 ${y}, 150 ${y}, 220 ${y}`} className="unit__pulse" style={{ animationDelay: later ? "0s" : `${n * 0.37}s` }} />
                  {[0, 1, 2, 3].map((k) => <rect key={k} x={222 + k * 22} y={y - 8} width={18} height={16} rx={5} className="unit__fiber" />)}
                </g>
              );
            })}
          </svg>
          <p className="lane__text">{later ? "More motor units take part, they fire faster, and they work together. The same muscle produces more force." : "A motor unit is one nerve cell and the fibers it controls. At first, only some of them join in, and not quite in step."}<Foot of="delvecchio" /></p>
        </div>
        <div className="lane">
          <p className="lane__title">One muscle fiber, cut across</p>
          <svg viewBox="-110 -110 220 220" className="lane__svg" role="img"
            aria-label={later ? "A thicker fiber, holding more myofibrils." : "A fiber in cross-section, filled with myofibrils."}>
            <circle r={later ? 98 : 82} className="fiber__wall" />
            {dots.map(([x, y], i) => <circle key={`${x}-${y}`} cx={x} cy={y} r={5.3} className="fiber__myo" style={{ transitionDelay: `${(i % 9) * 30}ms` }} />)}
          </svg>
          <p className="lane__text">{later ? "The fiber has added contractile protein. More material pulling side by side means more force." : "Each dot is a myofibril. Real fibers hold hundreds or thousands; this is a sketch."}<Foot of="jorgenson" /></p>
        </div>
      </div>
      <figcaption className="fig-caption">Illustration of two separate adaptations. They overlap in time, and neither is drawn to scale.</figcaption>
    </figure>
  );
}

/** Chapter 4: how training changes the muscle. */
export function Adapt() {
  return (
    <section className="chapter-block" id="chapter-4" aria-labelledby="adapt-title">
      <div className="prose">
        <p className="chapter mono"><span>4</span>How training changes the muscle</p>
        <h2 id="adapt-title" className="d-title">The lifting is the start. The change comes after.</h2>
        <p>When a load is hard for you, all that pulling puts the fibers under strain. The term for it is <b>mechanical tension</b>. Your cells can sense it. The exact sensor is still being worked out, but tension is the leading explanation for what starts muscle growth.<Foot of="wackerhage" /></p>
        <p>Sensing it switches on signalling inside the fiber, including a pathway called mTORC1, and the fiber starts building protein faster.<Foot of="roberts" /> That lasts a day or so after a hard workout, then settles.<Foot of="macdougall" /> Food supplies the material, protein especially,<Foot of="morton" /> and poor sleep can get in the way.<Foot of="knowles" /></p>
      </div>
      <ol className="stages">
        {STAGES.map((stage) => (
          <li key={stage.when}><span className="stages__when mono">{stage.when}</span><span className="stages__what">{stage.what}{"source" in stage && <Foot of={stage.source} />}</span></li>
        ))}
      </ol>
      <div className="prose">
        <p>No single workout changes much that you could see. Repeated over weeks, it changes two separate things.</p>
      </div>
      <Lanes />
      <div className="prose">
        <p><b>Strength and size aren’t the same thing.</b> Your nervous system can make you stronger without the muscle being any bigger, and in the first weeks a lot of what you feel is that learning. Growth starts early too, but it’s slower to show.<Foot of="folland" /><Foot of="seynnes" /> Whether fibers grow by thickening their myofibrils, adding more, or both is still an open question.<Foot of="jorgenson" /></p>
        <Note title="Does soreness mean it’s working?">
          <p>Not reliably. Soreness mostly follows movements you aren’t used to. Some muscle damage does happen, especially early on, and early protein building goes largely to repairing it. In one study, protein building only lined up with growth once the damage had faded.<Foot of="damas" /> Damage probably isn’t needed for growth at all.<Foot of="wackerhage" /></p>
        </Note>
      </div>
    </section>
  );
}
