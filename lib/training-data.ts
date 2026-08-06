export type TrainingFrequency = 1 | 2 | 3 | 4 | 5 | 6;

export type TrainingSplit =
  | "Push"
  | "Pull"
  | "Legs"
  | "Upper"
  | "Lower"
  | "Full Body";

export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface TrainingDay {
  readonly dayIndex: DayIndex;
  readonly shortLabel: string;
  readonly split: TrainingSplit | null;
}

export const TRAINING_FREQUENCIES = [1, 2, 3, 4, 5, 6] as const;

export const TRAINING_ROTATIONS = {
  1: ["Full Body"],
  2: ["Upper", "Lower"],
  3: ["Push", "Pull", "Legs"],
  4: ["Upper", "Lower", "Push", "Pull"],
  5: ["Push", "Pull", "Legs", "Upper", "Lower"],
  6: ["Push", "Pull", "Legs", "Push", "Pull", "Legs"],
} as const satisfies Record<TrainingFrequency, readonly TrainingSplit[]>;

export const WEEK_PATTERNS = {
  1: [0],
  2: [0, 3],
  3: [0, 2, 4],
  4: [0, 1, 3, 4],
  5: [0, 1, 2, 4, 5],
  6: [0, 1, 2, 3, 4, 5],
} as const satisfies Record<TrainingFrequency, readonly DayIndex[]>;

/**
 * Source values are exported for any future charting or data serialization.
 * Components use the token-backed classes below so visual colors stay in the
 * Tailwind theme.
 */
export const SPLIT_COLORS = {
  Push: "#FF7A3D",
  Pull: "#4F8BFF",
  Legs: "#B6E24A",
  Upper: "#23D3C4",
  Lower: "#B57BFF",
  "Full Body": "#FF5C86",
} as const satisfies Record<TrainingSplit, string>;

export const SPLIT_BACKGROUND_CLASSES = {
  Push: "bg-split-push",
  Pull: "bg-split-pull",
  Legs: "bg-split-legs",
  Upper: "bg-split-upper",
  Lower: "bg-split-lower",
  "Full Body": "bg-split-full",
} as const satisfies Record<TrainingSplit, string>;

export const SPLIT_SHADOW_CLASSES = {
  Push: "shadow-split-push",
  Pull: "shadow-split-pull",
  Legs: "shadow-split-legs",
  Upper: "shadow-split-upper",
  Lower: "shadow-split-lower",
  "Full Body": "shadow-split-full",
} as const satisfies Record<TrainingSplit, string>;

export const BLOCK_HEIGHTS = {
  1: 40,
  2: 40,
  3: 38,
  4: 34,
  5: 30,
  6: 28,
} as const satisfies Record<TrainingFrequency, number>;

export const BLOCK_HEIGHT_CLASSES = {
  1: "h-10",
  2: "h-10",
  3: "h-[38px]",
  4: "h-[34px]",
  5: "h-[30px]",
  6: "h-7",
} as const satisfies Record<TrainingFrequency, string>;

export const WEEKDAYS = [
  { dayIndex: 0, shortLabel: "M" },
  { dayIndex: 1, shortLabel: "T" },
  { dayIndex: 2, shortLabel: "W" },
  { dayIndex: 3, shortLabel: "T" },
  { dayIndex: 4, shortLabel: "F" },
  { dayIndex: 5, shortLabel: "S" },
  { dayIndex: 6, shortLabel: "S" },
] as const satisfies readonly {
  readonly dayIndex: DayIndex;
  readonly shortLabel: string;
}[];

export function getTrainingWeek(
  frequency: TrainingFrequency,
): readonly TrainingDay[] {
  const splitByDay = new Map<DayIndex, TrainingSplit>();
  const rotation = TRAINING_ROTATIONS[frequency];

  WEEK_PATTERNS[frequency].forEach((dayIndex, rotationIndex) => {
    const split = rotation[rotationIndex];

    if (split) {
      splitByDay.set(dayIndex, split);
    }
  });

  return WEEKDAYS.map(({ dayIndex, shortLabel }) => ({
    dayIndex,
    shortLabel,
    split: splitByDay.get(dayIndex) ?? null,
  }));
}

export function getLegendSplits(
  frequency: TrainingFrequency,
): readonly TrainingSplit[] {
  return [...new Set<TrainingSplit>(TRAINING_ROTATIONS[frequency])];
}
