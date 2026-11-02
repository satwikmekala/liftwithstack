"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { addsALittle, loudness, sameWorkout } from "@/lib/science/model";
import { Foot } from "./Foot";
import { FigureArt, paintFigure, type FigureNodes } from "./Figure";
import { prefersReducedMotion, smooth, span, useProgress } from "./useProgress";

/**
 * One stage, one scroll. You curl 10 kg; a lens opens on the bicep and we fall through it, and
 * through a lens at every level, down to the tiny hands. Then we pull all the way back out, you
 * shrink to the start of a line, and the rest of the story is drawn on that line.
 *
 * Each level is drawn inside the lens of the level above, so the zoom is one continuous move and
 * the same curl runs at every depth: when the arm bends, the units shorten and the ropes slide.
 */
const K = 6;
/** Every level is seen through the same round window; the lens on the level above is this size over K. */
const LENS = 480;
/** Where each level's lens sits in that level's drawing, and how much the view turns falling through it. */
const LENSES = [
  { x: 513, y: 462, turn: 90 },
  { x: 520, y: 592, turn: 0 },
  { x: 500, y: 400, turn: 0 },
  { x: 500, y: 500, turn: 0 },
];

type Beat = { eyebrow: string; title: string; body: ReactNode; note?: ReactNode; crumb: number };

const BEATS: Beat[] = [
  { eyebrow: "", title: "", body: null, crumb: 0 },
  { eyebrow: "START HERE", title: "This is you, curling 10 kg.", body: <>Your arm comes up because your bicep gets shorter. But what’s actually shortening in there? Let’s go in.</>, crumb: 0 },
  { eyebrow: "INSIDE YOUR BICEP", title: "A muscle is a bundle of cords.", body: <>Long cords, packed side by side, running from one end of the muscle to the other. They all get shorter together.</>, crumb: 1 },
  { eyebrow: "INSIDE ONE CORD", title: "Each cord is full of threads.", body: <>These threads are your muscle fibers. Each one is about as thin as a hair, and your bicep has thousands of them.</>, crumb: 2 },
  { eyebrow: "INSIDE ONE THREAD", title: "Each thread is a stack of tiny units.", body: <>Thousands of them, end to end. When you curl, every single one gets a little shorter at the same time. Add them up and your arm moves.</>, crumb: 3 },
  { eyebrow: "INSIDE ONE UNIT", title: "Tiny hands, pulling on ropes.", body: <>Each unit is full of them. They grab, pull, let go and grab again, dragging the ropes inward. This pull is what lifts the weight.</>, note: <>We’ve drawn them as hands. The real thing is a protein called myosin.<Foot of="huxley" /></>, crumb: 4 },
  { eyebrow: "THE MESSAGE", title: "The harder the pull, the louder the message.", body: <>An easy set barely wakes them up. A hard set has them all pulling, and your muscle hears it as a signal: build more of this.<Foot of="wackerhage" /></>, crumb: 4 },
  { eyebrow: "AFTER THE GYM", title: "The building happens when you leave.", body: <>A hard workout leaves you a little weaker for a day or so. Then, with enough food and sleep, your body builds back slightly stronger.<Foot of="macdougall" /><Foot of="morton" /><Foot of="knowles" /></>, note: <>Being sore doesn’t mean it’s working. Growth doesn’t depend on it.<Foot of="damas" /></>, crumb: 5 },
  { eyebrow: "WEEK AFTER WEEK", title: "Keep going, and it adds up.", body: <>First your nerves learn to use more of the muscle you already have. After a few weeks, the muscle itself starts to grow.<Foot of="delvecchio" /><Foot of="seynnes" /></>, crumb: 5 },
  { eyebrow: "THE CATCH", title: "Then 10 kg stops being hard.", body: <>You got stronger. The weight didn’t. The same set now asks less of you, so the message gets quieter and the changes slow down.<Foot of="refalo" /><Foot of="robinson" /></>, crumb: 5 },
  { eyebrow: "TWO OF YOU", title: "Same gym. Same days. Different result.", body: <>One of you repeats the same workout and keeps what they built. The other adds a little: one more rep, then a slightly heavier weight.<Foot of="plotkin" /> That’s the whole difference.</>, crumb: 5 },
];

