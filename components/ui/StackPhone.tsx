"use client";

import { motion, useReducedMotion } from "framer-motion";

import { heroTimeline } from "@/components/sections/hero-data";
import { ExerciseProgressCard } from "@/components/ui/ExerciseProgressCard";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { WorkoutCard } from "@/components/ui/WorkoutCard";

function BoltIcon({ className = "" }: { className?: string }) {
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

export function StackPhone() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="relative"
      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0 : heroTimeline.phoneDuration,
        delay: prefersReducedMotion ? 0 : heroTimeline.phoneDelay,
        ease: heroTimeline.ease,
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 m-auto h-[240px] w-[240px] rounded-full bg-phone-glow blur-[60px]"
      />

      <PhoneFrame
        showHardware
        className="relative z-[1] w-[min(328px,85vw)] rounded-[48px] p-[10px] animate-floaty motion-reduce:animate-none"
        screenClassName="aspect-[9/19.5] flex flex-col gap-[14px] px-[22px] pb-[23px] pt-[52px]"
      >
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[11px] h-[25px] w-[92px] -translate-x-1/2 rounded-full bg-black"
        />
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-semibold text-text">
            2:38
          </span>
          <span className="font-mono text-[10px] font-medium tracking-[0.1em] text-text-dim">
            SUN · JUL 19
          </span>
        </div>

        <div className="mt-0.5 font-display text-[22px] font-extrabold tracking-[-0.01em]">
          hey wik
        </div>

        <WorkoutCard />
        <ExerciseProgressCard />

        <motion.div
          aria-hidden="true"
          className="mt-auto flex w-full items-center justify-center gap-[9px] rounded-[15px] border-0 bg-accent p-[16px] font-display text-base font-extrabold text-ink"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : heroTimeline.buttonSettleDuration,
            delay: prefersReducedMotion ? 0 : heroTimeline.buttonSettleDelay,
            ease: heroTimeline.ease,
          }}
        >
          <BoltIcon className="size-[15px]" />
          Start workout
        </motion.div>
        <div
          aria-hidden="true"
          className="mx-auto mt-[2px] h-[4px] w-[112px] shrink-0 rounded-full bg-text/80"
        />
      </PhoneFrame>
    </motion.div>
  );
}

export default StackPhone;
