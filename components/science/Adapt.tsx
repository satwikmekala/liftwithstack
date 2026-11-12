"use client";

import { useMemo, useState } from "react";
import { Foot } from "./Foot";
import { Keep, Point, Step, Stop } from "./lesson";
import { Note } from "./Note";

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
const WEEKS = 12;
/** Illustrative shapes, not data: the nervous system moves first, fiber size follows more slowly. */
const drive = (week: number) => 1 - Math.exp(-week / 2.6);
const size = (week: number) => Math.pow(Math.max(0, week - 1) / (WEEKS - 1), 1.25);
const WHEN = (week: number) => week === 0 ? "First workout" : week === 1 ? "1 week in" : `${week} weeks in`;

/** Two adaptations on one timeline, with the weeks in the reader's hand. */
function Lanes({ onMoved }: { onMoved: () => void }) {
  const [week, setWeek] = useState(0);
  const d = drive(week), g = size(week);
  const radius = 76 + 16 * g;
  const dots = useMemo(() => packed(radius, 12.5), [radius]);
  const firing = 2 + Math.round(d * 2);
  const active = [1, 3, 0, 2].slice(0, firing);
  const synced = d > 0.6;
  return (
    <figure className="lanes">
      <div className="lanes__grid">
        <div className="lane">
          <p className="lane__title">Nervous system</p>
          <svg viewBox="0 0 320 220" className={`lane__svg${synced ? " is-later" : ""}`} role="img"
            aria-label={`${firing} of five motor units firing${synced ? " together" : ", out of step"}.`}>
            <rect x={8} y={14} width={34} height={192} rx={17} className="cord" />
            {NEURONS.map((n) => {
              const y = 34 + n * 38;
              const on = active.includes(n);
              return (
                <g key={n} className={on ? "unit is-on" : "unit"}>
                  <circle cx={25} cy={y} r={7} className="unit__body" />
                  <path d={`M 32 ${y} H 220`} className="unit__axon" />
                  <path d={`M 32 ${y} H 220`} className="unit__pulse" style={{ animationDelay: synced ? "0s" : `${n * 0.37}s` }} />
                  {[0, 1, 2, 3].map((k) => <rect key={k} x={222 + k * 22} y={y - 8} width={18} height={16} rx={5} className="unit__fiber" />)}
                </g>
              );
            })}
          </svg>
          <div className="meter"><span>Nerve drive to the muscle</span><i><b style={{ width: `${28 + d * 72}%` }} /></i></div>
        </div>
        <div className="lane">
          <p className="lane__title">One muscle fiber, cut across</p>
          <svg viewBox="-110 -110 220 220" className="lane__svg" role="img" aria-label={`A fiber in cross-section, ${Math.round(g * 100)}% of the way to its thicker size.`}>
            <circle r={radius + 6} className="fiber__wall" />
            {dots.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={5.3} className="fiber__myo" />)}
          </svg>
          <div className="meter"><span>Fiber thickness</span><i><b style={{ width: `${28 + g * 72}%` }} /></i></div>
        </div>
      </div>
      <label className="range range--wide lanes__range">
        <span className="range__label mono">WEEK 0</span>
        <input type="range" min={0} max={WEEKS} step={1} value={week} aria-label="Weeks of training" aria-valuetext={WHEN(week)}
          onChange={(event) => { const value = Number(event.target.value); setWeek(value); if (value >= 8) onMoved(); }} />
        <span className="range__label mono">WEEK {WEEKS}</span>
      </label>
      <p className="lanes__when" aria-live="polite"><b>{WHEN(week)}.</b> {week === 0 ? "Only some motor units join in, and not quite in step." : week <= 4 ? "More motor units take part and they fire faster. The fiber has barely changed." : week <= 8 ? "The nervous system has done most of its early learning. The fiber is now visibly thicker." : "Both have changed. From here, most new strength comes from the muscle itself growing."}</p>
      <figcaption className="fig-caption">An illustration of the order things happen in, not measured data. The two overlap, and timing differs between people. Each dot is a myofibril; real fibers hold hundreds or thousands.</figcaption>
    </figure>
  );
}

/** Stop 4: how training changes the muscle. */
export function Adapt() {
  const [moved, setMoved] = useState(false);
  return (
    <Stop n={4} title="The lifting is the start. The change comes after."
      lead={<>
        <p>When a load is hard for you, all that pulling puts the fibers under strain. The term for it is <b>mechanical tension</b>. Your cells can sense it. The exact sensor is still being worked out, but tension is the leading explanation for what starts muscle growth.<Foot of="wackerhage" /></p>
        <p>Sensing it switches on signalling inside the fiber, including a pathway called mTORC1, and the fiber builds protein faster for about a day or two.<Foot of="roberts" /><Foot of="macdougall" /> Food supplies the material, protein especially,<Foot of="morton" /> and poor sleep can get in the way.<Foot of="knowles" /></p>
      </>}>
      <Step wide stage={<Lanes onMoved={() => setMoved(true)} />}>
        <p className="step__intro">No single workout changes much. Repeat it for weeks and two separate things change, at different speeds.</p>
        <p className={`step__nudge${moved ? " is-done" : ""}`}><span className="mono">{moved ? "DONE" : "TRY IT"}</span>Drag from week 0 to week 12 and watch which lane moves first.</p>
          <Point>Your nervous system moves first.</Point>
          <p><b>Your nervous system gets better at the lift.</b> Your spinal cord drives muscle through motor units: one nerve cell and all the fibers it controls. In one study, four weeks of training made motor units switch on sooner and fire faster, with more force as the result.<Foot of="delvecchio" /></p>
          <p><b>Your fibers get thicker.</b> This is hypertrophy. A fiber adds contractile protein, so there is more material pulling side by side, which you already know means more force. Whether fibers do it by thickening their myofibrils, adding more, or both is still an open question.<Foot of="jorgenson" /></p>
          <p>The two overlap. Growth starts early as well, but it takes weeks to show, and some early size is swelling.<Foot of="folland" /><Foot of="seynnes" /><Foot of="damas" /></p>
          <Keep>Strength and size are two different changes. The nervous system leads, the muscle follows.</Keep>
          <Note title="Does soreness mean it’s working?">
            <p>Not reliably. Soreness mostly follows movements you aren’t used to, and it fades as you repeat them while progress carries on. Some muscle damage does happen, especially early on, and early protein building goes largely to repairing it. In one study, protein building only lined up with growth once the damage had faded.<Foot of="damas" /> Damage probably isn’t needed for growth at all.<Foot of="wackerhage" /></p>
          </Note>
      </Step>
    </Stop>
  );
}
