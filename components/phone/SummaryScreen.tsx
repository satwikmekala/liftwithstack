"use client";

import type { CSSProperties } from "react";
import { MomentsCluster } from "@/components/moments/MomentsCluster";
import { Icon } from "@/components/ui/Icon";
import { artFor } from "@/lib/exercises";
import type { MomentPrint } from "@/lib/moments";
import { color } from "@/lib/tokens";
import { StatusBar } from "./Phone";

/**
 * A workout saved with Log sets off goes straight to its summary (app/workout-summary.tsx,
 * UntrackedWorkoutSummary): what was done, nothing measured, and its Moments in the corner.
 */
export function SummaryScreen({ exercises, photos }: { exercises: readonly string[]; photos: readonly MomentPrint[] }) {
  return (
    <div className="screen summary" style={{ "--c": color.accent } as CSSProperties}>
      <div className="summary__bg" aria-hidden="true" />
      <StatusBar />
      <div className="summary__nav" aria-hidden="true">
        <span className="summary__nav-title">Workout summary</span>
        <span className="summary__nav-actions">
          <span className="glass-button"><Icon name="ellipsis" size={20} color={color.bone} /></span>
          <span className="glass-button"><Icon name="x" size={20} color={color.bone} /></span>
        </span>
      </div>
      <div className="summary__card card-surface">
        <span className="summary__pill"><Icon name="check" size={13} stroke={3} color={color.accent} />WORKOUT COMPLETE</span>
        <p className="summary__title">Push</p>
        <p className="summary__date">Thursday, 8 October</p>
        <p className="summary__meta">Without logging · 41 min</p>
        <p className="summary__note">Weights and reps not logged</p>
        <div className="summary__recap">
          <p className="summary__recap-title">EXERCISES NOTED</p>
          {exercises.length === 0
            ? <p className="summary__empty">No exercises noted</p>
            : <ul>{exercises.map((name) => <li key={name}><i style={{ background: artFor(name)?.color ?? color.accent }} />{name}</li>)}</ul>}
        </div>
        {photos.length > 0 && <span className="summary__moments"><MomentsCluster photos={photos} /></span>}
      </div>
      <div className="summary__week" aria-hidden="true"><span>This week</span><b>3<small>/4</small></b></div>
      <span className="summary__done" aria-hidden="true">Done</span>
    </div>
  );
}
