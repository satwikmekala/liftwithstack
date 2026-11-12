import type { Metadata } from "next";
import { FaqJsonLd } from "@/components/seo/JsonLd";
import { Footer } from "@/components/sections/Closing";
import { Download } from "@/components/ui/Download";
import { StackMark } from "@/components/ui/Icon";
import { AT_A_GLANCE, DEFINITION, FACTS_UPDATED, FAQ, FEATURE_GROUPS } from "@/lib/facts";
import { INSTAGRAM_URL } from "@/lib/site";
import "./about.css";

const title = "What is Stack? Facts and FAQ";
const description = "What Stack is, what it does and how to get it: a workout tracker for iPhone, now in TestFlight beta. Features, availability and answers to common questions, in plain text.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: { title, description, siteName: "Stack", type: "article", locale: "en_GB", url: "/about", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Stack. Every workout stacks up." }] },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
};

const updated = new Date(`${FACTS_UPDATED}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/**
 * The reference page: everything true of Stack today as plain, static HTML. The home page shows
 * the app; this one states it, for anyone (or anything) that needs the facts without the tour.
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
            <p className="about__lead">{DEFINITION}</p>
            <p className="about__updated">Last updated <time dateTime={FACTS_UPDATED}>{updated}</time></p>
          </header>

          <section className="about__section" aria-labelledby="glance">
            <h2 id="glance">At a glance</h2>
            <dl className="about__glance">
              {AT_A_GLANCE.map(({ label, value }) => (
                <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
              ))}
            </dl>
          </section>

          <section className="about__section" aria-labelledby="features">
            <h2 id="features">What Stack does</h2>
            {FEATURE_GROUPS.map((group) => (
              <section key={group.id} className="about__group" aria-labelledby={`about-${group.id}`}>
                <h3 id={`about-${group.id}`}>{group.title}</h3>
                <ul>
                  {group.features.map(({ name, text }) => (
                    <li key={name}><strong>{name}.</strong> {text}</li>
                  ))}
                </ul>
                {group.note && <p className="about__note">{group.note}</p>}
              </section>
            ))}
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
            <h2 id="get">Get the beta</h2>
            <p>Stack is in TestFlight beta for iPhone. Send a DM to <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">@liftwithstack on Instagram</a> to request access.</p>
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
