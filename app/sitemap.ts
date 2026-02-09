import type { MetadataRoute } from "next";
import { withSiteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: withSiteUrl("/es"),
      lastModified: now,
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: withSiteUrl("/en"),
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
  ];
}
