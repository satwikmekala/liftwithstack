import { SOURCES } from "@/lib/science/sources";

/** The research, numbered as the footnotes cite it. */
export function Sources() {
  return (
    <section className="sources" id="sources" aria-labelledby="sources-title">
      <p className="eyebrow">SOURCES</p>
      <h2 id="sources-title" className="sources__title">The research behind this page.</h2>
      <p className="sources__intro">A textbook, peer-reviewed studies, reviews and a position stand, in the order they are first cited. The figures are illustrations of these facts. Where something is simplified or still debated, the text says so.</p>
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
        <p>The anatomical figure in chapters 1, 2 and 5 is rendered from <a href="https://github.com/Charleeh/ecorche" target="_blank" rel="noopener noreferrer">Écorché</a>, licensed <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a>, which is based on BodyParts3D, © The Database Center for Life Science, licensed CC BY 4.0, and on Z-Anatomy by Gauthier Kervyn, licensed CC BY-SA 4.0. We posed the arm, added a dumbbell, changed the materials and lighting, and rendered it as images. Those images are shared under the same CC BY-SA 4.0 licence.</p>
        <p>The zoom in chapter 2 and the diagrams in chapters 3 and 4 are original illustrations made for this page. Facts about muscle structure and contraction follow OpenStax <i>Anatomy and Physiology 2e</i>, CC BY 4.0.</p>
      </div>
      <p className="sources__fine">Nothing here is medical advice. If you train with an injury or a condition, ask someone who knows your body.</p>
    </section>
  );
}
