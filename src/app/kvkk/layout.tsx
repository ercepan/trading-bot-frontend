import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description: "Nexora KVKK aydınlatma metni — kişisel veri işleme, saklama, silme politikası.",
  alternates: { canonical: "https://nexora-trading.net/kvkk" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
