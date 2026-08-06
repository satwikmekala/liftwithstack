"use client";

import { motion, useReducedMotion } from "framer-motion";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

const weeks = [
  { label: "THIS WEEK", count: "2 DAYS", days: ["MON", "THU"] },
  { label: "NEXT WEEK", count: "5 DAYS", days: ["MON", "TUE", "THU", "FRI", "SUN"] },
] as const;

function WeeklyRhythmVisual() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="grid gap-3 sm:grid-cols-2" aria-label="Two valid training weeks: two workouts this week and five next week.">
      {weeks.map((week, weekIndex) => (
        <motion.div
          key={week.label}
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reducedMotion ? 0 : 0.55, delay: reducedMotion ? 0 : weekIndex * 0.1, ease: [0.2, 0.7, 0.2, 1] }}
          className="rounded-[18px] border border-white/[0.08] bg-bg/60 p-5"
        >
          <div className="flex items-center justify-between gap-3 font-mono text-[10px] font-bold tracking-[0.15em] text-text-dim">
            <span>{week.label}</span><span className="text-accent">{week.count}</span>
          </div>
          <div className="mt-5 flex flex-wrap gap-x-3 gap-y-3">
            {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => {
              const active = week.days.some((scheduledDay) => scheduledDay === day);
              return <div key={day} className="flex min-w-[30px] flex-col items-center gap-2"><span className="font-mono text-[9px] font-semibold tracking-[0.08em] text-text-muted">{day.slice(0, 1)}</span><i aria-hidden="true" className={`size-2 rounded-full ${active ? "bg-accent shadow-[0_0_14px_rgba(255,122,61,.42)]" : "bg-day"}`} /></div>;
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function WhyStackExistsSection() {
  return (
    <section id="why-stack-exists" className="scroll-mt-24 border-t border-white/[0.07] bg-surface/35" aria-labelledby="why-stack-heading">
      <div className="mx-auto max-w-[1180px] px-[clamp(20px,5vw,40px)] py-[clamp(88px,11vw,140px)]">
        <RevealOnScroll>
          <p className="font-mono text-[11px] font-bold tracking-[0.19em] text-text-dim">WHY STACK EXISTS</p>
          <h2 id="why-stack-heading" className="mt-5 max-w-[17ch] text-balance font-display text-[clamp(42px,5.7vw,76px)] font-extrabold leading-[1.02] tracking-[-0.05em] text-text">
            Fitness should demand effort from your body. <span className="text-accent">Not administration from your brain.</span>
          </h2>
          <p className="mt-7 max-w-[43ch] text-pretty font-body text-[clamp(16px,1.8vw,19px)] leading-[1.6] text-text-muted">
            Most fitness apps give you more to manage. Stack gives you one less thing to think about.
          </p>
        </RevealOnScroll>

        <div className="mt-[clamp(48px,7vw,78px)] grid items-end gap-9 lg:grid-cols-[minmax(0,1fr)_minmax(420px,.9fr)]">
          <RevealOnScroll>
            <p className="max-w-[30ch] font-display text-[clamp(25px,3.1vw,39px)] font-bold leading-[1.1] tracking-[-0.035em] text-text">Built for people who care about getting stronger—but have a life outside the gym.</p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <p className="mb-5 max-w-[43ch] font-body text-[15px] leading-[1.55] text-text-muted">Two workouts this week. Five workouts next week. Stack keeps the training moving.</p>
            <WeeklyRhythmVisual />
          </RevealOnScroll>
        </div>

        <RevealOnScroll delay={0.12}>
          <p className="mt-[clamp(44px,6vw,72px)] max-w-[31ch] font-display text-[clamp(27px,3.6vw,48px)] font-medium leading-[1.08] tracking-[-0.04em] text-text-muted">Your life changes. <span className="text-text">Your training doesn&apos;t have to fall apart with it.</span></p>
        </RevealOnScroll>
      </div>
    </section>
  );
}

export default WhyStackExistsSection;
