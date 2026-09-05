import type { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/progress", "/mission", "/publications", "/contact", "/demo", "/privacy", "/disclaimer"].map(path => ({
    url: `https://satelliteinference.com${path}`,
    lastModified: new Date("2026-09-05T00:00:00Z"),
    changeFrequency: path.includes("privacy") || path.includes("disclaimer") ? "yearly" : "monthly",
    priority: path === "" ? 1 : path === "/contact" ? 0.7 : 0.6,
  }));
}
