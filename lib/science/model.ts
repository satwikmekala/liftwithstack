/**
 * The arithmetic behind the page. All of it illustrates a principle and none of it predicts
 * anyone's body: the curves are shaped to show the idea, and the game uses Epley's rule of thumb
 * for how weight and reps relate.
 */
const reach = (load: number, max: number) => Math.round(30 * (max / load - 1));

/** How strong you are over the weeks if the workout never changes: up, then levelling off. */
export const sameWorkout = (week: number) => 1 + 0.36 * (1 - Math.exp(-week / 5));

/** The same start, then a little more whenever it gets easy: it keeps climbing, but more slowly with time. */
export const addsALittle = (week: number) => (week <= 6 ? sameWorkout(week) : sameWorkout(6) + 0.62 * (1 - Math.exp(-(week - 6) / 16)));

/** How loud the message is: full while the weight is hard, fading as you outgrow it. */
export const loudness = (strength: number) => Math.exp(-(strength - 1) / 0.16);

export type Choice = "same" | "rep" | "heavier" | "toomuch";
export type GameSet = { load: number; reps: number };
export type Message = "loud" | "medium" | "quiet" | "failed";
export type Round = { set: GameSet; choice: Choice; message: Message; stoppedAt?: number };
export type Game = { max: number; last: GameSet; rounds: Round[] };

export const ROUNDS = 6;
export const newGame = (): Game => ({ max: 14, last: { load: 10, reps: 10 }, rounds: [] });

/** "A little heavier" is 2 kg up for about as many reps as you have in you: hard, and doable. */
export const choicesFor = ({ max, last: { load, reps } }: Pick<Game, "max" | "last">): { choice: Choice; label: string; set: GameSet }[] => [
  { choice: "same", label: "Same again", set: { load, reps } },
  { choice: "rep", label: "One more rep", set: { load, reps: reps + 1 } },
  { choice: "heavier", label: "A little heavier", set: { load: load + 2, reps: Math.max(3, reach(load + 2, max) - 1) } },
  { choice: "toomuch", label: "Way heavier", set: { load: load + 8, reps } },
];

/** Play one week: a set you can't finish doesn't count, an easy one barely registers, a hard one does. */
export function play(game: Game, choice: Choice): Game {
  const option = choicesFor(game).find((item) => item.choice === choice)!;
  const possible = reach(option.set.load, game.max);
  if (possible < option.set.reps) {
    return { ...game, rounds: [...game.rounds, { set: option.set, choice, message: "failed", stoppedAt: Math.max(1, possible) }] };
  }
  const left = possible - option.set.reps;
  // Repeating last week can never be louder than last week was.
  const message: Message = choice === "same" ? (left <= 3 ? "medium" : "quiet") : left <= 3 ? "loud" : left <= 5 ? "medium" : "quiet";
  const slowing = 0.92 ** game.rounds.length;
  const gain = { loud: 0.6, medium: 0.3, quiet: 0.05 }[message] * slowing;
  return { max: game.max + gain, last: option.set, rounds: [...game.rounds, { set: option.set, choice, message }] };
}
