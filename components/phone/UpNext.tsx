import { Icon } from "@/components/ui/Icon";
import { artFor } from "@/lib/exercises";
import { color } from "@/lib/tokens";

function Thumb({ name, size }: { name: string; size: number }) {
  const art = artFor(name);
  return art
    ? <img className="thumb" src={art.image} alt="" width={size} height={size} loading="lazy" decoding="async" />
    : <span className="thumb thumb--empty" style={{ width: size, height: size }}><Icon name="dumbbell" size={Math.round(size * 0.4)} color={color.ashDim} /></span>;
}

/**
 * The card under the exercise in both workout screens (components/UpNextCard.tsx): the next
 * exercise's picture and name, with the ones after it as a small stack on the right.
 */
export function UpNext({ name, following }: { name: string; following: readonly string[] }) {
  const shown = following.slice(0, 2);
  const more = following.length - shown.length;
  return (
    <div className="up-next" aria-hidden="true">
      <Thumb name={name} size={56} />
      <span className="up-next__copy">
        <span className="up-next__eyebrow">UP NEXT</span>
        <span className="up-next__name">{name}</span>
      </span>
      {following.length > 0 && (
        <span className="up-next__stack">
          {shown.map((next) => <span key={next} className="up-next__chip"><Thumb name={next} size={22} /></span>)}
          {more > 0 && <span className="up-next__chip up-next__more">+{more}</span>}
        </span>
      )}
      <Icon name="chevronRight" size={20} color={color.ashDim} />
    </div>
  );
}
