import { DIFFERENT_LINE, FAQ, FEATURE_LIST, MAKER, NOT_TO_CONFUSE, SHORT, abs } from "@/lib/facts";
import type { Guide } from "@/lib/guides";
import { INSTAGRAM_URL, SITE_URL } from "@/lib/site";

const ORG = `${SITE_URL}/#organization`;
const SITE = `${SITE_URL}/#website`;
const APP = `${SITE_URL}/#app`;

/** Structured data as a script tag. "<" is escaped so no value can close the tag early. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

const organization = {
  "@type": "Organization",
  "@id": ORG,
  name: MAKER,
  alternateName: ["liftwithstack", "Stack"],
  url: abs("/"),
  logo: abs("/apple-touch-icon.png"),
  sameAs: [INSTAGRAM_URL],
};

const website = {
  "@type": "WebSite",
  "@id": SITE,
  name: "Stack by Lift with Stack",
  alternateName: ["liftwithstack.com", "Lift with Stack"],
  url: abs("/"),
  inLanguage: "en-GB",
  publisher: { "@id": ORG },
};

/** No price, rating or store link: none exists yet, and the beta status is stated instead. */
const app = {
  "@type": ["MobileApplication", "SoftwareApplication"],
  "@id": APP,
  name: "Stack",
  alternateName: ["Stack by Lift with Stack", "Stack workout tracker", "liftwithstack"],
  description: SHORT,
  disambiguatingDescription: `${DIFFERENT_LINE} ${NOT_TO_CONFUSE}`,
  identifier: { "@type": "PropertyValue", propertyID: "iOS bundle ID", value: "com.liftwithstack.stack" },
  sameAs: [INSTAGRAM_URL],
  url: abs("/"),
  image: abs("/og.png"),
  operatingSystem: "iOS",
  availableOnDevice: "iPhone",
  applicationCategory: "HealthApplication",
  applicationSubCategory: "Workout tracker",
  creativeWorkStatus: "Beta (TestFlight). Not yet on the App Store.",
  featureList: FEATURE_LIST,
  publisher: { "@id": ORG },
  mainEntityOfPage: abs("/about"),
};

export function SiteJsonLd() {
  return <JsonLd data={{ "@context": "https://schema.org", "@graph": [organization, website, app] }} />;
}

export function FaqJsonLd() {
  return <JsonLd data={{
    "@context": "https://schema.org",
    "@graph": [organization, website, app, {
      "@type": "FAQPage",
      "@id": `${abs("/about")}#faq`,
      url: abs("/about"),
      about: { "@id": APP },
      mainEntity: FAQ.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    }],
  }} />;
}

export function LessonJsonLd({ title, description }: { title: string; description: string }) {
  return <JsonLd data={{
    "@context": "https://schema.org",
    "@graph": [organization, {
      "@type": ["Article", "LearningResource"],
      "@id": `${abs("/science")}#lesson`,
      headline: title,
      description,
      url: abs("/science"),
      inLanguage: "en-GB",
      learningResourceType: "Interactive lesson",
      timeRequired: "PT6M",
      isAccessibleForFree: true,
      about: ["Strength training", "Muscle contraction", "Progressive overload"],
      image: abs("/og.png"),
      author: { "@id": ORG },
      publisher: { "@id": ORG },
    }],
  }} />;
}

export function GuideJsonLd({ guide }: { guide: Guide }) {
  const url = abs(`/guides/${guide.slug}`);
  return <JsonLd data={{
    "@context": "https://schema.org",
    "@graph": [organization, website, app, {
      "@type": "Article",
      "@id": `${url}#guide`,
      headline: guide.h1,
      description: guide.description,
      url,
      inLanguage: "en-GB",
      image: abs("/og.png"),
      author: { "@id": ORG },
      publisher: { "@id": ORG },
      about: { "@id": APP },
      isPartOf: { "@id": SITE },
    }, {
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      url,
      about: { "@id": APP },
      mainEntity: guide.faq.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    }, {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Stack", item: abs("/") },
        { "@type": "ListItem", position: 2, name: "Guides", item: abs("/guides") },
        { "@type": "ListItem", position: 3, name: guide.h1, item: url },
      ],
    }],
  }} />;
}