const CRUMBS = ["Arm", "Muscle", "Cord", "Thread", "Unit", "Time"];

/** Scroll position in beats to a value that rests on each beat and moves between them. */
function keyed(b: number, values: readonly number[]) {
  const i = Math.min(values.length - 1, Math.floor(b));
  const next = values[Math.min(values.length - 1, i + 1)];
  return values[i] + (next - values[i]) * smooth(span(b - i, 0.3, 0.9));
}

const DEPTH = [0, 0.1, 1.1, 2.1, 3.1, 4, 4, 0, 0, 0, 0];
const WINDOW = [8, 18, 26];

/** The plot, in the stage's 1000-unit drawing. */
const X0 = 190, X1 = 930, Y0 = 690;
const yOf = (value: number, zoom = 1) => Y0 - (value - 1) * zoom * 470 - 90;
const WEIGHT_Y = Y0 - 10;

function strengthPath(window: number, reveal: number, amp: number, zoom: number, fn: (week: number) => number, from = 0) {
  const points: string[] = [];
  const steps = 220;
  for (let i = 0; i <= steps; i++) {
    const week = (i / steps) * window;
    if (week > reveal) break;
    if (week < from) continue;
    // Three workouts a week: a dip after each, then back up and a touch higher.
    const phase = (week * 2.33) % 1;
    const dip = week > 0.005 ? amp * Math.exp(-phase * 5) * Math.min(1, week * 40) : 0;
    const x = X0 + ((X1 - X0) * week) / window;
    points.push(`${points.length ? "L" : "M"}${x.toFixed(1)} ${yOf(fn(week) - dip, zoom).toFixed(1)}`);
  }
  return points.join(" ");
}

