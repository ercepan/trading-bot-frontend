import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kullanım Şartları",
  description: "Nexora kullanım şartları + SPK bilgilendirmesi. Yatırım tavsiyesi vermez, tüm sorumluluk kullanıcıdadır.",
  alternates: { canonical: "https://nexora-trading.net/terms" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
