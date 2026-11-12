import type { MetadataRoute } from "next";
import { FACTS_UPDATED, abs } from "@/lib/facts";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: abs("/"), lastModified: FACTS_UPDATED, changeFrequency: "weekly", priority: 1 },
    { url: abs("/about"), lastModified: FACTS_UPDATED, changeFrequency: "weekly", priority: 0.9 },
    { url: abs("/science"), lastModified: FACTS_UPDATED, changeFrequency: "monthly", priority: 0.8 },
  ];
}
