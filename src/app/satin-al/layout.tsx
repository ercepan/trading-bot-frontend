import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Satın Al — Sinyal & Eğitim Paketleri",
  description:
    "USDT (BEP-20) ile 30 günlük abonelik. Sinyal $25, Eğitim $40. Anlık BSC blockchain doğrulama. Referans kodu ile %20 indirim.",
  alternates: { canonical: "https://nexora-trading.net/satin-al" },
  openGraph: {
    title: "Satın Al · Nexora",
    description: "USDT BEP-20 ile 30 günlük abonelik. $25 sinyal · $40 eğitim. Referans %20 indirim.",
    url: "https://nexora-trading.net/satin-al",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
