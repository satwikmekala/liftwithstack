import type { DemoBlock } from "../demo-block";
import { muscle } from "@/lib/tokens";
import { block, exampleHistory, layer, layoutSlabs, type BuildLayer, type BuildSlab } from "./model";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** 5–11 Oct, or 28 Sep–4 Oct across months (the app's range format). */
export function weekRange(start: Date) {
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return start.getMonth() === end.getMonth()
    ? `${start.getDate()}–${end.getDate()} ${MONTHS[end.getMonth()]}`
    : `${start.getDate()} ${MONTHS[start.getMonth()]}–${end.getDate()} ${MONTHS[end.getMonth()]}`;
}

export type Week = {
  id: string;
  range: string;
  blocks: BuildLayer[];
  movedKg: number;
  records: number;
  sealed: boolean;
};

/** Deterministic weight moved for an example workout, 2,600–6,400 kg. */
const movedFor = (index: number, blockIndex: number) => 2600 + (((index + 3) * 7919 + blockIndex * 104729) % 3800);

/**
 * Example history for Your Stack: 39 finished weeks, last week (28 Sep–4 Oct) still as
 * four separate blocks so it can press into a layer, then this week’s three blocks.
 */
export function finaleHistory(demo: DemoBlock | null = null) {
  const lastWeekStart = new Date(2026, 8, 28);
  const earlierStart = new Date(2026, 8, 21);
  const earlier = exampleHistory(39, earlierStart, 23);
  const lastWeekBlocks: BuildLayer[] = [
    { color: muscle.chest, height: 1.3, record: false },
    { color: muscle.back, height: 1.15, record: true },
    { color: muscle.legs, height: 1, record: false },
    { color: muscle.chest, height: 1.15, record: false },
  ];
  const thisWeekBlocks: BuildLayer[] = [
    { color: muscle.back, height: 1.15, record: false },
    { color: muscle.legs, height: 1, record: false },
    { color: muscle.chest, height: 1.3, record: true },
  ];

  if (demo) thisWeekBlocks[2] = demo.slab.layers[0];

  const weeks: Week[] = [
    ...earlier.map((week, index) => ({
      id: week.slab.id, range: weekRange(week.start), blocks: week.blocks, sealed: true, records: week.records,
      movedKg: week.blocks.reduce((sum, _, blockIndex) => sum + movedFor(index, blockIndex), 0),
    })),
    { id: "last-week", range: weekRange(lastWeekStart), blocks: lastWeekBlocks, sealed: true, records: 1, movedKg: 17840 },
    { id: "this-week", range: "This week", blocks: thisWeekBlocks, sealed: false, records: demo ? 0 : 1, movedKg: demo ? 8680 + demo.movedKg : 12960 },
  ];

  const sealedSlabs: BuildSlab[] = earlier.map((week) => week.slab);
  const lastWeekLayer = layer("last-week", lastWeekBlocks);
  const thisWeek = thisWeekBlocks.map((item, index) => demo && index === 2 ? demo.slab : block(`this-week-${index}`, item.color, item.height, item.record));

  // Final positions: every finished week as a layer, then this week's blocks.
  const final = layoutSlabs([...sealedSlabs, lastWeekLayer, ...thisWeek]);
  const lastWeekY = final.items[sealedSlabs.length].y;
  // Before the press: last week's four blocks sit separately where the layer will be.
  const loose = lastWeekBlocks.map((item, index) => block(`last-week-${index}`, item.color, item.height, item.record));

  return { weeks, sealedSlabs, lastWeekLayer, lastWeekBlocks, lastWeekY, loose, thisWeek, final };
}