export function Journey() {
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [beat, setBeat] = useState(0);
  const levels = useRef<(SVGGElement | null)[]>([]);
  const figure = useRef<SVGGElement>(null);
  const figureNodes = useRef<FigureNodes>({ forearm: null, bicep: null, label: null });
  const cords = useRef<SVGGElement>(null);
  const threads = useRef<SVGGElement>(null);
  const units = useRef<SVGGElement>(null);
  const plates = useRef<(SVGRectElement | null)[]>([]);
  const stage = useRef<HTMLDivElement>(null);
  const lensLabel = useRef<SVGTextElement>(null);
  const startLine = useRef<SVGLineElement>(null);
  const loudWords = useRef<(SVGTextElement | null)[]>([]);
  const ropesLeft = useRef<SVGGElement>(null);
  const ropesRight = useRef<SVGGElement>(null);
  const handNodes = useRef<{ arm: SVGLineElement | null; palm: SVGGElement | null }[]>([]);
  const lensLabels = useRef<(SVGTextElement | null)[]>([]);
  const rings = useRef<(SVGCircleElement | null)[]>([]);
  const chart = useRef<SVGGElement>(null);
  const line = useRef<SVGPathElement>(null);
  const flatLine = useRef<SVGLineElement>(null);
  const flatTag = useRef<SVGTextElement>(null);
  const branch = useRef<SVGPathElement>(null);
  const pulses = useRef<(SVGCircleElement | null)[]>([]);
  const cycle = useRef<(SVGTextElement | null)[]>([]);
  const tips = useRef<(SVGTextElement | null)[]>([]);
  const axis = useRef<SVGGElement>(null);

  useProgress(section, (t) => {
    progress.current = t;
    setBeat(Math.min(BEATS.length - 1, Math.floor(t * (BEATS.length - 1) + 0.4)));
  });

  const hands = useMemo(() => {
    const list: { x: number; bar: number; rope: number; side: -1 | 1; offset: number; rank: number }[] = [];
    let n = 0;
    for (const [bar, ropeUp, ropeDown] of [[370, 290, 450], [630, 550, 710]]) {
      for (const rope of [ropeUp, ropeDown]) {
        for (const side of [-1, 1] as const) {
          for (let i = 0; i < 3; i++) {
            list.push({ x: 500 + side * (96 + i * 72), bar, rope, side, offset: (n * 0.381) % 1, rank: (n * 0.618) % 1 });
            n++;
          }
        }
      }
    }
    return list;
  }, []);

  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const motion = !prefersReducedMotion();
    let frame = 0;
    let visible = false;
    const start = performance.now();

    const paint = (now: number) => {
      const b = progress.current * (BEATS.length - 1);
      const time = motion ? (now - start) / 1000 : 0.8;
      // The same curl at every depth; it stops once you've put the weight down.
      const outside = 1 - span(b, 6.75, 7.05);
      const curl = (motion ? 0.5 - 0.5 * Math.cos(time * 1.9) : 0.6) * outside;
      paintFigure(figureNodes.current, curl);

      const depth = keyed(b, DEPTH);
      const level = Math.min(4, Math.floor(depth));
      const f = depth - level;
      levels.current.forEach((node, index) => {
        if (node) node.style.display = index === level || index === level + 1 ? "" : "none";
      });
      const lens = LENSES[level];
      const eased = smooth(f);
      const cx = 500 + ((lens?.x ?? 500) - 500) * Math.min(1, f * 1.4);
      const cy = 500 + ((lens?.y ?? 500) - 500) * Math.min(1, f * 1.4);
      const camera = `translate(500 500) rotate(${(-(lens?.turn ?? 0) * eased).toFixed(2)}) scale(${(K ** f).toFixed(4)}) translate(${-cx} ${-cy})`;
      const mix = smooth(span(b, 6.9, 7.3));
      if (stage.current) {
        const round = depth > 0.15 ? "radial-gradient(circle closest-side, #000 93%, transparent 100%)" : "none";
        stage.current.style.maskImage = round;
        stage.current.style.webkitMaskImage = round;
      }
      if (lensLabel.current) lensLabel.current.style.opacity = String(span(b, 0.4, 0.8) * (1 - mix));
      if (figureNodes.current.label) figureNodes.current.label.style.opacity = String(1 - mix);
      const current = levels.current[level];
      if (level === 0) {
        // You shrink to the start of the line, with the dumbbell where the 10 kg line will begin.
        const scale = 1 - 0.76 * mix;
        const place = `translate(${((X0 - 470 * scale) * mix).toFixed(1)} ${((WEIGHT_Y - 822 * scale) * mix).toFixed(1)}) scale(${scale.toFixed(3)})`;
        current?.setAttribute("transform", mix ? place : camera);
      } else {
        current?.setAttribute("transform", camera);
      }
      const child = levels.current[level + 1];
      if (child && lens) {
        child.setAttribute("transform", `${camera} translate(${lens.x} ${lens.y}) rotate(${lens.turn}) scale(${1 / K}) translate(-500 -500)`);
        child.style.opacity = String(span(f, 0.02, 0.09));
      }
      // The level we're leaving falls away as the lens opens over it.
      if (current) current.style.opacity = String(1 - span(f, 0.55, 0.92));

      lensLabels.current.forEach((label, index) => { if (label) label.style.opacity = index === level ? String(1 - span(f, 0.16, 0.3)) : "0"; });
      const shorten = curl;
      cords.current?.setAttribute("transform", `translate(500 500) scale(${(1 - 0.14 * shorten).toFixed(4)} ${(1 + 0.09 * shorten).toFixed(4)}) translate(-500 -500)`);
      threads.current?.setAttribute("transform", `translate(500 500) scale(${(1 - 0.16 * shorten).toFixed(4)} 1) translate(-500 -500)`);
      units.current?.setAttribute("transform", `translate(500 500) scale(${(1 - 0.18 * shorten).toFixed(4)} 1) translate(-500 -500)`);

      if (level >= 3) {
        const slide = 72 * shorten;
        plates.current[0]?.setAttribute("x", String(85 + slide));
        plates.current[1]?.setAttribute("x", String(885 - slide));
        ropesLeft.current?.setAttribute("transform", `translate(${slide} 0)`);
        ropesRight.current?.setAttribute("transform", `translate(${-slide} 0)`);
        // An easy set wakes few of them; a hard one, all of them.
        const pull = b < 5.2 ? 0.8 : b < 5.6 ? 0.8 - 0.62 * span(b, 5.2, 5.5) : 0.18 + 0.82 * span(b, 5.6, 6);
        const message = span(b, 5.3, 6);
        hands.forEach((hand, index) => {
          const nodes = handNodes.current[index];
          if (!nodes?.arm || !nodes.palm) return;
          const active = hand.rank < pull;
          const phase = (time * 1.1 + hand.offset) % 1;
          // Reach out and away, grab, haul toward the middle, let go, swing back.
          const stroke = !active ? 0 : phase < 0.55 ? phase / 0.55 : 1 - (phase - 0.55) / 0.45;
          const gripping = active && phase < 0.55;
          const reach = !active ? 0.3 : gripping ? 1 : 0.55;
          const fromBar = hand.rope < hand.bar ? -1 : 1;
          const x = hand.x - hand.side * (16 - 34 * stroke);
          const y = hand.bar + fromBar * (22 + (Math.abs(hand.rope - hand.bar) - 30) * reach);
          nodes.arm.setAttribute("x2", x.toFixed(1));
          nodes.arm.setAttribute("y2", y.toFixed(1));
          nodes.palm.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(1.35 ${(fromBar * 1.35).toFixed(2)})`);
          nodes.palm.style.color = gripping ? "#ffab7a" : "#b5613f";
          nodes.palm.style.opacity = active ? "1" : "0.4";
          nodes.arm.style.opacity = active ? "1" : "0.4";
        });
        rings.current.forEach((ring, index) => {
          if (!ring) return;
          const wave = (time * 0.5 + index / 3) % 1;
          ring.setAttribute("r", (110 + wave * 360).toFixed(1));
          ring.style.opacity = (message * pull * (1 - wave) * 0.75).toFixed(3);
        });
      }

      // The chart: everything from here on is drawn on the line that starts at your dumbbell.
      if (chart.current) {
        chart.current.style.display = mix > 0 ? "" : "none";
        if (mix > 0) {
          chart.current.style.opacity = String(span(b, 7.05, 7.3));
          // One lift and rest, close up. Then time opens out to weeks, and to months.
          const window = b < 8 ? 0.43 + 7.57 * smooth(span(b, 7.7, 8.15)) : keyed(b - 8, WINDOW);
          const reveal = window * (b < 8 ? span(b, 7.08, 7.65) : 1);
          const amp = 0.052 - 0.05 * smooth(span(b, 7.8, 8.4));
          const zoom = 5 - 4 * smooth(span(b, 7.75, 8.2));
          const branching = span(b, 9.55, 9.95);
          if (startLine.current) startLine.current.style.opacity = String(span(b, 7.1, 7.3) * (1 - span(b, 7.7, 7.9)));
          loudWords.current.forEach((word) => { if (word) word.style.opacity = String(span(b, 8.9, 9.2)); });
          line.current?.setAttribute("d", strengthPath(window, reveal, amp, zoom, sameWorkout));
          branch.current?.setAttribute("d", branching > 0 ? strengthPath(window, Math.min(26, 6 + 20 * branching), 0, 1, addsALittle, 5.9) : "");
          line.current?.setAttribute("stroke", b > 9.6 ? "#a99f91" : "#ff7a3d");
          const flat = span(b, 8.55, 8.95);
          flatLine.current?.setAttribute("x2", String(X0 + (X1 - X0) * flat));
          if (flatTag.current) flatTag.current.style.opacity = String(span(b, 8.7, 9));
          pulses.current.forEach((pulse, index) => {
            if (!pulse) return;
            const week = 1.2 + index * 2.4;
            const x = X0 + ((X1 - X0) * week) / window;
            const shown = b > 8.6 && week <= window;
            pulse.setAttribute("cx", x.toFixed(1));
            pulse.setAttribute("r", (6 + 38 * loudness(sameWorkout(week))).toFixed(1));
            pulse.style.opacity = shown ? String(0.2 + 0.6 * loudness(sameWorkout(week))) : "0";
          });
          cycle.current.forEach((label, index) => {
            if (label) label.style.opacity = String(span(b, 7.12 + index * 0.17, 7.27 + index * 0.17) * (1 - span(b, 7.7, 7.88)));
          });
          if (tips.current[0]) {
            tips.current[0].style.opacity = String(span(b, 8.3, 8.6) * (1 - span(b, 9.4, 9.7)));
            tips.current[0].setAttribute("y", String(yOf(sameWorkout(window)) - 26));
          }
          if (tips.current[1]) { tips.current[1].style.opacity = String(span(b, 9.75, 10)); tips.current[1].setAttribute("y", String(yOf(addsALittle(26)) - 22)); }
          if (tips.current[2]) { tips.current[2].style.opacity = String(span(b, 9.75, 10)); tips.current[2].setAttribute("y", String(yOf(sameWorkout(26)) + 44)); }
          if (axis.current) axis.current.style.opacity = String(span(b, 8.2, 8.6));
        }
      }
    };

    const tick = (now: number) => {
      paint(now);
      frame = motion ? requestAnimationFrame(tick) : 0;
    };
    const view = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      frame = visible ? requestAnimationFrame(tick) : 0;
    });
    view.observe(element);
    // Without motion nothing loops, so the scene redraws only when the scroll moves it.
    const onScroll = () => { if (!motion && visible) requestAnimationFrame(paint); };
    window.addEventListener("scroll", onScroll, { passive: true });
    paint(performance.now());
    return () => { view.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("scroll", onScroll); };
  }, [hands]);

  const crumb = BEATS[beat].crumb;

  return (
    <section ref={section} className="journey" aria-label="Inside the muscle">
      <div className="journey__sticky">
        <div className="journey__copy">
          <div className={`j-beat j-hook${beat === 0 ? " is-on" : ""}`}>
            <p className="eyebrow">THE SCIENCE OF GETTING STRONGER</p>
            <h1 className="j-hook__title">You’re showing up. So why aren’t you changing?</h1>
            <p className="j-hook__body">The answer is inside your muscle, on every rep.</p>
            <p className="j-hook__meta mono">5 MIN READ · NO BIOLOGY DEGREE NEEDED</p>
          </div>
          {BEATS.slice(1).map((item, index) => (
            <div key={item.title} className={`j-beat${beat === index + 1 ? " is-on" : beat > index + 1 ? " is-past" : ""}`}>
              <p className="eyebrow">{item.eyebrow}</p>
              <h2 className="j-beat__title">{item.title}</h2>
              <p className="j-beat__body">{item.body}</p>
              {item.note && <p className="j-beat__note">{item.note}</p>}
            </div>
          ))}
        </div>

        <div ref={stage} className="journey__stage">
          <svg className="j-svg" viewBox="0 0 1000 1000" aria-hidden="true" focusable="false">
            <defs>
              <clipPath id="j-lens"><circle cx="500" cy="500" r={LENS} /></clipPath>
              <linearGradient id="j-cord" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d9694a" /><stop offset="1" stopColor="#8f3424" /></linearGradient>
              <linearGradient id="j-thread" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e27a56" /><stop offset="1" stopColor="#a4442c" /></linearGradient>
              <pattern id="j-stripes" width="26" height="10" patternUnits="userSpaceOnUse"><rect width="26" height="10" fill="transparent" /><rect x="8" width="9" height="10" fill="#6d2517" opacity="0.5" /><rect width="1.6" height="10" fill="#f5f0e8" opacity="0.5" /></pattern>
            </defs>

            {/* 0. You */}
            <g ref={(node) => { levels.current[0] = node; }}>
              <g ref={figure}><FigureArt nodes={figureNodes} /></g>
              <text ref={lensLabel} x={513 + 98} y={462 - 74} className="j-text j-text--strong" style={{ opacity: 0 }}>your bicep</text>
            </g>

            {/* 1. The muscle: cords */}
            <Level set={(node) => { levels.current[1] = node; }}>
              <g ref={cords}>
                <path d="M-40 500 C160 470 240 160 500 160 C760 160 840 470 1040 500 C840 530 760 840 500 840 C240 840 160 530 -40 500Z" fill="#2a120c" />
                {[-3, -2, -1, 0, 1, 2, 3].map((i) => {
                  const mid = 500 + i * 92, end = 500 + i * 7, half = 38;
                  return <path key={i} d={`M30 ${end} C240 ${end} 300 ${mid - half} 500 ${mid - half} C700 ${mid - half} 760 ${end} 970 ${end} C760 ${end} 700 ${mid + half} 500 ${mid + half} C300 ${mid + half} 240 ${end} 30 ${end}Z`} fill="url(#j-cord)" opacity={i === 1 ? 1 : 0.72} />;
                })}
              </g>
              <Lens set={(node) => { lensLabels.current[1] = node; }} label="one cord" x={520} y={592} />
            </Level>

            {/* 2. One cord: threads */}
            <Level set={(node) => { levels.current[2] = node; }}>
              <g ref={threads}>
                {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((y) => (
                  <g key={y} opacity={y === 400 ? 1 : 0.62}>
                    <rect x="-300" y={y - 41} width="1600" height="82" rx="41" fill="url(#j-thread)" />
                    <rect x="-300" y={y - 41} width="1600" height="82" rx="41" fill="url(#j-stripes)" />
                  </g>
                ))}
              </g>
              <Lens set={(node) => { lensLabels.current[2] = node; }} label="one thread" x={500} y={400} />
            </Level>

            {/* 3. One thread: a stack of units */}
            <Level set={(node) => { levels.current[3] = node; }}>
              <g ref={units}>
                {[300, 500, 700].map((y) => (
                  <g key={y} opacity={y === 500 ? 1 : 0.45}>
                    {Array.from({ length: 15 }, (_, i) => {
                      const left = 500 - 67 + (i - 7) * 134;
                      return (
                        <g key={i}>
                          <rect x={left} y={y - 74} width="134" height="148" fill="#e8a27c" />
                          <rect x={left + 28} y={y - 74} width="78" height="148" fill="#a4442c" />
                          <rect x={left + 55} y={y - 74} width="24" height="148" fill="#c9694a" />
                          <rect x={left - 3} y={y - 74} width="6" height="148" fill="#f5f0e8" />
                        </g>
                      );
                    })}
                  </g>
                ))}
              </g>
              <Lens set={(node) => { lensLabels.current[3] = node; }} label="one unit" x={500} y={500} />
            </Level>

            {/* 4. One unit: hands and ropes */}
            <Level set={(node) => { levels.current[4] = node; }}>
              {[0, 1, 2].map((index) => <circle key={index} ref={(node) => { rings.current[index] = node; }} cx="500" cy="500" r="110" fill="none" stroke="#ff7a3d" strokeWidth="3" opacity="0" />)}
              <rect ref={(node) => { plates.current[0] = node; }} x="85" y="262" width="30" height="476" rx="8" fill="#f5f0e8" />
              <rect ref={(node) => { plates.current[1] = node; }} x="885" y="262" width="30" height="476" rx="8" fill="#f5f0e8" />
              {([[ropesLeft, 112, 300], [ropesRight, 588, 300]] as const).map(([rope, x, width]) => (
                <g key={x} ref={rope}>
                  {[290, 450, 550, 710].map((y) => (
                    <g key={y}>
                      <rect x={x} y={y - 7} width={width} height="14" rx="7" fill="#e8c4a4" />
                      {Array.from({ length: 13 }, (_, i) => <rect key={i} x={x + 12 + i * 23} y={y - 7} width="3" height="14" fill="#8c6a50" />)}
                    </g>
                  ))}
                </g>
              ))}
              {[370, 630].map((y) => <rect key={y} x="240" y={y - 22} width="520" height="44" rx="22" fill="#a4442c" />)}
              {hands.map((hand, index) => (
                <g key={index}>
                  <line ref={(node) => { handNodes.current[index] ??= { arm: null, palm: null }; handNodes.current[index].arm = node; }} x1={hand.x} y1={hand.bar} x2={hand.x} y2={hand.bar} stroke="#c9694a" strokeWidth="6" strokeLinecap="round" />
                  <g ref={(node) => { handNodes.current[index] ??= { arm: null, palm: null }; handNodes.current[index].palm = node; }} fill="currentColor" stroke="currentColor">
                    <rect x="-14" y="8" width="28" height="16" rx="8" stroke="none" />
                    <path d="M-11 10 L-13 -3 M-4 10 L-5 -6 M4 10 L5 -6 M11 10 L13 -3" strokeWidth="6" strokeLinecap="round" fill="none" />
                  </g>
                </g>
              ))}
              <text x="500" y="508" textAnchor="middle" className="j-text">tiny hands</text>
              <text x="500" y="248" textAnchor="middle" className="j-text j-text--dim">ropes</text>
            </Level>

            {/* The line: everything after the gym */}
            <g ref={chart} style={{ display: "none" }}>
              <g ref={axis}>
                <line x1={X0} x2={X1} y1={Y0 + 70} y2={Y0 + 70} stroke="rgba(245,240,232,0.14)" />
                <text x={X0} y={Y0 + 112} className="j-text j-text--dim">Today</text>
                <text x={X1} y={Y0 + 112} textAnchor="end" className="j-text j-text--dim">6 months</text>
              </g>
              <line ref={startLine} x1={X0} x2={X1} y1={Y0 - 90} y2={Y0 - 90} stroke="rgba(245,240,232,0.3)" strokeWidth="2" strokeDasharray="2 8" style={{ opacity: 0 }} />
              <line ref={flatLine} x1={X0} x2={X0} y1={WEIGHT_Y} y2={WEIGHT_Y} stroke="#f5f0e8" strokeWidth="3" strokeDasharray="3 10" strokeLinecap="round" />
              <text ref={flatTag} x={X1} y={WEIGHT_Y + 46} textAnchor="end" className="j-text" style={{ opacity: 0 }}>10 kg, every week</text>
              {Array.from({ length: 11 }, (_, index) => <circle key={index} ref={(node) => { pulses.current[index] = node; }} cy={WEIGHT_Y} r="10" fill="none" stroke="#ff7a3d" strokeWidth="3" style={{ opacity: 0 }} />)}
              <text ref={(node) => { loudWords.current[0] = node; }} x={X0 + 50} y={WEIGHT_Y - 56} className="j-text j-text--accent" style={{ opacity: 0 }}>loud</text>
              <text ref={(node) => { loudWords.current[1] = node; }} x={X1} y={WEIGHT_Y - 26} textAnchor="end" className="j-text j-text--dim" style={{ opacity: 0 }}>quiet</text>
              <path ref={line} fill="none" stroke="#ff7a3d" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path ref={branch} fill="none" stroke="#ff7a3d" strokeWidth="6" strokeLinecap="round" />
              <text ref={(node) => { cycle.current[0] = node; }} x="250" y="775" className="j-text" style={{ opacity: 0 }}>You lift: a little weaker</text>
              <text ref={(node) => { cycle.current[1] = node; }} x="620" y="680" className="j-text" style={{ opacity: 0 }}>Food and sleep</text>
              <text ref={(node) => { cycle.current[2] = node; }} x={X1} y="480" textAnchor="end" className="j-text j-text--accent" style={{ opacity: 0 }}>A little stronger</text>
              <text ref={(node) => { tips.current[0] = node; }} x={X1} textAnchor="end" className="j-text j-text--accent" style={{ opacity: 0 }}>How strong you are</text>
              <text ref={(node) => { tips.current[1] = node; }} x={X1} textAnchor="end" className="j-text j-text--accent" style={{ opacity: 0 }}>Adds a little</text>
              <text ref={(node) => { tips.current[2] = node; }} x={X1} textAnchor="end" className="j-text" style={{ opacity: 0 }}>Same workout</text>
            </g>
          </svg>
          {beat >= 7 && <p className="journey__illustration">An illustration of the idea, not a prediction.</p>}
        </div>

        <ol className={`journey__crumbs${beat === 0 ? " is-hidden" : ""}`} aria-hidden="true">
          {CRUMBS.map((name, index) => <li key={name} className={index === crumb ? "is-on" : index < crumb ? "is-past" : ""}>{name}</li>)}
        </ol>
      </div>
    </section>
  );
}

function Level({ set, children }: { set: (node: SVGGElement | null) => void; children: ReactNode }) {
  return (
    <g ref={set} style={{ display: "none" }}>
      <g clipPath="url(#j-lens)">
        <circle cx="500" cy="500" r={LENS} fill="#160c08" />
        {children}
      </g>
      <circle cx="500" cy="500" r={LENS} fill="none" stroke="#f5f0e8" strokeWidth="9" />
    </g>
  );
}

/** A label beside the lens on a level, so it's clear what we are about to fall into. */
function Lens({ set, label, x, y }: { set: (node: SVGTextElement | null) => void; label: string; x: number; y: number }) {
  return <text ref={set} x={x + 62} y={y - 88} className="j-text j-text--strong" style={{ paintOrder: "stroke", stroke: "#160c08", strokeWidth: 10 }}>{label}</text>;
}
