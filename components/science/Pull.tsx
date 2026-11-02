"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { CURL_END } from "@/lib/science/story";
import { Foot } from "./Foot";
import { loadFrames, onFrame, paint } from "./frames";
import { Note } from "./Note";
import { prefersReducedMotion } from "./useProgress";

const CX = 380;
const THICK_HALF = 170;
const THIN = 200;
const THICK_ROWS = [92, 152, 212];
const THIN_ROWS = [62, 122, 182, 242];

/** A sarcomere you can contract yourself, with the curl beside it moving in step. */
function Sliding() {
  const [c, setC] = useState(0.15);
  const [playing, setPlaying] = useState(false);
  const arm = useRef<HTMLCanvasElement>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = box.current;
    if (!element) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      loadFrames(arm.current?.getBoundingClientRect().width ?? 300);
      if (!prefersReducedMotion()) setPlaying(true);
      io.disconnect();
    }, { threshold: 0.5 });
    io.observe(element);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = ((now - start) / 3200) % 1;
      setC(0.5 - 0.5 * Math.cos(t * Math.PI * 2));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  useEffect(() => {
    const draw = () => { if (arm.current) paint(arm.current, c * CURL_END, 1.18); };
    draw();
    return onFrame(draw);
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
            <text x={CX} y={14} textAnchor="middle">myosin: same length</text>
            <line x1={zl} y1={292} x2={zr} y2={292} className="bracket" />
            <text x={CX} y={318} textAnchor="middle" className="sl-label__strong">sarcomere: {shortening === 0 ? "at rest" : `${shortening}% shorter`}</text>
            <text x={zl} y={30} textAnchor="middle" className="sl-label__z">Z-disc</text>
            <text x={zr} y={30} textAnchor="middle" className="sl-label__z">Z-disc</text>
          </g>
        </svg>
      </div>
      <div className="sliding__controls">
        <label className="range">
          <span className="range__label">Relax</span>
          <input type="range" min={0} max={1} step={0.01} value={c} aria-label="Contract the sarcomere"
            onChange={(event) => { setPlaying(false); setC(Number(event.target.value)); }} />
          <span className="range__label">Contract</span>
        </label>
        <button type="button" className="pill-button" onClick={() => setPlaying((value) => !value)} aria-pressed={playing}>
          {playing ? "Pause" : "Play"}
        </button>
      </div>
      <figcaption className="fig-caption"><span className="key key--actin" />actin <span className="key key--myosin" />myosin. Thin filaments are drawn as beads because actin is built from small units strung together. Not to scale.</figcaption>
    </figure>
  );
}

type Phase = "attach" | "stroke" | "release" | "recock";
const ORDER: Phase[] = ["attach", "stroke", "release", "recock"];
const POSE: Record<Phase, { angle: number; reach: number; bound: boolean; carries: string }> = {
  attach: { angle: 26, reach: 1, bound: true, carries: "ADP + Pi" },
  stroke: { angle: -26, reach: 1, bound: true, carries: "ADP" },
  release: { angle: -26, reach: 0, bound: false, carries: "ATP" },
  recock: { angle: 26, reach: 0, bound: false, carries: "ADP + Pi" },
};
const TEXT: Record<Phase, { title: string; body: string }> = {
  attach: { title: "1. Attach", body: "The charged myosin head binds to actin. That link is the cross-bridge." },
  stroke: { title: "2. Power stroke", body: "The head pivots toward the middle of the sarcomere and drags the actin with it, by a few billionths of a metre. The leftovers of the last ATP leave." },
  release: { title: "3. Release", body: "A fresh ATP binds to the head, and the head lets go. Without ATP it can’t let go at all, which is why muscles stiffen after death." },
  recock: { title: "4. Re-cock", body: "The head splits the ATP and uses that energy to swing back, ready to grab again further along." },
};
const PIVOT = { x: 330, y: 236 };
const BEAD = 26;

