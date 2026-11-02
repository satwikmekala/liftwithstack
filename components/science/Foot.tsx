import { ref } from "@/lib/science/sources";

/** A footnote mark that jumps to its entry in the Sources. */
export function Foot({ of }: { of: string }) {
  const n = ref(of);
  return <sup className="foot"><a href={`#source-${n}`} aria-label={`Source ${n}`}>{n}</a></sup>;
}
