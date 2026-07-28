"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

const panelTransition = {
  duration: 0.56,
  ease: [0.22, 1, 0.36, 1],
} as const;

const panelReveal = {
  hidden: { opacity: 0, y: 22 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { ...panelTransition, delay: index * 0.09 },
  }),
};

const problems = [
  {
    number: "01",
    label: "THE WEEK",
    title: "Your week breaks the plan.",
    body: [
      "Miss one workout and the split stops making sense.",
      "Continue? Restart? Skip something? Most of the time, you just train whatever feels easiest.",
    ],
  },
  {
    number: "02",
    label: "THE PROGRESS",
    title: "Your progress lives in your memory.",
    body: [
      "You know you should lift more than last time.",
      "You just can’t remember whether last time was 60 kg × 8 or 62.5 kg × 6.",
    ],
  },
  {
    number: "03",
    label: "THE WORKOUT",
    title: "Every workout starts from scratch.",
    body: [
      "You reach the gym ready to lift—then spend ten minutes choosing exercises, arranging the order, and deciding how many sets to do.",
    ],
  },
] as const;

function BrokenWeekVisual({ reduceMotion, active }: { readonly reduceMotion: boolean | null; readonly active: boolean }) {
  const sessions = [
    ["MON", "Push", "Completed"],
    ["WED", "Pull", "Missed"],
    ["FRI", "Legs", "Planned"],
    ["SUN", "Upper", "Planned"],
  ] as const;

  return (
    <div className="problem-week" aria-label="A weekly training plan disrupted by a missed Wednesday pull workout.">
      {sessions.map(([day, workout, state], index) => (
        <motion.div
          aria-hidden="true"
          className={`problem-week__session problem-week__session--${state.toLowerCase()}`}
          initial={false}
          animate={reduceMotion || !active ? { opacity: 1, x: 0 } : index > 1 ? { opacity: [0.68, 0.68, 1], x: [0, 0, 7, 7] } : { opacity: 1, x: 0 }}
          transition={{ duration: 0.72, delay: 0.56 + index * 0.11, ease: "easeOut" }}
          key={day}
        >
          <span>{day}</span>
          <strong>{workout}</strong>
          <em>{state}</em>
        </motion.div>
      ))}
      <motion.div
        aria-hidden="true"
        className="problem-week__break"
        initial={false}
        animate={reduceMotion || !active ? { opacity: 1, scaleX: 1 } : { opacity: [0, 1, 1], scaleX: [0, 1, 1] }}
        transition={{ duration: 0.38, delay: 0.6 }}
      />
      <motion.div
        aria-hidden="true"
        className="problem-week__questions"
        initial={false}
        animate={reduceMotion || !active ? { opacity: 1, y: 0 } : { opacity: [0, 0, 1], y: [5, 5, 0] }}
        transition={{ duration: 0.46, delay: 1.02 }}
      >
        <span>Continue?</span><span>Restart?</span><span>Skip?</span>
      </motion.div>
    </div>
  );
}

function ForgottenProgressVisual({ reduceMotion, active }: { readonly reduceMotion: boolean | null; readonly active: boolean }) {
  const value = reduceMotion ? "?" : ["60 kg × 8", "62.5 kg × 6", "60 kg × 10", "?"];
  return (
    <div className="problem-history" aria-label="An uncertain bench press lifting history ending in an unknown previous performance.">
      <div className="problem-history__heading">BENCH PRESS</div>
      <div className="problem-history__label">LAST SESSION</div>
      {typeof value === "string" ? (
        <div aria-hidden="true" className="problem-history__value">{value}</div>
      ) : (
        <motion.div
          aria-hidden="true"
          className="problem-history__value"
          initial={false}
          animate={active ? { opacity: [1, 0, 1, 0, 1, 0, 1], y: [0, -3, 0, -3, 0, -3, 0] } : { opacity: 1, y: 0 }}
          transition={{ duration: 2.7, delay: 0.48, times: [0, 0.13, 0.24, 0.37, 0.49, 0.63, 0.76] }}
        >
          {value.map((item, index) => (
            <motion.span
              key={item}
              animate={active
                ? index === value.length - 1
                  ? { opacity: [0, 1, 1] }
                  : { opacity: [0, 1, 1, 0] }
                : { opacity: index === value.length - 1 ? 1 : 0 }}
              transition={{
                duration: index === value.length - 1 ? 0.48 : 0.64,
                delay: 0.5 + index * 0.61,
                times: index === value.length - 1 ? [0, 0.3, 1] : [0, 0.14, 0.75, 1],
              }}
            >
              {item}
            </motion.span>
          ))}
        </motion.div>
      )}
      <div aria-hidden="true" className="problem-history__sources"><span>Notes</span><span>Notebook</span><span>Screenshot</span><span>Memory</span></div>
    </div>
  );
}

