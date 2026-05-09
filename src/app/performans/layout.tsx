import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Performans — Track Record",
  description:
    "Nexora sinyallerinin gerçek track record'u. Hit rate, ortalama 7 gün getiri, en iyi/kötü çağrılar. Yatırım tavsiyesi değildir, geçmiş performans gelecek için garanti vermez.",
  alternates: { canonical: "https://nexora-trading.net/performans" },
  openGraph: {
    title: "Performans · Nexora",
    description: "76% hit rate · Sentiment radar sinyallerinin gerçek track record'u.",
    url: "https://nexora-trading.net/performans",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
