"use client";

import { motion, useReducedMotion } from "framer-motion";

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}

export function NextWorkoutScreen() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="flex flex-col gap-[18px]"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
      transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <div className="flex items-center gap-[7px]">
        <span
          aria-hidden="true"
          className="flex size-5 items-center justify-center rounded-full bg-accent text-ink"
        >
          <CheckIcon />
        </span>
        <span className="font-mono text-[10px] font-bold tracking-[0.18em] text-accent">
          WORKOUT COMPLETE
        </span>
      </div>

      <div className="relative pt-3">
        <div
          aria-hidden="true"
          className="absolute inset-x-2 top-0 rounded-[20px] border border-white/[0.06] bg-surface-2 px-[18px] py-4 opacity-60 [transform:scale(0.94)]"
        >
          <div className="font-display text-[16px] font-extrabold tracking-[-0.01em] text-text-muted">
            Full Body A
          </div>
          <div className="mt-1 font-mono text-[10px] font-medium tracking-[0.06em] text-text-dim">
            6 EXERCISES COMPLETED
          </div>
        </div>

        <div className="relative mt-[18px] overflow-hidden rounded-[22px] border border-accent/55 bg-warm-card px-[18px] pb-[18px] pt-5 shadow-warm-card">
          <div className="font-mono text-[10px] font-bold tracking-[0.2em] text-accent">
            NEXT UP
          </div>
          <div className="mt-2 font-display text-[26px] font-extrabold tracking-[-0.01em]">
            Full Body B
          </div>
          <div className="mt-[5px] font-mono text-[11px] font-medium tracking-[0.06em] text-text-soft">
            READY WHEN YOU ARE
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default NextWorkoutScreen;
