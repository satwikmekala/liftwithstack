import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// The same app typefaces, using the existing Latin assets. The Google-font
// loader in this runtime preloads every subset even when preload is disabled.
const display = localFont({ src: "./fonts/BricolageGrotesque-Latin.woff2", variable: "--font-display", weight: "700", display: "swap" });
const ui = localFont({ src: "./fonts/HankenGrotesk-Latin.woff2", variable: "--font-ui", weight: "400 700", display: "swap" });
const mono = localFont({ src: "./fonts/JetBrainsMono-Latin.woff2", variable: "--font-mono", weight: "400 700", display: "swap" });

const description = "Log your training. See your progress take shape. Stack makes training easier to start, easier to continue and easier to look back on.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Stack — Every workout stacks up.",
  description,
  applicationName: "Stack",
  // The SVG is the Stack mark; keep a PNG fallback for browsers that do not
  // support SVG favicons and advertise it as the legacy shortcut icon too.
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon.png", type: "image/png" }],
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
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
