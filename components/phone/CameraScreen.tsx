"use client";

import { useEffect, useRef, useState } from "react";
import { MomentPhoto } from "@/components/moments/MomentPhoto";
import { Icon } from "@/components/ui/Icon";
import { color } from "@/lib/tokens";

/**
 * The Moments camera (features/moments/MomentCamera.tsx): a square preview edge to edge, the
 * shutter, and around it Close, Label, flash, flip and this workout's last photo. One press keeps
 * the photo with the workout and closes the camera: no review, retake, caption or filter.
 */
export function CameraScreen({ open, exercise, line, count, onShoot, onClose }: {
  open: boolean;
  exercise: string;
  /** The set the label would print, or null without one (Log sets off). */
  line: string | null;
  count: number;
  onShoot: (labelled: boolean) => void;
  onClose: () => void;
}) {
  const [label, setLabel] = useState(false);
  const [flash, setFlash] = useState(false);
  const [firing, setFiring] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const shoot = () => {
    if (firing) return;
    setFiring(true);
    timer.current = setTimeout(() => {
      setFiring(false);
      onShoot(label);
    }, 260);
  };

  return (
    <div className={`camera${open ? " is-open" : ""}`} inert={!open} role="group" aria-label="Camera">
      <div className="camera__top">
        <button type="button" className="camera__round" onClick={onClose} aria-label="Close camera"><Icon name="x" size={22} color={color.bone} /></button>
        <button type="button" role="switch" aria-checked={label} className={`camera__chip${label ? " is-on" : ""}`} onClick={() => setLabel((on) => !on)}
          aria-label="Label. Prints the exercise and set into the photo">{label ? "LABEL ON" : "LABEL"}</button>
        <button type="button" role="switch" aria-checked={flash} className="camera__round" onClick={() => setFlash((on) => !on)} aria-label="Flash">
          <Icon name={flash ? "zap" : "zapOff"} size={20} color={flash ? color.accent : color.bone} />
        </button>
      </div>
      <div className="camera__frame">
        <MomentPhoto exercise={exercise} line={line} label={label} className="camera__preview" />
        <span className={`camera__flash${firing ? " is-firing" : ""}`} aria-hidden="true" />
      </div>
      <div className="camera__bottom">
        <span className="camera__side">
          {count > 0 && <span className="camera__last" aria-label={`${count} ${count === 1 ? "photo" : "photos"} this workout`}>
            <MomentPhoto exercise={exercise} line={null} label={false} className="camera__thumb" />
            <span className="camera__count">{count}</span>
          </span>}
        </span>
        <button type="button" className={`camera__shutter${firing ? " is-firing" : ""}`} onClick={shoot} aria-label="Take photo"><span /></button>
        <span className="camera__side camera__side--end"><span className="camera__round" aria-hidden="true"><Icon name="refresh" size={20} color={color.bone} /></span></span>
      </div>
    </div>
  );
}
