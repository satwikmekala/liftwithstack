"use client";

import { AnimatePresence } from "framer-motion";

import { howItWorksStateDescriptions } from "@/components/sections/how-it-works-data";
import type { HowItWorksStepId } from "@/components/sections/how-it-works-data";
import { ActiveExerciseScreen } from "@/components/ui/ActiveExerciseScreen";
import { NextWorkoutScreen } from "@/components/ui/NextWorkoutScreen";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { TodayWorkoutScreen } from "@/components/ui/TodayWorkoutScreen";

export interface StackProductDemoProps {
  readonly state: HowItWorksStepId;
  readonly className?: string;
}

export function StackProductDemo({ state, className }: StackProductDemoProps) {
  return (
    <div className={className}>
      <p aria-live="polite" className="sr-only">
        {howItWorksStateDescriptions[state]}
      </p>

      <div aria-hidden="true">
        <PhoneFrame
          className="relative z-[1] mx-auto"
          screenClassName="flex flex-col gap-[14px] px-5 pb-[22px] pt-6"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold text-text">
              7:12
            </span>
            <span className="font-mono text-[10px] font-medium tracking-[0.1em] text-text-dim">
              MON · JUL 20
            </span>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {state === "today" && <TodayWorkoutScreen key="today" />}
            {state === "exercise" && <ActiveExerciseScreen key="exercise" />}
            {state === "next" && <NextWorkoutScreen key="next" />}
          </AnimatePresence>
        </PhoneFrame>
      </div>
    </div>
  );
}

export default StackProductDemo;