/** The cross-bridge cycle, one head and its actin, one step at a time. */
function Cycle() {
  const [{ phase, strokes }, step] = useReducer((state: { phase: Phase; strokes: number }) => {
    const following = ORDER[(ORDER.indexOf(state.phase) + 1) % ORDER.length];
    return { phase: following, strokes: state.strokes + (following === "stroke" ? 1 : 0) };
  }, { phase: "recock", strokes: 0 });
  const [playing, setPlaying] = useState(false);
  const pose = POSE[phase];
  const started = strokes > 0 || phase !== "recock";

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(step, 1500);
    return () => clearInterval(id);
  }, [playing]);

  const lever = 70 + pose.reach * 34;
  const shift = -strokes * BEAD * 4;
  // The actin unit this head grabbed, ringed so you can watch it travel.
  const grabbedAt = -(strokes - (phase === "stroke" || phase === "release" || phase === "recock" ? 1 : 0)) * BEAD * 4;
  const grabbed = strokes > 0 || phase === "attach" ? Math.round((386 - grabbedAt + 300) / BEAD) : -1;
  return (
    <figure className="cycle">
      <svg className="cycle__svg" viewBox="0 0 660 300" role="img" aria-label={`Cross-bridge cycle. ${TEXT[phase].title}: ${TEXT[phase].body}`}>
        <g className="cycle__actin" style={{ transform: `translateX(${shift}px)` }}>
          {Array.from({ length: 70 }, (_, i) => (
            <circle key={i} cx={-300 + i * BEAD} cy={i % 2 ? 66 : 84} r={14} className={`bead${i === grabbed ? " bead--grabbed" : ""}`} />
          ))}
        </g>
        <text x={18} y={30} className="cycle__note">actin, pulled this way ←</text>
        <rect x={0} y={248} width={660} height={30} rx={15} className="thick" />
        <text x={18} y={296} className="cycle__note">myosin filament</text>
        <g className="cycle__head" style={{ transform: `rotate(${pose.angle}deg)`, transformOrigin: `${PIVOT.x}px ${PIVOT.y}px` }}>
          <line x1={PIVOT.x} y1={PIVOT.y + 8} x2={PIVOT.x} y2={PIVOT.y - lever} className="cycle__lever" />
          <ellipse cx={PIVOT.x} cy={PIVOT.y - lever - 22} rx={19} ry={30} className={`cycle__ball${pose.bound ? " is-bound" : ""}`} />
          <g style={{ transform: `rotate(${-pose.angle}deg)`, transformOrigin: `${PIVOT.x}px ${PIVOT.y - lever - 22}px` }}>
            <rect x={PIVOT.x + 26} y={PIVOT.y - lever - 34} width={pose.carries.length * 9 + 22} height={26} rx={13} className={`cycle__badge${pose.carries === "ATP" ? " is-atp" : ""}`} />
            <text x={PIVOT.x + 37} y={PIVOT.y - lever - 16} className="cycle__badge-text">{pose.carries}</text>
          </g>
        </g>
      </svg>
      <div className="cycle__panel">
        <ol className="cycle__steps">
          {ORDER.map((item) => (
            <li key={item} className={item === phase && started ? "is-on" : ""}>{TEXT[item].title}</li>
          ))}
        </ol>
        <p className="cycle__text" aria-live="polite">
          {started ? <><b>{TEXT[phase].title}.</b> {TEXT[phase].body}</> : <>A myosin head, already charged with energy from its last ATP. Step through one cycle.</>}
        </p>
        <div className="cycle__actions">
          <button type="button" className="pill-button pill-button--solid" onClick={() => { setPlaying(false); step(); }}>{started ? "Next step" : "Start"}</button>
          <button type="button" className="pill-button" onClick={() => setPlaying((value) => !value)} aria-pressed={playing}>{playing ? "Pause" : "Play"}</button>
          {strokes > 0 && <span className="cycle__count mono">{strokes} {strokes === 1 ? "stroke" : "strokes"}</span>}
        </div>
      </div>
    </figure>
  );
}

