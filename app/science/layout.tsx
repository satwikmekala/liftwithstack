import type { Metadata } from "next";
import "./science.css";

const title = "Remember when 10 kg felt heavy? — Stack";
const description = "Why the same weight gets easier, as a six-stop interactive lesson: from a curl down to actin and myosin, how training changes your muscle, and what that means for your next workout.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, siteName: "Stack", type: "article", url: "/science", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Stack. Every workout stacks up." }] },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
};

export default function ScienceLayout({ children }: { children: React.ReactNode }) {
  return <div className="sci">{children}</div>;
}
