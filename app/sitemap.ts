import type { MetadataRoute } from "next";
import { FACTS_UPDATED, abs } from "@/lib/facts";
import { GUIDES } from "@/lib/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: abs("/"), lastModified: FACTS_UPDATED, changeFrequency: "weekly", priority: 1 },
    { url: abs("/about"), lastModified: FACTS_UPDATED, changeFrequency: "weekly", priority: 0.9 },
    { url: abs("/guides"), lastModified: FACTS_UPDATED, changeFrequency: "monthly", priority: 0.7 },
    ...GUIDES.map((guide) => ({ url: abs(`/guides/${guide.slug}`), lastModified: FACTS_UPDATED, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: abs("/science"), lastModified: FACTS_UPDATED, changeFrequency: "monthly", priority: 0.8 },
  ];
}
