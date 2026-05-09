import type { MetadataRoute } from "next";

const SITE = "https://nexora-trading.net";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" | "yearly" }[] = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/performans", priority: 0.9, changeFrequency: "daily" },
    { path: "/satin-al", priority: 0.9, changeFrequency: "weekly" },
    { path: "/iletisim", priority: 0.6, changeFrequency: "monthly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
    { path: "/kvkk", priority: 0.3, changeFrequency: "yearly" },
  ];
  return pages.map((p) => ({
    url: `${SITE}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
}
