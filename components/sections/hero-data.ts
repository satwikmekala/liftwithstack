export interface HeroHeadlineSegment {
  readonly text: string;
  readonly emphasis?: boolean;
}

export const heroCopy = {
  eyebrow: "STRENGTH TRAINING FOR BUSY PEOPLE",
  headline: [
    { text: "Your life has enough to manage. " },
    { text: "Your workout " },
    { text: "doesn’t have to be", emphasis: true },
    { text: " one of them." },
  ] as readonly HeroHeadlineSegment[],
  paragraph:
    "Stack tells you what to train, remembers what you lifted, and prepares what comes next—so every time you make it to the gym, you can just lift.",
  primaryCta: { label: "Get launch updates", href: "#download" },
  secondaryCta: { label: "See how it works →", href: "#how-it-works" },
} as const;

export interface HeroDecision {
  readonly id: string;
  readonly label: string;
  readonly top?: string;
  readonly bottom?: string;
  readonly left?: string;
  readonly right?: string;
  readonly rotate: number;
  readonly convergeX: number;
  readonly convergeY: number;
  /** Hidden below the 480px breakpoint to avoid mobile clutter. */
  readonly compact?: boolean;
}

export const heroDecisions: readonly HeroDecision[] = [
  {
    id: "training",
    label: "What am I training?",
    top: "0%",
    left: "-2%",
    rotate: -7,
    convergeX: 70,
    convergeY: 55,
  },
  {
    id: "back",
    label: "Did I hit back this week?",
    top: "6%",
    right: "-5%",
    rotate: 5,
    convergeX: -65,
    convergeY: 55,
    compact: true,
  },
  {
    id: "weight",
    label: "60 or 62.5 kg?",
    top: "42%",
    right: "-10%",
    rotate: -4,
    convergeX: -85,
    convergeY: -5,
  },
  {
    id: "sets",
    label: "How many sets?",
    top: "46%",
    left: "-10%",
    rotate: 4,
    convergeX: 90,
    convergeY: -10,
    compact: true,
  },
  {
    id: "missed",
    label: "Missed Wednesday",
    bottom: "4%",
    left: "-3%",
    rotate: -3,
    convergeX: 60,
    convergeY: -70,
  },
  {
    id: "repeat",
    label: "Same as last time?",
    bottom: "-3%",
    right: "-2%",
    rotate: 3,
    convergeX: -60,
    convergeY: -70,
  },
] as const;

export const heroTimeline = {
  phoneDelay: 0.15,
  phoneDuration: 0.6,
  chipBaseDelay: 0.55,
  // Give each question room to enter, stay readable, and leave as part of
  // one coordinated loop. The fade is aligned so all chips leave together.
  chipCount: heroDecisions.length,
  chipStagger: 0.72,
  chipRevealDuration: 0.8,
  chipReadDuration: 4.8,
  chipFadeDuration: 1.6,
  chipCycleGap: 1.8,
  cardBrightenDelay: 2.65,
  cardBrightenDuration: 0.5,
  buttonSettleDelay: 3.0,
  buttonSettleDuration: 0.4,
  ease: [0.2, 0.7, 0.2, 1] as const,
} as const;
