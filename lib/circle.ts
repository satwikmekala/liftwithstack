/**
 * Private Circle, as the app models it (features/circle/visibility.ts, model.ts, nudges.ts).
 * The people and their weeks below are examples for the page, not real accounts.
 */
import type { DemoBlock } from "./demo-block";
import { muscle } from "./tokens";
import { block, exampleHistory, type BuildSlab } from "./stack/model";

export type ShareKey = "stack" | "weekly" | "history" | "workouts" | "performance" | "photos";
export type ShareSettings = Record<ShareKey, boolean> & { paused: boolean };

/** What someone who just joined shares: this week's Stack, and nothing more. */
export const DEFAULT_SHARE: ShareSettings = {
  stack: true, weekly: true, history: false, workouts: false, performance: false, photos: false, paused: false,
};

/** A category only counts when the ones it depends on are on too. */
export const SHARE_DEPENDS_ON: Partial<Record<ShareKey, ShareKey[]>> = {
  weekly: ["stack"], history: ["stack"], performance: ["workouts"], photos: ["workouts"],
};

/** The rows of "What friends see", in the app's words. */
export const SHARE_ROWS: { key: ShareKey; title: string; detail: string }[] = [
  { key: "stack", title: "Your Stack", detail: "Your tower, in your friends’ circles." },
  { key: "weekly", title: "This week", detail: "The blocks you’ve added since Monday." },
  { key: "history", title: "Full Stack", detail: "Every layer you’ve built, back to your first week." },
  { key: "workouts", title: "Workouts", detail: "What you trained and when. Never your notes." },
  { key: "performance", title: "Weights and reps", detail: "Your sets and PRs inside the workouts you share." },
  { key: "photos", title: "Photos", detail: "Only the Moments you choose to share, from this week’s workouts." },
];

export function effectiveShare(settings: ShareSettings): Record<ShareKey, boolean> {
  const on = (key: ShareKey): boolean => !settings.paused && settings[key] && (SHARE_DEPENDS_ON[key] ?? []).every(on);
  return {
    stack: on("stack"), weekly: on("weekly"), history: on("history"),
    workouts: on("workouts"), performance: on("performance"), photos: on("photos"),
  };
}

/** One sentence for what your circle sees right now (sharingSummary). */
export function sharingSummary(settings: ShareSettings) {
  if (settings.paused) return "Sharing is paused. Friends see your name and that you’ve paused.";
  const can = effectiveShare(settings);
  const parts = [
    can.weekly ? "this week’s Stack" : null,
    can.history ? "your full Stack" : null,
    can.workouts ? (can.performance ? "your workouts with weights and reps" : "your workouts") : null,
    can.photos ? "the photos you share" : null,
  ].filter((part): part is string => Boolean(part));
  if (parts.length === 0) return "Friends see your name only.";
  const list = parts.length === 1 ? parts[0] : `${parts.slice(0, -1).join(", ")} and ${parts.at(-1)}`;
  return `Friends see ${list}.`;
}

/** Nudges: a few set words, at most two a day to one person, and no replies. */
export const NUDGES = ["Proud of you 🫶", "Keep going 🤝", "Good work today 🙌", "Gym when? 👀"] as const;
export const NUDGES_PER_DAY = 2;

/** This week's three blocks (Pull, Legs, Push), with the visitor's own block as Push once they've made one. */
export function thisWeekSlabs(demo: DemoBlock | null): BuildSlab[] {
  return [
    block("week-pull", muscle.back, 1.15),
    block("week-legs", muscle.legs, 1),
    demo ? { ...demo.slab, id: "week-push" } : block("week-push", muscle.chest, 1.3, true),
  ];
}

/** Your finished weeks, for a friend who is shown your full Stack. */
export const yourHistory = (): BuildSlab[] => exampleHistory(9, new Date(2026, 8, 28), 11).map((week) => week.slab);

/** Strip gold seams: PRs are only shown alongside weights and reps. */
export const withoutRecords = (slabs: readonly BuildSlab[]): BuildSlab[] =>
  slabs.map((slab) => ({ ...slab, layers: slab.layers.map((layer) => ({ ...layer, record: false })) }));

export type Friend = { id: string; name: string; activity: string | null; slabs: BuildSlab[] };

/** Three example friends, in name order as the circle lists them: this week's blocks only. */
export const FRIENDS: Friend[] = [
  { id: "ben", name: "Ben", activity: "Trained yesterday", slabs: [block("ben-0", muscle.chest, 1.3), block("ben-1", muscle.back, 1.15)] },
  { id: "maya", name: "Maya", activity: "Trained today", slabs: [block("maya-0", muscle.legs, 1.15), block("maya-1", muscle.chest, 1), block("maya-2", muscle.back, 1.3), block("maya-3", muscle.legs, 1.15, true)] },
  { id: "sam", name: "Sam", activity: null, slabs: [block("sam-0", muscle.shoulders, 1), block("sam-1", muscle.legs, 1.3), block("sam-2", muscle.arms, 1)] },
];
