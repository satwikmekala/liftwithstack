"use client";

import { useEffect, useRef, useState } from "react";
import { BodyFigure } from "@/components/body/BodyFigure";
import { REGION_INFO, type BodyRegion, type RegionStates } from "@/lib/body/regions";
import { platePose } from "@/lib/science/arm";
import { drawScene } from "@/lib/science/scene";
import { Foot } from "./Foot";
import { Ask, Keep, Step, Stop } from "./lesson";
import { Plate } from "./Plate";

const CURL_STATES: RegionStates = { biceps: "primary", forearms: "secondary" };
const ARM: readonly BodyRegion[] = ["biceps", "forearms"];
const NOTHING: RegionStates = {};

const MISS: Partial<Record<BodyRegion, string>> = {
  triceps: "That’s the triceps, on the back of the arm. It straightens the elbow. A curl bends it.",
  forearms: "Close. The forearm helps and grips the dumbbell, but the main mover sits above the elbow.",
  frontDelts: "That’s the front of the shoulder. It lifts the whole arm forward. In a curl the upper arm stays still.",
  sideDelts: "That’s the side of the shoulder. In a curl the upper arm stays still and only the elbow bends.",
  chest: "That’s the chest. It brings the arm across the body. A curl only bends the elbow.",
  upperChest: "That’s the chest. It brings the arm across the body. A curl only bends the elbow.",
};

/** The opening: the headline, and the app's figure asking the first question. */
export function Opening() {
  const [picked, setPicked] = useState<BodyRegion | null>(null);
  const [misses, setMisses] = useState(0);
  const [solved, setSolved] = useState(false);
  const [side, setSide] = useState<"front" | "back">("front");

  const select = (region: BodyRegion | null) => {
    if (solved || !region) return;
    if (region === "biceps") { setSolved(true); setPicked(null); setSide("front"); return; }
    setPicked(region);
    setMisses((count) => count + 1);
  };
  const show = () => { setSolved(true); setPicked(null); setSide("front"); };

  return (
    <section className="opening" aria-labelledby="opening-title">
      <div className="opening__copy">
        <p className="eyebrow">THE SCIENCE OF GETTING STRONGER</p>
        <h1 id="opening-title" className="d-hook">Remember when 10&nbsp;kg felt heavy?</h1>
        <p className="d-deck">The weight hasn’t changed since then. You have. Work out what changed in six short stops, from the curl down to the molecules.</p>
        <p className="d-meta mono">6 MIN · 6 STOPS · YOU DO THE WORK</p>
        <div className={`opening__ask${solved ? " is-solved" : ""}`}>
          <p className="opening__prompt"><span className="mono">START HERE</span>Tap the muscle that lifts a dumbbell in a curl.</p>
          <p className="opening__feedback" aria-live="polite">
            {solved
              ? <><b>The biceps.</b> It runs from your shoulder blade, across the elbow, to your forearm. The lighter muscle below it helps.</>
              : picked
                ? MISS[picked] ?? `That’s your ${REGION_INFO[picked].name.toLowerCase()}. Look at the joint that bends in a curl.`
                : "Drag to turn the figure. It’s the same one Stack uses in the app."}
          </p>
          {solved
            ? <a className="pill-button pill-button--solid opening__next" href="#stop-1">Lift it<span aria-hidden="true">↓</span></a>
            : misses > 0 && <button type="button" className="ask__skip" onClick={show}>Show me</button>}
        </div>
      </div>
      <div className="opening__stage">
        <BodyFigure states={solved ? CURL_STATES : NOTHING} selected={solved ? null : picked} focus={solved ? ARM : null} side={side}
          onSelect={select} onSideChange={setSide} className="opening__figure"
          label={solved ? "Stack’s 3D figure, close on the arms, with the biceps lit and the forearms lit lighter" : "Stack’s 3D figure. Tap the muscle that lifts a dumbbell in a curl"} />
        <p className="opening__credit">{solved ? "Stack’s Body Map: the muscle that leads, and the one that helps." : "Stack’s own 3D figure. Tap a muscle."}</p>
      </div>
    </section>
  );
}

