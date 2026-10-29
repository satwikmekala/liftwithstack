import { initialWorkout, type WorkoutState } from "./workout";
import { muscle } from "./tokens";
import { block, HEIGHTS, type BuildSlab } from "./stack/model";

export type DemoBlock = {
  /** Logged sets, or Log sets off: exercises marked done and nothing measured. */
  mode: "tracked" | "untracked";
  slab: BuildSlab;
  movedKg: number;
  sets: number;
  improved: number;
  lifts: { name: string; weight: number; reps: number }[];
  /** Exercises with something done, in order. */
  exercises: string[];
};

export function makeDemoBlock(workout: WorkoutState): DemoBlock {
  const baseline = initialWorkout();
  const lifts = workout.exercises.flatMap((exercise, index) => exercise.sets.flatMap((set, setIndex) =>
    set.done && !baseline.exercises[index].sets[setIndex].done
      ? [{ name: exercise.name, weight: set.weight, reps: set.reps }] : []));
  const improved = workout.exercises.filter((exercise, index) => exercise.sets.some((set, setIndex) => {
    const previous = baseline.exercises[index].sets[setIndex];
    return set.done && !previous.done && (set.weight > previous.weight || (set.weight === previous.weight && set.reps > previous.reps));
  })).length;
  return {
    mode: "tracked",
    slab: block("your-first-block", muscle.chest, HEIGHTS[Math.min(3, improved)]),
    movedKg: lifts.reduce((sum, lift) => sum + lift.weight * lift.reps, 0),
    sets: lifts.length, improved, lifts,
    exercises: [...new Set(lifts.map((lift) => lift.name))],
  };
}

/**
 * A workout logged without sets still lands as a block: at the base height, since nothing
 * was measured to make it thicker (features/build/evidence.ts, attendance).
 */
export function makeGuidedBlock(done: readonly string[]): DemoBlock {
  return {
    mode: "untracked",
    slab: block("your-first-block", muscle.chest, HEIGHTS[0]),
    movedKg: 0, sets: 0, improved: 0, lifts: [],
    exercises: [...done],
  };
}
