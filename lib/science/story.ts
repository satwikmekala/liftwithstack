/**
 * The numbers behind /science that aren't research: the hierarchy, chapter 3's frames and the
 * illustrative workouts. Every workout here is made up, and the page says so.
 */

/** Chapter 3's small arm beside the sarcomere: the anatomical model, uncovered. Same 28 elbow angles. */
export const CLASSIC_CURL = Array.from({ length: 28 }, (_, i) => `curl/c${String(i).padStart(2, "0")}.webp`);

/** The hierarchy rail, outermost first. */
export const LEVELS = ["Biceps brachii", "Fascicle", "Muscle fiber", "Myofibril", "Sarcomere", "Actin & myosin"] as const;

/** One logged set, with an estimate of how many more reps were left in it. */
export type Effort = { load: number; reps: number; left: number };

/** Share of what was possible that a set used: 8 reps with 1 left is 8 of 9. */
export const effort = (set: Effort) => set.reps / (set.reps + set.left);

/** Chapter 5: the same 10 kg × 8, six weeks apart. Hypothetical. */
export const SAME_WEIGHT = {
  week1: { load: 10, reps: 8, left: 1 },
  week6: { load: 10, reps: 8, left: 4 },
} as const satisfies Record<string, Effort>;

/** Chapter 6: the next five weeks, two ways. Illustrative, and tidier than real life. */
export const PATHS = {
  weeks: [7, 8, 9, 10, 11],
  repeat: [
    { load: 10, reps: 8, left: 4 },
    { load: 10, reps: 8, left: 4 },
    { load: 10, reps: 8, left: 5 },
    { load: 10, reps: 8, left: 5 },
    { load: 10, reps: 8, left: 5 },
  ],
  progress: [
    { load: 10, reps: 8, left: 4 },
    { load: 10, reps: 9, left: 3 },
    { load: 10, reps: 10, left: 2 },
    { load: 10, reps: 12, left: 2 },
    { load: 12, reps: 8, left: 2 },
  ],
} as const satisfies { weeks: number[]; repeat: Effort[]; progress: Effort[] };

/** Kassiano et al. 2026: change in summed triceps thickness after 8 weeks. */
export const TRIAL = [
  { label: "Load increased", change: 22.9 },
  { label: "Load kept the same", change: 11.6 },
  { label: "No training", change: 1.8 },
] as const;

/** Chapter 7: Dumbbell Curl in Stack's exercise history, newest first. */
export const CURL_HISTORY = [
  { date: "Oct 27", relative: "1 week ago", sets: [[12, 8], [12, 8], [12, 7]] },
  { date: "Oct 20", relative: "2 weeks ago", sets: [[10, 12], [10, 12], [10, 11]] },
  { date: "Oct 13", relative: "3 weeks ago", sets: [[10, 10], [10, 10], [10, 10]] },
  { date: "Oct 6", relative: "4 weeks ago", sets: [[10, 9], [10, 9], [10, 8]] },
  { date: "Sep 22", relative: "6 weeks ago", sets: [[10, 8], [10, 8], [10, 7]] },
] as const;
