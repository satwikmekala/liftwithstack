"use client";

import { useState } from "react";
import { HARD_ENOUGH, LIMIT_BY_LOAD, LIMIT_BY_WEEK, TRIAL, effort } from "@/lib/science/story";
import { Foot } from "./Foot";
import { Ask, Keep, Reveal, Step, Stop } from "./lesson";
import { Stepper } from "./Pull";

function Dots({ reps, left }: { reps: number; left: number }) {
  return (
    <div className="reps" role="img" aria-label={`${reps} reps done, about ${left} more possible`}>
      {Array.from({ length: reps }, (_, i) => <i key={i} className="is-done" />)}
      {Array.from({ length: left }, (_, i) => <i key={`left-${i}`} className="is-left is-shown" />)}
    </div>
  );
}

/** The same 10 kg × 8 across six weeks: the set stays put while the limit moves away from it. */
function SameSet({ onMoved }: { onMoved: () => void }) {
  const [week, setWeek] = useState(1);
  const limit = LIMIT_BY_WEEK[week - 1];
  const left = limit - 8;
  return (
    <figure className="same">
      <div className="same__card">
        <p className="same__count mono">WEEK {week} · 10 KG × 8</p>
        <Dots reps={8} left={left} />
        <p className="same__line is-shown">{left <= 1 ? "Rep 8 is a fight. About one more was left." : left === 2 ? "Rep 8 is hard. About two more were left." : left === 3 ? "Rep 8 is steady. About three more were left." : "Rep 8 is comfortable. About four more were left."}</p>
        <div className="effort">
          <span className="effort__label">Share of what you could do<b className="mono">{Math.round(effort(8, limit) * 100)}%</b></span>
          <span className="effort__bar"><i style={{ width: `${effort(8, limit) * 100}%` }} /></span>
        </div>
      </div>
      <label className="range range--wide">
        <span className="range__label mono">WEEK 1</span>
        <input type="range" min={1} max={6} step={1} value={week} aria-label="Week of training" aria-valuetext={`Week ${week}`}
          onChange={(event) => { const value = Number(event.target.value); setWeek(value); if (value === 6) onMoved(); }} />
        <span className="range__label mono">WEEK 6</span>
      </label>
      <figcaption className="fig-caption">A made-up but typical example. Filled dots are reps done; open dots are reps that were still in reserve.</figcaption>
    </figure>
  );
}

type Route = "reps" | "load" | "both";

/** Week 7: the reader sets the next workout, and finds progressive overload by doing it. */
function NextSet({ onLanded }: { onLanded: (route: Route) => void }) {
  const [load, setLoad] = useState(10);
  const [reps, setReps] = useState(8);
  const [routes, setRoutes] = useState<Route[]>([]);
  const limit = LIMIT_BY_LOAD[load];
  const left = limit - reps;
  const zone = left < HARD_ENOUGH.min ? "max" : left <= HARD_ENOUGH.max ? "hard" : "easy";
  const land = (nextLoad: number, nextReps: number) => {
    const remaining = LIMIT_BY_LOAD[nextLoad] - nextReps;
    if (remaining < HARD_ENOUGH.min || remaining > HARD_ENOUGH.max) return;
    if (nextLoad < 10 || (nextLoad === 10 && nextReps <= 8)) return;
    const route: Route = nextLoad > 10 && nextReps > 8 ? "both" : nextLoad > 10 ? "load" : "reps";
    setRoutes((list) => (list.includes(route) ? list : [...list, route]));
    onLanded(route);
  };
  const changeLoad = (value: number) => { const capped = Math.min(reps, LIMIT_BY_LOAD[value]); setLoad(value); setReps(capped); land(value, capped); };
  const changeReps = (value: number) => { setReps(value); land(load, value); };
  const found = routes.length > 0;
  return (
    <figure className="next">
      <div className={`same__card next__card is-${zone}`}>
        <p className="same__count mono">WEEK 7 · {load} KG × {reps}</p>
        <Dots reps={reps} left={left} />
        <div className="zone" aria-hidden="true">
          <span className={zone === "easy" ? "is-on" : ""}>Easy</span>
          <span className={zone === "hard" ? "is-on is-target" : "is-target"}>Hard enough</span>
          <span className={zone === "max" ? "is-on" : ""}>Everything</span>
        </div>
        <p className="same__line is-shown" aria-live="polite">
          {zone === "easy" ? `About ${left} reps left over. That is a long way from your limit.`
            : zone === "max" ? "Nothing left. That works, but you don’t need to hit the wall on every set."
              : `About ${left} ${left === 1 ? "rep" : "reps"} left over. Close to your limit, which is where the work is.`}
        </p>
      </div>
      <div className="next__controls">
        <Stepper label="Weight" value={load} min={8} max={14} step={2} unit=" kg" onChange={changeLoad} />
        <Stepper label="Reps" value={reps} min={4} max={limit} onChange={changeReps} />
      </div>
      <p className={`next__routes${found ? " is-shown" : ""}`} aria-live="polite">
        {found && <>You got there by {routes.map((route) => route === "reps" ? "adding reps" : route === "load" ? "adding weight" : "adding both").join(", then by ")}.{routes.length === 1 && routes[0] !== "both" ? ` Now try it by ${routes[0] === "reps" ? "adding weight" : "adding reps"} instead.` : ""}</>}
      </p>
      <figcaption className="fig-caption">Illustrative. The numbers are for one made-up lifter. Yours will differ, and real progress is rarely this tidy.</figcaption>
    </figure>
  );
}

