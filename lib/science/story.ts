/**
 * The numbers behind /science that aren't research: the hierarchy, stop 3's frames and the
 * illustrative workouts. Every workout here is made up, and the page says so.
 */

/** Stop 3's small arm beside the sarcomere: the anatomical model, uncovered. Same 28 elbow angles. */
export const CLASSIC_CURL = Array.from({ length: 28 }, (_, i) => `curl/c${String(i).padStart(2, "0")}.webp`);

/** The hierarchy rail, outermost first. */
export const LEVELS = ["Biceps brachii", "Fascicle", "Muscle fiber", "Myofibril", "Sarcomere", "Actin & myosin"] as const;

/**
 * Stop 5's lifter, who is made up. The most curls they could do with 10 kg in each of the first
 * six weeks, and in week 7 the most reps they could do at each dumbbell.
 */
export const LIMIT_BY_WEEK = [9, 10, 10, 11, 11, 12] as const;
export const LIMIT_BY_LOAD: Record<number, number> = { 8: 16, 10: 12, 12: 9, 14: 6 };
/** A set is "hard enough" with one to three reps left in it. */
export const HARD_ENOUGH = { min: 1, max: 3 } as const;
/** Share of what was possible that a set used: 8 reps out of a possible 9. */
export const effort = (reps: number, limit: number) => reps / limit;

/** Kassiano et al. 2026: change in summed triceps thickness after 8 weeks. */
export const TRIAL = [
  { label: "Load increased", change: 22.9 },
  { label: "Load kept the same", change: 11.6 },
  { label: "No training", change: 1.8 },
] as const;

/** The closing log: Dumbbell Curl in Stack's exercise history, newest first. */
export const CURL_HISTORY = [
  { date: "Oct 27", relative: "1 week ago", sets: [[12, 8], [12, 8], [12, 7]] },
  { date: "Oct 20", relative: "2 weeks ago", sets: [[10, 12], [10, 12], [10, 11]] },
  { date: "Oct 13", relative: "3 weeks ago", sets: [[10, 10], [10, 10], [10, 10]] },
  { date: "Oct 6", relative: "4 weeks ago", sets: [[10, 9], [10, 9], [10, 8]] },
  { date: "Sep 22", relative: "6 weeks ago", sets: [[10, 8], [10, 8], [10, 7]] },
] as const;
