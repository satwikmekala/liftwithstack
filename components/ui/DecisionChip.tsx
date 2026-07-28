"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";

import { heroTimeline, type HeroDecision } from "@/components/sections/hero-data";

export interface DecisionChipProps {
  readonly decision: HeroDecision;
  readonly index: number;
}

function joinClasses(
  ...classes: readonly (string | false | null | undefined)[]
): string {
  return classes
    .filter((className): className is string => Boolean(className))
    .join(" ");
}

export function DecisionChip({ decision, index }: DecisionChipProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return null;
  }

  const position: CSSProperties = {
    top: decision.top,
    bottom: decision.bottom,
    left: decision.left,
    right: decision.right,
  };

  const delay = heroTimeline.chipBaseDelay + index * heroTimeline.chipStagger;
  const remainingChips = heroTimeline.chipCount - index - 1;
  const duration =
    remainingChips * heroTimeline.chipStagger +
    heroTimeline.chipRevealDuration +
    heroTimeline.chipReadDuration +
    heroTimeline.chipFadeDuration;
  const fadeStart =
    duration - heroTimeline.chipFadeDuration;
  const times = [
    0,
    heroTimeline.chipRevealDuration / duration,
    fadeStart / duration,
    1,
  ];

  return (
    <motion.div
      aria-hidden="true"
      className={joinClasses(
        "absolute z-10 max-w-[130px] select-none rounded-[10px] border border-white/[0.08] bg-surface-3 px-[11px] py-[8px] font-body text-[10.5px] font-medium leading-[1.3] text-text-muted shadow-chip sm:max-w-[148px] sm:text-[11.5px]",
        decision.compact && "max-[479px]:hidden",
      )}
      style={position}
      initial={{ opacity: 0, scale: 0.92, rotate: decision.rotate, x: 0, y: 10 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0.92, 1, 1, 0.85],
        rotate: decision.rotate,
        x: [0, 0, 0, decision.convergeX],
        y: [10, 0, 0, decision.convergeY],
      }}
      transition={{
        duration,
        delay,
        times,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: heroTimeline.chipCycleGap,
        ease: heroTimeline.ease,
      }}
    >
      {decision.label}
    </motion.div>
  );
}

export default DecisionChip;
