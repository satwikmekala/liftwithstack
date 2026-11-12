"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CLASSIC_CURL } from "@/lib/science/story";
import { Foot } from "./Foot";
import { classicCurl } from "./frames";
import { Ask, Keep, Step, Stop } from "./lesson";
import { Note } from "./Note";

const CX = 380;
const THICK_HALF = 170;
const THIN = 200;
const THICK_ROWS = [92, 152, 212];
const THIN_ROWS = [62, 122, 182, 242];

/** A sarcomere you contract yourself, with the curl beside it moving in step. */
function Sliding({ onMoved }: { onMoved: () => void }) {
  const [c, setC] = useState(0);
  const arm = useRef<HTMLCanvasElement>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = box.current;
    if (!element) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      classicCurl.load(arm.current?.getBoundingClientRect().width ?? 300);
      io.disconnect();
    }, { rootMargin: "200px" });
    io.observe(element);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const draw = () => { if (arm.current) classicCurl.paint(arm.current, c * (CLASSIC_CURL.length - 1), 1.18); };
    draw();
    return classicCurl.onFrame(draw);
  }, [c]);

  const half = 300 - 80 * c;
  const zl = CX - half, zr = CX + half;
  const a0 = CX - THICK_HALF, a1 = CX + THICK_HALF;
  const shortening = Math.round(c * 27);

  return (
    <figure className="sliding" ref={box}>
      <div className="sliding__stage">
        <canvas ref={arm} className="sliding__arm" aria-hidden="true" />
        <svg className="sliding__svg" viewBox="0 0 760 330" role="img"
          aria-label={`One sarcomere, ${shortening}% shorter than at rest. The filaments keep their length; the Z-discs move closer together.`}>
          {/* Bands, drawn first so filaments sit on top. */}
          <rect x={a0} y={36} width={a1 - a0} height={232} className="band band--a" />
          {THIN_ROWS.map((y) => (
            <g key={y}>
              {[0, 1].map((side) => {
                const from = side === 0 ? zl : zr - THIN;
                return (
                  <g key={side}>
                    {Array.from({ length: 20 }, (_, i) => <circle key={i} cx={from + 5 + i * 10} cy={y} r={5.2} className="bead" />)}
                  </g>
                );
              })}
            </g>
          ))}
          {THICK_ROWS.map((y) => (
            <g key={y}>
              <rect x={a0} y={y - 6} width={a1 - a0} height={12} rx={6} className="thick" />
              {Array.from({ length: 13 }, (_, i) => {
                const x = a0 + 8 + i * 12;
                return (
                  <g key={i}>
                    <line x1={x} y1={y - 5} x2={x - 7} y2={y - 17} className="head" />
                    <line x1={x} y1={y + 5} x2={x - 7} y2={y + 17} className="head" />
                    <line x1={a1 - 8 - i * 12} y1={y - 5} x2={a1 - 1 - i * 12} y2={y - 17} className="head" />
                    <line x1={a1 - 8 - i * 12} y1={y + 5} x2={a1 - 1 - i * 12} y2={y + 17} className="head" />
                  </g>
                );
              })}
            </g>
          ))}
          {[zl, zr].map((x, i) => (
            <path key={i} className="zdisc" d={`M${x} 40 l -6 14 l 12 14 l -12 14 l 12 14 l -12 14 l 12 14 l -12 14 l 12 14 l -12 14 l 12 14 l -12 14 l 12 14 l -12 14 l 12 14 l -12 14 l 6 14`} />
          ))}
          {/* Labels */}
          <g className="sl-label">
            <line x1={a0} y1={22} x2={a1} y2={22} className="bracket bracket--keep" />
            <text x={CX} y={14} textAnchor="middle">myosin filament</text>
            <line x1={zl} y1={292} x2={zr} y2={292} className="bracket" />
            <text x={CX} y={318} textAnchor="middle" className="sl-label__strong">sarcomere: {shortening === 0 ? "at rest" : `${shortening}% shorter`}</text>
            <text x={zl} y={30} textAnchor="middle" className="sl-label__z">Z-disc</text>
            <text x={zr} y={30} textAnchor="middle" className="sl-label__z">Z-disc</text>
          </g>
        </svg>
      </div>
      <dl className="sliding__readout mono">
        <div><dt>SARCOMERE</dt><dd className={shortening > 0 ? "is-on" : ""}>{shortening === 0 ? "at rest" : `${shortening}% shorter`}</dd></div>
        <div><dt>MYOSIN FILAMENT</dt><dd>{c > 0.02 ? "same length" : "…"}</dd></div>
        <div><dt>ACTIN FILAMENT</dt><dd>{c > 0.02 ? "same length" : "…"}</dd></div>
        <div><dt>OVERLAP</dt><dd className={shortening > 0 ? "is-on" : ""}>{Math.round(((THIN - (half - THICK_HALF)) / THIN) * 100)}%</dd></div>
      </dl>
      <label className="range sliding__controls">
        <span className="range__label">Relax</span>
        <input type="range" min={0} max={1} step={0.01} value={c} aria-label="Contract the sarcomere"
          onChange={(event) => { const value = Number(event.target.value); setC(value); if (value > 0.7) onMoved(); }} />
        <span className="range__label">Contract</span>
      </label>
      <figcaption className="fig-caption"><span className="key key--actin" />actin <span className="key key--myosin" />myosin. Thin filaments are drawn as beads because actin is built from small units strung together. Not to scale.</figcaption>
    </figure>
  );
}

