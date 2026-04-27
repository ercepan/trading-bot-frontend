import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Subscriber UI sürekli değişiyor, kaynak gizleme/rebrand güncellemelerinin
  // browser/CDN cache'inde takılmaması için HTML response'ları no-store yap.
  // _next/static (JS/CSS asset'leri) hash'li olduğu için bunlar uzun cache'lenir.
  async headers() {
    return [
      {
        // Tüm sayfalar (HTML) — _next/static ve api hariç
        source: "/((?!_next/static|_next/image|favicon).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, max-age=0",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
