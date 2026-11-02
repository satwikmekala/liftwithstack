import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';

const root = resolve(import.meta.dirname, '..');
const nativeRequire = createRequire(import.meta.url);
const cache = new Map();
function load(file) {
  const path = resolve(root, file);
  if (cache.has(path)) return cache.get(path);
  const loaded = { exports: {} };
  cache.set(path, loaded.exports);
  const code = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const require = (id) => id.startsWith('@/') ? load(`${id.slice(2)}.ts`)
    : id.startsWith('.') ? load(`${resolve(dirname(path), id)}.ts`) : nativeRequire(id);
  new Function('require', 'module', 'exports', code)(require, loaded, loaded.exports);
  return loaded.exports;
}
const { makeDemoBlock, makeGuidedBlock } = load('lib/demo-block.ts');
const { guidedReducer, initialGuided, GUIDED_PLAN } = load('lib/guided.ts');
const { effectiveShare, sharingSummary, DEFAULT_SHARE } = load('lib/circle.ts');
const { PATHS, SAME_WEIGHT, TRIAL, effort, framePaths, ZOOM_AT, FRAMES } = load('lib/science/story.ts');
const { initialWorkout, workoutReducer } = load('lib/workout.ts');
const { finaleHistory } = load('lib/stack/history.ts');

test('browsing without logging does not claim the prefilled set as yours', () => {
  assert.equal(makeDemoBlock(initialWorkout()).sets, 0);
  assert.equal(finaleHistory().final.items.some(({slab}) => slab.id === 'your-first-block'), false);
});

test('logged weights and reps become the same block in the finale', () => {
  let workout = workoutReducer(initialWorkout(), {type:'suggest'});
  workout = workoutReducer(workout, {type:'reps', value:9});
  workout = workoutReducer(workout, {type:'log'});
  const demo = makeDemoBlock(workout);
  assert.equal(demo.sets, 1);
  assert.equal(demo.movedKg, 742.5);
  assert.equal(demo.improved, 1);
  assert.equal(demo.slab.height, 1.15);
  const history = finaleHistory(demo);
  assert.equal(history.final.items.at(-1).slab, demo.slab);
  assert.equal(history.weeks.at(-1).movedKg, 8680 + 742.5);
  assert.equal(history.weeks.at(-1).records, 0);
  assert.equal(history.final.items.length, finaleHistory().final.items.length);
  workout = workoutReducer(workout, {type:'weight', value:85});
  assert.equal(demo.lifts[0].weight, 82.5);
});

test('finishing every exercise preserves the completed demo rather than resetting it', () => {
  let workout = initialWorkout();
  for (let exercise = 0; exercise < workout.exercises.length; exercise++) {
    for (let set = 0; set < workout.exercises[exercise].sets.length; set++) {
      workout = workoutReducer(workout, {type:'log'});
    }
    workout = workoutReducer(workout, {type:'next'});
  }
  assert.equal(makeDemoBlock(workout).sets, 18);
});

test('Log sets off keeps only exercises marked done, and still makes a base-height block', () => {
  let guided = guidedReducer(initialGuided(), {type:'skip'});
  assert.equal(guided.index, 1);
  guided = guidedReducer(guided, {type:'done'});
  assert.deepEqual(guided.done, [GUIDED_PLAN[1]]);
  assert.equal(guided.index, 2);
  const demo = makeGuidedBlock(guided.done);
  assert.equal(demo.mode, 'untracked');
  assert.equal(demo.sets, 0);
  assert.equal(demo.slab.height, 1);
  assert.equal(finaleHistory(demo).final.items.at(-1).slab, demo.slab);
});

test('skipped exercises come round again until everything is done', () => {
  let guided = initialGuided();
  for (let i = 0; i < GUIDED_PLAN.length; i++) guided = guidedReducer(guided, {type:'skip'});
  assert.equal(guided.index, 0);
  for (let i = 0; i < GUIDED_PLAN.length; i++) guided = guidedReducer(guided, {type:'done'});
  assert.equal(guided.done.length, GUIDED_PLAN.length);
  assert.equal(guided.index, GUIDED_PLAN.length);
});

test('a new circle member shares this week only; detail needs workouts on', () => {
  assert.equal(sharingSummary(DEFAULT_SHARE), 'Friends see this week’s Stack.');
  const photosOnly = { ...DEFAULT_SHARE, photos: true, performance: true };
  assert.equal(effectiveShare(photosOnly).photos, false);
  assert.equal(effectiveShare(photosOnly).performance, false);
  assert.equal(sharingSummary({ ...DEFAULT_SHARE, paused: true }), 'Sharing is paused. Friends see your name and that you’ve paused.');
});

test('the two paths stay honest: same start, repeating drifts from the limit, progressing stays near it', () => {
  assert.deepEqual(PATHS.repeat[0], PATHS.progress[0]);
  assert.deepEqual(PATHS.repeat[0], SAME_WEIGHT.week6);
  assert.ok(PATHS.repeat.every((set) => set.load === 10 && set.reps === 8));
  assert.deepEqual(PATHS.progress.map((set) => `${set.load}x${set.reps}`), ['10x8', '10x9', '10x10', '10x12', '12x8']);
  assert.ok(effort(PATHS.repeat.at(-1)) < effort(PATHS.repeat[0]));
  assert.ok(effort(PATHS.progress.at(-1)) > effort(PATHS.repeat.at(-1)));
  assert.ok(effort(SAME_WEIGHT.week1) > effort(SAME_WEIGHT.week6));
  // The trial's numbers, as published.
  assert.deepEqual(TRIAL.map((row) => row.change), [22.9, 11.6, 1.8]);
});

test('every rendered frame the page asks for exists on disk', () => {
  const paths = framePaths();
  assert.equal(paths.length, FRAMES.curl.count + FRAMES.isolate.count + FRAMES.zoom.count);
  assert.equal(ZOOM_AT.at(-1), paths.length - 1);
  for (const path of paths) {
    for (const file of [path, path.replace(/^(arm|zoom)\//, '$1/s/')]) {
      assert.ok(existsSync(resolve(root, 'public/science', file)), file);
    }
  }
});
