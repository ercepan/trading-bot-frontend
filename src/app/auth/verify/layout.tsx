import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "E-posta Onayı",
  description: "Nexora hesabınızı onaylayın.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