/** Series gives distance, parallel gives force. */
function AddingUp() {
  return (
    <figure className="adding">
      <div className="adding__panel">
        <svg viewBox="0 0 300 90" aria-hidden="true">
          {Array.from({ length: 6 }, (_, i) => (
            <g key={i} transform={`translate(${12 + i * 46} 30)`}>
              <rect x={0} y={0} width={44} height={30} rx={4} className="adding__unit" />
              <rect x={12} y={6} width={20} height={18} rx={2} className="adding__a" />
            </g>
          ))}
          <path d="M 16 76 H 284" className="adding__arrow" markerEnd="url(#arrow-r)" />
          <defs><marker id="arrow-r" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0 8 4 0 8z" fill="#ff7a3d" /></marker></defs>
        </svg>
        <p><b>End to end, shortening adds up.</b> About 5,000 sarcomeres in each centimetre all shorten together, so a tiny change in each becomes a big change in length.</p>
      </div>
      <div className="adding__panel">
        <svg viewBox="0 0 300 90" aria-hidden="true">
          {Array.from({ length: 4 }, (_, i) => (
            <g key={i} transform={`translate(20 ${6 + i * 20})`}>
              {Array.from({ length: 5 }, (_, j) => <rect key={j} x={j * 46} y={0} width={44} height={16} rx={3} className="adding__unit" />)}
              <path d="M 236 8 H 272" className="adding__arrow" markerEnd="url(#arrow-r2)" />
            </g>
          ))}
          <defs><marker id="arrow-r2" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 8 4 0 8z" fill="#ff7a3d" /></marker></defs>
        </svg>
        <p><b>Side by side, force adds up.</b> Myofibrils and fibers lie in parallel and pull at the same time. More of them pulling means more force.</p>
      </div>
    </figure>
  );
}

/** Chapter 3: how a muscle pulls. */
export function Pull() {
  return (
    <section className="chapter-block" id="chapter-3" aria-labelledby="pull-title">
      <div className="prose">
        <p className="chapter mono"><span>3</span>How muscles actually pull</p>
        <h2 id="pull-title" className="d-title">Myosin climbs actin, one stroke at a time.</h2>
        <p>For a long time it wasn’t obvious how a muscle gets shorter. Then in 1954 two teams, working separately, published the answer in the same issue of <i>Nature</i>: the filaments don’t shrink. They slide past each other.<Foot of="huxley" /></p>
        <p>Thick and thin filaments keep their length. What changes is how far they overlap. The actin is drawn in toward the middle, the Z-discs come closer together, and the whole sarcomere gets shorter. Try it, and watch the arm.</p>
      </div>
      <Sliding />
      <div className="prose">
        <p>The sliding comes from a repeating cycle called the <b>cross-bridge cycle</b>, and its fuel is a molecule called ATP.<Foot of="openstaxContraction" /></p>
      </div>
      <Cycle />
      <div className="prose">
        <p>Heads don’t all pull at once. Some hold on while others reset, so the filament keeps moving instead of slipping back.</p>
        <p>A single stroke is tiny, so how does it lift a dumbbell? Through two kinds of adding up.</p>
      </div>
      <AddingUp />
      <div className="prose">
        <Note title="What tells myosin to start?">
          <p>A signal from a nerve makes the fiber release calcium inside itself. Calcium binds to a protein called troponin, which shifts another protein, tropomyosin, off the binding sites on actin. Now myosin can attach. When the signal stops, the calcium is pumped away and the sites are covered again.<Foot of="openstaxContraction" /></p>
        </Note>
        <p>That’s one rep. It doesn’t explain why the same dumbbell feels lighter next month. For that, we need what happens after you put it down.</p>
      </div>
    </section>
  );
}
