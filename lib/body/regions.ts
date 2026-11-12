import { muscle } from "@/lib/tokens";

/** The app's body regions, in its order (features/body-map/regions.ts). */
export const BODY_REGIONS = [
  "upperChest", "chest", "frontDelts", "sideDelts", "rearDelts", "traps", "upperBack", "midBack", "lats",
  "lowerBack", "biceps", "triceps", "forearms", "abs", "obliques", "glutes", "quads", "hamstrings",
  "adductors", "calves",
] as const;
export type BodyRegion = (typeof BODY_REGIONS)[number];
export type Involvement = "primary" | "secondary";
export type RegionStates = Partial<Record<BodyRegion, Involvement>>;
export type BodySide = "front" | "back";

type Family = keyof typeof muscle;
export const REGION_INFO: Record<BodyRegion, { name: string; family: Family }> = {
  upperChest: { name: "Upper chest", family: "chest" },
  chest: { name: "Chest", family: "chest" },
  frontDelts: { name: "Front delts", family: "shoulders" },
  sideDelts: { name: "Side delts", family: "shoulders" },
  rearDelts: { name: "Rear delts", family: "shoulders" },
  traps: { name: "Traps", family: "back" },
  upperBack: { name: "Upper back", family: "back" },
  midBack: { name: "Mid back", family: "back" },
  lats: { name: "Lats", family: "back" },
  lowerBack: { name: "Lower back", family: "back" },
  biceps: { name: "Biceps", family: "arms" },
  triceps: { name: "Triceps", family: "arms" },
  forearms: { name: "Forearms", family: "arms" },
  abs: { name: "Abs", family: "core" },
  obliques: { name: "Obliques", family: "core" },
  glutes: { name: "Glutes", family: "legs" },
  quads: { name: "Quads", family: "legs" },
  hamstrings: { name: "Hamstrings", family: "legs" },
  adductors: { name: "Adductors", family: "legs" },
  calves: { name: "Calves", family: "legs" },
};

/** Body Map's neutrals (features/body-map/colors.ts, components/body-map/BodyModel.native.tsx). */
export const BODY_TONE = { body: "#302A25", plate: "#453D36", figure: "#3A332E" } as const;

export function mix(a: string, b: string, weightOfA: number) {
  const channels = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const [x, y] = [channels(a), channels(b)];
  return `#${x.map((v, i) => Math.round(v * weightOfA + y[i] * (1 - weightOfA)).toString(16).padStart(2, "0")).join("")}`;
}

export const regionColor = (region: BodyRegion) => muscle[REGION_INFO[region].family];
/** A muscle that helps is a lighter shade of the same colour. */
export const involvementColor = (region: BodyRegion, involvement: Involvement) =>
  involvement === "primary" ? regionColor(region) : mix(regionColor(region), "#FFFFFF", 0.55);

/** Its workout colour, or the neutral plate; with a muscle selected, the rest step back. */
export function regionFill(region: BodyRegion, states: RegionStates, selected: BodyRegion | null) {
  const involvement = states[region];
  let color: string = involvement || selected === region ? involvementColor(region, involvement ?? "primary") : BODY_TONE.plate;
  if (selected && region !== selected) color = mix(color, BODY_TONE.body, 0.5);
  return color;
}

/** Every region any of the given exercises works; primary anywhere wins. */
export function combineStates(list: readonly RegionStates[]): RegionStates {
  const states: RegionStates = {};
  for (const item of list) {
    for (const region of BODY_REGIONS) {
      const involvement = item[region];
      if (involvement && states[region] !== "primary") states[region] = involvement;
    }
  }
  return states;
}

/** Regions seen only from behind, so a figure showing just these turns round. */
const BACK_ONLY = new Set<BodyRegion>(["rearDelts", "traps", "upperBack", "midBack", "lats", "lowerBack", "glutes", "hamstrings", "calves"]);
export const sideFor = (regions: readonly BodyRegion[]): BodySide =>
  regions.length > 0 && regions.every((region) => BACK_ONLY.has(region)) ? "back" : "front";
