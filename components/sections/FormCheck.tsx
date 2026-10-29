"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { artFor } from "@/lib/exercises";
import { color } from "@/lib/tokens";

const EXERCISE = "Bench Press";
const DESCRIPTION = "Lower the bar toward your mid-chest with your feet planted, then press it back up with control.";

const MORE: { icon: IconName; title: string; body: string }[] = [
  { icon: "link", title: "Supersets", body: "Pair two exercises and alternate their sets." },
  { icon: "message", title: "Notes", body: "Jot a cue on any exercise. It’s there next time." },
  { icon: "calendarPlus", title: "Past workouts", body: "Forgot to log? Add it after, on the right day." },
  { icon: "pencil", title: "Edit anything", body: "Fix or delete a finished workout from its summary." },
];

/**
 * Form Check: the exercise's info sheet (components/ExerciseInfo.tsx) and its Check form button,
 * which plays a short, hand-picked form clip (components/ExerciseFormVideo.tsx). The clips stream
 * from YouTube, so the page shows the player's frame rather than embedding someone else's video.
 */
export function FormCheck() {
  const art = artFor(EXERCISE);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setPlaying(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playing]);

  return (
    <section className="form-check" id="form-check" aria-labelledby="form-title">
      <div className="form-check__layout">
        <Reveal className="form-check__copy">
          <p className="eyebrow">FORM CHECK</p>
          <h2 id="form-title" className="section-title">A little more confidence in every rep.</h2>
          <p className="section-body">Not sure about an exercise? Open its info, tap Check form, and watch a short demo without leaving your workout.</p>
          <p className="form-check__note">Hand-picked clips for most exercises in Stack. They stream from YouTube, so you’ll need a connection.</p>
        </Reveal>

        <Reveal className="info-sheet" delay={100} style={{ "--c": art.color } as CSSProperties}>
          <div className={`info-sheet__card${playing ? " is-playing" : ""}`}>
            <span className="info-sheet__grabber" aria-hidden="true" />
            <div className="info-sheet__art" aria-hidden="true">
              <span className="info-sheet__glow" />
              <img src={art.image} alt="" width={640} height={533} loading="lazy" decoding="async" />
            </div>
            <div className="info-sheet__body">
              <div className="info-sheet__head">
                <p className="info-sheet__title">{EXERCISE}</p>
                <button type="button" className="check-form" onClick={() => setPlaying(true)} aria-haspopup="dialog">
                  Check form<span className="check-form__play"><Icon name="play" size={10} stroke={0} color={art.color} /></span>
                </button>
              </div>
              <div className="info-sheet__chips">
                {art.primary.map((name) => <span key={name} className="chip chip--primary">{name}</span>)}
                {art.secondary.map((name) => <span key={name} className="chip">{name}</span>)}
              </div>
              <p className="info-sheet__text">{DESCRIPTION}</p>
            </div>

            <div className={`player${playing ? " is-on" : ""}`} role="dialog" aria-modal="false" aria-label={`Form check, ${EXERCISE}`} inert={!playing}>
              <div className="player__head">
                <span><span className="player__eyebrow mono">FORM CHECK</span><span className="player__title">{EXERCISE}</span></span>
                <button type="button" className="player__close" onClick={() => setPlaying(false)} aria-label="Close form video"><Icon name="x" size={20} color={color.bone} /></button>
              </div>
              <div className="player__frame">
                <img src={art.image} alt="" width={640} height={533} loading="lazy" decoding="async" />
                <span className="player__scrim" aria-hidden="true" />
                <span className="player__caption">A short demo clip plays here, streamed from YouTube.</span>
                <span className="player__bar" aria-hidden="true"><i /></span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="toolkit">
        {MORE.map((item, index) => (
          <Reveal key={item.title} className="toolkit__item" delay={index * 60}>
            <span className="toolkit__icon"><Icon name={item.icon} size={20} stroke={1.8} /></span>
            <span><b>{item.title}</b><span>{item.body}</span></span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
