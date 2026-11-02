import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";

/** The door to /science, between Progress and Get started. */
export function ScienceTeaser() {
  return (
    <section className="teaser" aria-labelledby="teaser-title">
      <a className="teaser__card" href="/science">
        <Reveal className="teaser__copy">
          <p className="eyebrow">THE SCIENCE</p>
          <h2 id="teaser-title" className="teaser__title">Remember when 10&nbsp;kg felt heavy?</h2>
          <p className="teaser__body">Why the same weight gets easier, from a curl down to the molecules, and what it means for your next workout.</p>
          <span className="teaser__link">Read the story<Icon name="arrowRight" size={18} /></span>
          <span className="teaser__meta mono">8 MIN READ · 7 CHAPTERS</span>
        </Reveal>
        <div className="teaser__stage" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="teaser__figure" src="/science/arm/s/c19.webp" alt="" width={640} height={640} loading="lazy" decoding="async" />
        </div>
      </a>
    </section>
  );
}
