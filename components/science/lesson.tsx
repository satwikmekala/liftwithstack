"use client";

import { useEffect, useId, useState, type ReactNode } from "react";

/**
 * The parts every stop of the lesson is built from. A stop puts something in the reader's hands
 * and explains it beside the picture. A few steps ask a question first. Nothing is locked, and
 * without scripts every explanation is simply on the page.
 */

export const STOPS = ["The lift", "Inside the muscle", "The pull", "After you put it down", "The same 10 kg", "The short version"] as const;

/** The six stops in the header: which are behind the reader, and which one is on screen. */
export function LessonRail() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>("[data-stop]")];
    let frame = 0;
    const measure = () => {
      frame = 0;
      const line = window.innerHeight * 0.45;
      let active = 0;
      for (const section of sections) if (section.getBoundingClientRect().top <= line) active = Number(section.dataset.stop);
      setCurrent(active);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);
  return (
    <nav className="lesson-rail" aria-label="Lesson progress">
      <ol>
        {STOPS.map((name, index) => {
          const stop = index + 1;
          return (
            <li key={name} className={stop < current ? "is-done" : current === stop ? "is-current" : ""}>
              <a href={`#stop-${stop}`} aria-current={current === stop ? "step" : undefined} title={`${stop}. ${name}`}>
                <span className="sr-only">Stop {stop}: {name}</span>
              </a>
            </li>
          );
        })}
      </ol>
      <span className="lesson-rail__label mono" aria-hidden="true">{current ? `${current} / 6 · ${STOPS[current - 1]}` : "6 stops · about 6 minutes"}</span>
    </nav>
  );
}

/** One stop of the lesson. */
export function Stop({ n, title, lead, children }: { n: number; title: string; lead?: ReactNode; children: ReactNode }) {
  return (
      <section className="stop" id={`stop-${n}`} data-stop={n} aria-labelledby={`stop-${n}-title`}>
        <header className="stop__head">
          <p className="stop__count mono"><span>{n}</span>{STOPS[n - 1]}</p>
          <h2 id={`stop-${n}-title`} className="stop__title">{title}</h2>
          {lead && <div className="stop__lead">{lead}</div>}
        </header>
        {children}
      </section>
  );
}

export function Step({ stage, children, flip = false, wide = false }: { stage?: ReactNode; children: ReactNode; flip?: boolean; wide?: boolean }) {
  if (!stage) return <div className="step step--text">{children}</div>;
  return (
    <div className={`step${flip ? " step--flip" : ""}${wide ? " step--wide" : ""}`}>
      <div className="step__words">{children}</div>
      <div className="step__stage">{stage}</div>
    </div>
  );
}

/** What the explanation says once the reader has tried. Present in the HTML either way. */
export function Reveal({ open, children }: { open: boolean; children: ReactNode }) {
  return <div className={`reveal${open ? " is-open" : ""}`}>{children}</div>;
}

/** What a step teaches, said plainly above its explanation. */
export function Point({ children }: { children: ReactNode }) {
  return <h3 className="step__title">{children}</h3>;
}

/** The one line to keep from a step. */
export function Keep({ children }: { children: ReactNode }) {
  return <p className="keep"><span className="keep__mark mono">KEEP</span><span>{children}</span></p>;
}

export type Option = { label: ReactNode; correct?: boolean; why: ReactNode };

/**
 * A question with a few answers, used sparingly: a few times in the whole lesson. A wrong pick says
 * why and stays open for another try; the right one fills orange and opens the explanation. "Show me"
 * does the same without a guess.
 */
export function Ask({ prompt, options, children, onSolved, hint = "Pick one. A wrong guess costs nothing." }: {
  prompt: ReactNode; options: Option[]; children?: ReactNode; onSolved?: (firstTry: boolean) => void; hint?: string;
}) {
  const id = useId();
  const [tried, setTried] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);
  const right = options.findIndex((option) => option.correct);

  const settle = (firstTry: boolean) => {
    setSolved(true);
    setPicked(right);
    onSolved?.(firstTry);
  };
  const choose = (index: number) => {
    if (solved) return;
    if (index === right) { settle(tried.length === 0); return; }
    setPicked(index);
    setTried((list) => (list.includes(index) ? list : [...list, index]));
  };

  return (
    <div className={`ask${solved ? " is-solved" : ""}`}>
      <p className="ask__prompt" id={`${id}-prompt`}>{prompt}</p>
      <div className="ask__options" role="group" aria-labelledby={`${id}-prompt`}>
        {options.map((option, index) => {
          const state = solved && index === right ? "right" : tried.includes(index) ? "tried" : "open";
          return (
            <button key={index} type="button" className={`ask__option is-${state}`} onClick={() => choose(index)}
              disabled={solved || state === "tried"} aria-pressed={picked === index}>
              <span className="ask__key mono" aria-hidden="true">{state === "right" ? "✓" : String.fromCharCode(65 + index)}</span>
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
      <p className={`ask__feedback${picked !== null ? " is-shown" : ""}${solved ? " is-right" : ""}`} aria-live="polite">
        {picked === null ? hint : <>{solved ? null : <b>Not quite. </b>}{options[picked].why}</>}
      </p>
      {!solved && <button type="button" className="ask__skip" onClick={() => settle(false)}>Show me</button>}
      {children && <Reveal open={solved}>{children}</Reveal>}
    </div>
  );
}
