import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kayıt Ol",
  description: "Davet kodu ile hesap aç. 30 gün abonelik aktif.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
