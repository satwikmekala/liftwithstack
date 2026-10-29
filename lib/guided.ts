/**
 * The same Push workout started with Log sets off (features/untracked/GuidedWorkoutScreen.tsx):
 * one exercise at a time, Done or Skip, nothing weighed, counted or timed. Only exercises
 * marked done are kept.
 */
import { initialWorkout } from "./workout";

export const GUIDED_PLAN = initialWorkout().exercises.map((exercise) => exercise.name);

export type GuidedState = { index: number; done: string[] };
export type GuidedAction = { type: "done" } | { type: "skip" } | { type: "reset" };

export const initialGuided = (): GuidedState => ({ index: 0, done: [] });

/** The next exercise in the plan that isn't done, after `from`, wrapping round; the plan's length once all are. */
export function nextGuidedIndex(done: readonly string[], from: number) {
  for (let step = 1; step <= GUIDED_PLAN.length; step++) {
    const index = (from + step) % GUIDED_PLAN.length;
    if (!done.includes(GUIDED_PLAN[index])) return index;
  }
  return GUIDED_PLAN.length;
}

export function guidedReducer(state: GuidedState, action: GuidedAction): GuidedState {
  switch (action.type) {
    case "reset":
      return initialGuided();
    case "done": {
      const current = GUIDED_PLAN[state.index];
      if (!current) return state;
      const done = state.done.includes(current) ? state.done : [...state.done, current];
      return { done, index: nextGuidedIndex(done, state.index) };
    }
    case "skip":
      if (!GUIDED_PLAN[state.index]) return state;
      return { ...state, index: nextGuidedIndex(state.done, state.index) };
  }
}
