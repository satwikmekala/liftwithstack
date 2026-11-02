import { CurlingFigure } from "@/components/science/Figure";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";

/** The door to /science, between Progress and Get started. */
export function ScienceTeaser() {
  return (
    <section className="teaser" aria-labelledby="teaser-title">
      <a className="teaser__card" href="/science">
        <Reveal className="teaser__copy">
          <p className="eyebrow">THE SCIENCE</p>
          <h2 id="teaser-title" className="teaser__title">You’re showing up. So why aren’t you changing?</h2>
          <p className="teaser__body">The answer is inside your muscle, on every rep.</p>
          <span className="teaser__link">Find out why<Icon name="arrowRight" size={18} /></span>
          <span className="teaser__meta mono">5 MIN READ · NO BIOLOGY DEGREE NEEDED</span>
        </Reveal>
        <div className="teaser__stage" aria-hidden="true"><CurlingFigure /></div>
      </a>
    </section>
  );
}
