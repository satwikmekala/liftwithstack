import { SOURCES } from "@/lib/science/sources";

/** The research, numbered as the footnotes cite it. */
export function Sources() {
  return (
    <section className="sources" id="sources" aria-labelledby="sources-title">
      <p className="eyebrow">SOURCES</p>
      <h2 id="sources-title" className="sources__title">The research behind this page.</h2>
      <p className="sources__intro">A textbook, peer-reviewed studies, reviews and a position stand, numbered as the footnotes cite them. The figures are illustrations of these facts, and the made-up lifter in stops 4 and 5 is labelled as made up. Where something is simplified or still debated, the text says so.</p>
      <ol className="sources__list">
        {SOURCES.map((source, index) => (
          <li key={source.key} id={`source-${index + 1}`}>
            <span className="sources__number mono">{index + 1}</span>
            <span className="sources__body">
              <a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a>
              <span className="sources__meta">{source.authors} ({source.year}). <em>{source.where}</em>.</span>
              {source.note && <span className="sources__note">{source.note}</span>}
            </span>
          </li>
        ))}
      </ol>
      <div className="credits" id="credits">
        <p className="eyebrow">CREDITS</p>
        <p>The 3D figure is Stack’s own, the same sculpt the app’s Body Map uses. The plate of the arm, the zoom into the muscle and the diagrams are original illustrations made for this page. Facts about muscle structure and contraction follow OpenStax <i>Anatomy and Physiology 2e</i>, CC BY 4.0.</p>
        <p>The small anatomical arm beside the sarcomere in stop 3 is rendered from <a href="https://github.com/Charleeh/ecorche" target="_blank" rel="noopener noreferrer">Écorché</a>, licensed <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a>, which is based on BodyParts3D, © The Database Center for Life Science, licensed CC BY 4.0, and on Z-Anatomy by Gauthier Kervyn, licensed CC BY-SA 4.0. We posed the arm into a curl, added a dumbbell and rendered it as images, which are shared under the same CC BY-SA 4.0 licence.</p>
      </div>
      <p className="sources__fine">Nothing here is medical advice. If you train with an injury or a condition, ask someone who knows your body.</p>
    </section>
  );
}
