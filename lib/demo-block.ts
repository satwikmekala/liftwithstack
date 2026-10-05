import { initialWorkout, type WorkoutState } from "./workout";
import { muscle } from "./tokens";
import { block, HEIGHTS, type BuildSlab } from "./stack/model";

export type DemoBlock = {
  slab: BuildSlab;
  movedKg: number;
  sets: number;
  improved: number;
  lifts: { name: string; weight: number; reps: number }[];
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
    slab: block("your-first-block", muscle.chest, HEIGHTS[Math.min(3, improved)]),
    movedKg: lifts.reduce((sum, lift) => sum + lift.weight * lift.reps, 0),
    sets: lifts.length, improved, lifts,
  };
}