/** Paint the plate at one elbow angle. */
function paint(canvas: HTMLCanvasElement | null, angle: number) {
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = Math.max(1, Math.round(rect.width * dpr)), h = Math.max(1, Math.round(rect.height * dpr));
  if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  const ctx = canvas.getContext("2d");
  if (ctx) drawScene(ctx, w, h, { angle, z: 0, dpr });
}

/** The drawn arm, with the curl in the reader's hand. */
function Curl({ onMoved }: { onMoved: () => void }) {
  const [angle, setAngle] = useState(0);
  const canvas = useRef<HTMLCanvasElement>(null);
  const top = useRef(0);
  useEffect(() => {
    paint(canvas.current, angle);
    const onResize = () => paint(canvas.current, angle);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [angle]);
  const shorter = Math.round(platePose(angle).shortening * 100);
  const move = (value: number) => {
    setAngle(value);
    top.current = Math.max(top.current, value);
    if (top.current > 80) onMoved();
  };
  return (
    <figure className="curl">
      <div className="curl__frame">
        <noscript><Plate className="curl__canvas" angle={100} /></noscript>
        <canvas ref={canvas} className="curl__canvas" role="img" aria-label={`A diagram of the arm, elbow bent ${Math.round(angle)} degrees. The biceps is ${shorter}% shorter than at rest.`} />
        <dl className="curl__readout mono">
          <div><dt>ELBOW</dt><dd>{Math.round(angle)}°</dd></div>
          <div className={shorter > 0 ? "is-on" : ""}><dt>BICEPS</dt><dd>{shorter === 0 ? "at rest" : `${shorter}% shorter`}</dd></div>
        </dl>
      </div>
      <label className="range curl__range">
        <span className="range__label">Lower</span>
        <input type="range" min={0} max={118} step={1} value={angle} aria-label="Curl the dumbbell" onChange={(event) => move(Number(event.target.value))} />
        <span className="range__label">Curl</span>
      </label>
      <figcaption className="fig-caption">Illustration. Bones and biceps only; not to scale.</figcaption>
    </figure>
  );
}

/** Stop 1: a curl is a muscle getting shorter. */
export function Lift() {
  const [moved, setMoved] = useState(false);
  return (
    <Stop n={1} title="Lift it yourself." lead={<p>Here is that arm with the skin off: two bones, one hinge, and the biceps. Drag the dumbbell up and keep your eye on the muscle.</p>}>
      <Step stage={<Curl onMoved={() => setMoved(true)} />}>
        <p className={`step__nudge${moved ? " is-done" : ""}`}><span className="mono">{moved ? "DONE" : "TRY IT"}</span>Curl the dumbbell all the way up, then lower it.</p>
        <Ask last prompt="You watched the biceps while the arm moved. What can a muscle actually do?"
          options={[
            { label: "Push and pull", why: "Watch the biceps on the way down. It never pushes the forearm away. It just lets out, still holding the weight." },
            { label: "Only pull", correct: true, why: "Right. A muscle can pull its two ends closer together, and that is all it can do." },
            { label: "Only push", why: "Curl it again and watch the muscle’s length. It gets shorter as the weight rises, which is a pull." },
          ]}>
          <p>The biceps starts on your shoulder blade, crosses the elbow and attaches to your forearm. When it shortens, the forearm comes up. It has help from two neighbours, the brachialis underneath it and the brachioradialis in the forearm.<Foot of="openstaxStructure" /></p>
          <p>To lower the dumbbell, the biceps doesn’t push. It lets out slowly while still pulling. To straighten the arm against resistance you need a different muscle on the other side, the triceps, which also only pulls.</p>
          <Keep>Muscles only pull. Every weight you have ever lifted came down to something getting shorter.</Keep>
          <p className="step__bridge">So how does a muscle get shorter? You have to go inside to see it.</p>
        </Ask>
      </Step>
    </Stop>
  );
}
