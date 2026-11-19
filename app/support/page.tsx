import type { Metadata } from "next";
import { LegalDoc } from "@/components/legal/LegalDoc";
import { SUPPORT } from "@/lib/legal";
import "../about/about.css";
import "../legal.css";

export const metadata: Metadata = {
  title: SUPPORT.title,
  description: SUPPORT.description,
  alternates: { canonical: "/support" },
  openGraph: { title: SUPPORT.title, description: SUPPORT.description, siteName: "Stack", type: "article", locale: "en_GB", url: "/support", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Stack. Every workout stacks up." }] },
};

/** Support page. The words live in lib/legal.ts (and, as markdown, in the app repo’s docs/legal/). */
export default function Support() {
  return <LegalDoc doc={SUPPORT} contents={false} />;
}
