"use client";

import { useEffect, useState } from "react";
import { Ask, Stop, useFinish, type Option } from "./lesson";

const QUESTIONS: { prompt: string; options: Option[] }[] = [
  {
    prompt: "You stand up out of a squat. In your thighs, millions of sarcomeres get shorter. What are the filaments inside them doing?",
    options: [
      { label: "Getting shorter too", why: "Same rule as the biceps. The filaments keep their length in every muscle." },
      { label: "Sliding further over each other", correct: true, why: "Right. It’s the sliding filament model again, in a different muscle." },
      { label: "Winding into a tighter coil", why: "They stay straight. Think back to the sarcomere you squeezed." },
    ],
  },
  {
    prompt: "A friend started lifting two months ago. She’s much stronger, but her arms look about the same. What’s the most likely reason?",
    options: [
      { label: "Something is wrong with her training", why: "Nothing is wrong. Strength and size are separate changes, and one of them moves first." },
      { label: "Her nervous system got better at driving the muscle", correct: true, why: "Right. Early strength is mostly neural. Visible growth is slower and varies between people." },
      { label: "Her muscles now run on less ATP", why: "Fuel isn’t what changed. Think of the two lanes, and which moved first." },
    ],
  },
  {
    prompt: "You’ve benched 40 kg for 10 every week for three months. It used to be a fight and now it’s comfortable. What happened to that set?",
    options: [
      { label: "It trains you exactly as much as it did", why: "The bar is the same, but you aren’t. Think about the open dots in week 6." },
      { label: "It now takes a smaller share of what you can do", correct: true, why: "Right. Your limit moved away from the set, so its relative effort dropped." },
      { label: "It has stopped doing anything", why: "Too strong. Repeating a workout still trains you. It asks a little less each week." },
    ],
  },
  {
    prompt: "Which of these is not progressive overload?",
    options: [
      { label: "One more rep at the same weight", why: "That counts. Adding reps built muscle about as well as adding weight in one study." },
      { label: "The same reps with a slightly heavier dumbbell", why: "That counts. It’s the version most people think of first." },
      { label: "Being more sore than last time", correct: true, why: "Right. Soreness isn’t a measure of the work, and chasing it isn’t progression." },
    ],
  },
];

/** Stop 6: four questions in new settings, with the pictures taken away. */
export function Check() {
  const [results, setResults] = useState<Record<number, boolean>>({});
  const finish = useFinish();
  const answered = Object.keys(results).length;
  const first = Object.values(results).filter(Boolean).length;
  const record = (index: number, firstTry: boolean) => setResults((current) => ({ ...current, [index]: firstTry }));
  useEffect(() => { if (answered === QUESTIONS.length) finish(); }, [answered, finish]);
  return (
    <>
      <ol className="check">
        {QUESTIONS.map((question, index) => (
          <li key={index} className={`check__item${index in results ? " is-done" : ""}`}>
            <span className="check__n mono">{index + 1} / {QUESTIONS.length}</span>
            <Ask prompt={question.prompt} options={question.options} onSolved={(firstTry) => record(index, firstTry)} hint="No picture this time." />
          </li>
        ))}
      </ol>
      <p className={`check__score${answered === QUESTIONS.length ? " is-shown" : ""}`} aria-live="polite">
        {answered === QUESTIONS.length && (first === QUESTIONS.length
          ? "Four out of four on the first try. You can explain why the same weight gets easier."
          : `${first} of ${QUESTIONS.length} on the first try, and all four by the end. You can explain why the same weight gets easier.`)}
      </p>
    </>
  );
}

export function CheckStop({ children }: { children?: React.ReactNode }) {
  return (
    <Stop n={6} title="Now explain it yourself." lead={<p>Four questions in places you haven’t seen yet. Recalling an idea is what makes it stay.</p>}>
      <Check />
      {children}
    </Stop>
  );
}
