import type { Metadata } from "next";
import { Fraunces, Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/auth-context";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Design system fonts — editorial × tech startup × trading terminal
const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
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
      className={`${geist.variable} ${fraunces.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <head>
        {/* CSS-only splash — body::before pseudo, React tree'ye dokunmaz */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              body::before {
                content: 'NEXORA';
                position: fixed; inset: 0; z-index: 9999;
                display: flex; align-items: center; justify-content: center;
                background: linear-gradient(135deg, #050505 0%, #0a0a0a 50%, #052e2a 100%);
                color: #10b981;
                font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
                font-size: 56px; font-weight: 900; letter-spacing: 2px;
                pointer-events: none;
                animation: nxSplashFade 0.4s 1.2s forwards;
              }
              @keyframes nxSplashFade {
                from { opacity: 1; }
                to   { opacity: 0; visibility: hidden; }
              }
            `,
          }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground">
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
