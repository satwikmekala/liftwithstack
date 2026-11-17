import type { Metadata } from "next";
import { RefShell } from "@/components/seo/RefShell";
import { GUIDES } from "@/lib/guides";
import "../about/about.css";

const title = "Guides — Stack by Lift with Stack";
const description = "Practical guides from the team behind Stack, the iPhone workout tracker: choosing a workout tracker, training with friends, and moving from Hevy.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/guides" },
  openGraph: { title, description, siteName: "Stack", type: "website", locale: "en_GB", url: "/guides", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Stack. Every workout stacks up." }] },
};

export default function Guides() {
  return (
    <RefShell>
      <header className="about__head">
        <p className="eyebrow">GUIDES</p>
        <h1 className="about__title">Guides</h1>
        <p className="about__lead">Straight answers to the questions people ask before they pick a workout tracker.</p>
      </header>
      <nav className="about__section guide__list" aria-label="Guides">
        {GUIDES.map((guide) => (
          // eslint-disable-next-line @next/next/no-html-link-for-pages
          <a key={guide.slug} href={`/guides/${guide.slug}`}>
            <h2>{guide.h1}</h2>
            <p>{guide.description}</p>
          </a>
        ))}
      </nav>
    </RefShell>
  );
}