/** The trial's bars, drawn only once the reader has guessed. */
function Trial({ shown }: { shown: boolean }) {
  const max = Math.max(...TRIAL.map((row) => row.change));
  return (
    <figure className={`trial${shown ? " is-shown" : ""}`}>
      <p className="trial__title">Change in triceps thickness after 8 weeks<Foot of="kassiano" /></p>
      <div className="trial__bars">
        {TRIAL.map((row, i) => (
          <div key={row.label} className={`trial__row${i === 0 ? " is-lead" : ""}`}>
            <span className="trial__label">{row.label}</span>
            <span className="trial__track"><i style={{ width: `${(row.change / max) * 100}%`, transitionDelay: `${i * 140}ms` }} /></span>
            <span className="trial__value mono">+{row.change}%</span>
          </div>
        ))}
      </div>
      <figcaption className="fig-caption">55 untrained young women, one exercise, arms randomly assigned. A real trial, but a short one, in beginners. It isn’t a forecast for you.</figcaption>
    </figure>
  );
}

/** Stop 5: relative effort, and what to do about it. */
export function Effort() {
  const [moved, setMoved] = useState(false);
  const [landed, setLanded] = useState(false);
  const [guessed, setGuessed] = useState(false);
  return (
    <Stop n={5} title="10 kg doesn’t feel the same anymore." lead={<p>Back to the dumbbell. Same person, same 10&nbsp;kg, same eight curls. Only the weeks change.</p>}>
      <Step stage={<SameSet onMoved={() => setMoved(true)} />}>
        <p className={`step__nudge${moved ? " is-done" : ""}`}><span className="mono">{moved ? "DONE" : "TRY IT"}</span>Drag from week 1 to week 6 and watch the open dots.</p>
        <Ask prompt="The dumbbell is the same and so are the eight reps. Why does the set feel easier in week 6?"
          options={[
            { label: "The dumbbell is easier to move once it’s familiar", why: "It’s still 10 kg, and gravity pulls on it exactly as hard. Look at what changed in the picture: the open dots." },
            { label: "Eight reps now uses a smaller share of what you can do", correct: true, why: "Right. The set stayed where it was. Your limit moved away from it." },
            { label: "You’re putting in less effort on purpose", why: "You’re doing the same eight reps. What changed is how many more you could have done." },
          ]}>
          <p>The load hasn’t moved. The share of your capacity it takes has, and that share is what you feel. It’s called <b>relative effort</b>. A stronger, better-coordinated arm lifts the same 10&nbsp;kg further from its limit.</p>
          <p>How quickly this happens varies a lot between people. In one study of 585 people on the same 12-week programme, muscle size changed by anything from a slight loss to a gain of more than half.<Foot of="hubal" /></p>
          <Keep>What you feel is the share of your limit a set takes. As you get stronger, the same set takes less.</Keep>
        </Ask>
      </Step>

      <Step flip stage={<NextSet onLanded={() => setLanded(true)} />}>
        <p className="step__intro">It’s week 7. Ten kilos for eight leaves four reps in the tank, and sets that finish closer to your limit tend to build more muscle.<Foot of="refalo" /><Foot of="robinson" /> So it’s your call.</p>
        <p className={`step__nudge${landed ? " is-done" : ""}`}><span className="mono">{landed ? "DONE" : "YOUR TURN"}</span>Change the set until it lands in “Hard enough”.</p>
        <Reveal open={landed}>
          <p>What you just did has a name: <b>progressive overload</b>.<Foot of="acsm" /> It doesn’t mean adding weight every week. It means gradually asking for more than your body is used to.</p>
          <p>There was more than one way to get there. One more rep at the same weight counts, and so does an extra set. In one study of trained lifters, adding reps built muscle about as well as adding weight.<Foot of="plotkin" /></p>
          <Keep>Progressive overload is keeping the set hard as you get stronger. Reps, weight or sets all count.</Keep>
        </Reveal>
        {!landed && <button type="button" className="ask__skip" onClick={() => setLanded(true)}>Show me</button>}
      </Step>

      <Step stage={<Trial shown={guessed} />}>
        <p className="step__intro">Does it matter? A trial published in 2026 tested it directly. Untrained young women did the same triceps exercise for eight weeks. One arm had its load raised whenever it reached the top of the rep range. Another arm kept the same load the whole time.</p>
        <Ask last prompt="Before you see the result: how much did the arms that never added load grow?" onSolved={() => setGuessed(true)}
          options={[
            { label: "Not at all", why: "They did grow. Repeating a workout still trains you, especially when you’re new to it." },
            { label: "About half as much", correct: true, why: "Right. Both trained arms grew, and the one with overload grew about twice as much." },
            { label: "Just as much", why: "Close to a common belief, but the arms that kept adding load pulled clearly ahead." },
          ]}>
          <p>Neither arm wasted its time. Repeating a workout still trains you, and the authors note that training without progression was enough to cause growth in these beginners.<Foot of="kassiano" /> It just asks a little less of you each week, because you’re getting further from your limit while the workout stays where it is. What happens over years is still open.</p>
          <aside className="sci-summary" aria-labelledby="summary-title">
            <p id="summary-title" className="sci-summary__title mono">THE SHORT VERSION</p>
            <ol>
              <li>Myosin heads pull on actin, powered by ATP. Sarcomeres shorten, fibers shorten, your arm bends.</li>
              <li>A load that’s hard for you creates tension, and tension starts the change.</li>
              <li>Over weeks your nervous system improves and your fibers thicken. Those are two different things.</li>
              <li>So the same weight takes a smaller share of what you’ve got. It gets easier, and it asks less of you.</li>
              <li>Asking for a little more, in whichever way fits, is progressive overload.</li>
            </ol>
          </aside>
        </Ask>
      </Step>
    </Stop>
  );
}
