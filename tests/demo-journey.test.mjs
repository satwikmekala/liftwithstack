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
const { LIMIT_BY_WEEK, LIMIT_BY_LOAD, HARD_ENOUGH, TRIAL, effort, CLASSIC_CURL } = load('lib/science/story.ts');
const { platePose } = load('lib/science/arm.ts');
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

test('the made-up lifter stays honest: same set, a limit that moves away, and more than one way back to hard', () => {
  // Weeks 1 to 6: 10 kg × 8 never changes; what it leaves in reserve only grows.
  assert.equal(LIMIT_BY_WEEK[0] - 8, 1);
  assert.equal(LIMIT_BY_WEEK.at(-1) - 8, 4);
  assert.ok(LIMIT_BY_WEEK.every((limit, i) => i === 0 || limit >= LIMIT_BY_WEEK[i - 1]));
  assert.ok(effort(8, LIMIT_BY_WEEK[0]) > effort(8, LIMIT_BY_WEEK.at(-1)));
  // Week 7 starts where week 6 ended, and that set is no longer hard enough.
  assert.equal(LIMIT_BY_LOAD[10], LIMIT_BY_WEEK.at(-1));
  const left = (load, reps) => LIMIT_BY_LOAD[load] - reps;
  const hard = (load, reps) => left(load, reps) >= HARD_ENOUGH.min && left(load, reps) <= HARD_ENOUGH.max;
  assert.equal(hard(10, 8), false);
  // Adding reps gets there, and so does adding weight.
  assert.ok(hard(10, 10));
  assert.ok(hard(12, 8));
  // A heavier dumbbell always allows fewer reps.
  const loads = Object.keys(LIMIT_BY_LOAD).map(Number).sort((a, b) => a - b);
  assert.ok(loads.every((load, i) => i === 0 || LIMIT_BY_LOAD[load] < LIMIT_BY_LOAD[loads[i - 1]]));
  // The trial's numbers, as published.
  assert.deepEqual(TRIAL.map((row) => row.change), [22.9, 11.6, 1.8]);
});

test('the plate behaves like an arm: the biceps shortens and thickens as the elbow bends', () => {
  const rest = platePose(0), curled = platePose(110);
  assert.equal(rest.shortening, 0);
  assert.ok(curled.shortening > 0.15 && curled.shortening < 0.4, String(curled.shortening));
  assert.ok(curled.tension > rest.tension);
  assert.ok(curled.hand[1] < rest.hand[1], 'the dumbbell rises');
});

test('chapter 3 frames exist on disk at both sizes', () => {
  for (const path of CLASSIC_CURL) {
    for (const file of [path, path.replace(/^([a-z]+)\//, '$1/s/')]) {
      assert.ok(existsSync(resolve(root, 'public/science', file)), file);
    }
  }
});
