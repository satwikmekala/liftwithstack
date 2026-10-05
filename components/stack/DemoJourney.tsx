"use client";

import { createContext, useContext, useReducer, useState, type Dispatch, type ReactNode } from "react";
import { initialWorkout, workoutReducer, type WorkoutAction, type WorkoutState } from "@/lib/workout";
import { makeDemoBlock, type DemoBlock } from "@/lib/demo-block";

type Journey = {
  workout: WorkoutState;
  dispatch: Dispatch<WorkoutAction>;
  completed: DemoBlock | null;
  finish: () => void;
};
const Context = createContext<Journey | null>(null);

export function DemoJourney({ children }: { children: ReactNode }) {
  const [workout, dispatch] = useReducer(workoutReducer, undefined, initialWorkout);
  const [completed, setCompleted] = useState<DemoBlock | null>(null);
  const finish = () => {
    const result = makeDemoBlock(workout);
    if (result.sets) setCompleted(result);
  };
  return <Context.Provider value={{ workout, dispatch, completed, finish }}>{children}</Context.Provider>;
}

export function useDemoJourney() {
  const journey = useContext(Context);
  if (!journey) throw new Error("DemoJourney is required");
  return journey;
}
