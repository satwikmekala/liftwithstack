import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Hanken_Grotesk,
  JetBrains_Mono,
} from "next/font/google";
import { headers } from "next/headers";
import { SmoothScrollProvider } from "@/lib/smooth-scroll";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetBrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const forwardedHost = requestHeaders
    .get("x-forwarded-host")
    ?.split(",")[0]
    ?.trim();
  const requestHost = forwardedHost ?? requestHeaders.get("host");
  const safeHost =
    requestHost && /^[a-z0-9.-]+(?::\d+)?$/i.test(requestHost)
      ? requestHost
      : "localhost:3000";
  const forwardedProtocol = requestHeaders
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();
  const protocol =
    forwardedProtocol === "http" || forwardedProtocol === "https"
      ? forwardedProtocol
      : safeHost.startsWith("localhost")
        ? "http"
        : "https";

  return {
    metadataBase: new URL(`${protocol}://${safeHost}`),
    title: {
      default: "Stack — Strength training that adapts",
      template: "%s | Stack",
    },
    description:
      "Choose how often you train. Stack keeps your workouts balanced, progresses your lifts, and adapts when your week changes.",
    icons: {
      icon: "/favicon.png",
      shortcut: "/favicon.png",
    },
    openGraph: {
      type: "website",
      title: "Get stronger on the schedule you actually keep.",
      description:
        "Stack plans the days, progresses the lifts, and adapts to your real week.",
      siteName: "Stack",
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: "Stack strength-training app with a 60 to 62.5 kilogram progression",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Get stronger on the schedule you actually keep.",
      description:
        "Stack plans the days, progresses the lifts, and adapts to your real week.",
      images: ["/og.png"],
    },
  };
}

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#16130F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bricolage.variable} ${hanken.variable} ${jetBrains.variable} bg-bg font-body text-text antialiased`}
      >
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
