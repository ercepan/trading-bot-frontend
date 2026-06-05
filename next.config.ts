import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /dene tamamen kapatıldı (deneme modülü iptal) — server-side 308 redirect.
  // Eski client-side useEffect redirect SEO botları + JS-disabled kullanıcılar
  // için blank-flash veriyordu; bu redirects() emit eden 308 HTTP yanıtı tüm
  // istemciler için sağlam.
  async redirects() {
    return [
      { source: "/dene", destination: "/satin-al", permanent: true },
      { source: "/dene/:path*", destination: "/satin-al", permanent: true },
    ];
  },
  // Subscriber UI sürekli değişiyor, kaynak gizleme/rebrand güncellemelerinin
  // browser/CDN cache'inde takılmaması için HTML response'ları no-store yap.
  // _next/static (JS/CSS asset'leri) hash'li olduğu için bunlar uzun cache'lenir.
  async headers() {
    return [
      {
        // Public marka logoları — Shopier / 3rd-party cross-origin fetch için CORS aç
        source: "/nexora-logo-512.png",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Tüm sayfalar (HTML) — _next/static ve api hariç
        source: "/((?!_next/static|_next/image|favicon|nexora-logo).*)",
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
