import { Fragment } from "react";
import { RefShell } from "@/components/seo/RefShell";
import { DRAFT_NOTICE, LEGAL_IS_DRAFT, longDate, type LegalBlock, type LegalDocument } from "@/lib/legal";

const MARKS = /\*\*(.+?)\*\*|\[CONFIRM: ([^\]]+)\]|\[([^\]]+)\]\(([^)\s]+)\)/g;

/**
 * The inline marks of lib/legal.ts: **bold**, [label](href), and [CONFIRM: …], which is set as a
 * highlighted placeholder so a draft can never be mistaken for final text.
 */
export function Inline({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(MARKS)) {
    const at = match.index ?? 0;
    if (at > last) parts.push(<Fragment key={`t${last}`}>{text.slice(last, at)}</Fragment>);
    const [whole, bold, confirm, label, href] = match;
    if (bold !== undefined) parts.push(<strong key={at}>{bold}</strong>);
    else if (confirm !== undefined) parts.push(<mark key={at} className="legal__confirm" title="Still to be confirmed">[CONFIRM: {confirm}]</mark>);
    else parts.push(<a key={at} href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{label}</a>);
    last = at + whole.length;
  }
  if (last < text.length) parts.push(<Fragment key={`t${last}`}>{text.slice(last)}</Fragment>);
  return <>{parts}</>;
}

function Block({ block }: { block: LegalBlock }) {
  if (typeof block === "string") return <p><Inline text={block} /></p>;
  if ("list" in block) return <ul className="guide__points">{block.list.map((item) => <li key={item}><Inline text={item} /></li>)}</ul>;
  if ("steps" in block) return <ol className="guide__steps">{block.steps.map((item) => <li key={item}><Inline text={item} /></li>)}</ol>;
  if ("note" in block) return <p className="about__note"><Inline text={block.note} /></p>;
  return (
    <div className="legal__table" role="region" aria-label="Table" tabIndex={0}>
      <table>
        <thead><tr>{block.table.head.map((cell) => <th key={cell} scope="col">{cell}</th>)}</tr></thead>
        <tbody>{block.table.rows.map((row) => (
          <tr key={row.join("|")}>{row.map((cell, index) => index === 0
            ? <th key={index} scope="row"><Inline text={cell} /></th>
            : <td key={index}><Inline text={cell} /></td>)}</tr>
        ))}</tbody>
      </table>
    </div>
  );
}

/** One legal or support page: the reference-page frame, a draft notice while LEGAL_IS_DRAFT, contents, then plain sections. */
export function LegalDoc({ doc, contents = true }: { doc: LegalDocument; contents?: boolean }) {
  return (
    <RefShell>
      <article className="legal">
        <header className="about__head">
          <p className="eyebrow">{doc.eyebrow}</p>
          <h1 className="about__title">{doc.h1}</h1>
          {LEGAL_IS_DRAFT && <p className="legal__draft" role="note">{DRAFT_NOTICE}</p>}
          {doc.lead.map((text) => <p key={text} className="about__intro"><Inline text={text} /></p>)}
          <p className="about__updated">Last updated <time dateTime={doc.updated}>{longDate(doc.updated)}</time></p>
        </header>
        {contents && (
          <nav className="legal__contents" aria-label="Contents">
            <ol>{doc.sections.map((section) => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ol>
          </nav>
        )}
        {doc.sections.map((section) => (
          <section key={section.id} id={section.id} className="about__section about__prose legal__section" aria-labelledby={`${section.id}-title`}>
            <h2 id={`${section.id}-title`}>{section.title}</h2>
            {section.body.map((block, index) => <Block key={index} block={block} />)}
          </section>
        ))}
      </article>
    </RefShell>
  );
}
