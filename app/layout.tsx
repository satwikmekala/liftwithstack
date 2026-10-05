import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// The app's own type: Bricolage Grotesque for display, Hanken Grotesk for UI,
// JetBrains Mono for eyebrows and numbers.
const display = Bricolage_Grotesque({ variable: "--font-display", subsets: ["latin"], weight: ["700"], display: "swap" });
const ui = Hanken_Grotesk({ variable: "--font-ui", subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["400", "700"], display: "swap" });

const description = "Log your training. See your progress take shape. Stack makes training easier to start, easier to continue and easier to look back on.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Stack — Every workout stacks up.",
  description,
  applicationName: "Stack",
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon.png", type: "image/png" }], apple: "/apple-touch-icon.png" },
  openGraph: {
    title: "Stack — Every workout stacks up.",
    description,
    siteName: "Stack",
    type: "website",
    url: "/",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Stack. Every workout stacks up." }],
  },
  twitter: { card: "summary_large_image", title: "Stack — Every workout stacks up.", description, images: ["/og.png"] },
};

export const viewport: Viewport = {
  themeColor: "#13110E",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${display.variable} ${ui.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Scroll reveals only apply once scripts run, so content is never hidden without them. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
