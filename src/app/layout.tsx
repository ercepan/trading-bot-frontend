import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/auth-context";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://nexora-trading.net";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Nexora — Sentiment Radar · BIST · NASDAQ · CRYPTO",
    template: "%s · Nexora",
  },
  description:
    "BIST + ABD hisse + kripto için sentiment radar, AI destekli sinyaller, topluluk ve resmi açıklama analizi. 76% isabet oranı, %20 indirimli referans programı.",
  applicationName: "Nexora",
  keywords: [
    "BIST", "Borsa İstanbul", "kripto sinyal", "NASDAQ", "sentiment analiz",
    "yatırım sinyali", "wallstreetbets", "kamuyu aydınlatma", "KAP", "crypto",
    "trading bot", "Türkçe trading", "AI sinyal", "Nexora"
  ],
  authors: [{ name: "Nexora Trading", url: SITE_URL }],
  creator: "Nexora",
  publisher: "Nexora",
  category: "finance",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE_URL,
    siteName: "Nexora",
    title: "Nexora — Sentiment Radar · BIST · NASDAQ · CRYPTO",
    description:
      "AI destekli sentiment sinyalleri. BIST + ABD hisse + kripto. Topluluk ve resmi açıklama bazlı analiz.",
    // OG image: app/opengraph-image.tsx tarafından otomatik üretilir (1200x630)
  },
  twitter: {
    card: "summary_large_image",
    site: "@nexora_trading",
    creator: "@nexora_trading",
    title: "Nexora — Sentiment Radar",
    description:
      "BIST + ABD hisse + kripto sentiment sinyalleri. AI destekli, topluluk bazlı analiz.",
    // Twitter image: app/twitter-image.tsx (re-export of opengraph-image)
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <head>
        {/* Splash screen — JS bundle yüklenirken siyah ekran yerine logo göster */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              #__nx_splash {
                position: fixed; inset: 0; z-index: 9999;
                display: flex; flex-direction: column;
                align-items: center; justify-content: center;
                background: linear-gradient(135deg, #050505 0%, #0a0a0a 50%, #052e2a 100%);
                color: #e7e7e7;
                font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
                transition: opacity 0.3s ease-out;
              }
              #__nx_splash .__nx_logo {
                font-size: 56px; font-weight: 900; letter-spacing: 1px; line-height: 1;
                margin-bottom: 16px;
              }
              #__nx_splash .__nx_logo .green { color: #10b981; }
              #__nx_splash .__nx_sub {
                font-size: 11px; letter-spacing: 4px; opacity: 0.5;
                text-transform: uppercase; margin-bottom: 32px;
              }
              #__nx_splash .__nx_spin {
                width: 28px; height: 28px;
                border: 2px solid rgba(16,185,129,0.2);
                border-top-color: #10b981;
                border-radius: 50%;
                animation: __nx_rot 0.8s linear infinite;
              }
              @keyframes __nx_rot { to { transform: rotate(360deg); } }
              .__nx_splash_hidden { opacity: 0; pointer-events: none; }
            `,
          }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground">
        {/* Inline splash — DOM'a hemen eklenir, hydration'a kadar görünür */}
        <div id="__nx_splash" aria-hidden="true">
          <div className="__nx_logo">
            <span className="green">N</span>EXORA
          </div>
          <div className="__nx_sub">BIST · NASDAQ · CRYPTO</div>
          <div className="__nx_spin"></div>
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function hideSplash() {
                  var el = document.getElementById('__nx_splash');
                  if (el) {
                    el.classList.add('__nx_splash_hidden');
                    setTimeout(function() { el && el.remove(); }, 350);
                  }
                }
                if (document.readyState === 'complete') {
                  setTimeout(hideSplash, 80);
                } else {
                  window.addEventListener('load', function() { setTimeout(hideSplash, 80); });
                }
              })();
            `,
          }}
        />
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
        <Toaster richColors position="top-right" />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
