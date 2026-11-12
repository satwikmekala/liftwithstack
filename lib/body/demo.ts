import { combineStates, type BodyRegion, type RegionStates } from "./regions";

/** Muscles per exercise, as the app lists them (features/stacked-plan/engine/exercises.ts, shown through builtInMuscles). */
const muscles = (primary: string, secondary = ""): RegionStates => ({
  ...Object.fromEntries(secondary.split(" ").filter(Boolean).map((region) => [region, "secondary"])),
  ...Object.fromEntries(primary.split(" ").filter(Boolean).map((region) => [region, "primary"])),
});

export const EXERCISE_MUSCLES: Record<string, RegionStates> = {
  "Bench Press": muscles("chest", "upperChest frontDelts triceps"),
  "Incline Dumbbell Press": muscles("upperChest", "chest frontDelts triceps"),
  "Seated Dumbbell Shoulder Press": muscles("frontDelts", "sideDelts triceps"),
  "Lateral Raise": muscles("sideDelts"),
  "Triceps Pushdown": muscles("triceps"),
  "Overhead Triceps Extension": muscles("triceps"),
  "Arnold Press": muscles("frontDelts", "sideDelts triceps"),
  "Bradford Press": muscles("frontDelts sideDelts", "triceps"),
  // The app leaves out muscles that only brace or grip, so a squat does not light the abs.
  Deadlift: muscles("hamstrings glutes lowerBack", "quads traps lats"),
  "Lat Pulldown": muscles("lats", "biceps midBack"),
  "Barbell Squat": muscles("quads glutes", "adductors lowerBack"),
  "Seated Cable Row": muscles("midBack lats", "biceps rearDelts"),
  "Romanian Deadlift": muscles("hamstrings glutes", "lowerBack"),
  "Dumbbell Curl": muscles("biceps", "forearms"),
  "Hanging Leg Raise": muscles("abs", "obliques"),
};

export type DemoStatus = "done" | "planned";
/** The page's Chest and Triceps workout, part-way through: two done, the rest still to come. */
export const BODY_WORKOUT: { name: string; status: DemoStatus }[] = [
  { name: "Bench Press", status: "done" },
  { name: "Incline Dumbbell Press", status: "done" },
  { name: "Seated Dumbbell Shoulder Press", status: "planned" },
  { name: "Lateral Raise", status: "planned" },
  { name: "Triceps Pushdown", status: "planned" },
  { name: "Overhead Triceps Extension", status: "planned" },
];
/** Exercises the sheet can offer to add: the ones the site has the app's art for. */
export const ADDABLE = ["Arnold Press", "Bradford Press"];

export const statesOf = (names: readonly string[]) => combineStates(names.map((name) => EXERCISE_MUSCLES[name] ?? {}));
export const regionsOf = (states: RegionStates) => Object.keys(states) as BodyRegion[];

/** Progress: what each timeframe trained. This week is the page's three workouts; four weeks reaches everything. */
export const WEEK_WORKOUTS = [
  ["Deadlift", "Lat Pulldown", "Seated Cable Row"],
  ["Barbell Squat", "Romanian Deadlift"],
  ["Bench Press", "Incline Dumbbell Press", "Seated Dumbbell Shoulder Press", "Lateral Raise", "Triceps Pushdown"],
];
export const WEEK_STATES = statesOf(WEEK_WORKOUTS.flat());
export const LAST4_STATES = statesOf([...WEEK_WORKOUTS.flat(), "Dumbbell Curl", "Hanging Leg Raise"]);

export type Trend = "Improving" | "Holding steady";
/** The lifts behind a muscle, as Progress lists them when you tap it. */
export const MUSCLE_LIFTS: Partial<Record<BodyRegion, { name: string; set: string; trend: Trend }[]>> = {
  chest: [{ name: "Bench Press", set: "82.5 kg × 8", trend: "Improving" }, { name: "Incline Dumbbell Press", set: "28 kg × 10", trend: "Improving" }],
  upperChest: [{ name: "Incline Dumbbell Press", set: "28 kg × 10", trend: "Improving" }, { name: "Bench Press", set: "82.5 kg × 8", trend: "Improving" }],
  frontDelts: [{ name: "Seated Dumbbell Shoulder Press", set: "22 kg × 10", trend: "Holding steady" }, { name: "Bench Press", set: "82.5 kg × 8", trend: "Improving" }],
  sideDelts: [{ name: "Lateral Raise", set: "10 kg × 12", trend: "Improving" }, { name: "Seated Dumbbell Shoulder Press", set: "22 kg × 10", trend: "Holding steady" }],
  triceps: [{ name: "Triceps Pushdown", set: "35 kg × 12", trend: "Improving" }, { name: "Bench Press", set: "82.5 kg × 8", trend: "Improving" }],
  biceps: [{ name: "Lat Pulldown", set: "65 kg × 10", trend: "Holding steady" }, { name: "Seated Cable Row", set: "55 kg × 10", trend: "Improving" }],
  lats: [{ name: "Lat Pulldown", set: "65 kg × 10", trend: "Holding steady" }, { name: "Deadlift", set: "140 kg × 5", trend: "Improving" }],
  midBack: [{ name: "Seated Cable Row", set: "55 kg × 10", trend: "Improving" }, { name: "Lat Pulldown", set: "65 kg × 10", trend: "Holding steady" }],
  traps: [{ name: "Deadlift", set: "140 kg × 5", trend: "Improving" }],
  rearDelts: [{ name: "Seated Cable Row", set: "55 kg × 10", trend: "Improving" }],
  lowerBack: [{ name: "Deadlift", set: "140 kg × 5", trend: "Improving" }, { name: "Romanian Deadlift", set: "90 kg × 8", trend: "Improving" }],
  glutes: [{ name: "Barbell Squat", set: "100 kg × 6", trend: "Improving" }, { name: "Deadlift", set: "140 kg × 5", trend: "Improving" }],
  quads: [{ name: "Barbell Squat", set: "100 kg × 6", trend: "Improving" }, { name: "Deadlift", set: "140 kg × 5", trend: "Improving" }],
  hamstrings: [{ name: "Romanian Deadlift", set: "90 kg × 8", trend: "Improving" }, { name: "Deadlift", set: "140 kg × 5", trend: "Improving" }],
  adductors: [{ name: "Barbell Squat", set: "100 kg × 6", trend: "Improving" }],
  abs: [{ name: "Hanging Leg Raise", set: "Bodyweight × 12", trend: "Holding steady" }],
  obliques: [{ name: "Hanging Leg Raise", set: "Bodyweight × 12", trend: "Holding steady" }],
  forearms: [{ name: "Dumbbell Curl", set: "14 kg × 10", trend: "Improving" }],
};
