import type { CSSProperties } from "react";
import { StackMark } from "@/components/ui/Icon";
import { artFor } from "@/lib/exercises";

/**
 * A Moment as a square print. The site has no real gym photography, so each print is the
 * app's own exercise art in a lit room, illustration only; the label is printed exactly as
 * the camera prints it (features/moments/MomentCamera.tsx MomentLabelOverlay).
 */
export function MomentPhoto({ exercise, line, label = true, className = "", eager = false }: {
  exercise: string; line: string | null; label?: boolean; className?: string; eager?: boolean;
}) {
  const art = artFor(exercise);
  return (
    <span className={`moment-photo ${className}`} style={{ "--c": art?.color ?? "#FF7A3D" } as CSSProperties}>
      <span className="moment-photo__room" aria-hidden="true" />
      {art && <img className="moment-photo__art" src={art.image} alt="" width={640} height={600} loading={eager ? "eager" : "lazy"} decoding="async" />}
      <span className="moment-photo__grain" aria-hidden="true" />
      {label && (
        <span className="moment-label" aria-hidden="true">
          <span className="moment-label__text">
            <span className="moment-label__name">{exercise}</span>
            {line && <span className="moment-label__line">{line}</span>}
          </span>
          <StackMark size={24} className="moment-label__mark" />
        </span>
      )}
    </span>
  );
}
