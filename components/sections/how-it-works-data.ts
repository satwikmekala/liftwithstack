export interface HowItWorksHeadlineSegment {
  readonly text: string;
  readonly emphasis?: boolean;
}

export const howItWorksIntro = {
  eyebrow: "HOW STACK WORKS",
  headline: [
    { text: "Open it. " },
    { text: "Lift.", emphasis: true },
    { text: " Keep moving." },
  ] as readonly HowItWorksHeadlineSegment[],
  paragraph:
    "Stack turns your training into one continuous loop. The next workout begins where the last one ended.",
} as const;

export type HowItWorksStepId = "today" | "exercise" | "next";

export interface HowItWorksStep {
  readonly id: HowItWorksStepId;
  readonly label: string;
  readonly title: string;
  readonly body: readonly string[];
}

export const howItWorksSteps: readonly HowItWorksStep[] = [
  {
    id: "today",
    label: "01 — YOUR WORKOUT IS READY",
    title: "Train the days you actually have.",
    body: [
      "Stack builds around how often you can make it to the gym.",
      "Two days this week, four the next—it adjusts.",
      "No rebuilding your plan every Monday.",
    ],
  },
  {
    id: "exercise",
    label: "02 — START WHERE YOU LEFT OFF",
    title: "Your last set is already waiting.",
    body: [
      "Your previous weight and reps are already there when the exercise begins.",
      "No remembering. No notes app. No guessing.",
    ],
  },
  {
    id: "next",
    label: "03 — THE WEEK KEEPS MOVING",
    title: "Miss a day. Nothing breaks.",
    body: [
      "Finish today's workout and Stack quietly prepares the next one.",
      "You simply keep moving.",
    ],
  },
] as const;

export const howItWorksStateDescriptions = {
  today:
    "Stack home screen showing today's prepared workout, Full Body A, with a start workout button.",
  exercise:
    "Active Bench Press screen with Set 1 ready to log at 40 kilograms for 8 reps, plus completed-set and personal-record follow-up states.",
  next: "Workout complete screen for Full Body A transitioning into the next prepared session, Full Body B.",
} as const satisfies Record<HowItWorksStepId, string>;
