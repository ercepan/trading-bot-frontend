import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/performans", "/satin-al", "/iletisim", "/terms", "/kvkk"],
        disallow: [
          "/admin/",
          "/auth/",
          "/dashboard",
          "/positions",
          "/history",
          "/signals",
          "/lab",
          "/errors",
          "/settings",
          "/profil",
          "/yenile",
          "/referans",
          "/egitim",
          "/haberler",
          "/bist",
          "/wsb",
          "/api/",
        ],
      },
    ],
    sitemap: "https://nexora-trading.net/sitemap.xml",
    host: "https://nexora-trading.net",
  };
}
