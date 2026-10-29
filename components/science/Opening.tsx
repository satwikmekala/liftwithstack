import { StackMark } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { INSTAGRAM_URL } from "@/lib/site";
import { Sarcomere } from "./Sarcomere";

export function ScienceNav() {
  return (
    <header className="nav sci-nav">
      {/* A plain anchor: next/link pulls a second React into the vinext dev bundle. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a className="nav__brand" href="/" aria-label="Stack, home">
        <StackMark size={26} />
        <span>Stack</span>
      </a>
      <span className="sci-nav__title mono">THE INVISIBLE WORK</span>
      <a className="download download--small download--soon" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Get the beta</a>
    </header>
  );
}

/** The first five seconds: a near-black room, one sarcomere, one sentence. */
export function Opening() {
  return (
    <section className="opening" aria-labelledby="opening-title">
      <div className="opening__glint" aria-hidden="true">
        <Sarcomere contraction={0.35} glow={0.9} width={720} animate />
      </div>
      <div className="opening__copy">
        <p className="eyebrow opening__eyebrow">THE SCIENCE OF GETTING STRONGER</p>
        <h1 id="opening-title" className="opening__title">
          <span className="line"><span>Every rep</span></span>
          <span className="line"><span>changes something.</span></span>
        </h1>
        <p className="opening__body">What happens inside a muscle when you lift. Why your body answers. Why the same weight stops being the same workout, and why one more rep is a bigger deal than it looks.</p>
        <p className="opening__meta mono">SIX ACTS · 12 MIN · 23 SOURCES</p>
      </div>
      <p className="opening__cue" aria-hidden="true"><span>Scroll</span><i /></p>
    </section>
  );
}

/** One line on black, between acts. */
export function Interlude({ line, detail }: { line: string; detail?: string }) {
  return (
    <Reveal as="section" className="interlude" aria-label={line}>
      <p className="interlude__line">{line}</p>
      {detail && <p className="interlude__detail">{detail}</p>}
    </Reveal>
  );
}
