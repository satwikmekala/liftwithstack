import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Plate } from "@/components/science/Plate";

/** The door to /science, between Progress and Get started. */
export function ScienceTeaser() {
  return (
    <section className="teaser" aria-labelledby="teaser-title">
      <a className="teaser__card" href="/science">
        <Reveal className="teaser__copy">
          <p className="eyebrow">THE SCIENCE</p>
          <h2 id="teaser-title" className="teaser__title">Remember when 10&nbsp;kg felt heavy?</h2>
          <p className="teaser__body">Work out why the same weight gets easier, from a curl down to the molecules, in a short lesson you do rather than read.</p>
          <span className="teaser__link">Start the lesson<Icon name="arrowRight" size={18} /></span>
          <span className="teaser__meta mono">6 MIN · 6 STOPS</span>
        </Reveal>
        <div className="teaser__stage" aria-hidden="true">
          <Plate className="teaser__figure" angle={96} />
        </div>
      </a>
    </section>
  );
}
