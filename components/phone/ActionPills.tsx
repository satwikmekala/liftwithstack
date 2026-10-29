"use client";

import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { color } from "@/lib/tokens";

/**
 * The logger's floating capsules (components/ExerciseActionPill.tsx): the exercise's
 * references on the left, and Moments' camera on the right with this workout's photo count.
 */
export function ActionPills({ left, photos, onCamera, cue }: { left: ReactNode; photos: number; onCamera: () => void; cue: boolean }) {
  return (
    <>
      <div className="action-pill action-pill--left" aria-hidden="true">{left}</div>
      <div className={`action-pill action-pill--right${cue ? " is-cued" : ""}`}>
        <button type="button" className="action-pill__camera" onClick={onCamera}
          aria-label={photos ? `Camera, ${photos} ${photos === 1 ? "photo" : "photos"} this workout` : "Camera"}>
          <Icon name="camera" size={26} stroke={1.8} color={color.bone} />
          {photos > 0 && <span key={photos} className="action-pill__badge">{photos}</span>}
        </button>
      </div>
    </>
  );
}
