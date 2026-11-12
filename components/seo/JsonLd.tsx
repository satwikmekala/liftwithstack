import { FAQ, FEATURE_GROUPS, SUMMARY, abs } from "@/lib/facts";
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
  name: "Stack",
  alternateName: "Lift with Stack",
  url: abs("/"),
  logo: abs("/apple-touch-icon.png"),
  sameAs: [INSTAGRAM_URL],
};

const website = {
  "@type": "WebSite",
  "@id": SITE,
  name: "Stack",
  alternateName: "liftwithstack.com",
  url: abs("/"),
  inLanguage: "en-GB",
  publisher: { "@id": ORG },
};

/** No price, rating or store link: none exists yet, and the beta status is stated instead. */
const app = {
  "@type": ["MobileApplication", "SoftwareApplication"],
  "@id": APP,
  name: "Stack",
  alternateName: "Stack workout tracker",
  description: SUMMARY,
  url: abs("/"),
  image: abs("/og.png"),
  operatingSystem: "iOS",
  availableOnDevice: "iPhone",
  applicationCategory: "HealthApplication",
  applicationSubCategory: "Workout tracker",
  creativeWorkStatus: "Beta (TestFlight). Not yet on the App Store.",
  featureList: FEATURE_GROUPS.flatMap((group) => group.features.map(({ name, text }) => `${name}: ${text}`)),
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