type Phase = "ready" | "attached" | "stroked" | "released";
const POSE: Record<Phase, { angle: number; reach: number; bound: boolean; carries: string }> = {
  ready: { angle: 26, reach: 0, bound: false, carries: "ADP + Pi" },
  attached: { angle: 26, reach: 1, bound: true, carries: "ADP + Pi" },
  stroked: { angle: -26, reach: 1, bound: true, carries: "empty" },
  released: { angle: -26, reach: 0, bound: false, carries: "ATP" },
};
const SAY: Record<Phase, string> = {
  ready: "A myosin head, cocked and charged with the energy from its last ATP. It is next to the actin but not holding it.",
  attached: "Attached. The head has bound to actin. That link is called a cross-bridge.",
  stroked: "Power stroke. The head pivoted toward the middle of the sarcomere and dragged the actin with it, by a few billionths of a metre. Now it is locked on.",
  released: "A fresh ATP bound to the head and it let go. It splits that ATP and uses the energy to swing back, ready to grab further along.",
};
const PIVOT = { x: 330, y: 236 };
const BEAD = 26;

/** The cross-bridge cycle, run by hand: attach, pull, and then the head is stuck. */
function Cycle({ phase, setPhase, onStuck, onCycle, taught }: { phase: Phase; setPhase: (phase: Phase) => void; onStuck: () => void; onCycle: () => void; taught: boolean }) {
  const [strokes, setStrokes] = useState(0);
  const [refused, setRefused] = useState(0);
  const pose = POSE[phase];
  useEffect(() => {
    if (phase !== "released") return;
    const id = setTimeout(() => { setPhase("ready"); onCycle(); }, 1100);
    return () => clearTimeout(id);
  }, [phase, onCycle, setPhase]);

  const attach = () => setPhase("attached");
  const pull = () => { setPhase("stroked"); setStrokes((n) => n + 1); onStuck(); };
  const letGo = () => setRefused((n) => n + 1);
  const atp = () => setPhase("released");

  const lever = 70 + pose.reach * 34;
  const shift = -strokes * BEAD * 4;
  const grabbedAt = -(strokes - (phase === "attached" ? 0 : 1)) * BEAD * 4;
  const grabbed = strokes > 0 || phase === "attached" ? Math.round((386 - grabbedAt + 300) / BEAD) : -1;
  return (
    <figure className="cycle">
      <svg className="cycle__svg" viewBox="0 0 660 300" role="img" aria-label={`One myosin head and its actin filament. ${SAY[phase]}`}>
        <g className="cycle__actin" style={{ transform: `translateX(${shift}px)` }}>
          {Array.from({ length: 90 }, (_, i) => (
            <circle key={i} cx={-300 + i * BEAD} cy={i % 2 ? 66 : 84} r={14} className={`bead${i === grabbed ? " bead--grabbed" : ""}`} />
          ))}
        </g>
        <text x={18} y={30} className="cycle__note">actin, pulled this way ←</text>
        <rect x={0} y={248} width={660} height={30} rx={15} className="thick" />
        <text x={18} y={296} className="cycle__note">myosin filament</text>
        <g key={refused} className={`cycle__head${refused && phase === "stroked" ? " is-refusing" : ""}`} style={{ transform: `rotate(${pose.angle}deg)`, transformOrigin: `${PIVOT.x}px ${PIVOT.y}px` }}>
          <line x1={PIVOT.x} y1={PIVOT.y + 8} x2={PIVOT.x} y2={PIVOT.y - lever} className="cycle__lever" />
          <ellipse cx={PIVOT.x} cy={PIVOT.y - lever - 22} rx={19} ry={30} className={`cycle__ball${pose.bound ? " is-bound" : ""}`} />
          <g style={{ transform: `rotate(${-pose.angle}deg)`, transformOrigin: `${PIVOT.x}px ${PIVOT.y - lever - 22}px` }}>
            <rect x={PIVOT.x + 26} y={PIVOT.y - lever - 34} width={pose.carries.length * 9 + 22} height={26} rx={13} className={`cycle__badge${pose.carries === "ATP" ? " is-atp" : ""}`} />
            <text x={PIVOT.x + 37} y={PIVOT.y - lever - 16} className="cycle__badge-text">{pose.carries}</text>
          </g>
        </g>
      </svg>
      <div className="cycle__panel">
        <p className="cycle__text" aria-live="polite">
          {phase === "stroked" && refused > 0 && !taught ? <><b>It can’t let go.</b> The head is locked onto the actin. Something has to free it. Answer the question below.</> : SAY[phase]}
        </p>
        <div className="cycle__actions">
          <button type="button" className={`pill-button${phase === "ready" ? " pill-button--solid" : ""}`} onClick={attach} disabled={phase !== "ready"}>Attach</button>
          <button type="button" className={`pill-button${phase === "attached" ? " pill-button--solid" : ""}`} onClick={pull} disabled={phase !== "attached"}>Pull</button>
          {taught
            ? <button type="button" className={`pill-button pill-button--atp${phase === "stroked" ? " is-ready" : ""}`} onClick={atp} disabled={phase !== "stroked"}>Give it ATP</button>
            : <button type="button" className={`pill-button${phase === "stroked" ? " pill-button--solid" : ""}`} onClick={letGo} disabled={phase !== "stroked"}>Let go</button>}
          <span className="cycle__count mono">{strokes} {strokes === 1 ? "STROKE" : "STROKES"}</span>
        </div>
      </div>
    </figure>
  );
}

