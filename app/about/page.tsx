import type { Metadata } from "next";
import { Fragment } from "react";
import { FaqJsonLd } from "@/components/seo/JsonLd";
import { Footer } from "@/components/sections/Closing";
import { Download } from "@/components/ui/Download";
import { StackMark } from "@/components/ui/Icon";
import { ABOUT_DESCRIPTION, ABOUT_TITLE, AT_A_GLANCE, BETA, CAN_DO, FACTS_UPDATED, FACTS_UPDATED_LONG, FAQ, FLOW, FLOW_CLOSE, INTRO, SHARE_DESCRIPTION, SHARE_TITLE, WHY } from "@/lib/facts";
import { INSTAGRAM_URL } from "@/lib/site";
import "./about.css";

export const metadata: Metadata = {
  title: ABOUT_TITLE,
  description: ABOUT_DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: { title: SHARE_TITLE, description: SHARE_DESCRIPTION, siteName: "Stack", type: "article", locale: "en_GB", url: "/about", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Stack. Every workout stacks up." }] },
  twitter: { card: "summary_large_image", title: SHARE_TITLE, description: SHARE_DESCRIPTION, images: ["/og.png"] },
};

/** Sets `**product terms**` in bold. */
function Rich({ text }: { text: string }) {
  return <>{text.split("**").map((part, index) => index % 2 ? <strong key={index}>{part}</strong> : <Fragment key={index}>{part}</Fragment>)}</>;
}

/**
 * The reference page: why Stack exists, who it is for and what it does, as plain static HTML.
 * The home page shows the app; this one states it, for anyone (or anything) that needs the
 * facts without the tour. The copy lives in lib/facts.ts.
 */
export default function About() {
  return (
    <div className="about">
      <FaqJsonLd />
      <header className="nav">
        {/* A plain anchor: next/link pulls a second React into the vinext dev bundle. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a className="nav__brand" href="/" aria-label="Stack, home">
          <StackMark size={26} />
          <span>Stack</span>
        </a>
        <a className="download download--small download--soon" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Get the beta</a>
      </header>
      <main className="about__main">
        <article>
          <header className="about__head">
            <p className="eyebrow">ABOUT STACK</p>
            <h1 className="about__title">What is Stack?</h1>
            <p className="about__lead">{INTRO.lead}</p>
            {INTRO.body.map((text) => <p key={text} className="about__intro"><Rich text={text} /></p>)}
            <p className="about__belief">{INTRO.belief}</p>
            <p className="about__updated">Last updated <time dateTime={FACTS_UPDATED}>{FACTS_UPDATED_LONG}</time></p>
          </header>

          <section className="about__section" aria-labelledby="glance">
            <h2 id="glance">At a glance</h2>
            <dl className="about__glance">
              {AT_A_GLANCE.map(({ label, value }) => (
                <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
              ))}
            </dl>
          </section>

          <section className="about__section about__prose" aria-labelledby="why">
            <h2 id="why">Why Stack exists</h2>
            {WHY.body.map((text) => <p key={text}>{text}</p>)}
            <p className="about__close">{WHY.close}</p>
          </section>

          <section className="about__section" aria-labelledby="features">
            <h2 id="features">What you can do with Stack</h2>
            {CAN_DO.map((topic) => (
              <section key={topic.id} className="about__topic about__prose" aria-labelledby={`about-${topic.id}`}>
                <h3 id={`about-${topic.id}`}>{topic.title}</h3>
                {topic.body.map((text) => <p key={text}><Rich text={text} /></p>)}
                {topic.close && <p className="about__close">{topic.close}</p>}
                {topic.note && <p className="about__note">{topic.note}</p>}
              </section>
            ))}
          </section>

          <section className="about__section" aria-labelledby="flow">
            <h2 id="flow">How Stack fits into a workout</h2>
            <dl className="about__flow">
              {FLOW.map(({ when, text }) => (
                <div key={when}><dt>{when}</dt><dd>{text}</dd></div>
              ))}
            </dl>
            <p className="about__after">{FLOW_CLOSE}</p>
          </section>

          <section className="about__section" aria-labelledby="faq">
            <h2 id="faq">Questions and answers</h2>
            <div className="about__faq">
              {FAQ.map(({ q, a }) => (
                <section key={q}>
                  <h3>{q}</h3>
                  <p>{a}</p>
                </section>
              ))}
            </div>
          </section>

          <section className="about__section about__get" aria-labelledby="get">
            <p className="eyebrow">GET THE BETA</p>
            <h2 id="get">Want to try Stack?</h2>
            <p>{BETA}</p>
            <Download />
            <p className="about__more">
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/">See the app in action</a>
              <span aria-hidden="true"> · </span>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/science">Read the science lesson</a>
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
