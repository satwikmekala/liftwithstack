import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideJsonLd } from "@/components/seo/JsonLd";
import { RefShell } from "@/components/seo/RefShell";
import { Download } from "@/components/ui/Download";
import { FACTS_UPDATED, FACTS_UPDATED_LONG } from "@/lib/facts";
import { GUIDES, guide as findGuide } from "@/lib/guides";
import "../../about/about.css";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return GUIDES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const guide = findGuide((await params).slug);
  if (!guide) return {};
  const path = `/guides/${guide.slug}`;
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: path },
    openGraph: { title: guide.title, description: guide.description, siteName: "Stack", type: "article", locale: "en_GB", url: path, images: [{ url: "/og.png", width: 1200, height: 630, alt: "Stack. Every workout stacks up." }] },
    twitter: { card: "summary_large_image", title: guide.title, description: guide.description, images: ["/og.png"] },
  };
}

/** One guide: a plain article that answers a real question, then says where Stack fits. */
export default async function GuidePage({ params }: Params) {
  const guide = findGuide((await params).slug);
  if (!guide) notFound();
  return (
    <RefShell>
      <GuideJsonLd guide={guide} />
      <article>
        <header className="about__head">
          <p className="eyebrow">{guide.eyebrow}</p>
          <h1 className="about__title">{guide.h1}</h1>
          {guide.intro.map((text, index) => <p key={text} className={index ? "about__intro" : "about__lead"}>{text}</p>)}
          <p className="about__updated">Last updated <time dateTime={FACTS_UPDATED}>{FACTS_UPDATED_LONG}</time></p>
        </header>

        {guide.sections.map((section) => (
          <section key={section.title} className="about__section about__topic about__prose">
            <h2>{section.title}</h2>
            {section.body?.map((text) => <p key={text}>{text}</p>)}
            {section.points && <ul className="guide__points">{section.points.map((point) => <li key={point}>{point}</li>)}</ul>}
            {section.steps && <ol className="guide__steps">{section.steps.map((step) => <li key={step}>{step}</li>)}</ol>}
            {section.note && <p className="about__note">{section.note}</p>}
          </section>
        ))}

        <section className="about__section" aria-labelledby="faq">
          <h2 id="faq">Questions and answers</h2>
          <div className="about__faq">
            {guide.faq.map(({ q, a }) => (
              <section key={q}><h3>{q}</h3><p>{a}</p></section>
            ))}
          </div>
        </section>

        <section className="about__section about__get" aria-labelledby="get">
          <p className="eyebrow">GET THE BETA</p>
          <h2 id="get">Want to try Stack?</h2>
          <p>Stack is in TestFlight beta for iPhone. Send a DM to @liftwithstack on Instagram to request access.</p>
          <Download />
          <p className="about__more">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/about">What is Stack?</a>
            <span aria-hidden="true"> · </span>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/guides">More guides</a>
          </p>
        </section>
      </article>
    </RefShell>
  );
}
