import { SOURCES } from "@/lib/science/sources";

/** The research, numbered as the footnotes cite it. */
export function Sources() {
  return (
    <section className="sources" id="sources" aria-labelledby="sources-title">
      <p className="eyebrow">SOURCES</p>
      <h2 id="sources-title" className="sources__title">The research behind this page.</h2>
      <p className="sources__intro">Peer-reviewed studies, reviews and position stands, in the order they are cited. The animations are illustrations; these are the facts they illustrate. Where something is simplified or still debated, the text says so.</p>
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
      <p className="sources__fine">Nothing here is medical advice. If you train with an injury or a condition, ask someone who knows your body.</p>
    </section>
  );
}
