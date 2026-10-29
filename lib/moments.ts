/**
 * Moments, as the app keeps them (features/moments/momentsModel.ts): a square photo that
 * belongs to one workout, with the exercise that was on screen, an optional label printed
 * into it, and a lock that keeps it from the Circle.
 */
import { formatWeight } from "./workout";

export type MomentPrint = {
  id: string;
  exercise: string;
  /** The label printed into the photo (momentSetLine), or null when Label was off. */
  line: string | null;
  /** Photos go to the Circle unless locked. */
  locked: boolean;
  /** Taken by the visitor in the demo. */
  yours?: boolean;
};

/** "SET 2 · 82.5 KG × 8", as the label prints it. */
export const momentSetLine = (set: { number: number; weight: number; reps: number }) =>
  `SET ${set.number} · ${formatWeight(set.weight)} KG × ${set.reps}`;

/** One example week of Moments, grouped as the grid groups them: newest workout first. */
export const EXAMPLE_WEEK: { label: string; color: string; prints: MomentPrint[] }[] = [
  {
    label: "THURSDAY · PUSH", color: "#FF7A3D", prints: [
      { id: "thu-bench", exercise: "Bench Press", line: "SET 3 · 82.5 KG × 8", locked: false },
      { id: "thu-raise", exercise: "Lateral Raise", line: null, locked: false },
    ],
  },
  {
    label: "WEDNESDAY · LEGS", color: "#B5E53F", prints: [
      { id: "wed-squat", exercise: "Barbell Squat", line: "SET 1 · 100 KG × 5", locked: true },
    ],
  },
  {
    label: "MONDAY · PULL", color: "#4F8BFF", prints: [
      { id: "mon-deadlift", exercise: "Deadlift", line: "SET 2 · 140 KG × 5", locked: false },
      { id: "mon-pulldown", exercise: "Lat Pulldown", line: null, locked: false },
    ],
  },
];
