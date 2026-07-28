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

export interface FaqItem {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

export interface PrincipleItem {
  readonly number: `${number}${number}`;
  readonly title: string;
  readonly description: string;
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

export const FAQ_ITEMS = [
  {
    id: "missed-workout",
    question: "What if I miss a workout?",
    answer:
      "Stack uses what you actually completed to prepare the next session, so you can pick up without manually rebuilding a calendar.",
  },
  {
    id: "change-target",
    question: "Can I change an exercise or target?",
    answer:
      "Yes. Stack suggests; you decide. Adjust an exercise, weight, reps, or session when the gym or your body calls for it.",
  },
  {
    id: "beginners",
    question: "Is Stack for beginners?",
    answer:
      "Stack is designed to make strength training less intimidating for beginners and less administratively annoying for experienced lifters.",
  },
] as const satisfies readonly FaqItem[];

export const PRINCIPLE_ITEMS = [
  {
    number: "01",
    title: "Train regularly",
    description:
      "Consistent, repeatable sessions do more over months than any single perfect week. Stack is built around showing up at a frequency you can hold.",
  },
  {
    number: "02",
    title: "Progress gradually",
    description:
      "Small, measured increases in weight or reps — suggested from your logged performance, never an arbitrary jump, and always yours to adjust.",
  },
  {
    number: "03",
    title: "Cover the whole body",
    description:
      'A balanced rotation helps spread work sensibly across muscle groups — no single "perfect split," just coverage that fits your available days.',
  },
] as const satisfies readonly PrincipleItem[];

export const PRINCIPLES_DISCLAIMER =
  "Stack is evidence-informed and designed to help you train consistently. It does not promise guaranteed gains, a universally optimal program, or that more training days are inherently better.";

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