/** Sarcomeres end to end add distance; side by side they add force. The reader builds both. */
function Builder({ onBuilt }: { onBuilt: () => void }) {
  const [chain, setChain] = useState(2);
  const [rows, setRows] = useState(1);
  const [squeeze, setSqueeze] = useState(false);
  const touched = useRef(new Set<string>());
  const set = (kind: "chain" | "rows", value: number) => {
    (kind === "chain" ? setChain : setRows)(value);
    touched.current.add(kind);
    if (touched.current.size === 2) onBuilt();
  };
  const unit = 54, gap = 4, shrink = squeeze ? 0.72 : 1;
  const width = chain * (unit * shrink + gap);
  return (
    <figure className="builder">
      <div className="builder__stage">
        <svg viewBox="0 0 400 190" role="img" aria-label={`${rows} ${rows === 1 ? "row" : "rows"} of ${chain} sarcomeres. Shortens ${chain} times as far as one sarcomere, and pulls ${rows} times as hard.`}>
          <line x1={26} y1={14} x2={26} y2={176} className="builder__wall" />
          {Array.from({ length: rows }, (_, r) => {
            const y = 95 - (rows * 30) / 2 + r * 30;
            return (
              <g key={r} className="builder__row">
                {Array.from({ length: chain }, (_, i) => (
                  <g key={i} style={{ transform: `translateX(${28 + i * (unit * shrink + gap)}px)` }} className="builder__unit">
                    <rect x={0} y={y + 3} width={unit * shrink} height={24} rx={5} className="adding__unit" style={{ width: unit * shrink }} />
                    <rect x={(unit * shrink) / 2 - 11} y={y + 8} width={22} height={14} rx={3} className="adding__a" />
                  </g>
                ))}
                <path d={`M ${30 + width + 4} ${y + 15} h 26`} className="adding__arrow builder__pull" markerEnd="url(#builder-arrow)" style={{ opacity: squeeze ? 1 : 0.25 }} />
              </g>
            );
          })}
          <defs><marker id="builder-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 8 4 0 8z" fill="#ff7a3d" /></marker></defs>
        </svg>
      </div>
      <div className="builder__controls">
        <Stepper label="End to end" value={chain} min={1} max={6} onChange={(value) => set("chain", value)} />
        <Stepper label="Side by side" value={rows} min={1} max={5} onChange={(value) => set("rows", value)} />
        <button type="button" className="pill-button pill-button--solid builder__go" onPointerDown={() => setSqueeze(true)} onPointerUp={() => setSqueeze(false)} onPointerLeave={() => setSqueeze(false)}
          onKeyDown={(event) => { if (event.key === " " || event.key === "Enter") setSqueeze(true); }} onKeyUp={() => setSqueeze(false)} aria-pressed={squeeze}>Hold to contract</button>
      </div>
      <dl className="builder__readout mono">
        <div><dt>SHORTENS BY</dt><dd>{chain}× one sarcomere</dd></div>
        <div><dt>PULLS WITH</dt><dd>{rows}× one sarcomere</dd></div>
      </dl>
      <figcaption className="fig-caption">A sketch of the principle. A real fiber has thousands of sarcomeres in each direction.</figcaption>
    </figure>
  );
}

