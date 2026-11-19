import type { Metadata } from "next";
import { LegalDoc } from "@/components/legal/LegalDoc";
import { TERMS } from "@/lib/legal";
import "../about/about.css";
import "../legal.css";

export const metadata: Metadata = {
  title: TERMS.title,
  description: TERMS.description,
  alternates: { canonical: "/terms" },
  openGraph: { title: TERMS.title, description: TERMS.description, siteName: "Stack", type: "article", locale: "en_GB", url: "/terms", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Stack. Every workout stacks up." }] },
};

/** Terms page. The words live in lib/legal.ts (and, as markdown, in the app repo’s docs/legal/). */
export default function Terms() {
  return <LegalDoc doc={TERMS} />;
}
