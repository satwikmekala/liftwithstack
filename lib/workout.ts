/** A Push workout from Stack’s plan, used by the logger and Lock Screen demos. */
export type DemoSet = { weight: number; reps: number; done: boolean };
export type DemoExercise = { name: string; short: string; sets: DemoSet[] };
export type WorkoutState = { exercise: number; set: number; exercises: DemoExercise[]; suggestion: boolean };

const sets = (count: number, weight: number, reps: number): DemoSet[] =>
  Array.from({ length: count }, () => ({ weight, reps, done: false }));

export function initialWorkout(): WorkoutState {
  const bench = sets(3, 80, 8);
  bench[0].done = true;
  return {
    exercise: 0,
    set: 1,
    suggestion: true,
    exercises: [
      { name: "Bench Press", short: "Bench", sets: bench },
      { name: "Incline Dumbbell Press", short: "Incline", sets: sets(3, 26, 10) },
      { name: "Seated Dumbbell Shoulder Press", short: "Press", sets: sets(3, 22, 10) },
      { name: "Lateral Raise", short: "Raise", sets: sets(4, 10, 12) },
      { name: "Triceps Pushdown", short: "Pushdown", sets: sets(3, 30, 12) },
      { name: "Overhead Triceps Extension", short: "Extension", sets: sets(3, 20, 12) },
    ],
  };
}

export type WorkoutAction =
  | { type: "weight"; value: number }
  | { type: "reps"; value: number }
  | { type: "suggest" }
  | { type: "log" }
  | { type: "next" }
  | { type: "reset" };

export const SUGGESTED_WEIGHT = 82.5;

export function workoutReducer(state: WorkoutState, action: WorkoutAction): WorkoutState {
  const exercises = state.exercises.map((exercise) => ({ ...exercise, sets: exercise.sets.map((set) => ({ ...set })) }));
  const current = exercises[state.exercise];
  const set = current.sets[state.set];
  switch (action.type) {
    case "reset":
      return initialWorkout();
    case "weight":
      if (!set || set.done) return state;
      set.weight = Math.max(0, Math.round(action.value * 10) / 10);
      return { ...state, exercises };
    case "reps":
      if (!set || set.done) return state;
      set.reps = Math.max(1, Math.round(action.value));
      return { ...state, exercises };
    case "suggest":
      if (!set || set.done) return state;
      set.weight = SUGGESTED_WEIGHT;
      return { ...state, exercises, suggestion: false };
    case "log": {
      if (!set || set.done) return state;
      set.done = true;
      const next = current.sets[state.set + 1];
      // The next set starts from what was just lifted.
      if (next) Object.assign(next, { weight: set.weight, reps: set.reps });
      return { ...state, exercises, set: next ? state.set + 1 : state.set, suggestion: false };
    }
    case "next": {
      if (current.sets.some((item) => !item.done)) return state;
      const following = (state.exercise + 1) % exercises.length;
      if (following === 0) return state;
      return { ...state, exercises, exercise: following, set: 0, suggestion: false };
    }
  }
}

export const isExerciseDone = (exercise: DemoExercise) => exercise.sets.every((set) => set.done);

/** 80 → "80", 82.5 → "82.5". */
export const formatWeight = (value: number) => (Number.isInteger(value) ? String(value) : value.toFixed(1));
