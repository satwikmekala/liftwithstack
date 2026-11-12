import { muscle } from "./tokens";

/**
 * The app's exercise art (assets/images/exercises, resized for the web) and the muscle
 * colour each exercise is listed under in constants/exerciseInfo.ts.
 */
export const EXERCISE_ART: Record<string, { image: string; color: string; primary: string[]; secondary: string[] }> = {
  "Bench Press": { image: "/exercises/bench-press.webp", color: muscle.chest, primary: ["Chest"], secondary: ["Upper chest", "Front delts", "Triceps"] },
  "Incline Dumbbell Press": { image: "/exercises/incline-dumbbell-press.webp", color: muscle.chest, primary: ["Upper chest", "Triceps"], secondary: ["Shoulders"] },
  "Seated Dumbbell Shoulder Press": { image: "/exercises/seated-dumbbell-shoulder-press.webp", color: muscle.shoulders, primary: ["Shoulders", "Triceps"], secondary: ["Upper chest"] },
  "Lateral Raise": { image: "/exercises/dumbbell-lateral-raise.webp", color: muscle.shoulders, primary: ["Side delts"], secondary: ["Upper traps"] },
  "Triceps Pushdown": { image: "/exercises/tricep-pushdown.webp", color: muscle.arms, primary: ["Triceps"], secondary: [] },
  "Overhead Triceps Extension": { image: "/exercises/cable-overhead-triceps-extension.webp", color: muscle.arms, primary: ["Triceps"], secondary: [] },
  Deadlift: { image: "/exercises/deadlift.webp", color: muscle.back, primary: ["Hamstrings", "Glutes", "Back"], secondary: ["Core", "Forearms"] },
  "Lat Pulldown": { image: "/exercises/lat-pulldown.webp", color: muscle.back, primary: ["Lats"], secondary: ["Biceps", "Upper back"] },
  "Arnold Press": { image: "/exercises/arnold-press.webp", color: muscle.shoulders, primary: ["Front delts"], secondary: ["Side delts", "Triceps"] },
  "Bradford Press": { image: "/exercises/bradford-press.webp", color: muscle.shoulders, primary: ["Front delts"], secondary: ["Side delts", "Triceps"] },
  "Barbell Squat": { image: "/exercises/barbell-squat.webp", color: muscle.legs, primary: ["Quads", "Glutes"], secondary: ["Core", "Lower back"] },
};

export const artFor = (name: string) => EXERCISE_ART[name];