function BlankWorkoutVisual({ reduceMotion, active }: { readonly reduceMotion: boolean | null; readonly active: boolean }) {
  const slots = ["Bench Press", "Incline Dumbbell Press", "Choose exercise", "Choose exercise"];
  return (
    <div className="problem-builder" aria-label="An incomplete workout builder with unfilled exercise slots.">
      <div className="problem-builder__heading">TODAY’S WORKOUT</div>
      <div className="problem-builder__slots" aria-hidden="true">
        {slots.map((slot, index) => (
          <motion.div
            className={`problem-builder__slot ${index > 1 ? "problem-builder__slot--empty" : ""}`}
            initial={false}
            animate={reduceMotion || !active ? { opacity: 1, y: 0 } : { opacity: [0.55, 1], y: [5, 0] }}
            transition={{ duration: 0.45, delay: 0.48 + index * 0.22 }}
            key={`${slot}-${index}`}
          ><span>{index + 1}</span>{slot}</motion.div>
        ))}
      </div>
      <motion.div aria-hidden="true" className="problem-builder__replacement" initial={false} animate={reduceMotion || !active ? { opacity: 0 } : { opacity: [0, 1, 1, 0], y: [5, 0, 0, -4] }} transition={{ duration: 1.1, delay: 0.9, times: [0, .18, .68, 1] }}>Cable Fly</motion.div>
      <div aria-hidden="true" className="problem-builder__footer">Exercises. Order. Sets. Weight. Again.</div>
    </div>
  );
}

function ProblemVisual({ index, reduceMotion, active }: { readonly index: number; readonly reduceMotion: boolean | null; readonly active: boolean }) {
  if (index === 0) return <BrokenWeekVisual reduceMotion={reduceMotion} active={active} />;
  if (index === 1) return <ForgottenProgressVisual reduceMotion={reduceMotion} active={active} />;
  return <BlankWorkoutVisual reduceMotion={reduceMotion} active={active} />;
}

function ProblemPanel({ problem, index, reduceMotion }: { readonly problem: typeof problems[number]; readonly index: number; readonly reduceMotion: boolean | null }) {
  const panelRef = useRef<HTMLElement>(null);
  const active = useInView(panelRef, { once: true, amount: 0.35 });
  return (
    <motion.article ref={panelRef} className={`problem-panel problem-panel--${index + 1}`} variants={panelReveal} custom={index}>
      <div className="problem-panel__meta">
        <span className="problem-panel__number">{problem.number}</span>
        <span className="problem-panel__label">{problem.label}</span>
      </div>
      <h3>{problem.title}</h3>
      <div className="problem-panel__body">{problem.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      <div className="problem-panel__visual">
        <ProblemVisual index={index} reduceMotion={reduceMotion} active={active} />
      </div>
    </motion.article>
  );
}

export function ProblemBeat() {
  const reduceMotion = useReducedMotion();
  const viewport = reduceMotion ? undefined : { once: true, amount: 0.18 };

  return (
    <section className="problem-section" aria-labelledby="problem-heading">
      <div className="problem-layout">
        <motion.div className="problem-introduction" initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewport} transition={panelTransition}>
          <div className="problem-eyebrow">THE REAL PROBLEM</div>
          <h2 id="problem-heading"><span>You don’t need more discipline.</span><strong className="text-accent">You need fewer decisions.</strong></h2>
        </motion.div>
        <motion.div className="problem-grid" initial="hidden" whileInView="visible" viewport={viewport}>
          {problems.map((problem, index) => <ProblemPanel key={problem.number} problem={problem} index={index} reduceMotion={reduceMotion} />)}
        </motion.div>
        <motion.p className="problem-conclusion" initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewport} transition={{ ...panelTransition, delay: reduceMotion ? 0 : 0.14 }}>
          <span>The problem isn’t effort.</span><br />It’s everything you have to figure out <em>before the effort begins.</em>
        </motion.p>
      </div>
    </section>
  );
}

export default ProblemBeat;
