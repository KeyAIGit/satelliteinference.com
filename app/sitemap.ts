import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://satelliteinference.com",
      lastModified: new Date("2026-09-03T00:00:00Z"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://satelliteinference.com/demo",
      lastModified: new Date("2026-09-03T00:00:00Z"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://satelliteinference.com/publications",
      lastModified: new Date("2026-09-03T00:00:00Z"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://satelliteinference.com/privacy",
      lastModified: new Date("2026-09-02T00:00:00Z"),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: "https://satelliteinference.com/disclaimer",
      lastModified: new Date("2026-09-02T00:00:00Z"),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
