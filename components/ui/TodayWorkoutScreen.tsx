"use client";

import { motion, useReducedMotion } from "framer-motion";

function BoltIcon({ className = "" }: { readonly className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M13 2 3 14h7l-1 8 11-13h-8z" />
    </svg>
  );
}

export function TodayWorkoutScreen() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="flex flex-col gap-[18px]"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
      transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <div className="font-display text-[20px] font-extrabold tracking-[-0.01em]">
        Good morning.
      </div>

      <div className="relative overflow-hidden rounded-[22px] border border-accent/55 bg-warm-card px-[18px] pb-[18px] pt-5 shadow-warm-card">
        <div className="font-mono text-[10px] font-bold tracking-[0.2em] text-accent">
          TODAY
        </div>
        <div className="mt-2 font-display text-[26px] font-extrabold tracking-[-0.01em]">
          Full Body A
        </div>
        <div className="mt-[5px] font-mono text-[11px] font-medium tracking-[0.06em] text-text-soft">
          6 EXERCISES · 48 MIN
        </div>
      </div>

      <div className="flex w-full items-center justify-center gap-[9px] rounded-[14px] border-0 bg-accent p-[15px] font-display text-base font-extrabold text-ink">
        <BoltIcon className="size-[15px]" />
        Start workout
      </div>
    </motion.div>
  );
}

export default TodayWorkoutScreen;
