"use client";

import { Icon } from "@/components/ui/Icon";
import { color } from "@/lib/tokens";

/** Example history for Bench Press: the last few times, newest first, best set marked. */
const HISTORY = [
  { date: "Oct 5", relative: "3 days ago", sets: [[60, 10], [70, 8], [80, 6]] },
  { date: "Oct 1", relative: "7 days ago", sets: [[50, 10], [60, 10], [70, 8]] },
  { date: "Sep 28", relative: "10 days ago", sets: [[70, 8], [75, 6], [80, 5]] },
  { date: "Sep 24", relative: "2 weeks ago", sets: [[60, 8], [70, 8], [75, 6]] },
] as const;

/**
 * Exercise history (components/ExerciseHistory.tsx): recent sets for the exercise on screen,
 * opened from the logger's history button as a native page sheet.
 */
export function HistorySheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div className={`page-sheet${open ? " is-open" : ""}`} inert={!open} role="dialog" aria-label="Exercise history, Bench Press">
      <div className="page-sheet__panel history">
        <div className="history__header">
          <span>
            <span className="history__title">Exercise history</span>
            <span className="history__name">Bench Press</span>
          </span>
          <button type="button" className="history__close" onClick={onClose} aria-label="Close exercise history"><Icon name="x" size={20} color={color.bone} /></button>
        </div>
        <div className="history__list">
          {HISTORY.map((entry) => {
            const best = Math.max(...entry.sets.map(([weight]) => weight));
            return (
              <div key={entry.date} className="history__entry">
                <p className="history__date"><b>{entry.date}</b><span>{entry.relative}</span></p>
                {entry.sets.map(([weight, reps], index) => (
                  <p key={index} className={`history__set${weight === best ? " is-top" : ""}`}>
                    <i />{weight}<small> kg</small> × {reps}
                  </p>
                ))}
              </div>
            );
          })}
        </div>
        <span className="history__notes" aria-hidden="true"><Icon name="message" size={18} stroke={1.9} color={color.bone} />Notes</span>
      </div>
    </div>
  );
}
