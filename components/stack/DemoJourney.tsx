"use client";

import { createContext, useCallback, useContext, useReducer, useState, type Dispatch, type ReactNode } from "react";
import { initialWorkout, workoutReducer, type WorkoutAction, type WorkoutState } from "@/lib/workout";
import { guidedReducer, initialGuided, type GuidedAction, type GuidedState } from "@/lib/guided";
import { makeDemoBlock, makeGuidedBlock, type DemoBlock } from "@/lib/demo-block";
import { EXAMPLE_WEEK, type MomentPrint } from "@/lib/moments";

export type LogMode = "tracked" | "untracked";

type Journey = {
  /** Log sets on (tracked) or off (untracked), as the switch on Train sets it. */
  mode: LogMode;
  setMode: (mode: LogMode) => void;
  workout: WorkoutState;
  dispatch: Dispatch<WorkoutAction>;
  guided: GuidedState;
  guide: Dispatch<GuidedAction>;
  /** Photos the visitor took in the demo, oldest first. */
  photos: MomentPrint[];
  takePhoto: (photo: Omit<MomentPrint, "id" | "locked" | "yours">) => void;
  /** Which photos are kept private, by id: the example week's and the visitor's. */
  locks: Record<string, boolean>;
  toggleLock: (id: string) => void;
  completed: DemoBlock | null;
  finish: () => void;
};
const Context = createContext<Journey | null>(null);

/** One Push workout carried through the page: logged, photographed, stacked and shared. */
export function DemoJourney({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<LogMode>("tracked");
  const [workout, dispatch] = useReducer(workoutReducer, undefined, initialWorkout);
  const [guided, guide] = useReducer(guidedReducer, undefined, initialGuided);
  const [photos, setPhotos] = useState<MomentPrint[]>([]);
  const [completed, setCompleted] = useState<DemoBlock | null>(null);
  const [locks, setLocks] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(EXAMPLE_WEEK.flatMap((group) => group.prints.map((print) => [print.id, print.locked]))));

  const setMode = useCallback((next: LogMode) => {
    setModeState(next);
    // A different kind of workout is a different first block.
    setCompleted((current) => (current && current.mode !== next ? null : current));
  }, []);
  const takePhoto = useCallback((photo: Omit<MomentPrint, "id" | "locked" | "yours">) => {
    setPhotos((current) => [...current, { ...photo, id: `yours-${current.length + 1}`, locked: false, yours: true }]);
  }, []);
  const toggleLock = useCallback((id: string) => {
    setLocks((current) => ({ ...current, [id]: !current[id] }));
  }, []);
  const finish = () => {
    if (mode === "tracked") {
      const result = makeDemoBlock(workout);
      if (result.sets) setCompleted(result);
    } else if (guided.done.length) {
      setCompleted(makeGuidedBlock(guided.done));
    }
  };
  return (
    <Context.Provider value={{ mode, setMode, workout, dispatch, guided, guide, photos, takePhoto, locks, toggleLock, completed, finish }}>
      {children}
    </Context.Provider>
  );
}

export function useDemoJourney() {
  const journey = useContext(Context);
  if (!journey) throw new Error("DemoJourney is required");
  return journey;
}
