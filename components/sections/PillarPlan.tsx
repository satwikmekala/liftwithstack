"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import {
  BLOCK_HEIGHT_CLASSES,
  getLegendSplits,
  getTrainingWeek,
  SPLIT_BACKGROUND_CLASSES,
  SPLIT_SHADOW_CLASSES,
  TRAINING_FREQUENCIES,
  type TrainingFrequency,
} from "@/lib/training-data";

export function PillarPlan() {
  const [frequency, setFrequency] = useState<TrainingFrequency>(4);
  const prefersReducedMotion = useReducedMotion();
  const week = getTrainingWeek(frequency);
  const legendSplits = getLegendSplits(frequency);
  const sessionLabel = frequency === 1 ? "session" : "sessions";

  return (
    <section className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,32px)] py-[clamp(50px,7vw,80px)]">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] items-center gap-[clamp(32px,5vw,64px)]">
        <RevealOnScroll>
          <div className="mb-[18px] font-mono text-xs font-bold tracking-[0.1em] text-accent">
            01 — PLAN THE DAYS YOU HAVE
          </div>
          <h3 className="mb-4 font-display text-[clamp(27px,3.8vw,46px)] font-extrabold leading-[1.05] tracking-[-0.02em] text-text">
            Pick your training frequency. Stack handles the rotation.
          </h3>
          <p className="max-w-[46ch] font-body text-[clamp(16px,1.8vw,18px)] leading-[1.6] text-text-muted">
            Train one day or six. Stack shapes the week around the time you
            actually have, then keeps the rotation balanced without asking you
            to rebuild a plan every Monday.
          </p>
        </RevealOnScroll>

        <RevealOnScroll
          delay={0.08}
          className="rounded-[26px] border border-white/[0.08] bg-surface p-[clamp(20px,3vw,30px)]"
        >
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <span className="font-mono text-[10px] font-medium tracking-[0.16em] text-text-dim">
              DAYS PER WEEK
            </span>
            <span className="font-mono text-[10px] font-medium tracking-[0.06em] text-text-dim">
              tap to rebuild →
            </span>
          </div>

          <div
            className="mb-6 grid grid-cols-3 gap-2 min-[400px]:grid-cols-6"
            role="group"
            aria-label="Training days per week"
          >
            {TRAINING_FREQUENCIES.map((option) => {
              const isActive = option === frequency;

              return (
                <motion.button
                  key={option}
                  type="button"
                  aria-label={`Train ${option} ${
                    option === 1 ? "day" : "days"
                  } per week`}
                  aria-pressed={isActive}
                  onClick={() => setFrequency(option)}
                  whileTap={
                    prefersReducedMotion
                      ? undefined
                      : {
                          scale: 0.96,
                        }
                  }
                  className={[
                    "min-h-12 rounded-xl border py-3 font-display text-[17px] font-bold transition-colors",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                    isActive
                      ? "border-accent bg-accent text-bg"
                      : "border-white/[0.14] bg-transparent text-text-muted hover:border-white/30 hover:text-text",
                  ].join(" ")}
                >
                  {option}
                </motion.button>
              );
            })}
          </div>

          <div
            className="grid grid-cols-7 items-end gap-1.5"
            aria-label={`${frequency} ${sessionLabel} balanced across the week`}
          >
            {week.map((day) => {
              const split = day.split;
              const blockClassName = split
                ? `${BLOCK_HEIGHT_CLASSES[frequency]} ${SPLIT_BACKGROUND_CLASSES[split]} ${SPLIT_SHADOW_CLASSES[split]}`
                : "h-[10px] bg-surface-3";

              return (
                <div
                  key={day.dayIndex}
                  className="flex min-w-0 flex-col items-center gap-2"
                >
                  <motion.span
                    key={`${frequency}-${day.dayIndex}-${split ?? "Rest"}`}
                    aria-hidden="true"
                    className={`block w-full max-w-[34px] origin-bottom rounded-[7px] ${blockClassName}`}
                    initial={
                      prefersReducedMotion
                        ? false
                        : {
                            opacity: 0.5,
                            scaleY: 0.65,
                          }
                    }
                    animate={{
                      opacity: 1,
                      scaleY: 1,
                    }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.35,
                      ease: [0.2, 0.7, 0.2, 1],
                    }}
                  />
                  <span
                    className={[
                      "min-h-[11px] text-center font-mono text-[9px] font-semibold leading-[1.2] tracking-[0.02em]",
                      split ? "text-text" : "text-text-dim",
                    ].join(" ")}
                  >
                    {split ?? "Rest"}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-text-dim/70">
                    {day.shortLabel}
                  </span>
                </div>
              );
            })}
          </div>

          <div
            className="mt-[22px] flex flex-wrap gap-2"
            aria-label="Training split legend"
          >
            {legendSplits.map((split) => (
              <motion.span
                key={split}
                initial={
                  prefersReducedMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 4,
                      }
                }
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-surface-2 px-[13px] py-[7px] font-body text-[13px] font-semibold text-text-muted"
              >
                <span
                  aria-hidden="true"
                  className={`h-[9px] w-[9px] rounded-full ${SPLIT_BACKGROUND_CLASSES[split]}`}
                />
                {split}
              </motion.span>
            ))}
          </div>

          <p
            className="mt-4 font-mono text-xs font-medium text-text-dim"
            aria-live="polite"
          >
            {frequency} {sessionLabel} · balanced across your week
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}

export default PillarPlan;
