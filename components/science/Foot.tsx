/** A footnote mark that jumps to its entry in the Sources. */
export function Foot({ n }: { n: number }) {
  return <sup className="foot"><a href={`#source-${n}`} aria-label={`Source ${n}`}>{n}</a></sup>;
}
