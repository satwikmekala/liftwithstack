/**
 * The arithmetic behind the interactive chapters. Everything here is an illustration of a
 * principle, not a model of anyone's physiology: Epley's rule of thumb relates load and reps,
 * and the progress curves are shaped to show diminishing returns, not to predict them.
 */

/** Epley: the heaviest single rep implied by lifting `load` for `reps` with `reserve` reps left. */
export const oneRepMax = (load: number, reps: number, reserve = 0) => load * (1 + (reps + reserve) / 30);

/** How many reps `load` allows at all, given a one-rep max (the inverse of Epley). */
export const repsPossible = (load: number, max: number) => Math.max(0, Math.round(30 * (max / load - 1)));

/** Load as a share of the one-rep max. */
export const relativeLoad = (load: number, max: number) => Math.min(1, load / max);

export type Effort = "limit" | "productive" | "easy" | "none";

/** What a set with this many reps in reserve is, in the page's words. */
export function effortBand(reserve: number): Effort {
  if (reserve <= 2) return "limit";
  if (reserve <= 4) return "productive";
  if (reserve <= 7) return "easy";
  return "none";
}

export const EFFORT_COPY: Record<Effort, { label: string; detail: string }> = {
  limit: { label: "Close to your limit", detail: "Two reps or fewer in reserve. The fibers that grow most are all working." },
  productive: { label: "Working", detail: "Three or four in reserve. Still a real stimulus, with room to add." },
  easy: { label: "Comfortable", detail: "Five or more in reserve. Some of the hardest-working fibers never had to join in." },
  none: { label: "A warm-up", detail: "Far from your limit. Good for practice; little reason for the body to adapt." },
};

/**
 * Two lifters over 16 weeks, as the Same Challenge chapter draws them. Capacity is the one-rep
 * max both start with (illustrative), rising fast then slowing. One keeps lifting 60 × 8 and
 * stops there; the other keeps the set close to the limit. Both are made-up curves.
 */
export function sameChallenge(weeks = 16) {
  const start = 75;
  const capacity = (week: number) => start * (1 + 0.22 * (1 - Math.exp(-week / 6)));
  return Array.from({ length: weeks + 1 }, (_, week) => {
    const max = capacity(week);
    const possible = repsPossible(60, max);
    // B adds a rep whenever reserve drifts past two, and adds 2.5 kg once reps reach 12.
    let loadB = 60;
    let repsB = 8;
    for (let w = 1; w <= week; w++) {
      const m = capacity(w);
      if (repsPossible(loadB, m) - repsB > 2) repsB += 1;
      if (repsB >= 12) { loadB += 2.5; repsB = 8; }
    }
    return {
      week,
      max,
      same: { load: 60, reps: 8, reserve: Math.max(0, possible - 8), relative: relativeLoad(60, max) },
      progressed: { load: loadB, reps: repsB, reserve: Math.max(0, repsPossible(loadB, max) - repsB), relative: relativeLoad(loadB, max) },
    };
  });
}

export type Step = { week: number; load: number; reps: number; change: string | null; record: boolean };

/**
 * Twenty-four weeks of bench press for the Accumulate chapter: a rep here, 2.5 kg there,
 * quick at first and slower later. Illustration only.
 */
export function smallSteps(weeks = 24): Step[] {
  const steps: Step[] = [];
  let load = 50;
  let reps = 8;
  for (let week = 1; week <= weeks; week++) {
    // Early weeks move almost every time; later ones every few weeks.
    const cadence = week <= 6 ? 1 : week <= 14 ? 2 : 3;
    let change: string | null = null;
    let record = false;
    if (week % cadence === 0) {
      if (reps >= 10) { load += 2.5; reps = 8; change = "+2.5 kg"; record = true; }
      else { reps += 1; change = "+1 rep"; }
    }
    steps.push({ week, load, reps, change, record });
  }
  return steps;
}
