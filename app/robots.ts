import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Everything public is open to search engines and to assistants, both the crawlers that build
 * their indexes and the agents that fetch a page when someone asks about Stack. They are named
 * so the welcome is explicit. Shared routine and invite links are personal, so they stay out.
 */
const ASSISTANTS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User",
  "ClaudeBot", "Claude-SearchBot", "Claude-User", "anthropic-ai",
  "PerplexityBot", "Perplexity-User",
  "Google-Extended", "Applebot", "Applebot-Extended",
  "Amazonbot", "Bingbot", "DuckAssistBot", "Meta-ExternalAgent", "MistralAI-User", "CCBot", "cohere-ai",
];
const PRIVATE = ["/r/", "/i/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: ASSISTANTS, allow: "/", disallow: PRIVATE },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
