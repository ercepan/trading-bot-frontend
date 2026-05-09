import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Nexora ekibine ulaş — soru, geri bildirim, iş birliği. 24 saat içinde dönüş yaparız. İletişim formu + Telegram kanalı.",
  alternates: { canonical: "https://nexora-trading.net/iletisim" },
  openGraph: {
    title: "İletişim · Nexora",
    description: "Nexora ekibine ulaş. Form + Telegram. 24 saat içinde dönüş.",
    url: "https://nexora-trading.net/iletisim",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
