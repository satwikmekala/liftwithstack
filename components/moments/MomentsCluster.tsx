import type { CSSProperties } from "react";
import type { MomentPrint } from "@/lib/moments";
import { MomentPhoto } from "./MomentPhoto";

const TILT = [0, -9, 8];
const SHIFT = [0, -7, 7];

/**
 * The little stack of photos that stands for a set of Moments (features/moments/MomentsCluster.tsx):
 * the newest on top, up to two more tucked behind at a slight angle, and a count past three.
 */
export function MomentsCluster({ photos, size = 46, className = "" }: { photos: readonly Pick<MomentPrint, "id" | "exercise">[]; size?: number; className?: string }) {
  if (photos.length === 0) return null;
  const shown = photos.slice(-3).reverse();
  return (
    <span className={`cluster ${className}`} style={{ "--size": `${size}px` } as CSSProperties} aria-hidden="true">
      {[...shown].reverse().map((photo, index, list) => {
        const depth = list.length - 1 - index;
        return (
          <span key={photo.id} className={`cluster__card${depth ? " is-behind" : ""}`}
            style={{ transform: `translateX(${SHIFT[depth]}px) rotate(${TILT[depth]}deg)` }}>
            <MomentPhoto exercise={photo.exercise} line={null} label={false} />
          </span>
        );
      })}
      {photos.length > 3 && <span className="cluster__count">{photos.length}</span>}
    </span>
  );
}
