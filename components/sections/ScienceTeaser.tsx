import { Sarcomere } from "@/components/science/Sarcomere";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";

/** The door to /science, between Progress and Get started: why last week's weight matters. */
export function ScienceTeaser() {
  return (
    <section className="teaser" aria-labelledby="teaser-title">
      <a className="teaser__card" href="/science">
        <Reveal className="teaser__copy">
          <p className="eyebrow">THE SCIENCE</p>
          <h2 id="teaser-title" className="teaser__title">Why does last week matter?</h2>
          <p className="teaser__body">Because your body is answering every rep you do. Go inside a muscle, watch it adapt, and find out why the same weight stops being the same workout.</p>
          <span className="teaser__link">Read the science<Icon name="arrowRight" size={18} /></span>
          <span className="teaser__meta mono">SIX ACTS · 12 MIN · PEER-REVIEWED SOURCES</span>
        </Reveal>
        <div className="teaser__stage" aria-hidden="true">
          <Sarcomere contraction={0.35} glow={0.85} width={520} animate />
          <span className="teaser__caption mono">ONE SARCOMERE · SCHEMATIC</span>
        </div>
      </a>
    </section>
  );
}
