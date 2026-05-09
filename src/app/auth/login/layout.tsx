import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giriş",
  description: "Nexora abonelik hesabınıza giriş yapın.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
