import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';

const root = resolve(import.meta.dirname, '..');
const nativeRequire = createRequire(import.meta.url);
const cache = new Map();
function load(file) {
  const path = resolve(root, file);
  if (cache.has(path)) return cache.get(path);
  const module = { exports: {} };
  cache.set(path, module.exports);
  const code = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const require = (id) => id.startsWith('@/') ? load(`${id.slice(2)}.ts`)
    : id.startsWith('.') ? load(`${resolve(dirname(path), id)}.ts`) : nativeRequire(id);
  new Function('require', 'module', 'exports', code)(require, module, module.exports);
  return module.exports;
}
const { makeDemoBlock } = load('lib/demo-block.ts');
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
