import type { Metadata } from "next";
import { LegalDoc } from "@/components/legal/LegalDoc";
import { PRIVACY } from "@/lib/legal";
import "../about/about.css";
import "../legal.css";

export const metadata: Metadata = {
  title: PRIVACY.title,
  description: PRIVACY.description,
  alternates: { canonical: "/privacy" },
  openGraph: { title: PRIVACY.title, description: PRIVACY.description, siteName: "Stack", type: "article", locale: "en_GB", url: "/privacy", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Stack. Every workout stacks up." }] },
};

/** Privacy page. The words live in lib/legal.ts (and, as markdown, in the app repo’s docs/legal/). */
export default function Privacy() {
  return <LegalDoc doc={PRIVACY} />;
}
