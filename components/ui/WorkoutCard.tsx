"use client";

import { motion, useReducedMotion } from "framer-motion";

import { heroTimeline } from "@/components/sections/hero-data";

export function WorkoutCard() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="relative overflow-hidden rounded-[22px] border border-accent/55 bg-warm-card px-[18px] pb-[18px] pt-5 shadow-warm-card"
      initial={prefersReducedMotion ? false : { opacity: 0.82, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0 : heroTimeline.cardBrightenDuration,
        delay: prefersReducedMotion ? 0 : heroTimeline.cardBrightenDelay,
        ease: heroTimeline.ease,
      }}
    >
      <div className="font-mono text-[10px] font-bold tracking-[0.2em] text-accent">
        TODAY · PUSH
      </div>
      <div className="mt-2 font-display text-[30px] font-extrabold tracking-[-0.01em]">
        Chest Day
      </div>
      <div className="mt-[5px] font-mono text-[11px] font-medium tracking-[0.06em] text-text-soft">
        5 EXERCISES · 42 MIN
      </div>
    </motion.div>
  );
}

export default WorkoutCard;
