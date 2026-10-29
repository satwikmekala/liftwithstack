import type { Metadata } from "next";
import "./science.css";

const title = "The invisible work — the science of getting stronger";
const description = "What happens inside a muscle when you lift, why the body adapts, why the same weight stops being the same workout, and why one more rep counts. The science of progressive overload, from Stack.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, siteName: "Stack", type: "article", url: "/science", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Stack. Every workout stacks up." }] },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
};

export default function ScienceLayout({ children }: { children: React.ReactNode }) {
  return <div className="sci">{children}</div>;
}
