import { Stop } from "./lesson";

const POINTS: [string, string][] = [
  ["Muscles only pull.", "Myosin heads pull on actin, powered by ATP. Sarcomeres shorten, fibers shorten, your arm bends."],
  ["Hard work is the signal.", "A load that’s hard for you creates tension, and tension starts the change."],
  ["Two things change.", "Over weeks your nervous system improves and your fibers thicken. Those are two different things."],
  ["So the same weight gets easier.", "It takes a smaller share of what you’ve got, and it asks less of you."],
  ["Then you ask for a little more.", "In whichever way fits: a rep, a little weight, a set. That is progressive overload."],
];

/** Stop 6: the whole lesson in five lines, before the log. */
export function Recap() {
  return (
    <Stop n={6} title="Why 10 kg stopped feeling heavy." lead={<p>The whole thing, in the order it happens.</p>}>
      <ol className="sci-recap">
        {POINTS.map(([head, body], index) => (
          <li key={head}>
            <span className="sci-recap__n mono">{index + 1}</span>
            <p><b>{head}</b> {body}</p>
          </li>
        ))}
      </ol>
    </Stop>
  );
}
