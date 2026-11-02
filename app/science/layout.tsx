import type { Metadata } from "next";
import "./science.css";

const title = "You’re showing up. So why aren’t you changing? — Stack";
const description = "The answer is inside your muscle, on every rep. A five-minute look at what really happens when you lift, why the same workout stops doing as much, and what to do about it.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, siteName: "Stack", type: "article", url: "/science", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Stack. Every workout stacks up." }] },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
};

export default function ScienceLayout({ children }: { children: React.ReactNode }) {
  return <div className="sci">{children}</div>;
}
