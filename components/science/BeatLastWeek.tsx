"use client";

import { useMemo, useState } from "react";
import { MiniStack, TRUE_UNIT } from "@/components/stack/MiniStack";
import { choicesFor, newGame, play, ROUNDS, type Choice, type Message } from "@/lib/science/model";
import { block, HEIGHTS } from "@/lib/stack/model";
import { muscle } from "@/lib/tokens";
import { Foot } from "./Foot";

const NOTES: Record<Message, { title: string; body: string }> = {
  loud: { title: "Loud and clear.", body: "Your muscle had to work for that. It lands as a thicker block." },
  medium: { title: "It heard you.", body: "A real challenge, with some room left." },
  quiet: { title: "Barely a whisper.", body: "Showing up still counts. But your muscle has done this before." },
  failed: { title: "Too much, too soon.", body: "The set fell apart, so it didn’t count. Nobody needs a jump that big." },
};

const HEIGHT: Record<Message, number> = { loud: HEIGHTS[2], medium: HEIGHTS[1], quiet: HEIGHTS[0], failed: HEIGHTS[0] };

/** The game that replaces the sliders: six weeks, one choice each, and a real Stack block for every one. */
export function BeatLastWeek() {
  const [game, setGame] = useState(newGame);
  const round = game.rounds.length;
  const finished = round >= ROUNDS;
  const latest = game.rounds[round - 1];
  const options = useMemo(() => choicesFor(game), [game]);
  const yours = game.rounds.map((item, index) => block(`yours-${index}`, muscle.chest, HEIGHT[item.message], item.choice === "heavier" && item.message !== "failed"));
  const same = game.rounds.map((_, index) => block(`same-${index}`, muscle.chest, HEIGHTS[0]));
  const loud = game.rounds.filter((item) => item.message === "loud").length;

  return (
    <section className="game" id="beat-last-week" aria-labelledby="game-title">
      <div className="game__head">
        <p className="eyebrow">YOUR TURN</p>
        <h2 id="game-title" className="sci-title">Beat last week.</h2>
        <p className="sci-body">Six weeks, one choice each. See what your muscle hears.</p>
      </div>

      <div className="game__board">
        <div className="game__play">
          {finished ? (
            <div className="game__end" role="status">
              <p className="game__week mono">SIX WEEKS LATER</p>
              <p className="game__verdict">{loud >= 4 ? "That has a name: progressive overload." : loud >= 2 ? "That’s the idea: progressive overload." : "You showed up. Your muscle stayed quiet."}</p>
              <p className="game__text">{loud >= 2
                ? <>From 10 kg × 10 to {game.last.load} kg × {game.last.reps}, without one big jump. Just a little more than last time, by whichever way fits.<Foot of="acsm" /></>
                : <>Progressive overload just means asking for a little more than last time. Try one more rep.<Foot of="acsm" /></>}</p>
              <button type="button" className="game__again" onClick={() => setGame(newGame())}>Play again</button>
            </div>
          ) : (
            <>
              <p className="game__week mono">WEEK {round + 1} OF {ROUNDS}</p>
              <p className="game__last">Last week<b>{game.last.load} kg × {game.last.reps}</b></p>
              <div className="game__choices">
                {options.map((option) => (
                  <button key={option.choice} type="button" onClick={() => setGame((current) => play(current, option.choice as Choice))}>
                    <b>{option.label}</b><span>{option.set.load} kg × {option.set.reps}</span>
                  </button>
                ))}
              </div>
            </>
          )}
          <div className="game__result" aria-live="polite">
            {latest && !finished && (
              <p key={round} className={`game__note is-${latest.message}`}>
                <b>{NOTES[latest.message].title}</b> {latest.stoppedAt ? `You stopped at rep ${latest.stoppedAt}. ` : ""}{NOTES[latest.message].body}
              </p>
            )}
          </div>
        </div>

        <div className="game__stacks" aria-hidden="true">
          <figure>
            <MiniStack slabs={yours} width={230} height={230} unit={TRUE_UNIT} base="plinth" glow />
            <figcaption>You</figcaption>
          </figure>
          <figure>
            <MiniStack slabs={same} width={230} height={230} unit={TRUE_UNIT} base="plinth" />
            <figcaption>Same workout</figcaption>
          </figure>
        </div>
      </div>
      <p className="game__fine">A game, not a forecast. Real bodies vary. Thicker blocks work the way they do in Stack: beat last time and the block lands thicker.</p>
    </section>
  );
}