export function Stepper({ label, value, min, max, step = 1, unit = "", onChange }: { label: string; value: number; min: number; max: number; step?: number; unit?: string; onChange: (value: number) => void }) {
  return (
    <div className="stepper" role="group" aria-label={label}>
      <span className="stepper__label">{label}</span>
      <button type="button" onClick={() => onChange(Math.max(min, value - step))} disabled={value <= min} aria-label={`Less: ${label}`}>−</button>
      <output className="mono" aria-live="polite">{value}{unit}</output>
      <button type="button" onClick={() => onChange(Math.min(max, value + step))} disabled={value >= max} aria-label={`More: ${label}`}>+</button>
    </div>
  );
}

/** Stop 3: how a muscle pulls. */
export function Pull() {
  const [slid, setSlid] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [taught, setTaught] = useState(false);
  const [phase, setPhase] = useState<Phase>("ready");
  const [cycles, setCycles] = useState(0);
  const countCycle = useCallback(() => setCycles((n) => n + 1), []);
  const [built, setBuilt] = useState(false);
  return (
    <Stop n={3} title="What happens when it shortens?" lead={<p>This is one sarcomere between its two Z-discs, the unit you just reached. Squeeze it and watch the two kinds of filament.</p>}>
      <Step wide stage={<Sliding onMoved={() => setSlid(true)} />}>
        <p className={`step__nudge${slid ? " is-done" : ""}`}><span className="mono">{slid ? "DONE" : "TRY IT"}</span>Drag the sarcomere to fully contracted and read the numbers under it.</p>
        <Ask prompt="The sarcomere got shorter. What did the filaments inside it do?"
          options={[
            { label: "They shrank", why: "Check the readout while you drag. Both filaments stay the same length the whole way." },
            { label: "They slid past each other", correct: true, why: "Right. Neither filament changes length. They overlap more." },
            { label: "They coiled up", why: "Look at the beads of actin. They stay in a straight line, and so does the myosin." },
          ]}>
          <p>For a long time this wasn’t obvious. Then in 1954 two teams, working separately, published the answer in the same issue of <i>Nature</i>: the filaments don’t shrink. They slide.<Foot of="huxley" /></p>
          <p>The actin is drawn in toward the middle, the Z-discs come closer together, and the whole sarcomere gets shorter. It is called the sliding filament model.</p>
          <Keep>Filaments keep their length and slide. Shortening is more overlap.</Keep>
        </Ask>
      </Step>

      <Step wide flip stage={<Cycle phase={phase} setPhase={setPhase} onStuck={() => setStuck(true)} onCycle={countCycle} taught={taught} />}>
        <p className="step__intro">Something has to do the sliding. It’s the small heads on the myosin. Here is one of them. Run it yourself.</p>
        <p className={`step__nudge${cycles > 0 ? " is-done" : ""}`}><span className="mono">{cycles > 0 ? "DONE" : "TRY IT"}</span>Press Attach, then Pull, then try to let go.</p>
        <div className={`gate${stuck ? " is-open" : ""}`}>
          <Ask prompt="The head has pulled, and now it is locked onto the actin. What frees it?"
            onSolved={() => { setTaught(true); setPhase((current) => (current === "stroked" ? "released" : current)); }}
            options={[
              { label: "Calcium", why: "Calcium matters earlier. It uncovers the spot on actin so the head can attach in the first place." },
              { label: "A new molecule of ATP", correct: true, why: "Right. ATP binds to the head and the head lets go. Watch it release and swing back." },
              { label: "It lets go when it gets tired", why: "It’s the other way round. With no fuel left the head stays locked on." },
            ]}>
            <p>This loop is the <b>cross-bridge cycle</b>: attach, pull, release, re-cock. Its fuel is ATP, and the surprise is where the ATP is spent. It is needed to let go.<Foot of="openstaxContraction" /> Without it the heads stay locked, which is why muscles stiffen after death.</p>
            <p>Run the cycle a few more times and watch the ringed bead of actin travel. In a real fiber the heads don’t all pull at once. Some hold on while others reset, so the filament keeps moving instead of slipping back.</p>
            <Keep>A myosin head attaches, pulls, and needs a fresh ATP to let go.</Keep>
            <Note title="What tells myosin to start?">
              <p>A signal from a nerve makes the fiber release calcium inside itself. Calcium binds to a protein called troponin, which shifts another protein, tropomyosin, off the binding sites on actin. Now myosin can attach. When the signal stops, the calcium is pumped away and the sites are covered again.<Foot of="openstaxContraction" /></p>
            </Note>
          </Ask>
        </div>
      </Step>

      <Step wide stage={<Builder onBuilt={() => setBuilt(true)} />}>
        <p className="step__intro">One stroke moves actin a few billionths of a metre. A dumbbell needs far more than that, so sarcomeres work in numbers. Build some.</p>
        <p className={`step__nudge${built ? " is-done" : ""}`}><span className="mono">{built ? "DONE" : "TRY IT"}</span>Add sarcomeres both ways, hold to contract, and compare the two readouts.</p>
        <Ask last prompt="You want this muscle to pull harder. Where do you add sarcomeres?"
          options={[
            { label: "End to end, in a longer chain", why: "A longer chain shortens further, but each link passes on the same pull. Try it and watch “pulls with”." },
            { label: "Side by side, in more rows", correct: true, why: "Right. Rows pull at the same time, so their forces add." },
            { label: "Either. More is more", why: "They do different jobs. Change one stepper at a time and watch which readout moves." },
          ]}>
          <p><b>End to end, shortening adds up.</b> About 5,000 sarcomeres in each centimetre all shorten together, so a tiny change in each becomes a big change in length.</p>
          <p><b>Side by side, force adds up.</b> Myofibrils and fibers lie in parallel and pull at the same time. More of them pulling means more force.</p>
          <Keep>More side by side means more force. Hold on to that one. It is what a bigger muscle is.</Keep>
          <p className="step__bridge">That’s one rep. It doesn’t explain why the same dumbbell feels lighter next month. For that, we need what happens after you put it down.</p>
        </Ask>
      </Step>
    </Stop>
  );
}
