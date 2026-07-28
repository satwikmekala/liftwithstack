"use client";

import { motion, useReducedMotion } from "framer-motion";

export function ActiveExerciseScreen() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="flex flex-col gap-[18px]"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
      transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <div className="font-display text-[19px] font-extrabold tracking-[-0.01em]">
        Bench Press
      </div>

      <div className="rounded-[18px] border border-white/[0.08] bg-surface-2 p-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] font-medium tracking-[0.08em] text-text-dim">
            LAST TIME
          </span>
          <span className="font-mono text-[13px] font-medium text-text-muted">
            60 kg × 8
          </span>
        </div>

        <div className="my-3 h-px bg-white/[0.07]" />

        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] font-medium tracking-[0.08em] text-accent">
            TODAY
          </span>
          <span className="font-mono text-base font-bold text-text">
            62.5 kg × 8
          </span>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="flex w-full items-center justify-center rounded-[14px] border-0 bg-accent p-[15px] font-display text-base font-extrabold text-ink"
      >
        Log set
      </div>
    </motion.div>
  );
}

export default ActiveExerciseScreen;
