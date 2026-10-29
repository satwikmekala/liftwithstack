"use client";

import type { CSSProperties } from "react";
import { Icon } from "@/components/ui/Icon";
import { artFor } from "@/lib/exercises";
import { color } from "@/lib/tokens";

/** The Bench Press clip Stack plays (constants/exerciseVideos.ts), a YouTube Short. */
export const BENCH_PRESS_VIDEO = "_FkbD0FhgVE";
const DESCRIPTION = "Lower the bar toward your mid-chest with your feet planted, then press it back up with control.";

/**
 * The exercise's info sheet (components/ExerciseInfo.tsx) and its Check form player
 * (components/ExerciseFormVideo.tsx). The video is only loaded once Check form is tapped.
 */
export function InfoSheet({ open, playing, onPlay, onStop, onClose }: {
  open: boolean; playing: boolean; onPlay: () => void; onStop: () => void; onClose: () => void;
}) {
  const art = artFor("Bench Press");
  return (
    <>
      <div className={`page-sheet${open ? " is-open" : ""}`} inert={!open || playing} role="dialog" aria-label="Bench Press info">
        <div className="page-sheet__panel info" style={{ "--c": art.color } as CSSProperties}>
          <button type="button" className="info__close" onClick={onClose} aria-label="Close exercise info"><Icon name="x" size={20} color={color.bone} /></button>
          <div className="info__art" aria-hidden="true">
            <span className="info__glow" />
            <img src={art.image} alt="" width={640} height={533} loading="lazy" decoding="async" />
          </div>
          <div className="info__head">
            <p className="info__title">Bench Press</p>
            <button type="button" className="check-form" onClick={onPlay}>
              Check form<span className="check-form__play"><Icon name="play" size={10} stroke={0} /></span>
            </button>
          </div>
          <div className="info__chips">
            {art.primary.map((name) => <span key={name} className="chip chip--primary">{name}</span>)}
            {art.secondary.map((name) => <span key={name} className="chip">{name}</span>)}
          </div>
          <p className="info__text">{DESCRIPTION}</p>
        </div>
      </div>
      <div className={`form-video${playing ? " is-on" : ""}`} inert={!playing} role="dialog" aria-label="Form check, Bench Press">
        <div className="form-video__head">
          <span><span className="form-video__eyebrow">FORM CHECK</span><span className="form-video__title">Bench Press</span></span>
          <button type="button" className="form-video__close" onClick={onStop} aria-label="Close form video"><Icon name="x" size={20} color={color.bone} /></button>
        </div>
        <div className="form-video__frame">
          {playing && (
            <iframe src={`https://www.youtube-nocookie.com/embed/${BENCH_PRESS_VIDEO}?autoplay=1&playsinline=1&rel=0&modestbranding=1`}
              title="Bench Press form video" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen loading="lazy" />
          )}
        </div>
      </div>
    </>
  );
}
